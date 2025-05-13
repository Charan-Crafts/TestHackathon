import React, { useState, useEffect, useRef } from 'react';

function TeamSection() {
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

  // Team members data with real Unsplash images
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      bio: 'Former software engineer with a passion for community building and hackathons.',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      },
      gradient: 'from-blue-600 to-indigo-600',
      specialties: ['Leadership', 'Strategy', 'Product Vision'],
      bgPattern: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMTAuNSA1NVY1TDUuNSA5Ljk5IDEwLjUgNW01MCAwTDIwLjUgNDYuMDIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIwMzA0OSIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')"
    },
    {
      name: 'Samantha Lee',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      bio: 'AI researcher and full-stack developer with 10+ years of experience in tech.',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      },
      gradient: 'from-purple-600 to-indigo-600',
      specialties: ['AI Research', 'Full-Stack', 'System Architecture'],
      bgPattern: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM1MzM3N2EiIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMiI+PGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTAiLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjQ1IiByPSIxMCIgLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjQ1IiByPSIxMCIgLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjE1IiByPSIxMCIgLz48L2c+PC9zdmc+')"
    },
    {
      name: 'Marcus Chen',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      bio: 'Award-winning UX designer focused on creating intuitive digital experiences.',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      },
      gradient: 'from-pink-600 to-rose-600',
      specialties: ['UX/UI Design', 'Branding', 'User Research'],
      bgPattern: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMTQuNCAxNC40VjBINC44djQuOEgwdjkuNmg0Ljh2NC44aDkuNnYtNC44aDQuOHYtOS42aC00Ljh6TTYwIDM5LjZWMjRoLTkuNnY5LjZoLTkuNlY0OGg5LjZ2OS42SDYwVjQ4aDkuNlYzMy42SDYweiIgZmlsbD0iIzkwMmI1MiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L3N2Zz4=')"
    },
    {
      name: 'Olivia Rodriguez',
      role: 'Community Lead',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      bio: 'Former event manager and developer advocate passionate about tech education.',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      },
      gradient: 'from-cyan-600 to-teal-600',
      specialties: ['Community Building', 'Events', 'Developer Relations'],
      bgPattern: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSIjMUQ3NTg0IiBmaWxsLW9wYWNpdHk9IjAuMiIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMCAyYzAtMS4xLjktMiAyLTJoMTJhMiAyIDAgMDEyIDJ2MTJhMiAyIDAgMDEtMiAySDJhMiAyIDAgMDEtMi0yVjJ6TTIgNDRjMC0xLjEuOS0yIDItMmgxMmEyIDIgMCAwMTIgMnYxMmEyIDIgMCAwMS0yIDJINGEyIDIgMCAwMS0yLTJWNDR6TTQ0IDQ0YzAtMS4xLjktMiAyLTJoMTJhMiAyIDAgMDEyIDJ2MTJhMiAyIDAgMDEtMiAySDQ2YTIgMiAwIDAxLTItMlY0NHoiLz48L2c+PC9zdmc+')"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden bg-gray-900">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-indigo-900/30">
        {/* Circuit board pattern background */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: "url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')", 
               backgroundSize: 'cover', 
               backgroundPosition: 'center',
               mixBlendMode: 'overlay'
             }}></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -bottom-40 left-1/3 transform -translate-x-1/2 w-2/3 h-80 bg-indigo-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute -top-40 right-1/3 transform translate-x-1/2 w-1/2 h-80 bg-purple-600/20 rounded-full filter blur-3xl animate-float"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-8 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="text-purple-500 text-sm font-semibold tracking-wider uppercase mb-2 block">
            The People Behind The Platform
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            A passionate group of innovators dedicated to connecting talent with opportunity and nurturing the next generation of tech leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className={`transition-all duration-700 transform perspective-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${150 * index}ms` }}
            >
              <div className="relative group h-full perspective-1000">
                {/* Improved subtle glow effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${member.gradient} rounded-xl opacity-50 group-hover:opacity-80 blur-sm transition duration-500`}></div>
                
                {/* Card with improved styling */}
                <div className="relative h-full bg-gray-900 rounded-xl overflow-hidden border border-gray-800/30 transition-all duration-300 group-hover:border-transparent" 
                     style={{
                       backgroundImage: member.bgPattern,
                       backgroundSize: '100px 100px'
                     }}>
                  {/* Top gradient bar */}
                  <div className={`h-1 w-full bg-gradient-to-r ${member.gradient}`}></div>
                  
                  {/* Front face - visible by default, hidden on hover */}
                  <div className="p-6 flex flex-col h-full transition-all duration-500 group-hover:opacity-0 group-hover:absolute group-hover:inset-0">
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br ${member.gradient} p-0.5 mb-4 shadow-lg`}>
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {member.name}
                      </h3>
                      <div className={`text-transparent bg-clip-text bg-gradient-to-r ${member.gradient} text-sm font-medium`}>
                        {member.role}
                      </div>
                    </div>
                  </div>
                  
                  {/* Details face - hidden by default, visible on hover */}
                  <div className="p-6 absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100 flex flex-col h-full">
                    {/* Team member image and name with improved spacing */}
                    <div className="flex items-start mb-4">
                      <div className={`w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br ${member.gradient} p-0.5 mr-4 shadow-lg`}>
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover rounded-[0.25rem]"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {member.name}
                        </h3>
                        <div className={`text-transparent bg-clip-text bg-gradient-to-r ${member.gradient} text-sm font-medium`}>
                          {member.role}
                        </div>
                      </div>
                    </div>

                    {/* Member bio with better typography */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{member.bio}</p>

                    {/* Specialties with improved pill design */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.specialties.map((specialty, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 bg-gray-800/50 text-gray-300 text-xs rounded-full border-[0.5px] border-gray-700/30"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    {/* Social icons with improved styling */}
                    <div className="mt-auto flex justify-center gap-3">
                      <a 
                        href={member.social.twitter} 
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a 
                        href={member.social.linkedin} 
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <a 
                        href={member.social.github} 
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                      </a>
                    </div>
                    
                    {/* View Profile Button */}
                    <div className="mt-4 text-center">
                      <a 
                        href={`/team/${member.name.toLowerCase().replace(' ', '-')}`} 
                        className={`inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium rounded-md bg-gradient-to-r ${member.gradient} text-white transition-all duration-300 hover:opacity-90`}
                      >
                        View Full Profile
                        <svg className="ml-1 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Team Banner */}
        <div className={`mt-8 transition-all duration-700 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative rounded-xl overflow-hidden h-64 shadow-2xl shadow-purple-500/10 group">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
              alt="Team Collaboration" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-xl px-4">
                <h3 className="text-2xl font-bold text-white mb-2">Join Our Growing Team</h3>
                <p className="text-gray-300 mb-6">We're always looking for talented individuals passionate about hackathons and innovation</p>
                <a 
                  href="/careers" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-lg shadow-purple-500/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  View Open Positions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamSection; 