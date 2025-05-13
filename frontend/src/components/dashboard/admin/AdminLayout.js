import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Function to check screen size and adjust sidebar state
  const checkScreenSize = useCallback(() => {
    const isMobileView = window.innerWidth < 768;
    setIsMobile(isMobileView);
    
    // Auto-close sidebar on mobile
    if (isMobileView && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isSidebarOpen]);

  // Initial check and event listener for window resize
  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [checkScreenSize]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gradient-to-bl from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden">
      {/* Admin Sidebar Component */}
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        user={user}
      />

      {/* Main Content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto custom-dashboard-scrollbar bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900
        ${isMobile ? 'w-full' : (isSidebarOpen ? 'ml-64' : 'ml-16')} 
        transition-all duration-300 ease-in-out pt-10 pb-1 px-0`}>
        {children}
      </div>
      
      {/* Custom scrollbar styles for dashboard */}
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
    </div>
  );
};

export default AdminLayout; 