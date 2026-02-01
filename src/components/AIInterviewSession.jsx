import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AIInterviewSession = ({ interviewData, onEndInterview }) => {
    const [messages, setMessages] = useState(interviewData.messages || []);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const messagesEndRef = useRef(null);

    // Audio Recording Logic
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Auto-scroll to bottom & Cleanup TTS on unmount
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isProcessing]);

    // Cleanup speech on unmount
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Text-to-Speech
    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => voice.name.includes('Google US English') || voice.name.includes('Samantha'));
            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);
        }
    };

    // Speak initial message
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'ai') {
            speak(lastMsg.content);
        }
    }, []); // Run only once on mount for the initial greeting

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await sendAudio(audioBlob);

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error creating MediaRecorder:", err);
            alert("Microphone access denied or not supported.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const sendAudio = async (audioBlob) => {
        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('interviewId', interviewData._id);

            const token = localStorage.getItem('navai_access_token');
            const response = await axios.post('http://localhost:5000/api/aiInterviews/audio-chat', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });

            const { userTranscript, content } = response.data;

            // Update UI with both messages
            setMessages(prev => [
                ...prev,
                { role: 'user', content: userTranscript },
                { role: 'ai', content: content }
            ]);

            // Speak the response
            speak(content);

        } catch (error) {
            console.error("Error sending audio:", error);
            alert("Failed to process audio. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTextSend = async () => {
        if (!transcript.trim()) return;

        const userMsg = { role: 'user', content: transcript };
        setMessages(prev => [...prev, userMsg]);
        setTranscript('');
        setIsProcessing(true);

        try {
            const token = localStorage.getItem('navai_access_token');
            const response = await axios.post('http://localhost:5000/api/aiInterviews/chat', {
                interviewId: interviewData._id,
                userResponse: userMsg.content
            }, {
                headers: { 'x-auth-token': token }
            });

            setMessages(prev => [...prev, { role: 'ai', content: response.data.content }]);
            speak(response.data.content);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to get response.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] w-full mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">{interviewData.interviewType} Interview</h2>
                    <p className="text-sm text-gray-400">Voice-Enabled AI Interview</p>
                </div>
                <button
                    onClick={onEndInterview}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                    End Interview
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                                }`}
                        >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {/* Loading / Processing Indicator */}
                {isProcessing && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex items-center space-x-2">
                            <span className="text-sm text-gray-500 font-medium ml-2">Thinking...</span>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-200">

                {/* Visual Feedback for Speaking/Listening */}
                <div className="mb-4 h-6 flex justify-center items-center">
                    {isSpeaking && (
                        <div className="flex items-center space-x-2 text-blue-600">
                            <span className="text-sm font-medium animate-pulse">AI is speaking...</span>
                            <div className="flex space-x-1">
                                <div className="h-4 w-1 bg-blue-600 animate-pulse"></div>
                                <div className="h-6 w-1 bg-blue-600 animate-pulse delay-75"></div>
                                <div className="h-4 w-1 bg-blue-600 animate-pulse delay-150"></div>
                            </div>
                        </div>
                    )}
                    {isRecording && (
                        <div className="flex items-center space-x-2 text-red-600">
                            <span className="text-sm font-medium animate-pulse">Listening... (Speak now)</span>
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                        </div>
                    )}
                </div>

                <div className="flex items-end space-x-4">
                    <div className="flex-1 relative">
                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder={isRecording ? "Listening..." : "Type your answer or use microphone..."}
                            className="w-full p-4 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 shadow-inner"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleTextSend();
                                }
                            }}
                            disabled={isRecording || isProcessing}
                        />

                        {/* Microphone Button */}
                        <button
                            onClick={toggleRecording}
                            disabled={isProcessing}
                            className={`absolute right-3 bottom-3 p-3 rounded-full transition-all duration-200 ${isRecording
                                ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse'
                                : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                            title={isRecording ? "Stop Recording" : "Start Recording"}
                        >
                            {isRecording ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <rect x="6" y="6" width="12" height="12" rx="2" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.66 9 5v6c0 1.66 1.34 3 3 3z" />
                                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={handleTextSend}
                        disabled={!transcript.trim() || isProcessing || isRecording}
                        className={`p-4 rounded-xl font-medium transition-all shadow-lg flex-shrink-0 ${!transcript.trim() || isProcessing || isRecording
                            ? 'bg-gray-300 text-white cursor-not-allowed'
                            : 'bg-primary-blue text-white hover:bg-blue-600 transform hover:scale-105'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                    {isRecording ? "Click the red button to stop and send." : "Click microphone to speak, or type and press Enter."}
                </p>
            </div>
        </div>
    );
};

export default AIInterviewSession;
