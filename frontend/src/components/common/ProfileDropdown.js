import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProfileSlider = ({ user = {}, onLogout, onNavigate, hideNameOnMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const { userVerification } = useAuth();

  // Close slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sliderRef.current && !sliderRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Add body overflow control
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when slider is open
    } else {
      document.body.style.overflow = ''; // Restore scrolling
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Navigation items based on user role
  const getDashboardItems = () => {
    // Common settings section for all users
    const settingsSection = {
      title: "Settings",
      items: [
        {
          label: 'Profile Settings',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          path: '/dashboard/profile'
        },
        {
          label: 'Settings',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          path: '/dashboard/settings'
        }
      ]
    };

    // If user is an unapproved organizer, show only settings section
    if (user?.role === 'organizer' && userVerification?.status !== 'approved') {
      return [settingsSection];
    }

    // Candidate-specific navigation items
    const candidateSections = [
      {
        title: "Participant",
        items: [
          {
            label: 'Overview',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            ),
            path: '/dashboard/user'
          },
          {
            label: 'My Hackathons',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            ),
            path: '/dashboard/user/hackathons'
          },
          {
            label: 'Challenges',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            ),
            path: '/dashboard/user/challenges'
          },
          {
            label: 'Certificates',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            ),
            path: '/dashboard/user/certificates'
          }
        ]
      }
    ];

    // Organizer-specific navigation items
    const organizerSections = [
      {
        title: "Organizer Dashboard",
        items: [
          {
            label: 'Dashboard',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            ),
            path: '/dashboard/organizer'
          },
          {
            label: 'My Hackathons',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
            path: '/dashboard/organizer/hackathons'
          },
          {
            label: 'Participants',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ),
            path: '/dashboard/organizer/participants'
          },
          {
            label: 'Teams',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ),
            path: '/dashboard/organizer/teams'
          },
          {
            label: 'Submissions',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
            path: '/dashboard/organizer/submissions'
          },
          {
            label: 'Judging',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            ),
            path: '/dashboard/organizer/judging'
          },
          {
            label: 'Wallet',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            ),
            path: '/dashboard/organizer/wallet'
          },
          {
            label: 'Analytics',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
            path: '/dashboard/organizer/analytics'
          }
        ]
      }
    ];

    // Return sections based on user role
    const userRole = user?.role || 'candidate';

    if (userRole === 'organizer') {
      return [...organizerSections, settingsSection];
    } else {
      return [...candidateSections, settingsSection];
    }
  };

  const handleItemClick = (path) => {
    setIsOpen(false);
    navigate(path);
    if (onNavigate) onNavigate(path);
  };

  // Default avatar if none provided
  const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none group"
        aria-label="Open profile menu"
      >
        <div className="flex items-center space-x-2">
          <div className="relative">
            <img
              src={user?.avatar || defaultAvatar}
              alt={user?.firstName || "User"}
              className="h-8 w-8 rounded-full border-2 border-indigo-500 transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          {!hideNameOnMobile && (
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              {user?.firstName || "Guest"}
            </span>
          )}
        </div>
        {/* Only show dropdown arrow when name is visible (desktop) */}
        {!hideNameOnMobile && (
          <svg
            className={`h-4 w-4 text-gray-400 transition-all duration-200 group-hover:text-white ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Fullscreen Slider */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          ref={sliderRef}
          className={`fixed top-0 right-0 bottom-0 w-full sm:w-72 md:w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
            } flex flex-col h-full`}
        >
          {/* Header with close button */}
          <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
            <h2 className="text-lg font-bold text-white">Profile</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="transition-colors group"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 transition-all duration-500 ease-in-out transform group-hover:rotate-180 group-hover:scale-110 text-gray-400 group-hover:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Items - Scrollable area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
            {/* User Profile Section - Moved inside scrollable area */}
            <div className="px-6 pb-6 mb-4 border-b border-gray-700 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={user?.avatar || defaultAvatar}
                    alt={user?.firstName || "User"}
                    className="h-16 w-16 rounded-full border-2 border-indigo-500"
                  />
                </div>
                <div>
                  <p className="text-lg font-medium text-white">{user?.firstName || "Guest"}</p>
                  <p className="text-sm text-gray-300 mt-1">{user?.email || "No email"}</p>
                  <div className="flex mt-2 space-x-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                      {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Guest"}
                    </span>
                    {user?.badges && user.badges.length > 0 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-indigo-900/50 text-indigo-300">
                        {user.badges[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {getDashboardItems().map((section, sectionIndex) => (
              <div key={sectionIndex} className={`${sectionIndex > 0 ? 'mt-6' : ''}`}>
                <div className="px-4 mb-3">
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold px-2">{section.title}</h3>
                </div>

                <div className="space-y-1 px-2">
                  {section.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleItemClick(item.path)}
                      className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors rounded-lg group"
                    >
                      <span className="mr-3 text-gray-400 group-hover:text-white transition-colors">
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-indigo-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center justify-center min-w-[1.5rem]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Logout Section */}
            <div className="px-2 mt-6">
              <div className="px-4 mb-2">
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold px-2">Account</h3>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    navigate('/login', { replace: true, state: {} });
                  }
                }}
                className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-gray-700/50 hover:text-red-300 transition-colors rounded-lg group"
              >
                <span className="mr-3 text-red-400 group-hover:text-red-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
                <span className="text-sm font-medium">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSlider; 