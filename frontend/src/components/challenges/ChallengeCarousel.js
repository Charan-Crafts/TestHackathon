import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Commented out unused carousel data
/* 
const CAROUSEL_SLIDES = [
  {
    id: 'daily-sprint',
    title: 'Unlock strategies',
    subtitle: 'for your',
    highlight: '100 Days Coding Sprint!',
    description: 'Level up your skills with daily challenges and track your progress',
    ctaText: 'Start Now',
    ctaLink: '/challenges/daily-sprint',
    bgColor: 'from-blue-600 to-indigo-800',
    tags: ['Arrays', 'Strings', 'Trees', 'Graphs', 'DP'],
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
  },
  {
    id: 'code-conquest',
    title: '10 Topics',
    subtitle: 'for',
    highlight: 'DSA Mastery',
    description: 'Your path to champion DSA, Algorithms, & Interviews',
    ctaText: 'Explore Now',
    ctaLink: '/challenges/code-conquest',
    bgColor: 'from-purple-700 to-blue-900',
    tags: ['DSA', 'Projects', 'Interviews'],
    image: 'https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
  },
  {
    id: 'company-prep',
    title: 'Prep4Placement',
    subtitle: 'with',
    highlight: 'Company Interview Guides',
    description: 'Curated challenges and resources for top tech companies',
    ctaText: 'Prepare Now',
    ctaLink: '/company-prep',
    bgColor: 'from-cyan-600 to-blue-800',
    tags: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
  }
];
*/

function ChallengeCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "100 Days Coding Sprint",
      description: "Build consistency with daily coding challenges for 100 consecutive days",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      color: "from-blue-600 to-blue-900",
      link: "/challenges/daily-sprint",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Code Conquest",
      description: "Customize topics and difficulty to master specific programming concepts",
      image: "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      color: "from-purple-600 to-purple-900",
      link: "/challenges/code-conquest",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Challenge Cards",
      description: "Weekly challenges, quizzes, and special coding events to test your skills",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      color: "from-indigo-600 to-indigo-900",
      link: "/challenges/cards",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Company Preparation",
      description: "Targeted practice for technical interviews at top tech companies",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      color: "from-green-600 to-green-900",
      link: "/challenges/company",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];
  
  // Auto advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);
  
  // Next slide handler
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };
  
  // Previous slide handler
  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  return (
    <div className="mb-12 overflow-hidden bg-gray-900 rounded-xl border border-gray-700 shadow-lg">
      <div className="relative h-80 md:h-96">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`}></div>
            
            {/* Optional background image with overlay */}
            <div 
              className="absolute inset-0 opacity-30 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            
            {/* Content */}
            <div className="relative z-20 h-full flex items-center px-6 md:px-12">
              <div className="max-w-2xl">
                <div className="bg-gray-900/40 backdrop-blur-md p-3 inline-flex items-center justify-center rounded-full mb-4">
                  <div className={`text-white ${
                    index === 0 ? 'text-blue-300' : 
                    index === 1 ? 'text-purple-300' : 
                    index === 2 ? 'text-indigo-300' : 'text-green-300'
                  }`}>
                    {slide.icon}
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {slide.title}
                </h2>
                
                <p className="text-gray-200 mb-6 max-w-lg">
                  {slide.description}
                </p>
                
                <Link
                  to={slide.link}
                  className="inline-flex items-center justify-center px-5 py-3 bg-gray-900/60 hover:bg-gray-900/80 text-white font-medium rounded-lg transition-colors backdrop-blur-md"
                >
                  Explore
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation buttons */}
        <div className="absolute bottom-6 right-6 z-30 flex space-x-2">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-gray-900/60 hover:bg-gray-900/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-gray-900/60 hover:bg-gray-900/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Slide indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeSlide 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChallengeCarousel; 