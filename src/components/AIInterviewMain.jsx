import React, { useState } from 'react';
import axios from 'axios';
import AIInterviewSession from './AIInterviewSession';

const AIInterviewMain = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    interviewType: '',
    feedback: false,
    practiceMode: false,
    voiceSupport: true // Default to true now
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeInterview, setActiveInterview] = useState(null);

  const handleStartSetup = () => {
    setCurrentStep(2);
  };

  const handleOptionChange = (option, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleBeginInterview = async () => {
    if (!resumeFile) {
      alert("Please upload your resume first!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('interviewType', selectedOptions.interviewType);

      const token = localStorage.getItem('navai_access_token');
      // If no token (dev env?), handle gracefully or warn. Assuming auth is required.
      if (!token) {
        alert("You must be logged in to start an interview.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:5000/api/aiInterviews/start', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });

      setActiveInterview(response.data);
      setCurrentStep(3); // Move to Interview Session
    } catch (error) {
      console.error("Error starting interview:", error);
      alert(error.response?.data?.error || "Failed to start interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndInterview = () => {
    setCurrentStep(1);
    setActiveInterview(null);
    setResumeFile(null);
    setSelectedOptions({
      interviewType: '',
      feedback: false,
      practiceMode: false,
      voiceSupport: true
    });
  };

  return (
    <main className="flex-1 pt-16 ml-0 md:ml-64">
      <div className="p-6 md:p-8">

        {/* Step 1: Welcome & Intro */}
        {currentStep === 1 && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Interview Simulator</h1>
              <p className="text-lg text-gray-600">Practice mock interviews powered by AI for HR, Technical, or Behavioral rounds</p>
            </div>

            <div className="w-full">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to NavAI's AI Interview Simulator!</h2>
                    <p className="text-blue-100">Upload your resume, chat with AI, and get real-time feedback.</p>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <button
                  onClick={handleStartSetup}
                  className="bg-primary-blue text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12a2 2 0 002 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                  </svg>
                  <span>Start New Interview</span>
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Based</h3>
                  <p className="text-gray-600">Questions tailored specifically to your resume.</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Interaction</h3>
                  <p className="text-gray-600">Speak naturally and hear the AI interviewer.</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Feedback</h3>
                  <p className="text-gray-600">Receive constructive feedback on your answers.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Setup (Resume + Options) */}
        {currentStep === 2 && (
          <div className="w-full min-w-full">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            <div className="w-full min-w-full bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Setup Your Interview</h2>
              <p className="text-gray-600 mb-6">Upload your resume and choose your interview style.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Resume Upload */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">1. Upload Resume</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-blue transition-colors bg-gray-50">
                    {resumeFile ? (
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium truncate max-w-[200px]">{resumeFile.name}</span>
                        <button onClick={() => setResumeFile(null)} className="text-red-500 hover:text-red-700 ml-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-500 mb-2">Drag and drop or click to upload</p>
                        <p className="text-xs text-gray-400">PDF or DOCX (Max 5MB)</p>
                        <input
                          type="file"
                          accept=".pdf,.docx,.doc"
                          onChange={handleResumeChange}
                          style={{ display: 'none' }} // Hide default and use label trigger
                          id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="block mt-4 cursor-pointer">
                          <span className="bg-blue-50 text-blue-700 font-semibold py-2 px-4 rounded-full hover:bg-blue-100 transition-colors">
                            Choose File
                          </span>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Options */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">2. Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
                      <select
                        value={selectedOptions.interviewType}
                        onChange={(e) => handleOptionChange('interviewType', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring focus:ring-blue-200 p-2 border"
                      >
                        <option value="">Select a type...</option>
                        <option value="HR">HR Round (General)</option>
                        <option value="Technical">Technical Round</option>
                        <option value="Behavioral">Behavioral Round</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="voiceSupport"
                        type="checkbox"
                        checked={selectedOptions.voiceSupport}
                        onChange={(e) => handleOptionChange('voiceSupport', e.target.checked)}
                        className="h-4 w-4 text-primary-blue focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="voiceSupport" className="ml-2 block text-sm text-gray-900">
                        Enable Voice Interaction (Recommended)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleBeginInterview}
                  disabled={!selectedOptions.interviewType || !resumeFile || isLoading}
                  className={`px-8 py-3 rounded-lg font-medium text-lg flex items-center space-x-2 transition-all ${(!selectedOptions.interviewType || !resumeFile || isLoading)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-blue text-white hover:bg-blue-600 shadow-lg transform hover:scale-105'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing Resume & Generating Questions...</span>
                    </>
                  ) : (
                    <span>Start Interview Session</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Active Session */}
        {currentStep === 3 && activeInterview && (
          <AIInterviewSession
            interviewData={activeInterview}
            onEndInterview={handleEndInterview}
          />
        )}

      </div>
    </main>
  );
};

export default AIInterviewMain;
