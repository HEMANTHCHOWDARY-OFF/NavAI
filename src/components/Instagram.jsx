import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const InstagramPost = ({ post, index }) => {
  return (
    <div className="instagram-card group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-100">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-tr ${post.gradient}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">NavAI Official</p>
            <p className="text-xs text-gray-500">{post.location}</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      </div>

      {/* Content Area - Simulated Image/Gradient */}
      <div className={`h-48 w-full bg-gradient-to-br ${post.gradient} flex items-center justify-center p-6 text-center group-hover:bg-opacity-90 transition-all`}>
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-30">
          <post.icon className="w-12 h-12 text-white mx-auto mb-2" />
          <h3 className="text-white font-bold text-lg">{post.title}</h3>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-4">
            <svg className="w-6 h-6 text-gray-800 hover:text-red-500 transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <svg className="w-6 h-6 text-gray-800 hover:text-blue-500 transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <svg className="w-6 h-6 text-gray-800 hover:text-gray-600 transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <svg className="w-6 h-6 text-gray-800 hover:text-gray-600 transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>

        <div className="font-bold text-sm mb-2 text-gray-900">{post.likes} likes</div>
        <p className="text-sm text-gray-700 leading-snug">
          <span className="font-bold mr-1">navai_official</span>
          {post.description}
        </p>
        <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">2 HOURS AGO</p>
      </div>
    </div>
  );
};

const Instagram = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-text", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
        .from(".instagram-card", {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.4")
        .from(".stats-item", {
          scale: 0.8,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05
        }, "-=0.2");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const posts = [
    {
      title: "New AI Features",
      location: "Silicon Valley, CA",
      gradient: "from-blue-500 to-purple-600",
      icon: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      likes: "1,245",
      description: "🚀 Exciting update! We've just launched our new AI Interview simulator. Practice like a pro and land that dream job! 💼✨ #NavAI #CareerGoals #AIInnovation"
    },
    {
      title: "Resume Tips 101",
      location: "Career Center",
      gradient: "from-green-400 to-teal-500",
      icon: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      likes: "892",
      description: "📝 Is your resume ATS-friendly? Swipe left to see the top 5 mistakes to avoid in 2024. Don't let a bot reject your hard work! 🤖❌ #ResumeTips #JobSearch #CareerAdvice"
    },
    {
      title: "User Success Story",
      location: "New York, NY",
      gradient: "from-pink-500 to-rose-500",
      icon: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      likes: "2,301",
      description: "🎉 Congratulations to Sarah M. for landing her role at Google after using NavAI's Resume Screener! We're so proud to be part of your journey. 🌟👩‍💻 #SuccessStory #Hired #TechLife"
    },
    {
      title: "Community Challenge",
      location: "Global",
      gradient: "from-orange-400 to-red-500",
      icon: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      likes: "567",
      description: "🔥 Challenge Alert! Post your best mock interview score from NavAI and tag us! Top 3 scores this week win a free premium resume review. 🏆👀 #Challenge #CareerPrep #WinBig"
    },
    {
      title: "Webinar Alert",
      location: "Online Event",
      gradient: "from-indigo-500 to-blue-600",
      icon: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
      likes: "430",
      description: "📢 Join us LIVE this Friday for a Q&A with Senior Recruiters from top tech firms. Get your questions answered directly! Link in bio. 🔗🎥 #Webinar #Recruiting #CareerGrowth"
    },
    {
      title: "Quote of the Day",
      location: "Inspiration",
      gradient: "from-yellow-400 to-orange-500",
      icon: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
      likes: "1,102",
      description: "💡 'The only way to do great work is to love what you do.' - Steve Jobs. Keep pushing towards your passion! 💪❤️ #MondayMotivation #Inspiration #SteveJobs"
    }
  ];

  return (
    <main className="flex-1 pt-16 ml-0 md:ml-64 bg-gray-50 min-h-screen" ref={containerRef}>
      <div className="p-6 md:p-8 w-full max-w-full mx-auto">

        {/* Hero Header */}
        <div className="text-center mb-8 hero-text">
          <div className="inline-block p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 mb-3 shadow-lg">
            <div className="bg-white p-1 rounded-full">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">NavAI Official</h1>
          <p className="text-gray-500 text-base mb-4">@navai_official • 12.5k followers</p>

          <div className="flex justify-center space-x-4 stats-item mb-6">
            <div className="text-center px-4">
              <span className="block font-bold text-lg text-gray-900">542</span>
              <span className="text-xs text-gray-500 uppercase">Posts</span>
            </div>
            <div className="text-center px-4 border-l border-gray-200">
              <span className="block font-bold text-lg text-gray-900">12.5k</span>
              <span className="text-xs text-gray-500 uppercase">Followers</span>
            </div>
            <div className="text-center px-4 border-l border-gray-200">
              <span className="block font-bold text-lg text-gray-900">105</span>
              <span className="text-xs text-gray-500 uppercase">Following</span>
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <a
              href="https://www.instagram.com/navai.off?igsh=MWxmeWFoNDV1aDl1eA=="
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Follow</span>
            </a>
            <button className="bg-white text-gray-800 border border-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm text-sm">
              Message
            </button>
          </div>
        </div>

        {/* Categories / Highlights */}
        <div className="flex justify-center space-x-6 mb-8 overflow-x-auto pb-2">
          {['Tips', 'Stories', 'Events', 'Q&A', 'Life'].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-2 cursor-pointer group stats-item">
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-full p-0.5">
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">#{item}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">{item}</span>
            </div>
          ))}
        </div>

        {/* Feed Divider */}
        <div className="border-t border-gray-200 pt-8 mb-6">
          <div className="flex items-center justify-center space-x-2 text-sm font-semibold text-gray-900 tracking-wide uppercase">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Latest Activity</span>
          </div>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <InstagramPost key={index} post={post} index={index} />
          ))}
        </div>

      </div>
    </main>
  );
};

export default Instagram;
