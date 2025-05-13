import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RecentlyViewed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    // Simulate API fetch for recently viewed data
    setTimeout(() => {
      // Mock data - in a real app, this would come from an API
      setRecentItems([
        {
          id: 1,
          type: 'challenge',
          title: 'Advanced Graph Algorithms',
          difficulty: 'hard',
          category: 'Algorithms',
          viewedTime: '2 hours ago',
          progress: 65,
          thumbnail: 'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          link: '/challenges/graph-algorithms'
        },
        {
          id: 2,
          type: 'hackathon',
          title: 'Health Tech Innovators',
          difficulty: 'medium',
          category: 'Healthcare',
          viewedTime: 'Yesterday',
          progress: 30,
          thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          link: '/hackathons/health-tech'
        },
        {
          id: 3,
          type: 'learning',
          title: 'Modern JavaScript Fundamentals',
          difficulty: 'easy',
          category: 'Web Development',
          viewedTime: '3 days ago',
          progress: 75,
          thumbnail: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          link: '/learning/javascript-fundamentals'
        },
        {
          id: 4,
          type: 'challenge',
          title: 'Microservices Architecture',
          difficulty: 'medium',
          category: 'System Design',
          viewedTime: '1 week ago',
          progress: 40,
          thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          link: '/challenges/microservices-arch'
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  // Helper functions for styling
  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-900/30 text-green-400 border-green-500/50';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/50';
      case 'hard':
        return 'bg-red-900/30 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-500/50';
    }
  };

  const getTypeClass = (type) => {
    switch (type.toLowerCase()) {
      case 'challenge':
        return 'bg-indigo-900/30 text-indigo-400 border-indigo-500/50';
      case 'hackathon':
        return 'bg-purple-900/30 text-purple-400 border-purple-500/50';
      case 'project':
        return 'bg-blue-900/30 text-blue-400 border-blue-500/50';
      case 'learning':
        return 'bg-cyan-900/30 text-cyan-400 border-cyan-500/50';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-500/50';
    }
  };

  // Format time relative to now
  const formatTimeAgo = (timeString) => {
    // In a real app, this would be more sophisticated
    return timeString;
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading recently viewed...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <svg className="w-6 h-6 mr-2 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recently Viewed
        </h1>
        <p className="text-gray-400 mb-4">Browse your content viewing history from across the platform.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">Filter by:</span>
          <select className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-gray-300 text-sm focus:border-brand-700 focus:ring focus:ring-brand-700/30">
            <option value="all">All Items</option>
            <option value="challenge">Challenges</option>
            <option value="hackathon">Hackathons</option>
            <option value="project">Projects</option>
            <option value="learning">Learning Resources</option>
          </select>
        </div>
        <div className="text-gray-400 text-sm">
          {recentItems.length} items in history
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-blue-900/5">
        <div className="px-6 py-4 border-b border-gray-700/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Viewing History
            </h2>
          </div>
        </div>

        <div className="overflow-hidden">
          {recentItems.length > 0 ? (
            <div className="divide-y divide-gray-700/30">
              {recentItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 rounded object-cover shadow-md border border-gray-700/50"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link to={item.link} className="text-white font-medium hover:text-brand-400 transition-colors block">
                        {item.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${getTypeClass(item.type)}`}>
                          {item.type}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${getDifficultyClass(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                        <span className="text-xs text-gray-400">{item.category}</span>
                        <span className="text-xs text-brand-400 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Viewed {formatTimeAgo(item.viewedTime)}
                        </span>
                      </div>

                      {item.progress > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center text-xs">
                            <div className="flex-1 h-1.5 bg-gray-700/50 rounded-full overflow-hidden mr-2">
                              <div
                                className="h-full bg-brand-700 rounded-full"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-400">{item.progress}% complete</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex flex-col space-y-2">
                      <Link to={item.link} className="px-3 py-1.5 bg-brand-700 hover:bg-brand-900 text-white rounded-md text-sm font-medium flex items-center justify-center whitespace-nowrap transition-colors">
                        {item.progress > 0 ? 'Continue' : 'View'}
                      </Link>
                      <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-sm flex items-center justify-center whitespace-nowrap transition-colors">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 mb-4">No recently viewed items</p>
              <Link to="/challenges" className="inline-flex items-center text-sm text-brand-400 hover:text-brand-300 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Browse challenges
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-gray-800/30 p-4 rounded-lg border border-gray-700/40">
        <h3 className="text-white text-lg font-medium mb-3">Viewing History Settings</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">History retention period:</span>
              <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-300 text-sm">
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
                <option>All time</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Auto-remove completed items:</span>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-10 h-5 bg-gray-700 rounded-full shadow-inner"></div>
                  <div className="dot absolute w-3 h-3 bg-gray-300 rounded-full transition left-1 top-1"></div>
                </div>
              </label>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Show progress indicators:</span>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="w-10 h-5 bg-brand-900/50 rounded-full shadow-inner"></div>
                  <div className="dot absolute w-3 h-3 bg-brand-300 rounded-full transition left-6 top-1"></div>
                </div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Sync across devices:</span>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="w-10 h-5 bg-brand-900/50 rounded-full shadow-inner"></div>
                  <div className="dot absolute w-3 h-3 bg-brand-300 rounded-full transition left-6 top-1"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700/40 flex justify-end">
          <button className="px-4 py-2 bg-brand-700 hover:bg-brand-900 text-white rounded-md text-sm mr-2">
            Clear History
          </button>
          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-md text-sm">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed; 