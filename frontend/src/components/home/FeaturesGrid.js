import React, { useEffect, useRef, useState } from 'react';

function FeaturesGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Store the ref value in a variable
    const currentRef = sectionRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      // Use the stored ref value in cleanup
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []); // Empty dependency array is fine now

  const features = [
    {
      title: "Join Hackathons",
      description: "Participate in exciting hackathons across different domains and technologies",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: "from-purple-500 to-indigo-500",
      stats: "500+ Events"
    },
    {
      title: "Build Projects",
      description: "Create innovative solutions and showcase your development skills",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      gradient: "from-pink-500 to-rose-500",
      stats: "10k+ Projects"
    },
    {
      title: "Win Prizes",
      description: "Compete for exciting prizes and recognition in the tech community",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-orange-500 to-yellow-500",
      stats: "$1M+ Prizes"
    },
    {
      title: "Get Hired",
      description: "Connect with top companies and land your dream tech job",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-green-500 to-emerald-500",
      stats: "200+ Companies"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className={`absolute inset-0 bg-gradient-to-b from-purple-900/20 via-purple-900/10 to-transparent 
                      transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute inset-0 bg-gradient-to-r from-purple-900/10 via-pink-900/10 to-purple-900/10 
                      transition-opacity duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Animated Particles */}
      <div className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 delay-500 
                      ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.1
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-8 transition-all duration-700 transform
                        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="text-purple-500 text-sm font-semibold tracking-wider uppercase mb-2 block">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Why Hackathon?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Your gateway to exciting hackathons, amazing projects, and career opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`relative group perspective-1000 transition-all duration-700 transform
                         ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Card Background with Gradient Border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 
                            group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              
              <div className="relative bg-gray-900 rounded-xl p-6 h-full transform transition-all duration-500 
                            group-hover:-translate-y-2 group-hover:translate-z-10 preserve-3d">
                {/* Icon Container with 3D effect */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4
                              bg-gradient-to-br ${feature.gradient} 
                              group-hover:scale-110 group-hover:rotate-y-12 transition-all duration-500
                              shadow-lg`}>
                  <div className="text-white transform transition-transform duration-500 group-hover:scale-110">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content with enhanced hover effects */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent 
                             group-hover:bg-clip-text group-hover:bg-gradient-to-r 
                             group-hover:from-purple-400 group-hover:to-pink-400 
                             transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-4">
                  {feature.description}
                </p>
                
                {/* Stats with shimmer effect */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <span className="text-sm font-semibold text-transparent bg-clip-text 
                                 bg-gradient-to-r from-purple-400 to-pink-400 
                                 group-hover:from-pink-400 group-hover:to-purple-400
                                 transition-all duration-500">
                    {feature.stats}
                  </span>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 
                              bg-gradient-to-r from-purple-500 to-pink-500 
                              transition-all duration-300 group-hover:w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesGrid; 