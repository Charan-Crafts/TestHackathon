import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedHackathons } from '../../services/api';

function FeaturedHackathons() {
  const [isVisible, setIsVisible] = useState(false);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await getApprovedHackathons(3); // Get 3 featured hackathons
        if (response.data && response.data.success) {
          setHackathons(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  // Helper function to get gradient colors based on hackathon category
  const getGradientColors = (category) => {
    switch (category?.toLowerCase()) {
      case 'ai':
      case 'machine learning':
        return 'from-purple-600 to-indigo-600';
      case 'web3':
      case 'blockchain':
        return 'from-cyan-500 to-blue-600';
      case 'mobile':
      case 'app development':
        return 'from-orange-500 to-pink-600';
      default:
        return 'from-purple-600 to-indigo-600';
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section ref={sectionRef} className="relative py-12 bg-gray-900 overflow-hidden">
      {/* Curved background transition */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-gray-900 to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0">
        <svg
          className="w-full text-gray-900 fill-current"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C720,200 1440,0 1440,0 L1440,200 L0,200 Z"
          />
        </svg>
      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-20">
        <div className={`text-center mb-8 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase mb-2 block">
            Upcoming Events
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
            Featured Hackathons
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Participate in our trending hackathons and showcase your skills
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading hackathons...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {hackathons.map((hackathon, index) => (
              <div
                key={hackathon._id}
                className={`transition-all duration-700 transform perspective-1000
                           ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative group">
                  {/* Improved subtle glow effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${getGradientColors(hackathon.category)} rounded-xl opacity-50 group-hover:opacity-80 blur-sm transition duration-500`}></div>

                  {/* Thinner border card with improved styling */}
                  <div className="relative h-full bg-gray-900 rounded-xl overflow-hidden border border-gray-800/30 transition-all duration-300 group-hover:border-transparent">
                    {/* Top gradient bar */}
                    <div className={`h-1 w-full bg-gradient-to-r ${getGradientColors(hackathon.category)}`}></div>

                    <div className="p-6 flex flex-col h-full">
                      {/* Hackathon logo and name with improved spacing */}
                      <div className="flex items-start mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getGradientColors(hackathon.category)} p-2 mr-4 
                                      flex items-center justify-center shadow-lg`}>
                          <img
                            src={hackathon.imageFile?.fileUrl || "https://img.icons8.com/fluency/96/000000/code.png"}
                            alt={hackathon.title}
                            className="w-8 h-8"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY29kZS0yIj48cGF0aCBkPSJNMTUgMThoNlY2aC02TTkgNkgzdjEyaDZNMyAxMmgxMiI+PC9wYXRoPjwvc3ZnPg==";
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                            {hackathon.title}
                          </h3>
                          <div className="mt-1 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-800/70 text-gray-300 border-[0.5px] border-gray-700/50">
                            {hackathon.category || 'General'}
                          </div>
                        </div>
                      </div>

                      {/* Hackathon details with better typography */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-5">{hackathon.description}</p>

                      {/* Redesigned details grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-400 text-xs">{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                        </div>

                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-gray-400 text-xs">{hackathon.maxTeamSize || '1-4'} members</span>
                        </div>

                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-gray-400 text-xs">{hackathon.rounds?.length || 1} rounds</span>
                        </div>

                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span className="text-gray-400 text-xs">{hackathon.participants?.toLocaleString() || '0'}+ participants</span>
                        </div>
                      </div>

                      {/* Prize with improved styling */}
                      <div className="mb-5 py-2 px-3 bg-gray-800/40 rounded-lg border border-gray-700/30 flex items-center">
                        <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`font-bold bg-gradient-to-r ${getGradientColors(hackathon.category)} bg-clip-text text-transparent`}>
                          ${hackathon.prize?.toLocaleString() || '0'} Prize Pool
                        </span>
                      </div>

                      {/* Technologies with improved pill design */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hackathon.technologies?.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-800/50 text-gray-300 text-xs rounded-full border-[0.5px] border-gray-700/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons with improved styling */}
                      <div className="mt-auto grid grid-cols-2 gap-3">
                        <Link
                          to={`/hackathon/${hackathon._id}`}
                          className="text-center py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-white border border-gray-700/30 hover:border-gray-600 transition-all duration-300 text-sm"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/registration/${hackathon._id}`}
                          className={`text-center py-2 rounded-lg bg-gradient-to-r ${getGradientColors(hackathon.category)} text-white font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:shadow-purple-600/20 text-sm`}
                        >
                          Register
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button with improved styling */}
        <div className={`text-center transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '450ms' }}>
          <Link
            to="/hackathons"
            className="inline-block bg-transparent hover:bg-purple-600/20 text-purple-400 hover:text-purple-300 font-medium py-3 px-8 border border-purple-700/50 hover:border-purple-500/50 rounded-lg transition-all duration-300"
          >
            View All Hackathons
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedHackathons; 