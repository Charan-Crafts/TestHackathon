import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function BackHeader({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle back button click
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go back to previous page in history
    } else {
      navigate('/'); // Fallback to home if no history
    }
  };
  
  // Determine title from location if not provided
  const getTitle = () => {
    if (title) return title;
    
    // Extract title from pathname
    const path = location.pathname;
    
    if (path.includes('/hackathons')) return 'Hackathons';
    if (path.includes('/projects')) return 'Projects';
    if (path.includes('/mentorships')) return 'Mentorships';
    if (path.includes('/challenges')) return 'Challenges';
    if (path.includes('/leaderboard')) return 'Leaderboard';
    if (path.includes('/events')) return 'Events';
    if (path.includes('/blogs')) return 'Blogs';
    if (path.includes('/about')) return 'About';
    if (path.includes('/contact')) return 'Contact';
    if (path.includes('/faq')) return 'FAQ';
    if (path.includes('/signup')) return 'Signup';
    if (path.includes('/login')) return 'Login';
    
    // Default title if path not recognized
    return 'Back';
  };
  
  return (
    <div className="bg-gray-900 text-white fixed top-0 left-0 right-0 z-50 shadow-md h-14 flex items-center px-4">
      {/* Back button */}
      <button 
        onClick={handleBack}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>
      
      {/* Page title */}
      <h1 className="text-lg font-semibold ml-4 flex-1 text-center mr-12">
        {getTitle()}
      </h1>
    </div>
  );
}

export default BackHeader; 