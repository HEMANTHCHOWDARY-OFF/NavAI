const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const OpenAI = require('openai');
const Tesseract = require('node-tesseract-ocr');
const auth = require('../middleware/auth');
const AIInterview = require('../models/AIInterview');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Initialize OpenAI client for Groq
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/**
 * Helper: Extract text from uploaded resume
 */
async function extractResumeText(file) {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  let resumeText = '';

  if (fileExtension === '.pdf') {
    const dataBuffer = fs.readFileSync(file.path);
    const data = await pdfParse(dataBuffer);
    resumeText = data.text;

    // Fallback to OCR if text is too short (scanned PDF)
    if (resumeText.trim().length < 100) {
      try {
        const ocrResult = await Tesseract.recognize(file.path, {
          lang: 'eng',
          oem: 1,
          psm: 6
        });
        if (ocrResult.data.trim().length > resumeText.trim().length) {
          resumeText = ocrResult.data;
        }
      } catch (err) {
        console.warn('OCR failed, proceeding with pdf-parse text:', err.message);
      }
    }
  } else if (fileExtension === '.docx' || fileExtension === '.doc') {
    const result = await mammoth.extractRawText({ path: file.path });
    resumeText = result.value;
  } else {
    throw new Error('Unsupported file format. Please upload PDF or DOCX.');
  }

  return resumeText;
}

/**
 * POST /start
 * Upload resume, extract text, create session, generate first question.
 */
