import React, { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  PresentationChartLineIcon,
  ShieldCheckIcon,
  CogIcon,
  RocketLaunchIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
  BellAlertIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen, toggleSidebar, isMobile, user }) => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/dashboard/profile');
  };

  // Fixed width values for better stability
  const expandedWidth = "16rem"; // 256px
  const collapsedWidth = "4rem";

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

        {/* Main Navigation - scrollable area */}
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
                    src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=John"}
                    alt={user?.name || 'Admin'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-purple-300 truncate">{user?.email || 'admin@example.com'}</p>
                  <div className="flex items-center text-xs text-purple-300 mt-1.5">
                    <span className="px-2 py-0.5 bg-purple-800/50 text-purple-200 rounded-full text-xs">
                      Admin
                    </span>
                  </div>
                </div>
              </div>
            ) :
              <div className="mb-4 flex justify-center">
                <div
                  onClick={goToProfile}
                  className="w-12 h-10 rounded-full overflow-hidden cursor-pointer"
                >
                  <img
                    src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=John"}
                    alt={user?.name || 'Admin'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            }

            {/* Admin Section */}
            <div className="space-y-4">
              <div>
                {isSidebarOpen && (
                  <div className="px-3 mb-2 text-xs font-semibold text-purple-300 uppercase">Admin Panel</div>
                )}
                <ul className="space-y-1">
                  <NavItem to="/dashboard/admin" icon={<BuildingLibraryIcon />} text="Dashboard" isOpen={isSidebarOpen} />
                  <NavItem to="/dashboard/admin/users" icon={<UsersIcon />} text="User Management" isOpen={isSidebarOpen} />
                  <NavItem to="/dashboard/admin/verification" icon={<ShieldCheckIcon />} text="Verifications" isOpen={isSidebarOpen} badge={2} />
                  <NavItem to="/dashboard/admin/hackathons" icon={<RocketLaunchIcon />} text="Hackathons" isOpen={isSidebarOpen} />
                  <NavItem to="/dashboard/admin/challenges" icon={<CodeBracketIcon />} text="Challenges" isOpen={isSidebarOpen} />
                  <NavItem to="/dashboard/admin/moderation" icon={<ShieldCheckIcon />} text="Moderation" isOpen={isSidebarOpen} />
                  <NavItem to="/dashboard/admin/analytics" icon={<PresentationChartLineIcon />} text="Analytics" isOpen={isSidebarOpen} />
                  <NavItem to="/dashboard/admin/notifications" icon={<BellAlertIcon />} text="Notifications" isOpen={isSidebarOpen} badge={3} />
                  <NavItem to="/dashboard/admin/system" icon={<CogIcon />} text="System Settings" isOpen={isSidebarOpen} />
                  <NavItem to="/dashboard/admin/help" icon={<QuestionMarkCircleIcon />} text="Support" isOpen={isSidebarOpen} />
                </ul>
              </div>

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
              <div className="pt-2 border-t border-purple-800/30">
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

      {/* Custom scrollbar styles - kept simple */}
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

export default AdminSidebar; 