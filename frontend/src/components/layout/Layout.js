import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackHeader from './BackHeader';
import { useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBackHeader, setShowBackHeader] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const isChallengesolverPage = location.pathname.includes('/challenges/') && 
                              !location.pathname.includes('/challenges/leaderboard') &&
                              !location.pathname.includes('/challenges/daily-sprint') &&
                              !location.pathname.includes('/challenges/code-conquest') &&
                              !location.pathname.includes('/challenges/cards') &&
                              !location.pathname.includes('/challenges/company-prep');
  
  // Check if the current page is the dashboard
  const isDashboardPage = location.pathname.includes('/dashboard');
  
  // Check if current page is homepage
  const isHomePage = location.pathname === '/';
  
  // Check if current page is login or signup
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  // Check if current page is registration-related
  const isRegistrationPage = location.pathname.includes('/registration') || 
                           location.pathname.includes('/create-team') || 
                           location.pathname.includes('/team-formation') ||
                           location.pathname.includes('/submit-project');
  
  // Determine when to show the navbar, back header, and footer
  const shouldShowTopNavbar = !isAuthPage && !isChallengesolverPage && (!showBackHeader || isHomePage);
  
  // Modified to show BackHeader on auth pages when on mobile
  const shouldShowBackHeader = (!isChallengesolverPage && showBackHeader && !isHomePage) || 
                              (isAuthPage && isMobile);
                              
  const shouldShowBottomNav = !isAuthPage && !isChallengesolverPage && showBottomNav;
  const shouldShowFooter = !isAuthPage && !isChallengesolverPage && !isDashboardPage && !isRegistrationPage;
  
  // Check screen size - differentiate between mobile, tablet, and desktop
  useEffect(() => {
    const checkDeviceSize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 640) {
        // Mobile
        setShowBottomNav(true);
        setShowBackHeader(true);
        setIsMobile(true);
      } else if (windowWidth < 1024) {
        // Tablet
        setShowBottomNav(true);
        setShowBackHeader(true);
        setIsMobile(false);
      } else {
        // Desktop
        setShowBottomNav(false);
        setShowBackHeader(false);
        setIsMobile(false);
      }
    };
    
    checkDeviceSize();
    window.addEventListener('resize', checkDeviceSize);
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);
  
  // Handle scroll to hide bottom navigation
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 100) { // Only hide after scrolling 100px
        if (window.scrollY > lastScrollY) {
          // Scrolling down
          setHideOnScroll(true);
        } else {
          // Scrolling up
          setHideOnScroll(false);
        }
        setLastScrollY(window.scrollY);
      } else {
        setHideOnScroll(false);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);
  
  return (
    <div className={`min-h-screen w-full flex flex-col ${!isAuthPage ? 'bg-gray-900 text-white' : 'bg-gray-900'}`}>
      <Navbar 
        showTopNavbar={shouldShowTopNavbar}
        showBottomNav={shouldShowBottomNav}
        hideOnScroll={hideOnScroll}
        isHomePage={isHomePage}
      />
      {shouldShowBackHeader && <BackHeader />}
      <main className={`flex-grow ${!isAuthPage ? 'bg-gray-900' : 'bg-gray-900'} 
        ${(shouldShowTopNavbar || shouldShowBackHeader) && !isDashboardPage ? 'pt-14' : ''} 
        ${shouldShowBottomNav && !hideOnScroll ? 'pb-16' : ''}`}
      >
        {children}
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default Layout; 