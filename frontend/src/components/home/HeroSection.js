import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  const [selectedTag, setSelectedTag] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [counters, setCounters] = useState({ hackathons: 0, participants: 0, companies: 0 });
  const [currentHackathonIndex, setCurrentHackathonIndex] = useState(0);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const typingIndexRef = useRef(0); // Add ref for typing index
  
  // Wrap backgroundImages in useMemo to prevent unnecessary re-renders
  const backgroundImages = useMemo(() => [
    {
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Hackathon Collaboration",
      heading: "Unlock Your Career",
      subheading: "Explore opportunities from across the globe to grow, showcase skills, gain CV points & get hired by your dream company.",
      badge: "Just Went HackathonHub Pro!",
      badgeIcon: "⚡",
      primaryButton: "Get Started",
      secondaryButton: "Learn More",
      primaryButtonLink: "/registration",
      secondaryButtonLink: "/about"
    },
    {
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Team Innovation",
      heading: "Build Together",
      subheading: "Join forces with talented developers worldwide. Create innovative solutions and make lasting connections in the tech community.",
      badge: "New: Team Matching Feature",
      badgeIcon: "🤝",
      primaryButton: "Find Your Team",
      secondaryButton: "View Projects",
      primaryButtonLink: "/teams",
      secondaryButtonLink: "/projects"
    },
    {
      url: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Tech Community",
      heading: "Level Up Your Skills",
      subheading: "Access exclusive workshops, mentorship programs, and resources to accelerate your learning journey in tech.",
      badge: "Premium Learning Hub",
      badgeIcon: "🎓",
      primaryButton: "Start Learning",
      secondaryButton: "View Resources",
      primaryButtonLink: "/learning",
      secondaryButtonLink: "/resources"
    }
  ], []); // Empty dependency array since this data is static

  // Sample hackathon data
  const hackathons = [
    {
      id: 'hack1',
      title: 'Global Tech Hackathon',
      endDate: 'May 30, 2024 • 11:59 PM',
      prize: '$50,000',
      isLive: true,
      tags: ['AI/ML', 'Web Development', 'Blockchain'],
      prizes: [
        { place: 1, amount: '$20,000' },
        { place: 2, amount: '$15,000' },
        { place: 3, amount: '$10,000' }
      ]
    },
    {
      id: 'hack2',
      title: 'FinTech Innovation Cup',
      endDate: 'June 15, 2024 • 11:59 PM',
      prize: '$75,000',
      isLive: true,
      tags: ['FinTech', 'Blockchain', 'AI/ML'],
      prizes: [
        { place: 1, amount: '$35,000' },
        { place: 2, amount: '$25,000' },
        { place: 3, amount: '$15,000' }
      ]
    },
    {
      id: 'hack3',
      title: 'Sustainability Challenge',
      endDate: 'July 5, 2024 • 11:59 PM',
      prize: '$40,000',
      isLive: false,
      tags: ['CleanTech', 'IoT', 'Data Science'],
      prizes: [
        { place: 1, amount: '$20,000' },
        { place: 2, amount: '$12,000' },
        { place: 3, amount: '$8,000' }
      ]
    }
  ];

  // Add this helper function to ensure consistent card data
  const normalizeHackathonData = (hackathon) => {
    return {
      ...hackathon,
      title: hackathon.title || 'Upcoming Hackathon',
      endDate: hackathon.endDate || 'Coming Soon',
      prize: hackathon.prize || 'TBA',
      isLive: hackathon.isLive ?? false,
      tags: hackathon.tags || ['Coming Soon'],
      prizes: hackathon.prizes || [
        { place: 1, amount: 'TBA' },
        { place: 2, amount: 'TBA' },
        { place: 3, amount: 'TBA' }
      ]
    };
  };

  // Get current hackathon with normalized data
  const currentHackathon = normalizeHackathonData(hackathons[currentHackathonIndex]);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
    
    // Typing effect
    let currentText = '';
    typingIndexRef.current = 0; // Reset typing index
    const fullText = backgroundImages[currentBgIndex].heading;
    
    const typingInterval = setInterval(() => {
      if (typingIndexRef.current < fullText.length) {
        currentText += fullText.charAt(typingIndexRef.current);
        setTypedText(currentText);
        typingIndexRef.current++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    // Animate counters
    const counterInterval = setInterval(() => {
      setCounters(prev => ({
        hackathons: prev.hackathons < 500 ? prev.hackathons + 5 : 500,
        participants: prev.participants < 10000 ? prev.participants + 100 : 10000,
        companies: prev.companies < 200 ? prev.companies + 2 : 200
      }));
    }, 30);

    // Auto-rotate hackathons
    const hackathonInterval = setInterval(() => {
      setCurrentHackathonIndex(prev => (prev + 1) % hackathons.length);
    }, 8000);

    // Auto-rotate background images
    const bgInterval = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % backgroundImages.length);
      setTypedText(''); // Reset typing text
      typingIndexRef.current = 0; // Reset typing index
    }, 10000); // Changed from 5000 to 10000 for 10 second duration
    
    // Cleanup function
    return () => {
      clearInterval(typingInterval);
      clearInterval(counterInterval);
      clearInterval(hackathonInterval);
      clearInterval(bgInterval);
    };
  }, [hackathons.length, backgroundImages.length, currentBgIndex, backgroundImages]);

  // Handle tag click
  const handleTagClick = (tagId) => {
    if (selectedTag === tagId) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagId);
    }
  };

  // Tag data
  const skillTags = {
    'AI/ML': {
      id: 'aiml',
      color: 'bg-blue-900/50',
      textColor: 'text-blue-300',
      borderColor: 'border-blue-700/50',
      activeColor: 'bg-blue-800',
      activeBorderColor: 'border-blue-500'
    },
    'Web Development': {
      id: 'webdev',
      color: 'bg-green-900/50',
      textColor: 'text-green-300',
      borderColor: 'border-green-700/50',
      activeColor: 'bg-green-800',
      activeBorderColor: 'border-green-500'
    },
    'Blockchain': {
      id: 'blockchain',
      color: 'bg-orange-900/50',
      textColor: 'text-orange-300',
      borderColor: 'border-orange-700/50',
      activeColor: 'bg-orange-800',
      activeBorderColor: 'border-orange-500'
    },
    'FinTech': {
      id: 'fintech',
      color: 'bg-emerald-900/50',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-700/50',
      activeColor: 'bg-emerald-800',
      activeBorderColor: 'border-emerald-500'
    },
    'CleanTech': {
      id: 'cleantech',
      color: 'bg-teal-900/50',
      textColor: 'text-teal-300',
      borderColor: 'border-teal-700/50',
      activeColor: 'bg-teal-800',
      activeBorderColor: 'border-teal-500'
    },
    'IoT': {
      id: 'iot',
      color: 'bg-indigo-900/50',
      textColor: 'text-indigo-300',
      borderColor: 'border-indigo-700/50',
      activeColor: 'bg-indigo-800',
      activeBorderColor: 'border-indigo-500'
    },
    'Data Science': {
      id: 'datascience',
      color: 'bg-cyan-900/50',
      textColor: 'text-cyan-300',
      borderColor: 'border-cyan-700/50',
      activeColor: 'bg-cyan-800',
      activeBorderColor: 'border-cyan-500'
    }
  };

  // Stats data
  const stats = [
    { 
      id: 'hackathons', 
      label: 'Hackathons', 
      value: counters.hackathons, 
      gradient: 'from-pink-500 to-purple-500'
    },
    { 
      id: 'participants', 
      label: 'Participants', 
      value: counters.participants, 
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'companies', 
      label: 'Companies', 
      value: counters.companies, 
      gradient: 'from-orange-500 to-pink-500'
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden min-h-screen flex items-start sm:items-center">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentBgIndex 
                ? 'opacity-100 translate-x-0' 
                : index < currentBgIndex 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
          >
            {index === 0 ? (
              // Original gradient background for first slide
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900"></div>
            ) : (
              // Image background for other slides
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${image.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-purple-900/60 to-gray-900/70"></div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Background image indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentBgIndex(index);
              setTypedText('');
              typingIndexRef.current = 0; // Reset typing index
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 
                      ${currentBgIndex === index 
                        ? 'w-6 bg-purple-500' 
                        : 'bg-gray-600 hover:bg-gray-500'}`}
            aria-label={`Go to background ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12 relative z-10 w-full mt-16 sm:mt-0">
        <div className={`grid ${currentBgIndex === 0 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 items-center`}>
          {/* Content Column - Center aligned for slides 2 and 3 */}
          <div className={`${currentBgIndex !== 0 ? 'max-w-2xl mx-auto text-center' : 'text-left'}`}>
            {/* Pro Badge */}
            <div className={`inline-flex items-center bg-purple-800/50 px-4 py-2 rounded-full mb-4 sm:mb-6 border border-purple-500/30 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-yellow-400 mr-2">{backgroundImages[currentBgIndex].badgeIcon}</span>
              <span className="text-white font-semibold">{backgroundImages[currentBgIndex].badge}</span>
            </div>
            
            {/* Main Heading with typing effect */}
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white ${currentBgIndex !== 0 ? 'text-center' : ''}`}>
              {typedText}
              {typedText.length < backgroundImages[currentBgIndex].heading.length && (
                <span className="animate-blink">|</span>
              )}
            </h1>

            {/* Subheading */}
            <p className={`text-xl text-gray-300 mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${currentBgIndex !== 0 ? 'text-center' : ''}`}>
              {backgroundImages[currentBgIndex].subheading}
            </p>

            {/* Call to Action Buttons - Only show on first slide */}
            {currentBgIndex === 0 && (
              <div className={`flex space-x-4 mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Link 
                  to={backgroundImages[currentBgIndex].primaryButtonLink}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">{backgroundImages[currentBgIndex].primaryButton}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                </Link>
                <Link 
                  to={backgroundImages[currentBgIndex].secondaryButtonLink}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 border border-gray-700"
                >
                  {backgroundImages[currentBgIndex].secondaryButton}
                </Link>
              </div>
            )}

            {/* Stats - Only show on first slide */}
            {currentBgIndex === 0 && (
              <div className={`grid grid-cols-3 gap-6 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {stats.map((stat, index) => (
                  <div 
                    key={stat.id}
                    className="bg-purple-900/30 p-4 rounded-lg border border-purple-800/30 hover:bg-purple-800/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className={`bg-gradient-to-r ${stat.gradient} w-full h-2 mb-2 rounded animate-pulse-slow`}></div>
                    <p className="text-lg md:text-xl font-bold text-white">{stat.value.toLocaleString()}</p>
                    <p className="text-gray-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Simple Feature List - Show on second slide */}
            {currentBgIndex === 1 && (
              <div className={`space-y-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center justify-center space-x-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  <span>Smart Team Matching</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  <span>Real-time Collaboration</span>
                </div>
              </div>
            )}

            {/* Simple Feature List - Show on third slide */}
            {currentBgIndex === 2 && (
              <div className={`space-y-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center justify-center space-x-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  <span>Expert-led Workshops</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  <span>Structured Learning</span>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Hackathon Card - Only show on first slide */}
          {currentBgIndex === 0 && (
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative">
                {/* Nav arrows for carousel */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between z-20 px-4">
                  <button 
                    onClick={() => setCurrentHackathonIndex(prev => prev === 0 ? hackathons.length - 1 : prev - 1)}
                    className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all"
                    aria-label="Previous hackathon"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setCurrentHackathonIndex(prev => (prev + 1) % hackathons.length)}
                    className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all"
                    aria-label="Next hackathon"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* Carousel indicators */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {hackathons.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentHackathonIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 
                                ${currentHackathonIndex === index 
                                  ? 'w-6 bg-purple-500' 
                                  : 'bg-gray-600 hover:bg-gray-500'}`}
                      aria-label={`Go to hackathon ${index + 1}`}
                    />
                  ))}
                </div>
                
                {/* Hackathon Event Card */}
                <div className="bg-opacity-80 bg-gray-900 rounded-xl shadow-2xl overflow-hidden max-w-md mx-auto 
                             border border-gray-800 transition-all duration-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]">
                  {/* Card Header - Fixed height */}
                  <div className="bg-gradient-to-r from-purple-700 to-purple-900 px-6 py-5 text-white relative overflow-hidden h-[100px]">
                    {/* Animated light effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shine-slow"></div>
                    </div>
                    
                    <div className="flex justify-between items-center relative z-10">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-purple-200">Featured Event</p>
                        <h2 className="text-2xl font-bold mt-1">{currentHackathon.title}</h2>
                      </div>
                      {currentHackathon.isLive && (
                        <div className="relative group">
                          {/* Simplified LIVE badge - removed pulsing effects */}
                          <div className="relative bg-white px-4 py-1 rounded-full transition-all duration-300 flex items-center">
                            {/* Only keeping the blinking dot */}
                            <span className="w-2 h-2 bg-red-600 rounded-full mr-1.5 animate-blink"></span>
                            <span className="text-sm font-bold text-purple-700">LIVE</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body - Fixed height */}
                  <div className="p-6 bg-gray-900 h-[400px] flex flex-col">
                    {/* Event details - Fixed height section */}
                    <div className="space-y-5 mb-6 h-[120px]">
                      {/* Registration End Date */}
                      <div className="flex items-center group cursor-pointer">
                        <div className="bg-purple-900 p-3 rounded-full transition-all duration-300 group-hover:bg-purple-800 transform group-hover:scale-110">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-gray-400 text-sm">Registration Ends</p>
                          <p className="font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300 transition-all duration-300">{currentHackathon.endDate}</p>
                        </div>
                      </div>

                      {/* Prize Worth */}
                      <div className="flex items-center group cursor-pointer">
                        <div className="bg-green-900 p-3 rounded-full transition-all duration-300 group-hover:bg-green-800 transform group-hover:scale-110">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-gray-400 text-sm">Prizes Worth</p>
                          <p className="font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300 transition-all duration-300">{currentHackathon.prize}</p>
                        </div>
                      </div>
                    </div>

                    {/* Prize Tiers - Fixed height section */}
                    <div className="h-[100px] mb-6">
                      <div className="flex justify-between">
                        {currentHackathon.prizes.map((prize, index) => (
                          <div key={index} className="text-center group cursor-pointer">
                            <div className="transform transition-all duration-300 group-hover:scale-110 hover:shadow-lg">
                              <div className="relative">
                                <div className={`w-16 h-16 bg-gradient-to-br ${
                                  index === 0 ? 'from-yellow-400 to-yellow-600 border-yellow-300' : 
                                  index === 1 ? 'from-gray-400 to-gray-600 border-gray-300' : 
                                  'from-amber-700 to-amber-900 border-amber-600'
                                } text-white rounded-full flex items-center justify-center mx-auto border-2`}>
                                  <span className="text-xl font-bold">{prize.place}</span>
                                </div>
                              </div>
                              <p className="mt-2 text-white group-hover:font-bold transition-all duration-300">{prize.amount}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags Section - Fixed height */}
                    <div className="h-[80px] mb-6">
                      <div className="flex flex-wrap gap-2">
                        {currentHackathon.tags.map((tagName, index) => {
                          const tagInfo = skillTags[tagName] || skillTags['AI/ML']; // Fallback
                          return (
                            <button
                              key={index}
                              onClick={() => handleTagClick(tagInfo.id)}
                              className={`${selectedTag === tagInfo.id ? tagInfo.activeColor : tagInfo.color} 
                                         ${tagInfo.textColor} text-xs px-3 py-1.5 rounded-full border 
                                         ${selectedTag === tagInfo.id ? tagInfo.activeBorderColor : tagInfo.borderColor} 
                                         transition-all duration-300 hover:-translate-y-1 
                                         hover:shadow-md`}
                            >
                              {tagName}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* CTA Button - Always at bottom */}
                    <div className="mt-auto">
                      <Link
                        to={`/registration/${currentHackathon.id}`}
                        className="relative w-full group overflow-hidden block"
                      >
                        {/* Button glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-70 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                        
                        {/* Button content */}
                        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 overflow-hidden group-hover:from-purple-700 group-hover:to-indigo-700">
                          <span className="relative z-10 flex items-center justify-center">
                            <span>Register Now</span>
                            <svg className="w-5 h-5 ml-2 transform transition-all duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                          
                          {/* Animated shine effect */}
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom wave design */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="text-white opacity-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,128C960,160,1056,224,1152,229.3C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}

export default HeroSection; 