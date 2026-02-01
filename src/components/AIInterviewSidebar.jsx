import React from 'react';

const AIInterviewSidebar = ({ isOpen, toggleSidebar }) => {

  const handleNewInterview = () => {
    // Logic to start a new interview session
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-full bg-white shadow-lg transition-transform duration-300 z-40 w-64 border-r border-gray-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>
        <div className="p-6 h-full flex flex-col">
          {/* NavAI Logo at Top */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">AI Interview</h2>
          </div>

          {/* New Interview Button */}
          <button
            onClick={handleNewInterview}
            className="w-full bg-primary-blue text-white p-3 rounded-lg hover:bg-blue-600 transition-colors font-medium mb-8 flex items-center justify-center space-x-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Interview</span>
          </button>

          {/* Instructions / How it Works */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">How it Works</h3>

            <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-20px)] before:w-0.5 before:bg-gray-100">

              {/* Step 1 */}
              <div className="relative flex items-start space-x-4">
                <div className="z-10 w-8 h-8 rounded-full bg-white border-2 border-primary-blue flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-primary-blue font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Upload Resume</h4>
                  <p className="text-xs text-gray-500 mt-1">Upload your resume so the AI can ask relevant questions.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start space-x-4">
                <div className="z-10 w-8 h-8 rounded-full bg-white border-2 border-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-purple-500 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Choose Type</h4>
                  <p className="text-xs text-gray-500 mt-1">Select HR, Technical, or Behavioral interview mode.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start space-x-4">
                <div className="z-10 w-8 h-8 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-orange-500 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Start Speaking</h4>
                  <p className="text-xs text-gray-500 mt-1">Engage in a voice-based interview with real-time feedback.</p>
                </div>
              </div>

            </div>

            {/* Pro Tip */}
            <div className="mt-8 bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <span className="text-xs font-bold text-green-700">PRO TIP</span>
              </div>
              <p className="text-xs text-green-800 leading-relaxed">
                Treat this like a real interview. Speak clearly and take your time to answer.
              </p>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default AIInterviewSidebar;
