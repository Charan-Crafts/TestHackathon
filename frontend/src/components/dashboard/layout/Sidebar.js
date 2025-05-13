import React, { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  Cog6ToothIcon,
  RocketLaunchIcon,
  ClipboardDocumentCheckIcon,
  CodeBracketIcon,
  ArrowRightOnRectangleIcon,
  BookmarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { PiCertificateDuotone } from "react-icons/pi";
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, toggleSidebar, isMobile, user }) => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { userVerification } = useAuth();

  // Check if user is a verified organizer - show organizer section only if approved
  const isVerifiedOrganizer = (user?.role === 'organizer' && userVerification?.status === 'approved') || user?.role === 'admin';

  // For pending organizers, we don't show the organizer section
  const isPendingOrganizer = user?.role === 'pending_organizer';

  // If user is an unapproved organizer, show only settings and logout, no navigation
  const isUnapprovedOrganizer = user?.role === 'organizer' && userVerification?.status !== 'approved';

  // If user is an organizer and userVerification is undefined (still loading), show nothing
  if (user?.role === 'organizer' && typeof userVerification === 'undefined') {
    return null; // or return a loading spinner if you prefer
  }

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login', { replace: true, state: {} });
  };

  const goToProfile = () => {
    navigate('/dashboard/profile');
  };

  // Fixed width values for better stability
  const expandedWidth = "16rem"; // 256px
  const collapsedWidth = "4rem"; // 64px

  if (isUnapprovedOrganizer) {
    return (
      <>
        {/* Sidebar Container - Fixed positioning for stability */}
        <aside
          ref={sidebarRef}
          className="fixed top-14 bottom-0 left-0 z-30 bg-gradient-to-b from-purple-900 to-indigo-950 border-r border-purple-800/20"
          style={{
            width: isMobile ? (isSidebarOpen ? expandedWidth : '0px') : (isSidebarOpen ? expandedWidth : collapsedWidth),
            boxShadow: '0 0 20px rgba(88, 28, 135, 0.3)',
            transition: 'width 200ms ease'
          }}
        >
          {/* Toggle button at the edge */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-6 top-6 w-10 h-10 flex items-center justify-center text-white z-50 hover:bg-purple-800/30 hover:text-white rounded-full transition-colors"
          >
            {isSidebarOpen ?
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            }
          </button>

          {/* Main Navigation - removed the dashboard header */}
          <div className="h-full overflow-y-auto custom-dashboard-scrollbar">
            <nav className="py-3 px-2">
              {/* User Profile */}
              {isSidebarOpen ? (
                <div
                  onClick={goToProfile}
                  className="mb-5 p-2 flex items-center bg-purple-900/30 rounded-lg cursor-pointer hover:bg-purple-800/40 border border-purple-700/30"
                >
                  <div className="w-12 h-10 rounded-full overflow-hidden mr-3">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                      alt={user?.firstName || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{user?.firstName || 'User'}</p>
                    <p className="text-xs text-purple-300 truncate">{user?.email || 'john@example.com'}</p>
                    <div className="flex items-center text-xs text-purple-300 mt-1.5">
                      <span className="mr-1">Profile</span>
                      <div className="flex-1 bg-purple-800/40 rounded-full h-1.5 mx-1">
                        <div className="bg-gradient-to-r from-purple-500 to-violet-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <span className="ml-1 text-[10px]">75%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex justify-center">
                  <div
                    onClick={goToProfile}
                    className="w-12 h-10 rounded-full overflow-hidden cursor-pointer"
                  >
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                      alt={user?.firstName || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Only settings and logout sections, no navigation */}
              <div className="pt-2 border-t border-purple-800/30">
                {isSidebarOpen && (
                  <div className="px-3 mb-2 mt-2 text-xs font-semibold text-purple-300 uppercase">Settings</div>
                )}
                <ul className="space-y-1">
                  <NavItem to="/dashboard/settings" icon={<Cog6ToothIcon />} text="Settings" isOpen={isSidebarOpen} />
                </ul>
              </div>

              {/* Logout */}
              <div className="pt-3 border-t border-purple-800/40 mt-2">
                {isSidebarOpen ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 min-w-5" />
                    <span className="ml-3 truncate">Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <ArrowRightOnRectangleIcon className="w-6 h-6" />
                  </button>
                )}
              </div>
            </nav>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Style for custom scrollbar - kept simple */}
        <style jsx="true">{`
          .custom-dashboard-scrollbar::-webkit-scrollbar {
            width: 3px;
          }
          .custom-dashboard-scrollbar::-webkit-scrollbar-track {
            background: rgba(88, 28, 135, 0.02);
            border-radius: 20px;
          }
          .custom-dashboard-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(147, 51, 234, 0.3);
            border-radius: 20px;
            border: none;
            max-height: 40px;
            height: 40px;
          }
          .custom-dashboard-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(147, 51, 234, 0.5);
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      {/* Sidebar Container - Fixed positioning for stability */}
      <aside
        ref={sidebarRef}
        className="fixed top-14 bottom-0 left-0 z-30 bg-gradient-to-b from-purple-900 to-indigo-950 border-r border-purple-800/20"
        style={{
          width: isMobile ? (isSidebarOpen ? expandedWidth : '0px') : (isSidebarOpen ? expandedWidth : collapsedWidth),
          boxShadow: '0 0 20px rgba(88, 28, 135, 0.3)',
          transition: 'width 200ms ease'
        }}
      >
        {/* Toggle button at the edge */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-6 top-6 w-10 h-10 flex items-center justify-center text-white z-50 hover:bg-purple-800/30 hover:text-white rounded-full transition-colors"
        >
          {isSidebarOpen ?
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg> :
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          }
        </button>

        {/* Main Navigation - removed the dashboard header */}
        <div className="h-full overflow-y-auto custom-dashboard-scrollbar">
          <nav className="py-3 px-2">
            {/* User Profile */}
            {isSidebarOpen ? (
              <div
                onClick={goToProfile}
                className="mb-5 p-2 flex items-center bg-purple-900/30 rounded-lg cursor-pointer hover:bg-purple-800/40 border border-purple-700/30"
              >
                <div className="w-12 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                    alt={user?.firstName || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user?.firstName || 'User'}</p>
                  <p className="text-xs text-purple-300 truncate">{user?.email || 'john@example.com'}</p>
                  <div className="flex items-center text-xs text-purple-300 mt-1.5">
                    <span className="mr-1">Profile</span>
                    <div className="flex-1 bg-purple-800/40 rounded-full h-1.5 mx-1">
                      <div className="bg-gradient-to-r from-purple-500 to-violet-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="ml-1 text-[10px]">75%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 flex justify-center">
                <div
                  onClick={goToProfile}
                  className="w-12 h-10 rounded-full overflow-hidden cursor-pointer"
                >
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                    alt={user?.firstName || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Navigation Sections */}
            <div className="space-y-4">
              {/* User Section - Only show if not a verified organizer */}
              {!isVerifiedOrganizer && (
                <div>
                  {isSidebarOpen && (
                    <div className="px-3 mb-2 text-xs font-semibold text-purple-300 uppercase">User</div>
                  )}
                  <ul className="space-y-1">
                    <NavItem to="/dashboard/user" icon={<HomeIcon />} text="Overview" isOpen={isSidebarOpen} />
                    <NavItem to="/dashboard/user/hackathons" icon={<ClipboardDocumentCheckIcon />} text="Hackathons" isOpen={isSidebarOpen} />
                    <NavItem to="/dashboard/user/challenges" icon={<CodeBracketIcon />} text="Challenges" isOpen={isSidebarOpen} />
                    <NavItem to="/dashboard/user/watchlist" icon={<BookmarkIcon />} text="Watchlist" isOpen={isSidebarOpen} badge={4} />
                    <NavItem to="/dashboard/user/history" icon={<ClockIcon />} text="Recently Viewed" isOpen={isSidebarOpen} />
                    <NavItem to="/dashboard/user/certificates" icon={<PiCertificateDuotone />} text="Certificates" isOpen={isSidebarOpen} />

                    {/* For pending organizers, show verification status instead */}
                    {isPendingOrganizer && isSidebarOpen && (
                      <li className="px-3 py-2 text-yellow-400 flex items-center">
                        <ClockIcon className="w-5 h-5 min-w-5" />
                        <span className="ml-3 text-sm">Verification Pending</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Organizer Section - Only show if user is a verified organizer */}
              {isVerifiedOrganizer && (
                <div className="pt-2 border-t border-purple-800/30">
                  {isSidebarOpen && (
                    <div className="px-3 mb-2 mt-2 text-xs font-semibold text-purple-300 uppercase">Organizer</div>
                  )}
                  <ul className="space-y-1">
                    <NavItem to="/dashboard/organizer" icon={<RocketLaunchIcon />} text="Hackathons" isOpen={isSidebarOpen} />
                    <NavItem to="/dashboard/organizer/participants" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} text="Participants" isOpen={isSidebarOpen} />
                    <NavItem to="/dashboard/organizer/teams" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} text="Teams" isOpen={isSidebarOpen} />
                    <NavItem to="/dashboard/organizer/submissions" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} text="Submissions" isOpen={isSidebarOpen} />
                    <NavItem to="/dashboard/organizer/judging" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>} text="Judging" isOpen={isSidebarOpen} />
                    <NavItem to="/dashboard/organizer/wallet" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>} text="Wallet" isOpen={isSidebarOpen} />
                  </ul>
                </div>
              )}

              {/* Settings Section */}
              <div className="pt-2 border-t border-purple-800/30">
                {isSidebarOpen && (
                  <div className="px-3 mb-2 mt-2 text-xs font-semibold text-purple-300 uppercase">Settings</div>
                )}
                <ul className="space-y-1">
                  <NavItem to="/dashboard/settings" icon={<Cog6ToothIcon />} text="Settings" isOpen={isSidebarOpen} />
                </ul>
              </div>

              {/* Logout */}
              <div className="pt-3 border-t border-purple-800/40 mt-2">
                {isSidebarOpen ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 min-w-5" />
                    <span className="ml-3 truncate">Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <ArrowRightOnRectangleIcon className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Style for custom scrollbar - kept simple */}
      <style jsx="true">{`
        .custom-dashboard-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-dashboard-scrollbar::-webkit-scrollbar-track {
          background: rgba(88, 28, 135, 0.02);
          border-radius: 20px;
        }
        .custom-dashboard-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(147, 51, 234, 0.3);
          border-radius: 20px;
          border: none;
          max-height: 40px;
          height: 40px;
        }
        .custom-dashboard-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(147, 51, 234, 0.5);
        }
      `}</style>
    </>
  );
};

// Simplified NavItem component with minimal transitions
const NavItem = ({ to, icon, text, badge, isOpen }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-lg ${isActive
            ? 'bg-purple-800/50 text-white'
            : 'text-gray-300 hover:bg-purple-900/40 hover:text-white'}`
        }
        end
      >
        <div className={`${isOpen ? 'min-w-5 w-5 h-5' : 'min-w-6 w-6 h-6'}`}>
          {React.cloneElement(icon, { className: isOpen ? 'w-5 h-5' : 'w-6 h-6' })}
        </div>

        {isOpen && <span className="ml-3 truncate">{text}</span>}

        {isOpen && badge && (
          <span className="ml-auto bg-purple-500 text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[1.5rem] text-center">
            {badge}
          </span>
        )}
      </NavLink>
    </li>
  );
};

export default Sidebar; 