import React, { useState, useEffect, useRef } from 'react';

function PartnersSection() {
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

  // Partner companies with Unsplash images as logos
  const partners = [
    {
      name: "TechCorp",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      description: "Leading AI research and development company focused on building ethical technology solutions",
      tier: "platinum"
    },
    {
      name: "InnovateAI",
      logo: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      description: "Machine learning platform connecting researchers and developers for collaborative innovation",
      tier: "gold"
    },
    {
      name: "CloudSystems",
      logo: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      description: "Enterprise cloud infrastructure with dedicated support for hackathon and open source projects",
      tier: "gold"
    },
    {
      name: "DevPartners",
      logo: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      description: "Developer tools and resources that accelerate the software development lifecycle",
      tier: "silver"
    },
    {
      name: "StartupBoost",
      logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      description: "Venture accelerator dedicated to supporting tech entrepreneurs and innovative startups",
      tier: "silver"
    },
    {
      name: "TechFoundry",
      logo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      description: "Tech education platform focused on practical skills and project-based learning",
      tier: "bronze"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/30">
        {/* Background pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2px, transparent 0),
            radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.1) 2px, transparent 0)
          `,
          backgroundSize: '100px 100px',
          opacity: 0.3
        }}></div>
        
        {/* Animated gradient elements */}
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-gradient-to-r from-purple-900/20 to-indigo-800/10 blur-3xl"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/3 bg-gradient-to-l from-purple-900/10 to-indigo-800/20 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="text-purple-500 text-sm font-semibold tracking-wider uppercase mb-2 block">
            Our Global Partners
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Backed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Industry Leaders</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            We collaborate with innovative companies worldwide to provide exceptional opportunities and resources for developers
          </p>
        </div>

        {/* Platinum partners - featured section */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="h-px flex-grow bg-gradient-to-r from-purple-600/50 to-transparent"></div>
            <h3 className="text-xl font-semibold text-white px-4">
              Platinum Partners
            </h3>
            <div className="h-px flex-grow bg-gradient-to-l from-purple-600/50 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {partners.filter(p => p.tier === "platinum").map((partner, index) => (
              <div 
                key={index}
                className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${150 * index}ms` }}
              >
                <div className="group relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
                  
                  <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30 flex flex-col md:flex-row items-center gap-8 hover:bg-gray-800/90 transition-all duration-300">
                    {/* Logo area */}
                    <div className="flex-shrink-0 w-40 h-40 relative group-hover:scale-105 transition-all duration-500 ease-out">
                      <div className="absolute inset-0 bg-white/5 rounded-lg"></div>
                      <div className="absolute inset-1 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg backdrop-blur-sm border border-white/10"></div>
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full rounded shadow-lg" />
                      </div>
                    </div>
                    
                    {/* Content area */}
                    <div className="flex-grow text-center md:text-left">
                      <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-3 py-1 text-xs font-medium text-white mb-3">
                        Platinum Partner
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">{partner.name}</h4>
                      <p className="text-gray-300 mb-4">{partner.description}</p>
                      
                      {/* Partner benefits */}
                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-xs">Global Events</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-pink-900/30 text-pink-300 text-xs">Hiring Access</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-900/30 text-indigo-300 text-xs">Premium Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gold & silver partners */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="h-px flex-grow bg-gradient-to-r from-amber-600/50 to-transparent"></div>
            <h3 className="text-xl font-semibold text-white px-4">
              Gold & Silver Partners
            </h3>
            <div className="h-px flex-grow bg-gradient-to-l from-amber-600/50 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.filter(p => p.tier === "gold" || p.tier === "silver").map((partner, index) => (
              <div 
                key={index}
                className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${150 * (index + 1)}ms` }}
              >
                <div className={`bg-gray-800/60 rounded-xl p-6 border border-${partner.tier === "gold" ? "amber" : "gray"}-500/20 hover:bg-gray-800/80 transition-all duration-300 group`}>
                  <div className="flex items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 w-16 h-16 mr-4 rounded overflow-hidden bg-white/5 p-2 group-hover:scale-110 transition-all duration-300">
                      <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                    </div>
                    
                    {/* Name and tier */}
                    <div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-rose-400 transition-all duration-300">{partner.name}</h4>
                      <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)} Partner
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="mt-4 text-gray-400 text-sm">{partner.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bronze partners */}
        <div>
          <div className="flex items-center mb-8">
            <div className="h-px flex-grow bg-gradient-to-r from-orange-800/50 to-transparent"></div>
            <h3 className="text-xl font-semibold text-white px-4">
              Bronze Partners
            </h3>
            <div className="h-px flex-grow bg-gradient-to-l from-orange-800/50 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {partners.filter(p => p.tier === "bronze").map((partner, index) => (
              <div 
                key={index}
                className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${150 * (index + 5)}ms` }}
              >
                <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30 flex flex-col items-center text-center hover:bg-gray-800/60 transition-all duration-300 group">
                  <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-lg p-2 mb-3 group-hover:scale-110 transition-all duration-300">
                    <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full rounded" />
                  </div>
                  <h4 className="text-base font-medium text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-amber-400 transition-all duration-300">{partner.name}</h4>
                  <p className="text-xs text-purple-400">Bronze Partner</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Become a partner CTA */}
        <div className={`mt-20 text-center transition-all duration-700 delay-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative inline-block">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-lg opacity-30 group-hover:opacity-100 animate-pulse-slow"></div>
            
            <a 
              href="/partners" 
              className="relative inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-lg shadow-purple-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Become a Partner
            </a>
          </div>
          
          <p className="text-gray-400 mt-4 max-w-md mx-auto">
            Join our growing network of partners and connect with the brightest minds in tech
          </p>
        </div>
      </div>
    </section>
  );
}

export default PartnersSection; 