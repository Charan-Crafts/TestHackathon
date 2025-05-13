import React, { useState, useEffect } from 'react';

function About() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-200 min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Tech circuit pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 10 10 L 90 10 M 10 10 L 10 40 M 50 10 L 50 90 M 90 10 L 90 50 M 90 50 L 60 50 M 60 50 L 60 90" 
                  fill="none" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="1" />
                <circle cx="10" cy="10" r="2" fill="rgba(147, 51, 234, 0.5)" />
                <circle cx="90" cy="10" r="2" fill="rgba(147, 51, 234, 0.5)" />
                <circle cx="10" cy="90" r="2" fill="rgba(147, 51, 234, 0.5)" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
          </svg>
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl animate-float"></div>
      </div>

      {/* Hero section */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block p-1 px-3 mb-4 border border-purple-500/30 rounded-full bg-purple-900/30 text-purple-300 text-sm font-semibold">
              Our Story
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 relative inline-block">
              <span className="relative z-10">About HackathonHub</span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></span>
            </h1>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
              Connecting innovators and transforming hackathons worldwide
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content section */}
      <div className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About section with card style */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-xl">
              <div className="prose prose-lg prose-invert mx-auto">
                <p className="lead text-xl md:text-2xl text-purple-300 font-light">
                  HackathonHub is the premier platform connecting talented developers with cutting-edge hackathon opportunities worldwide.
                </p>
                
                <div className="my-8 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                
                <p>
                  Founded in 2018, our platform has grown from a small project to a global community serving thousands of developers, companies, and hackathon organizers. We believe in the power of collaboration and innovation to solve real-world problems.
                </p>
                
                <p>
                  Our mission is simple: make hackathons more accessible, organized, and impactful. Whether you're a seasoned developer or just starting out, HackathonHub provides the tools and community you need to succeed.
                </p>

                <p>
                  With participants from over 150 countries and partnerships with leading tech companies, we're proud to be at the forefront of the global hackathon movement.
                </p>
              </div>
            </div>
          </div>
          
          {/* Core values section with improved visual design */}
          <div className={`mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 relative inline-block">
                <span className="relative">Our Core Values</span>
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors group cursor-default">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-purple-900/50 rounded-lg mr-3 group-hover:bg-purple-800/80 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Innovation</h3>
                  </div>
                  <p className="text-gray-300 pl-11">We believe in pushing boundaries and exploring new possibilities in technology and collaboration.</p>
                </div>
                
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors group cursor-default">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-purple-900/50 rounded-lg mr-3 group-hover:bg-purple-800/80 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Inclusivity</h3>
                  </div>
                  <p className="text-gray-300 pl-11">Our platform welcomes developers of all backgrounds and skill levels from around the world.</p>
                </div>
                
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors group cursor-default">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-purple-900/50 rounded-lg mr-3 group-hover:bg-purple-800/80 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Impact</h3>
                  </div>
                  <p className="text-gray-300 pl-11">We focus on creating real-world solutions to meaningful problems through technology.</p>
                </div>
                
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors group cursor-default">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-purple-900/50 rounded-lg mr-3 group-hover:bg-purple-800/80 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Community</h3>
                  </div>
                  <p className="text-gray-300 pl-11">We foster connections and collaboration between technology professionals around the globe.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats card */}
          <div className={`mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">500+</div>
                  <div className="text-gray-400 text-sm">Hackathons</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">150+</div>
                  <div className="text-gray-400 text-sm">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">10k+</div>
                  <div className="text-gray-400 text-sm">Developers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">200+</div>
                  <div className="text-gray-400 text-sm">Partners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 