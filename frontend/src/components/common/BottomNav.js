import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Bottom Navigation Component for Mobile - Direct page navigation
const BottomNav = ({ 
  moreItems = []
}) => {
  const location = useLocation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  
  // Main navigation items for user sections
  const userNavItems = [
    { id: 'overview', title: 'Overview', icon: 'home', path: '/dashboard/user' },
    { id: 'applications', title: 'Applications', icon: 'clipboard-list', path: '/dashboard/user/application-status' },
    { id: 'challenges', title: 'Challenges', icon: 'code', path: '/dashboard/user/challenges' },
    { id: 'watchlist', title: 'Watchlist', icon: 'bookmark', path: '/dashboard/user/watchlist' },
    { id: 'more', title: 'More', icon: 'ellipsis-h', path: '#' }
  ];
  
  // Additional items for the More menu - if none provided, use these defaults
  const defaultMoreItems = [
    { id: 'hackathons', title: 'Hackathons', icon: 'laptop-code', link: '/dashboard/user/hackathons' },
    { id: 'projects', title: 'Projects', icon: 'project-diagram', link: '/dashboard/user/projects' },
    { id: 'certificates', title: 'Certificates', icon: 'certificate', link: '/dashboard/user/certificates' },
    { id: 'mentorship', title: 'Mentorship', icon: 'user-friends', link: '/dashboard/user/mentorship' },
    { id: 'community', title: 'Community', icon: 'users', link: '/dashboard/user/community' }, 
    { id: 'profile', title: 'Profile', icon: 'user', link: '/dashboard/profile' },
    { id: 'recent', title: 'Recently Viewed', icon: 'history', link: '/dashboard/user/recently-viewed' }
  ];
  
  const moreNavItems = moreItems.length > 0 ? moreItems : defaultMoreItems;
  
  // Check if the current path matches a nav item
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Handle more button click
  const handleMoreClick = () => {
    setMoreMenuOpen(!moreMenuOpen);
  };
  
  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/70 backdrop-blur-lg border-t border-gray-700/50 py-2 px-2 z-50 md:hidden">
        {/* Main Navigation Items */}
        <div className="flex justify-around">
          {userNavItems.map((item) => (
            item.id === 'more' ? (
              <button
                key={item.id}
                onClick={handleMoreClick}
                className="flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors"
              >
                <i className={`fas fa-${item.icon} text-lg`}></i>
                <span className="text-xs mt-1">{item.title}</span>
              </button>
            ) : (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center p-2 ${
                  isActive(item.path)
                    ? 'text-purple-400'
                    : 'text-gray-400 hover:text-white'
                } transition-colors`}
              >
                <i className={`fas fa-${item.icon} text-lg`}></i>
                <span className="text-xs mt-1">{item.title}</span>
              </Link>
            )
          ))}
        </div>
      </div>
      
      {/* More Menu Modal */}
      {moreMenuOpen && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-end justify-center md:hidden">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-xl w-full max-w-md p-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">More Options</h3>
              <button 
                onClick={() => setMoreMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {moreNavItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="flex flex-col items-center p-3 bg-gray-800/70 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700/50"
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 mb-2">
                    <i className={`fas fa-${item.icon}`}></i>
                  </div>
                  <span className="text-sm text-white">{item.title}</span>
                </Link>
              ))}
            </div>
            
            <div className="mt-6 mb-2 flex justify-center">
              <button 
                onClick={() => setMoreMenuOpen(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav; 