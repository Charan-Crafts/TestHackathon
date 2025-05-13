import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';

function ForumsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const forumCategories = [
    {
      id: 1,
      name: "Web Development",
      description: "Discussions about frontend, backend, and full-stack web development",
      threads: 1248,
      posts: 8720
    },
    {
      id: 2,
      name: "Mobile Development",
      description: "Topics related to iOS, Android, and cross-platform mobile app development",
      threads: 856,
      posts: 4310
    },
    {
      id: 3,
      name: "AI & Machine Learning",
      description: "Explore topics in artificial intelligence, machine learning, and data science",
      threads: 624,
      posts: 3290
    },
    {
      id: 4,
      name: "DevOps & Cloud",
      description: "Discussions about CI/CD, cloud platforms, containers, and infrastructure",
      threads: 512,
      posts: 2850
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
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 relative inline-block">
            <span className="relative z-10">Developer <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Forums</span></span>
            <span className="absolute -left-2 bottom-0 w-full h-2 sm:h-3 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-70 transform skew-x-12 z-0"></span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
            Join discussions, ask questions, and share your knowledge with fellow developers
          </p>
        </div>

        {/* Forum Categories */}
        <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
          <div className="space-y-4">
            {forumCategories.map((category) => (
              <div 
                key={category.id}
                className="bg-gradient-to-br from-gray-800/70 via-gray-900/80 to-gray-800/70 rounded-xl overflow-hidden border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <Link 
                        to={`/community/forums/${category.id}`}
                        className="text-xl font-bold text-white hover:text-cyan-400 transition-colors"
                      >
                        {category.name}
                      </Link>
                      <p className="text-gray-400 text-sm mt-1">{category.description}</p>
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-400">
                      <div>
                        <span className="text-cyan-400 font-medium">{category.threads}</span> threads
                      </div>
                      <div>
                        <span className="text-cyan-400 font-medium">{category.posts}</span> posts
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Discussions */}
        <div className={`mt-10 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
          <div className="bg-gradient-to-r from-cyan-900/30 via-gray-900/40 to-cyan-900/30 rounded-xl p-6 backdrop-blur-sm border border-cyan-800/30">
            <h2 className="text-xl font-bold text-white mb-6">Recent Discussions</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center">
                      <img src={`https://i.pravatar.cc/40?img=${item + 15}`} alt="User avatar" className="w-10 h-10 rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Link 
                      to={`/community/forums/thread/${item}`}
                      className="text-white text-md font-medium hover:text-cyan-400 transition-colors"
                    >
                      How to optimize React performance for large data sets?
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-4 text-xs text-gray-400 mt-2">
                      <span>Posted by <span className="text-cyan-400">User{item}</span></span>
                      <span>3 hours ago</span>
                      <span>12 replies</span>
                      <span className="text-cyan-400">Web Development</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4 hidden sm:block">
                    <span className="inline-block px-2 py-1 bg-cyan-900/30 text-cyan-400 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link 
                to="/community/forums/recent"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 hover:from-cyan-600/30 hover:to-cyan-800/30 text-white text-sm font-medium rounded-lg border border-cyan-500/30 transition-all duration-300"
              >
                View All Discussions
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className={`mt-10 flex justify-center space-x-4 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
          <Link 
            to="/community"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 hover:from-cyan-600/30 hover:to-cyan-800/30 text-white text-sm font-medium rounded-lg border border-cyan-500/30 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Community Hub
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForumsPage; 