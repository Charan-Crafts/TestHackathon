import React from 'react';

// Add animation styles for BottomNav
const BottomNavStyles = () => {
  React.useEffect(() => {
    // Create style element for animations and mobile padding
    const style = document.createElement('style');
    style.textContent = `
      /* Animation for slide up effect */
      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      
      .animate-slide-up {
        animation: slideUp 0.3s ease-out forwards;
      }
      
      /* Add padding to prevent content being hidden behind nav on mobile */
      @media (max-width: 768px) {
        .container {
          padding-bottom: 5rem;
          padding-top: 4rem;
        }
        
        /* Ensure fixed position headers don't cover anchor scroll targets */
        html {
          scroll-padding-top: 4rem;
          scroll-padding-bottom: 5rem;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
};

export default BottomNavStyles; 