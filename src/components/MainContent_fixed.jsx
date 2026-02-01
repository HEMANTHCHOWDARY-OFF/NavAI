import React from 'react';
import Instagram from './Instagram.jsx';
import AboutNavAI from './AboutNavAI.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import SplitText from './SplitText.jsx';

const MainContent = ({ onNavigateToAIInterview, activeSection }) => {
  const { user } = useAuth();
  const handleStartPracticing = () => {
    if (onNavigateToAIInterview) {
      onNavigateToAIInterview();
    }
  };

  if (activeSection === 'profile') {
    return (
      <main className="flex-1 pt-16 ml-0 md:ml-64">
        <div className="p-6 md:p-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <SplitText
                  text={user?.name || 'User'}
                  className="text-xl font-semibold text-gray-900"
                  delay={50}
                  duration={1.25}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="left"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (activeSection === 'instagram') {
    return <Instagram />;
  }

  return (
    <main className="flex-1 pt-16 ml-0 md:ml-64">
      <div className="p-6 md:p-8">
        <AboutNavAI />
      </div>
    </main>
  );
};

export default MainContent;
