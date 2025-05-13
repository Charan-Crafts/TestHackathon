import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';

// Import section components
import FeaturedHackathons from './sections/featured/FeaturedHackathons';
import UpcomingHackathons from './sections/upcoming/UpcomingHackathons';
import HackathonResources from './sections/HackathonResources';
import PastWinners from './sections/PastWinners';

function HackathonPage() {
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, 800);
  }, []);

  if (loading) {
    return (
      <LoadingIndicator 
        type="scanning" 
        message="Please wait..." 
        title=""
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-purple-900/20 to-gray-900 py-8 sm:py-12 relative">
      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero section */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 relative inline-block">
            <span className="relative z-10">Hackathon <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Events</span></span>
            <span className="absolute -left-2 bottom-0 w-full h-2 sm:h-3 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-70 transform skew-x-12 z-0"></span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base px-4">
            Join exciting hackathons, collaborate with talented developers, and turn your ideas into reality
          </p>
        </div>

        {/* Stats overview */}
        <div className={`mb-8 sm:mb-12 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
          <div className="bg-gradient-to-r from-blue-900/50 via-indigo-900/40 to-blue-900/50 rounded-xl p-4 sm:p-8 backdrop-blur-sm border border-blue-500/30 shadow-lg shadow-blue-900/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-blue-400">15+</div>
                <div className="text-gray-400 text-xs sm:text-sm group-hover:text-blue-300 transition-colors">Active Hackathons</div>
              </div>
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 to-indigo-400">$250K+</div>
                <div className="text-gray-400 text-xs sm:text-sm group-hover:text-indigo-300 transition-colors">Total Prize Pool</div>
              </div>
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-cyan-400">10K+</div>
                <div className="text-gray-400 text-xs sm:text-sm group-hover:text-cyan-300 transition-colors">Participants</div>
              </div>
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-300 to-purple-400">500+</div>
                <div className="text-gray-400 text-xs sm:text-sm group-hover:text-purple-300 transition-colors">Projects Submitted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Sections */}
        <div className="space-y-6 sm:space-y-8">
          {/* Featured Hackathons */}
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
            <FeaturedHackathons />
          </div>

          {/* Upcoming Hackathons */}
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
            <UpcomingHackathons />
          </div>

          {/* Past Winners */}
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
            <PastWinners />
          </div>

          {/* Resources */}
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '700ms' }}>
            <HackathonResources />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`mt-8 sm:mt-12 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '800ms' }}>
          <div className="bg-gradient-to-r from-blue-900/50 via-indigo-900/50 to-blue-900/50 rounded-xl p-6 sm:p-8 backdrop-blur-sm border border-blue-500/30 text-center">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Ready to organize your own hackathon?</h3>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-3xl mx-auto text-sm sm:text-base">
              Create an engaging hackathon experience for developers worldwide. Our platform provides all the tools you need.
            </p>
            <Link 
              to="/host" 
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm sm:text-base font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg shadow-indigo-900/30 transition-all duration-300 transform hover:scale-105"
            >
              Host a Hackathon
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HackathonPage; 