import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';

function CommunityPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const communityFeatures = [
    {
      title: "Developer Forums",
      description: "Connect with fellow developers to share ideas and solve problems together",
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      link: "/community/forums",
      color: "cyan"
    },
    {
      title: "Collaborative Tools",
      description: "Work on projects together with real-time collaboration tools and version control",
      icon: (
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      link: "/community/collaborate",
      color: "blue"
    },
    {
      title: "Events & Meetups",
      description: "Participate in online and local events to network and learn from experts",
      icon: (
        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      link: "/community/events",
      color: "purple"
    },
    {
      title: "Mentorship Program",
      description: "Connect with experienced developers for guidance on your coding journey",
      icon: (
        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      link: "/community/mentorship",
      color: "indigo"
    }
  ];

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
      
      // Trigger animation after data is loaded
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, 1200);
  }, []);

  if (loading) {
    return <LoadingIndicator type="scanning" message="Please wait..." title="" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-cyan-900/20 to-gray-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-10 sm:mb-14 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 relative inline-block">
            <span className="relative z-10">Community <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Hub</span></span>
            <span className="absolute -left-2 bottom-0 w-full h-2 sm:h-3 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-70 transform skew-x-12 z-0"></span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
            Connect, collaborate, and grow with our global community of developers and creators
          </p>
        </div>

        {/* Stats */}
        <div className={`mb-10 sm:mb-14 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
          <div className="bg-gradient-to-r from-cyan-900/30 via-gray-900/40 to-cyan-900/30 rounded-xl p-6 sm:p-8 backdrop-blur-sm border border-cyan-800/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">14,305</div>
                <div className="text-gray-400 text-xs sm:text-sm">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">5,280</div>
                <div className="text-gray-400 text-xs sm:text-sm">Forum Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">128</div>
                <div className="text-gray-400 text-xs sm:text-sm">Upcoming Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">372</div>
                <div className="text-gray-400 text-xs sm:text-sm">Mentors Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {communityFeatures.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-gradient-to-br from-gray-800/70 via-gray-900/80 to-gray-800/70 rounded-xl overflow-hidden border border-gray-700/30 hover:border-cyan-500/40 shadow-lg transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="p-6 sm:p-8">
                  <div className={`w-16 h-16 bg-${feature.color}-900/30 rounded-lg flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{feature.title}</h2>
                  <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                  <div className="flex items-center text-cyan-400">
                    <span className="text-sm font-medium">Learn more</span>
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`mt-10 sm:mt-14 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
          <div className="bg-gradient-to-r from-cyan-900/30 via-gray-900/40 to-cyan-900/30 rounded-xl p-6 sm:p-8 backdrop-blur-sm border border-cyan-800/30">
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center">
                      <img src={`https://i.pravatar.cc/40?img=${item + 10}`} alt="User avatar" className="w-10 h-10 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      <span className="text-cyan-400">User{item + 1}</span> posted in <span className="text-cyan-400">Web Development Forum</span>
                    </p>
                    <p className="text-gray-400 text-xs mt-1">"How do I implement authentication with JWT in a React application?"</p>
                    <p className="text-gray-500 text-xs mt-2">2 hours ago • 8 replies</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link 
                to="/community/activity"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 hover:from-cyan-600/30 hover:to-cyan-800/30 text-white text-sm font-medium rounded-lg border border-cyan-500/30 transition-all duration-300"
              >
                View All Activity
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className={`mt-10 text-center transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
          <Link 
            to="/projects"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-600/20 to-gray-800/20 hover:from-gray-600/30 hover:to-gray-800/30 text-white text-sm font-medium rounded-lg border border-gray-500/30 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects Hub
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage; 