import React, { useState, useEffect, useRef } from 'react';

function MissionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')" }}>
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-purple-700/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/4 rounded-full bg-indigo-700/20 blur-3xl animate-float"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3
        }}></div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.2
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="text-purple-500 text-sm font-semibold tracking-wider uppercase mb-2 block">
            Our Mission
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Empowering Innovators <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Worldwide</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - mission text */}
          <div className={`space-y-6 transition-all duration-700 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <p className="text-xl text-gray-300 leading-relaxed">
              At HackathonHub, we're dedicated to connecting passionate developers with impactful challenges that shape the future of technology.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Our platform was born from a simple idea: innovation thrives when barriers are removed. We've created an ecosystem where creativity meets opportunity, where talented developers find their community, and where companies discover groundbreaking solutions.
            </p>
            <p className="text-gray-400 leading-relaxed">
              With thousands of hackathons hosted and countless careers launched, we're just getting started on our mission to democratize innovation globally.
            </p>
            
            <div className="pt-4">
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex items-center space-x-4 flex-grow backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-3 shadow-lg shadow-purple-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Innovation First</h3>
                    <p className="text-sm text-gray-400">We foster creative problem-solving</p>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex items-center space-x-4 flex-grow backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-full p-3 shadow-lg shadow-pink-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Community Driven</h3>
                    <p className="text-sm text-gray-400">Built by developers, for developers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Image and stats cards */}
          <div className={`space-y-8 transition-all duration-700 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            {/* Featured Image */}
            <div className="relative rounded-xl overflow-hidden mb-8 shadow-2xl shadow-purple-500/10 group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1540304453527-62f979142a17?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Global Hackathon Event" 
                className="w-full h-auto object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
                <p className="text-white font-semibold">Global Tech Hackathon 2023</p>
                <p className="text-gray-300 text-sm">Bringing innovators together from across the world</p>
              </div>
            </div>
            
            {/* Stats card */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-100 animate-pulse-slow"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 transform hover:-translate-y-1 transition-all duration-300 border border-gray-700/50 text-center">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full shadow-lg shadow-purple-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-3 text-3xl font-bold text-white mb-2">Global Reach</h3>
                <p className="text-gray-400 mb-4">Connecting developers across 150+ countries</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-900/50 rounded-lg p-2 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">500+</div>
                    <div className="text-xs text-gray-500">Hackathons</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-2 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">10k+</div>
                    <div className="text-xs text-gray-500">Projects</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-2 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">200+</div>
                    <div className="text-xs text-gray-500">Companies</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mission statement */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start mb-4">
                <div className="text-4xl font-bold mr-4 text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400">"</div>
                <p className="text-lg text-gray-300 italic leading-relaxed">
                  We believe technology has the power to solve humanity's biggest challenges when put in the hands of passionate innovators.
                </p>
              </div>
              <div className="flex items-center">
                <div className="h-0.5 flex-grow bg-gradient-to-r from-purple-500 to-pink-500 opacity-30"></div>
                <span className="px-4 text-gray-400 text-sm">Our Vision</span>
                <div className="h-0.5 flex-grow bg-gradient-to-r from-pink-500 to-purple-500 opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MissionSection; 