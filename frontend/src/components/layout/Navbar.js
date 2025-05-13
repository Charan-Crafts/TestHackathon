import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileSlider from '../common/ProfileDropdown';
import MobileNavigation from '../common/MobileNavigation';
import NotificationsDropdown from '../common/NotificationsDropdown';
import logo from '../../assets/images/logo.png';
import { TrophyIcon, BuildingLibraryIcon, UsersIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

function Navbar({ showTopNavbar = true, showBottomNav = false, hideOnScroll = false, isHomePage = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, userVerification } = useAuth();

  // Notification state
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isNotificationClick = event.target.closest('.notification-bell') !== null;
      if (showNotifications && !isNotificationClick) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
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
    if (isOpen) {
      toggleMenu();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        navigate('/login', { replace: true, state: {} });
      }
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login', { replace: true, state: {} });
    }
  };

  // Handle profile navigation
  const handleProfileNavigation = (path) => {
    handleNavClick();
    navigate(path);
  };

  // Define a custom ProfileSlider prop to hide username on mobile/tablet
  const profileProps = {
    user: user,
    hideNameOnMobile: showBottomNav, // Hide name on mobile/tablet views (which use bottom nav)
    onLogout: handleLogout,
    onNavigate: handleProfileNavigation
  };

  // Navigation items for candidate
  const candidateNavItems = [
    { path: '/hackathons', label: 'Hackathons' },
    { path: '/challenges', label: 'Challenges' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/blogs', label: 'Blogs' }
  ];

  // Navigation items for organizer
  const organizerNavItems = [
    { path: '/dashboard/organizer', label: 'Dashboard' },
    { path: '/manage-hackathons', label: 'My Hackathons' },
    { path: '/submissions', label: 'Submissions' },
    { path: '/analytics', label: 'Analytics' }
  ];

  // Navigation items for admin
  const adminNavItems = [
    { path: '/dashboard/admin', label: 'Admin Panel' },
    { path: '/dashboard/admin/users', label: 'Users' },
    { path: '/dashboard/admin/hackathons', label: 'Hackathons' },
    { path: '/dashboard/admin/challenges', label: 'Challenges' }
  ];

  // Get navigation items based on user role
  const getNavItems = () => {
    if (!user) return candidateNavItems;

    if (user.role === 'organizer' && userVerification?.status !== 'approved') {
      // Unapproved organizer: show no nav items
      return [];
    }
    if (user.role === 'admin') {
      return adminNavItems;
    } else if (user.role === 'organizer' && userVerification?.status === 'approved') {
      return organizerNavItems;
    } else if (user.role === 'pending_organizer' || (user.role === 'organizer' && userVerification?.status !== 'approved')) {
      // Pending or unapproved organizers see candidate items
      return candidateNavItems;
    } else {
      return candidateNavItems;
    }
  };

  const navItems = getNavItems();

  // Get host button text and path based on user role
  const getHostButton = () => {
    if (!user) return { text: 'Host', path: '/login' };

    if (user.role === 'admin' || user.role === 'organizer') {
      return { text: 'Create Event', path: '/host/create' };
    } else if (user.role === 'pending_organizer') {
      return { text: 'Verification', path: '/verification' };
    } else {
      return { text: 'Host', path: '/host' };
    }
  };

  const hostButton = getHostButton();

  // If user is an organizer and userVerification is undefined (still loading), show nothing
  if (user?.role === 'organizer' && typeof userVerification === 'undefined') {
    return null; // or return a loading spinner if you prefer
  }

  return (
    <>
      {/* Only show top navbar when showTopNavbar is true */}
      {showTopNavbar && (
        <nav className={`bg-gray-900 text-white fixed top-0 left-0 right-0 z-50 shadow-md ${showBottomNav ? 'h-14' : ''} border-b border-indigo-900/40`}>
          <div className="container-fluid w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              {/* Logo - stays at the left */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center" onClick={handleNavClick}>
                  <img
                    src={logo}
                    alt="Hackathon Logo"
                    className="h-8 w-auto mr-2"
                  />
                  <span className="text-lg font-bold">Hackathon</span>
                </Link>
              </div>

              {/* Mobile menu button - only show if not using bottom nav */}
              {!showBottomNav && (
                <div className="lg:hidden">
                  <button
                    onClick={toggleMenu}
                    className="text-white hover:text-gray-300 focus:outline-none"
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isOpen}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                </div>
              )}

              {/* Desktop navigation - centered items - hide on mobile and tablet */}
              <div className={`${showBottomNav ? 'hidden' : 'hidden lg:flex'} flex-1 justify-center`}>
                <div className="flex items-center space-x-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`${isActive(item.path) ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-white hover:bg-gray-700'} px-3 py-2 rounded-md text-sm font-medium`}
                      onClick={handleNavClick}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Login Button or Notification + Profile - stays at the right */}
              <div className="flex items-center space-x-3">
                {isAuthenticated && (
                  <NotificationsDropdown
                    notificationCount={notificationCount}
                    setNotificationCount={setNotificationCount}
                    showNotifications={showNotifications}
                    toggleNotifications={toggleNotifications}
                    onNavigate={handleNavClick}
                  />
                )}

                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 flex items-center"
                    onClick={handleNavClick}
                  >
                    <span className="flex-shrink-0">Login</span>
                  </Link>
                ) : (
                  <ProfileSlider
                    {...profileProps}
                  />
                )}
              </div>
            </div>

            {/* Traditional Mobile menu - only show if not using bottom nav */}
            {!showBottomNav && isOpen && (
              <div className="lg:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`${isActive(item.path) ? 'text-indigo-400 border-l-4 border-indigo-400 pl-2' : 'text-white hover:bg-gray-700'} block px-3 py-2 rounded-md text-base font-medium`}
                      onClick={handleNavClick}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Mobile Navigation Component */}
      {showBottomNav && (
        <MobileNavigation
          hideOnScroll={hideOnScroll}
          onNavigate={handleNavClick}
          navItems={navItems}
          userRole={user?.role || 'candidate'}
        />
      )}
    </>
  );
}

export default Navbar; 