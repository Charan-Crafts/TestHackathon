import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';

// Import section components
import DailyCodeSprint from '../../components/challenges/sections/DailyCodeSprint';
import CodeConquest from '../../components/challenges/sections/CodeConquest';
import ChallengeCards from '../../components/challenges/sections/ChallengeCards';
import CompanyPreparation from '../../components/challenges/sections/CompanyPreparation';
import ChallengeCarousel from '../../components/challenges/ChallengeCarousel';

function ChallengesList() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, 800);
  }, []);
  
  if (isLoading) {
    return (
      <LoadingIndicator 
        type="scanning" 
        message="Please wait..." 
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-purple-900/20 to-gray-900 py-12 relative">
      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero section */}
        <div className={`text-center mb-8 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 relative inline-block">
            <span className="relative z-10">Coding <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Challenges</span></span>
            <span className="absolute -left-2 bottom-0 w-full h-3 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70 transform skew-x-12 z-0"></span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm">
            Level up with coding challenges from daily sprints to interview prep
          </p>
        </div>
        
        {/* Stats overview */}
        <div className={`mb-6 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
          <div className="bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-indigo-900/50 rounded-xl p-8 backdrop-blur-sm border border-indigo-500/30 shadow-lg shadow-purple-900/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 to-indigo-400">850+</div>
                <div className="text-gray-400 text-sm group-hover:text-indigo-300 transition-colors">Total Challenges</div>
              </div>
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-300 to-purple-400">15+</div>
                <div className="text-gray-400 text-sm group-hover:text-purple-300 transition-colors">Topic Categories</div>
              </div>
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-cyan-400">4</div>
                <div className="text-gray-400 text-sm group-hover:text-cyan-300 transition-colors">Challenge Modes</div>
              </div>
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-pink-300 to-pink-400">25K+</div>
                <div className="text-gray-400 text-sm group-hover:text-pink-300 transition-colors">Users Solving</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Carousel */}
        <div className={`mb-6 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
          <div className="bg-gradient-to-r from-indigo-900/20 via-gray-900/60 to-indigo-900/20 p-1 rounded-2xl backdrop-blur-sm shadow-lg shadow-purple-900/5">
            <ChallengeCarousel />
          </div>
        </div>
        
        {/* Sections */}
        <div className="space-y-6">
          {/* Daily code sprint section */}
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
            <div className="mb-6 flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg mr-4 shadow-lg shadow-indigo-900/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Daily Code Sprint</h2>
                <p className="text-gray-400 text-sm">Fresh challenges every day to keep your skills sharp</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-indigo-900/30 via-gray-900/40 to-indigo-900/30 rounded-xl p-1 backdrop-blur-sm border border-indigo-800/30 shadow-lg shadow-indigo-900/5">
              <DailyCodeSprint />
            </div>
          </div>
          
          {/* Code conquest section */}
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '500ms' }}>
            <div className="mb-6 flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg mr-4 shadow-lg shadow-purple-900/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Code Conquest</h2>
                <p className="text-gray-400 text-sm">Master specific programming concepts with targeted challenges</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-900/30 via-gray-900/40 to-purple-900/30 rounded-xl p-1 backdrop-blur-sm border border-purple-800/30 shadow-lg shadow-purple-900/5">
              <CodeConquest />
            </div>
          </div>
          
          {/* Challenge cards section */}
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
            <div className="mb-6 flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-lg mr-4 shadow-lg shadow-cyan-900/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Challenge Cards</h2>
                <p className="text-gray-400 text-sm">Browse our collection of problem-solving challenges</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-cyan-900/30 via-gray-900/40 to-cyan-900/30 rounded-xl p-1 backdrop-blur-sm border border-cyan-800/30 shadow-lg shadow-cyan-900/5">
              <ChallengeCards />
            </div>
          </div>
          
          {/* Company preparation section */}
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '700ms' }}>
            <div className="mb-6 flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-800 rounded-lg mr-4 shadow-lg shadow-pink-900/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Company Preparation</h2>
                <p className="text-gray-400 text-sm">Practice with challenges based on real tech company interviews</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-pink-900/30 via-gray-900/40 to-pink-900/30 rounded-xl p-1 backdrop-blur-sm border border-pink-800/30 shadow-lg shadow-pink-900/5">
              <CompanyPreparation />
            </div>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className={`mt-8 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '800ms' }}>
          <div className="bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50 rounded-xl p-8 backdrop-blur-sm border border-indigo-500/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to level up your coding skills?</h3>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
              Start solving challenges today and track your progress as you become a better programmer.
            </p>
            <Link 
              to="/challenges/daily" 
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-purple-900/30 transition-all duration-300 transform hover:scale-105"
            >
              Start Today's Challenge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengesList; 