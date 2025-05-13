import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  TrophyIcon,
  BriefcaseIcon,
  ChartBarIcon,
  BookOpenIcon,
  XMarkIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  Squares2X2Icon,
  AcademicCapIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { CgDetailsMore } from "react-icons/cg";

function MobileNavigation({ hideOnScroll = false, onNavigate, navItems, userRole = 'candidate' }) {
  const [isTablet, setIsTablet] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const location = useLocation();
  const moreMenuRef = useRef(null);

  // Check device sizes - mobile, tablet, or desktop
  useEffect(() => {
    const checkDeviceSize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 640) {
        // Mobile
        setIsTablet(false);
      } else if (windowWidth < 1024) {
        // Tablet
        setIsTablet(true);
      }
    };

    checkDeviceSize();
    window.addEventListener('resize', checkDeviceSize);
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  // Close the more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target) && showMoreMenu) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);

  const toggleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  // Check if a navigation item is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Handle navigation click
  const handleNavClick = () => {
    window.scrollTo(0, 0);
    if (showMoreMenu) {
      setShowMoreMenu(false);
    }
    if (onNavigate) {
      onNavigate();
    }
  };

  // Get icon component based on path
  const getIconForPath = (path) => {
    switch (path) {
      case '/':
        return <HomeIcon className={`${isTablet ? 'w-5 h-5' : 'w-5 h-5'}`} />;
      case '/hackathons':
        return <TrophyIcon className={`${isTablet ? 'w-5 h-5' : 'w-5 h-5'}`} />;
      case '/challenges':
        return <BriefcaseIcon className={`${isTablet ? 'w-5 h-5' : 'w-5 h-5'}`} />;
      case '/leaderboard':
        return <ChartBarIcon className={`${isTablet ? 'w-5 h-5' : 'w-5 h-5'}`} />;
      case '/blogs':
        return <BookOpenIcon className={`${isTablet ? 'w-5 h-5' : 'w-5 h-5'}`} />;
      case '/dashboard':
        return <Squares2X2Icon className={`${isTablet ? 'w-5 h-5' : 'w-5 h-5'}`} />;
      case '/manage-hackathons':
        return <DocumentTextIcon className={`${isTablet ? 'w-5 h-5' : 'w-5 h-5'}`} />;
      case '/submissions':
        return <ClipboardDocumentCheckIcon className={`${isTablet ? 'w-5 h-5' : 'w-5 h-5'}`} />;
      case '/analytics':
        return <ChartBarIcon className={`${isTablet ? 'w-5 h-5' : 'w-5 h-5'}`} />;
      default:
        return <HomeIcon className={`${isTablet ? 'w-5 h-5' : 'w-5 h-5'}`} />;
    }
  };

  // Different number of primary items based on screen size
  const mobileNavItems = [
    { path: '/', label: 'Home' },
    ...(navItems || []).slice(0, 3) // Include first 3 items from the provided navItems
  ].map(item => ({
    ...item,
    icon: getIconForPath(item.path)
  }));

  // Show only 4 items on mobile
  const displayedNavItems = isTablet ? mobileNavItems : mobileNavItems.slice(0, 4);

  // Additional items for the More menu - depends on user role
  const getCandidateMoreItems = () => [
    { path: '/host', icon: <TrophyIcon className="w-4 h-4" />, label: 'Host Hackathon' },
    { path: '/challenges/create', icon: <BriefcaseIcon className="w-4 h-4" />, label: 'Create Challenge' },
    { path: '/blogs', icon: <BookOpenIcon className="w-4 h-4" />, label: 'Blogs' },
    { path: '/community', icon: <UserGroupIcon className="w-4 h-4" />, label: 'Community' }
  ];

  const getOrganizerMoreItems = () => [
    { path: '/host', icon: <DocumentTextIcon className="w-4 h-4" />, label: 'Create Event' },
    { path: '/teams', icon: <UserGroupIcon className="w-4 h-4" />, label: 'Manage Teams' },
    { path: '/payments', icon: <BuildingLibraryIcon className="w-4 h-4" />, label: 'Payments' },
    { path: '/settings', icon: <AcademicCapIcon className="w-4 h-4" />, label: 'Settings' }
  ];

  const moreNavItems = userRole === 'organizer' ? getOrganizerMoreItems() : getCandidateMoreItems();

  return (
    <>
      {/* Bottom navbar */}
      <nav className={`bg-gray-900 text-white fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 ${hideOnScroll ? 'translate-y-16' : 'translate-y-0'} transition-transform duration-300 ${showMoreMenu && !isTablet ? 'opacity-0 pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between h-16">
          {/* Main nav items */}
          {displayedNavItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center px-3 py-2 w-full text-xs relative
                ${isActive(item.path)
                  ? 'text-purple-500'
                  : 'text-gray-400 hover:text-gray-300'}`}
              onClick={handleNavClick}
            >
              {isActive(item.path) && (
                <div className="absolute -top-1.5 w-10 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-sm shadow-purple-500/30"></div>
              )}
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </Link>
          ))}

          {/* More menu button */}
          <button
            className={`flex flex-col items-center justify-center px-3 py-2 w-full text-xs relative
              ${showMoreMenu
                ? 'text-purple-500'
                : 'text-gray-400 hover:text-gray-300'}`}
            onClick={toggleMoreMenu}
            aria-expanded={showMoreMenu}
            aria-label="More menu"
          >
            {showMoreMenu && (
              <div className="absolute -top-1.5 w-10 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-sm shadow-purple-500/30"></div>
            )}
            <CgDetailsMore className={`${isTablet ? 'w-5 h-5' : 'w-5 h-5'}`} />
            <span className="mt-1">More</span>
          </button>
        </div>
      </nav>

      {/* More menu - expandable from bottom nav - different for mobile vs tablet */}
      {showMoreMenu && (
        <>
          {/* Mobile: slide up from bottom */}
          {!isTablet && (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 border-t border-gray-700 shadow-lg rounded-t-xl overflow-hidden">
              <div className="flex justify-between items-center py-2 px-4">
                <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto"></div>
                <button
                  onClick={toggleMoreMenu}
                  className="absolute right-4 text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded-full transition-all duration-300 group"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>
              <div className="p-3 grid grid-cols-3 gap-3 pb-5">
                {moreNavItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    onClick={handleNavClick}
                  >
                    <div className="text-center text-white mb-1">
                      {item.icon}
                    </div>
                    <span className="text-xs text-center font-medium text-white">{item.label}</span>
                    {item.badge && (
                      <span className="mt-0.5 text-[10px] bg-purple-600 px-1 py-0.5 rounded text-white text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tablet: slide in from right */}
          {isTablet && (
            <div
              ref={moreMenuRef}
              className="fixed top-14 bottom-16 right-0 z-40 bg-gray-800 border-l border-gray-700 shadow-lg w-60 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <h3 className="text-white font-medium">More Options</h3>
                <button
                  onClick={toggleMoreMenu}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded-full transition-all duration-300 group"
                >
                  <XMarkIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>
              <div className="p-2">
                {moreNavItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg ${isActive(item.path)
                        ? 'bg-gray-700 text-purple-400'
                        : 'hover:bg-gray-700 text-white'
                      } transition-colors`}
                    onClick={handleNavClick}
                  >
                    <div className="text-center mr-3">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-xs bg-purple-600 px-1.5 py-0.5 rounded text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Overlay for more menu */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMoreMenu}
        ></div>
      )}
    </>
  );
}

export default MobileNavigation; 