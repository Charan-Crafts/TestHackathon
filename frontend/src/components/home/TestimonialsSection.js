import React, { useState, useEffect, useRef, useMemo } from 'react';

function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);

  const testimonials = useMemo(() => [
    {
      quote: "HackathonHub transformed our recruitment strategy. We've hired three exceptional engineers from their platform who are now leading our AI initiatives.",
      author: "Sarah Chen",
      role: "CTO at TechInnovate",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      companyLogo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      quote: "Participating in hackathons on this platform kickstarted my career. The connections I made and skills I developed led directly to my dream job in Silicon Valley.",
      author: "Miguel Rodriguez",
      role: "Senior Developer at CloudScale",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      gradient: "from-purple-600 to-indigo-600"
    },
    {
      quote: "As a hackathon organizer, I've tried multiple platforms and nothing compares to HackathonHub. The tools, community reach, and support are unmatched.",
      author: "Aisha Patel",
      role: "Director at GlobalTech Summit",
      image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      companyLogo: "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      gradient: "from-pink-600 to-rose-600"
    }
  ], []);

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

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 8000);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      clearInterval(interval);
    };
  }, [testimonials.length]);

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-5 mix-blend-overlay"
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1591267990532-e5bda4e38f78?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')" }}>
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 rounded-full bg-purple-700/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1/3 h-1/3 rounded-full bg-indigo-700/10 blur-3xl animate-float"></div>
      </div>
      
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="text-purple-500 text-sm font-semibold tracking-wider uppercase mb-2 block">
            Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What People <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Are Saying</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Hear from developers, companies, and organizers who've experienced the impact of our platform
          </p>
        </div>

        {/* Enhanced testimonial carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* The Testimonials - Reduce height from h-[32rem] to h-[24rem] */}
            <div className="relative h-[24rem] overflow-hidden rounded-2xl shadow-2xl shadow-purple-700/10">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    activeIndex === index 
                      ? 'translate-x-0 opacity-100 z-10' 
                      : activeIndex > index 
                        ? '-translate-x-full opacity-0 z-0' 
                        : 'translate-x-full opacity-0 z-0'
                  }`}
                >
                  <div className="h-full rounded-2xl overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-purple-900/50"></div>
                    
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-pattern opacity-5"></div>
                    
                    {/* Content container */}
                    <div className="absolute inset-0 flex md:flex-row flex-col">
                      {/* Image column - adjust padding */}
                      <div className="w-full md:w-2/5 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-30`}></div>
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <div className="relative w-full aspect-square max-w-xs overflow-hidden rounded-xl border-2 border-white/20 shadow-2xl transform md:rotate-3 group-hover:rotate-0 transition-all duration-700">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.author}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
                                <img 
                                  src={testimonial.companyLogo} 
                                  alt="Company logo"
                                  className="h-10 w-auto"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Text column - adjust padding */}
                      <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                        {/* Quote icon */}
                        <div className="text-8xl text-purple-500/20 font-serif leading-none mb-4">"</div>
                        
                        {/* Quote text */}
                        <div className="mb-8">
                          <blockquote className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                            {testimonial.quote}
                          </blockquote>
                        </div>
                        
                        {/* Author info */}
                        <div className="mt-auto">
                          <div className="flex items-center">
                            <div className="flex-grow">
                              <div className="font-bold text-white text-lg mb-1">{testimonial.author}</div>
                              <div className="text-purple-400 text-sm">{testimonial.role}</div>
                            </div>
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          
                          {/* Visual separator */}
                          <div className="mt-4 flex items-center">
                            <div className="h-0.5 flex-grow bg-gradient-to-r from-purple-500/30 to-transparent"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel controls */}
            <div className="flex justify-between mt-8">
              <div className="flex items-center gap-1">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeIndex === index 
                        ? 'bg-purple-500 w-8' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  aria-label="Previous testimonial"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setActiveIndex(prev => (prev + 1) % testimonials.length)}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  aria-label="Next testimonial"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection; 