import React, { useState, useEffect, useRef } from 'react';

function WhosUsingSection() {
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

  const companies = [
    { 
      name: "Google", 
      logo: "https://www.vectorlogo.zone/logos/google/google-icon.svg",
      color: "from-blue-500 to-red-500"
    },
    { 
      name: "Microsoft", 
      logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg",
      color: "from-blue-500 to-green-500"
    },
    { 
      name: "Amazon", 
      logo: "https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg",
      color: "from-orange-500 to-yellow-500"
    },
    { 
      name: "Meta", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",
      color: "from-blue-600 to-indigo-600"
    },
    { 
      name: "Apple", 
      logo: "https://www.vectorlogo.zone/logos/apple/apple-icon.svg",
      color: "from-gray-600 to-gray-800"
    },
    { 
      name: "Netflix", 
      logo: "https://www.vectorlogo.zone/logos/netflix/netflix-icon.svg",
      color: "from-red-600 to-red-800"
    }
  ];

  const stats = [
    { number: "500+", label: "Hackathons Hosted", color: "from-purple-500 to-indigo-500" },
    { number: "50k+", label: "Active Developers", color: "from-pink-500 to-rose-500" },
    { number: "200+", label: "Partner Companies", color: "from-blue-500 to-cyan-500" },
    { number: "$2M+", label: "Prize Pool", color: "from-green-500 to-emerald-500" }
  ];

  // Add error handling for image loading
  const handleImageError = (e) => {
    // Fallback to a default tech icon if image fails to load
    e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jb2RlMiI+PHBhdGggZD0ibTI0IDEyLTUuNy01LjdNMjQgMTJsLTUuNyA1LjdNMjQgMTJIMkwyLjMgMTFjLjgtMy42IDQtNi42IDgtNi42IiBzdHJva2U9IiNmZmYiLz48L3N2Zz4=";
    e.target.classList.add('opacity-50'); // Make the fallback icon slightly transparent
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Simplified Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-900/95"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase mb-2 block">
            Our Partners
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Join the ranks of developers who've launched their careers through our platform
          </p>
        </div>

        {/* Stats Section - Lighter background */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`text-center transition-all duration-700 transform 
                         ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-lg opacity-75 group-hover:opacity-100 transition duration-300`}></div>
                <div className="relative bg-gray-900 rounded-lg p-6">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>
                  <p className="text-gray-300 text-sm font-medium">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Companies Grid - Lighter containers */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {companies.map((company, index) => (
            <div 
              key={index}
              className={`transition-all duration-700 transform
                         ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${(index + 4) * 100}ms` }}
            >
              <div className="relative group cursor-pointer">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${company.color} 
                                rounded-xl opacity-30 group-hover:opacity-100 transition duration-300`}></div>
                <div className="relative bg-gray-900 rounded-xl p-4
                              flex items-center justify-center group-hover:bg-gray-900/80 
                              transition-all duration-300">
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    onError={handleImageError}
                    className="h-12 w-auto object-contain opacity-100 group-hover:opacity-100 transition-all duration-300
                             transform group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhosUsingSection; 