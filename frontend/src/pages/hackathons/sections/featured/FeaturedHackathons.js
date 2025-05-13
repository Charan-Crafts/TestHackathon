import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hackathonAPI } from '../../../../services/api';
import { useAuth } from '../../../../contexts/AuthContext';
import { registrationAPI } from '../../../../services/api';

function FeaturedHackathons() {
  const [featuredHackathons, setFeaturedHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const [registeredHackathonIds, setRegisteredHackathonIds] = useState(new Set());

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        // Fetch hackathons with status 'approved', limit to 5 for featured
        const response = await hackathonAPI.getAllHackathons(1, 5, { status: 'approved' });
        if (response.data && response.data.success) {
          setFeaturedHackathons(response.data.data);
        } else {
          setFeaturedHackathons([]);
        }
      } catch (err) {
        setFeaturedHackathons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (user && user._id) {
      registrationAPI.getRegistrations({ userId: user._id })
        .then(res => {
          if (res.data && res.data.success) {
            setRegisteredHackathonIds(
              new Set(res.data.data.map(r => r.hackathonId?._id || r.hackathonId))
            );
          }
        });
    }
  }, [user]);

  // Function to get gradient based on category
  const getCategoryGradient = (category) => {
    if (!category) return 'from-indigo-600 to-indigo-800';
    const cat = category.toLowerCase();
    if (cat.includes('health')) return 'from-rose-600 to-pink-600';
    if (cat.includes('fintech') || cat.includes('blockchain')) return 'from-blue-600 to-cyan-600';
    if (cat.includes('climate') || cat.includes('sustain')) return 'from-green-600 to-emerald-600';
    if (cat.includes('ai')) return 'from-violet-600 to-indigo-600';
    if (cat.includes('iot')) return 'from-cyan-600 to-sky-600';
    if (cat.includes('cyber') || cat.includes('security')) return 'from-red-600 to-rose-600';
    if (cat.includes('ar') || cat.includes('vr') || cat.includes('xr')) return 'from-fuchsia-600 to-pink-600';
    if (cat.includes('edtech') || cat.includes('education')) return 'from-amber-600 to-yellow-600';
    if (cat.includes('web3') || cat.includes('metaverse')) return 'from-purple-600 to-fuchsia-600';
    if (cat.includes('gaming') || cat.includes('game')) return 'from-indigo-600 to-blue-600';
    if (cat.includes('hardware')) return 'from-teal-600 to-emerald-600';
    if (cat.includes('mobile')) return 'from-cyan-600 to-sky-600';
    return 'from-indigo-600 to-indigo-800';
  };

  // Function to get location type icon and label
  const getLocationTypeInfo = (locationType) => {
    switch (locationType) {
      case 'online':
        return {
          icon: (
            <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          ),
          label: 'Online',
          className: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/30'
        };
      case 'offline':
        return {
          icon: (
            <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          label: 'In-Person',
          className: 'bg-amber-900/40 text-amber-300 border-amber-700/30'
        };
      case 'hybrid':
        return {
          icon: (
            <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: 'Hybrid',
          className: 'bg-purple-900/40 text-purple-300 border-purple-700/30'
        };
      default:
        return {
          icon: (
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: 'Unknown',
          className: 'bg-gray-900/40 text-gray-300 border-gray-700/30'
        };
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900/10 via-gray-900/10 to-indigo-900/10 rounded-xl p-1 backdrop-blur-sm border border-gray-700/50 shadow-lg shadow-indigo-900/5">
      <div className="bg-gray-900/50 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg mr-3 sm:mr-4 shadow-lg shadow-indigo-900/30">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Featured Hackathons</h2>
              <p className="text-gray-400 text-xs sm:text-sm">Premier events with the biggest prizes</p>
            </div>
          </div>
          <Link
            to="/hackathons/featured"
            className="inline-flex items-center justify-center w-full sm:w-auto px-3 py-2 sm:px-4 bg-gradient-to-r from-indigo-600/20 to-indigo-800/20 hover:from-indigo-600/30 hover:to-indigo-800/30 text-white text-sm sm:text-base font-medium rounded-lg border border-indigo-500/30 transition-all duration-300 group"
          >
            View All Featured
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 ml-2 transform transition-all duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading featured hackathons...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featuredHackathons.map((hackathon) => {
              const categoryGradient = getCategoryGradient(hackathon.category);
              const locationTypeInfo = getLocationTypeInfo(hackathon.locationType);
              return (
                <div
                  key={hackathon._id}
                  className="group relative rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Card with color accent based on category */}
                  <div className="bg-gray-800/90 h-full flex flex-col">
                    {/* Top accent bar with category-based gradient */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${categoryGradient}`}></div>
                    <div className="p-4">
                      {/* Status badge and parent event */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-medium text-gray-400 bg-gray-800/80 border border-gray-700 px-2 py-0.5 rounded-md">
                          {hackathon.organizerId?.name || hackathon.organizerId?.firstName || 'Hackathon Event'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${hackathon.status === "approved"
                          ? "bg-green-900/70 text-green-300 border border-green-500/30"
                          : "bg-blue-900/70 text-blue-300 border border-blue-500/30"
                          }`}>
                          {hackathon.status === "approved" && (
                            <span className="h-1.5 w-1.5 mr-1 rounded-full bg-green-400 animate-pulse"></span>
                          )}
                          {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                        </span>
                      </div>
                      {/* Logo and title */}
                      <div className="flex items-start mb-2">
                        <div className="h-12 w-12 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden border border-gray-700 mr-3">
                          <img
                            src={hackathon.imageFile?.fileUrl || "https://img.icons8.com/fluency/96/000000/code.png"}
                            alt={hackathon.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors truncate">
                            {hackathon.title}
                          </h3>
                          {/* Location with icon */}
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-gray-400 text-xs flex items-center">
                              {locationTypeInfo.icon}
                              <span className={`ml-1 px-2 py-0.5 rounded-full border text-xs font-medium ${locationTypeInfo.className}`}>
                                {locationTypeInfo.label}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Dates and prize */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                        </span>
                        <span className="text-xs font-semibold text-amber-300">
                          ${hackathon.prize?.toLocaleString() || '0'} Prize
                        </span>
                      </div>
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {hackathon.technologies?.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-800/50 text-gray-300 text-xs rounded-full border-[0.5px] border-gray-700/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                      {/* Action button */}
                      <div className="mt-4">
                        {registeredHackathonIds.has(hackathon._id) ? (
                          <Link
                            to={`/dashboard/user/hackathons/${hackathon._id}`}
                            className="inline-block w-full text-center py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-800 text-white font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:shadow-green-600/20 text-sm"
                          >
                            View Details
                          </Link>
                        ) : (
                          <Link
                            to={`/registration/${hackathon._id}`}
                            className="inline-block w-full text-center py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:shadow-indigo-600/20 text-sm"
                          >
                            Register
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeaturedHackathons; 