router.post('/start', auth, upload.single('resume'), async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    const { interviewType } = req.body;

    if (!file) return res.status(400).json({ error: 'Resume file is required' });

    // 1. Extract Text
    let resumeText = '';
    try {
      resumeText = await extractResumeText(file);
    } catch (err) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: err.message });
    } finally {
      // Clean up file immediately after extraction if possible, or later
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Failed to extract text from resume.' });
    }

    // 2. Generate First Question via Groq
    const systemPrompt = `You are an expert ${interviewType || 'HR'} interviewer. 
    The candidate has uploaded their resume. Your goal is to conduct a professional interview.
    Start by welcoming them and asking the first question based on their resume.
    Keep your response concise (under 2-3 sentences) to allow for a natural voice conversation.
    Do not use markdown formatting.
    Resume Content: "${resumeText.substring(0, 3000)}..."`; /* Truncate to avoid token limits if needed */

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: systemPrompt }],
    });

    const firstQuestion = completion.choices[0]?.message?.content || "Hello! I've reviewed your resume. Could you tell me a little about yourself?";

    // 3. Save Session
    const interview = new AIInterview({
      userId,
      resumeText,
      interviewType,
      messages: [{ role: 'ai', content: firstQuestion }]
    });

    await interview.save();

    res.status(201).json(interview);

  } catch (err) {
    console.error('Error starting interview:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /chat
 * Continue the interview.
 */
router.post('/chat', auth, async (req, res) => {
  try {
    const { interviewId, userResponse } = req.body;

    const interview = await AIInterview.findById(interviewId);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    // 1. Add User Response
    interview.messages.push({ role: 'user', content: userResponse });

    // Check question count (AI messages)
    const aiMessageCount = interview.messages.filter(m => m.role === 'ai').length;
    const isLastQuestion = aiMessageCount >= 10;

    // 2. Build Context for AI
    let systemPrompt = `You are an expert ${interview.interviewType} interviewer.
    Maintain a professional but conversational tone. 
    Keep responses concise (2-3 sentences max) for voice interaction.
    Ask one question at a time.
    Do not use markdown formatting.
    If the candidate's answer is vague, ask for clarification.
    Resume Context: "${interview.resumeText.substring(0, 1000)}..."`;

    if (isLastQuestion) {
      systemPrompt += `\nIMPORTANT: This is the final exchange. Do NOT ask any more questions. 
       Instead, briefly thank the candidate, mention that the interview is concluded, and provide a 1-sentence positive feedback on their performance.`;
    }

    // Construct message history for API (limit last 10 messages for context window)
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...interview.messages.slice(-10).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }))
    ];

    // 3. Generate AI Response
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: apiMessages,
    });

    const aiResponse = completion.choices[0]?.message?.content || "Thank you. Let's move on to the next topic.";

    // 4. Save AI Response
    interview.messages.push({ role: 'ai', content: aiResponse });
    await interview.save();

    res.json({
      role: 'ai',
      content: aiResponse,
      updatedInterview: interview
    });

  } catch (err) {
    console.error('Error in chat:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /audio-chat
 * Voice-to-Voice: Receive audio -> STT (Groq Whisper) -> LLM -> Return Text
 */
router.post('/audio-chat', auth, upload.single('audio'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { interviewId } = req.body;
    const audioFile = req.file;

    if (!audioFile) return res.status(400).json({ error: 'Audio file is required' });

    const interview = await AIInterview.findById(interviewId);
    if (!interview) {
      if (fs.existsSync(audioFile.path)) fs.unlinkSync(audioFile.path); // Clean up
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Rename file to include extension (Groq/OpenAI often needs this to detect format)
    const originalExt = path.extname(audioFile.originalname) || '.webm'; // Default to .webm if missing
    const newPath = audioFile.path + originalExt;

    fs.appendFileSync('debug_audio.log', `[${new Date().toISOString()}] Renaming ${audioFile.path} to ${newPath}\n`);
    fs.renameSync(audioFile.path, newPath);

    // 1. STT: Transcribe Audio using Groq Whisper
    let transcription = "";
    try {
      fs.appendFileSync('debug_audio.log', `[${new Date().toISOString()}] Sending ${newPath} to Groq STT...\n`);

      const translation = await openai.audio.transcriptions.create({
        file: fs.createReadStream(newPath),
        model: "whisper-large-v3",
        response_format: "text", // or verbose_json
      });

      fs.appendFileSync('debug_audio.log', `[${new Date().toISOString()}] Transcription success: ${translation.substring(0, 50)}...\n`);
      transcription = translation;
    } catch (sttError) {
      const errorMsg = `[${new Date().toISOString()}] STT Error: ${sttError.message}\nFull: ${JSON.stringify(sttError, null, 2)}\n`;
      fs.appendFileSync('debug_audio.log', errorMsg);
      console.error(errorMsg); // Keep console just in case
      throw new Error("Speech-to-Text failed: " + sttError.message);
    } finally {
      // Clean up uploaded audio file (new path)
      if (fs.existsSync(newPath)) {
        fs.appendFileSync('debug_audio.log', `[${new Date().toISOString()}] Cleaning up ${newPath}\n`);
        fs.unlinkSync(newPath);
      }
    }

    if (!transcription || !transcription.trim()) {
      return res.status(400).json({ error: "Could not understand audio" });
    }

    // 2. Add User Transcript to History
    interview.messages.push({ role: 'user', content: transcription });

    // Check question count (AI messages)
    const aiMessageCount = interview.messages.filter(m => m.role === 'ai').length;
    const isLastQuestion = aiMessageCount >= 10;

    // 3. Build Context for LLM
    let systemPrompt = `You are an expert ${interview.interviewType} interviewer.
    Maintain a professional but conversational tone. 
    Keep responses concise (2-3 sentences max) for voice interaction.
    Ask one question at a time.
    Do not use markdown formatting.
    If the candidate's answer is vague, ask for clarification.
    Resume Context: "${interview.resumeText.substring(0, 1000)}..."`;

    if (isLastQuestion) {
      systemPrompt += `\nIMPORTANT: This is the final exchange. Do NOT ask any more questions. 
       Instead, briefly thank the candidate, mention that the interview is concluded, and provide a 1-sentence positive feedback on their performance.`;
    }

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...interview.messages.slice(-10).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }))
    ];

    // 4. Generate AI Response
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: apiMessages,
    });

    const aiResponse = completion.choices[0]?.message?.content || "Thank you. Let's move on.";

    // 5. Save AI Response
    interview.messages.push({ role: 'ai', content: aiResponse });
    await interview.save();

    res.json({
      role: 'ai',
      userTranscript: transcription,
      content: aiResponse,
      updatedInterview: interview
    });

  } catch (err) {
    console.error('Error in audio-chat:', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: err.message });
  }
});

// Get all interviews for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const interviews = await AIInterview.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recent interviews for a user (limit 5)
router.get('/user/:userId/recent', async (req, res) => {
  try {
    const interviews = await AIInterview.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(5);
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get interview by ID
router.get('/:id', async (req, res) => {
  try {
    const interview = await AIInterview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
