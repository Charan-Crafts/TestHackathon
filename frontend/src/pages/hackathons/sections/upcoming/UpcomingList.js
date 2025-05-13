import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';
import { hackathonsData } from '../../../../data/hackathons';

function UpcomingList() {
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilterTab, setActiveFilterTab] = useState('mode');

  // Filter modes
  const modes = [
    { id: 'all', name: 'All' },
    { id: 'online', name: 'Online' },
    { id: 'offline', name: 'In-Person' },
    { id: 'hybrid', name: 'Hybrid' }
  ];

  // Category filters
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'ai', name: 'AI & ML' },
    { id: 'blockchain', name: 'Blockchain' },
    { id: 'climate', name: 'Climate Tech' },
    { id: 'web3', name: 'Web3' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'iot', name: 'IoT' },
    { id: 'cybersecurity', name: 'Cybersecurity' },
    { id: 'ar-vr', name: 'AR/VR' },
    { id: 'edtech', name: 'EdTech' },
    { id: 'fintech', name: 'FinTech' },
    { id: 'health', name: 'Healthcare' },
    { id: 'gaming', name: 'Gaming' }
  ];

  // Mock upcoming hackathons data
  const [hackathons, setHackathons] = useState([]);

  // Function to get gradient based on category
  const getCategoryGradient = (tags) => {
    if (tags.includes("AI") || tags.includes("Machine Learning")) {
      return "from-violet-600 to-indigo-600";
    } else if (tags.includes("Blockchain") || tags.includes("Web3")) {
      return "from-blue-600 to-cyan-600";
    } else if (tags.includes("Climate Tech") || tags.includes("Sustainability")) {
      return "from-green-600 to-emerald-600";
    } else if (tags.includes("Healthcare")) {
      return "from-rose-600 to-pink-600";
    } else if (tags.includes("Quantum")) {
      return "from-purple-600 to-fuchsia-600";
    } else if (tags.includes("Entrepreneurship")) {
      return "from-amber-600 to-orange-600";
    } else if (tags.includes("IoT") || tags.includes("Hardware")) {
      return "from-teal-600 to-emerald-600";
    } else if (tags.includes("Cybersecurity") || tags.includes("Security")) {
      return "from-red-600 to-rose-600";
    } else if (tags.includes("AR") || tags.includes("AR/VR") || tags.includes("VR") || tags.includes("XR")) {
      return "from-fuchsia-600 to-pink-600";
    } else if (tags.includes("EdTech") || tags.includes("Education")) {
      return "from-amber-600 to-yellow-600";
    } else if (tags.includes("FinTech") || tags.includes("Finance")) {
      return "from-emerald-600 to-teal-600";
    } else if (tags.includes("Gaming") || tags.includes("Game")) {
      return "from-indigo-600 to-blue-600";
    } else if (tags.includes("Mobile")) {
      return "from-cyan-600 to-sky-600";
    } else {
      return "from-indigo-600 to-purple-600";
    }
  };
  
  // Function to get location type icon and label
  const getLocationTypeInfo = (locationType) => {
    switch(locationType) {
      case 'online':
      case 'virtual':
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
      case 'in-person':
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

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      // Use data from the centralized hackathons.js file
      setHackathons(hackathonsData);
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);
  }, []);

  // Filter hackathons based on search, mode and category
  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesSearch = hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hackathon.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedMode === 'all' || hackathon.locationType === selectedMode;
    
    // Check if hackathon matches selected category
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'ai' && (hackathon.tags.includes('AI') || hackathon.tags.includes('Machine Learning'))) ||
                           (selectedCategory === 'blockchain' && (hackathon.tags.includes('Blockchain'))) ||
                           (selectedCategory === 'climate' && (hackathon.tags.includes('Climate Tech') || hackathon.tags.includes('Sustainability'))) ||
                           (selectedCategory === 'web3' && (hackathon.tags.includes('Web3') || hackathon.tags.includes('Metaverse'))) ||
                           (selectedCategory === 'mobile' && (hackathon.tags.includes('Mobile'))) ||
                           (selectedCategory === 'iot' && (hackathon.tags.includes('IoT') || hackathon.tags.includes('Hardware'))) ||
                           (selectedCategory === 'cybersecurity' && (hackathon.tags.includes('Cybersecurity') || hackathon.tags.includes('Security'))) ||
                           (selectedCategory === 'ar-vr' && (hackathon.tags.includes('AR') || hackathon.tags.includes('VR') || hackathon.tags.includes('AR/VR') || hackathon.tags.includes('XR'))) ||
                           (selectedCategory === 'edtech' && (hackathon.tags.includes('EdTech') || hackathon.tags.includes('Education'))) ||
                           (selectedCategory === 'fintech' && (hackathon.tags.includes('FinTech') || hackathon.tags.includes('Finance') || hackathon.tags.includes('Banking'))) ||
                           (selectedCategory === 'health' && (hackathon.tags.includes('Healthcare') || hackathon.tags.includes('Health'))) ||
                           (selectedCategory === 'gaming' && (hackathon.tags.includes('Gaming') || hackathon.tags.includes('Game')));
    
    return matchesSearch && matchesMode && matchesCategory;
  });

  if (loading) {
    return <LoadingIndicator type="scanning" message="Please wait..." title="" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-purple-900/20 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-6 sm:mb-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="relative z-10">Upcoming <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Hackathons</span></span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-base sm:text-lg">
            Discover and register for upcoming hackathons. Don't miss out!
          </p>
        </div>

        {/* Filters */}
        <div className={`mb-6 sm:mb-8 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-gradient-to-r from-gray-800/60 via-gray-900/80 to-gray-800/60 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700/50">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search hackathons..."
                  className="w-full pl-10 pr-10 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                    onClick={() => setSearchQuery('')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Active Filters Summary */}
              {(selectedMode !== 'all' || selectedCategory !== 'all' || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2 mt-4 p-3 bg-gray-800/40 rounded-lg border border-gray-700">
                  <span className="text-gray-400 text-sm">Active filters:</span>
                  
                  {/* Show selected mode */}
                  {selectedMode !== 'all' && (
                    <div className="flex items-center bg-gray-700/80 text-white text-xs px-2 py-1 rounded-md">
                      <span>{modes.find(m => m.id === selectedMode)?.name}</span>
                      <button 
                        onClick={() => setSelectedMode('all')} 
                        className="ml-1 text-gray-400 hover:text-white"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {/* Show selected category */}
                  {selectedCategory !== 'all' && (
                    <div className="flex items-center bg-gray-700/80 text-white text-xs px-2 py-1 rounded-md">
                      <span>{categories.find(c => c.id === selectedCategory)?.name}</span>
                      <button 
                        onClick={() => setSelectedCategory('all')} 
                        className="ml-1 text-gray-400 hover:text-white"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {/* Show search query */}
                  {searchQuery && (
                    <div className="flex items-center bg-gray-700/80 text-white text-xs px-2 py-1 rounded-md">
                      <span>Search: {searchQuery}</span>
                      <button 
                        onClick={() => setSearchQuery('')} 
                        className="ml-1 text-gray-400 hover:text-white"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {/* Clear all button */}
                  <button
                    onClick={() => {
                      setSelectedMode('all');
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="ml-auto text-xs text-red-400 hover:text-red-300"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Filter tabs */}
              <div className="flex border-b border-gray-700 mb-3">
                <button
                  onClick={() => setActiveFilterTab('mode')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilterTab === 'mode'
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Mode
                </button>
                <button
                  onClick={() => setActiveFilterTab('category')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilterTab === 'category'
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Category
                </button>
              </div>

              {/* Mode filters */}
              {activeFilterTab === 'mode' && (
                <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                  <div className="flex gap-2 w-max">
                    {modes.map(mode => {
                      // Calculate how many hackathons match this mode
                      const count = hackathons.filter(h => 
                        mode.id === 'all' || h.locationType === mode.id
                      ).length;
                      
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setSelectedMode(mode.id)}
                          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 ${
                            selectedMode === mode.id
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                              : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center">
                            <span>{mode.name}</span>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                              selectedMode === mode.id 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gray-700 text-gray-300'
                            }`}>{count}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category filters */}
              {activeFilterTab === 'category' && (
                <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                  <div className="flex gap-2 w-max">
                    {categories.map(category => {
                      // Calculate how many hackathons match this category
                      const count = hackathons.filter(hackathon => {
                        if (category.id === 'all') return true;
                        
                        if (category.id === 'ai' && (hackathon.tags.includes('AI') || hackathon.tags.includes('Machine Learning'))) return true;
                        if (category.id === 'blockchain' && (hackathon.tags.includes('Blockchain'))) return true;
                        if (category.id === 'climate' && (hackathon.tags.includes('Climate Tech') || hackathon.tags.includes('Sustainability'))) return true;
                        if (category.id === 'web3' && (hackathon.tags.includes('Web3') || hackathon.tags.includes('Metaverse'))) return true;
                        if (category.id === 'mobile' && (hackathon.tags.includes('Mobile'))) return true;
                        if (category.id === 'iot' && (hackathon.tags.includes('IoT') || hackathon.tags.includes('Hardware'))) return true;
                        if (category.id === 'cybersecurity' && (hackathon.tags.includes('Cybersecurity') || hackathon.tags.includes('Security'))) return true;
                        if (category.id === 'ar-vr' && (hackathon.tags.includes('AR') || hackathon.tags.includes('VR') || hackathon.tags.includes('AR/VR') || hackathon.tags.includes('XR'))) return true;
                        if (category.id === 'edtech' && (hackathon.tags.includes('EdTech') || hackathon.tags.includes('Education'))) return true;
                        if (category.id === 'fintech' && (hackathon.tags.includes('FinTech') || hackathon.tags.includes('Finance') || hackathon.tags.includes('Banking'))) return true;
                        if (category.id === 'health' && (hackathon.tags.includes('Healthcare') || hackathon.tags.includes('Health'))) return true;
                        if (category.id === 'gaming' && (hackathon.tags.includes('Gaming') || hackathon.tags.includes('Game'))) return true;
                        
                        return false;
                      }).length;
                        
                      // Skip categories with 0 matches except "All Categories"
                      if (count === 0 && category.id !== 'all') return null;
                        
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                              : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center">
                            <span>{category.name}</span>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                              selectedCategory === category.id 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gray-700 text-gray-300'
                            }`}>{count}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hackathons Grid - Redesigned with the new card style */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {filteredHackathons.map((hackathon) => {
            const categoryGradient = getCategoryGradient(hackathon.tags);
            const locationTypeInfo = getLocationTypeInfo(hackathon.locationType);
            
            return (
              <Link
                key={hackathon.id}
                to={`/hackathon/${hackathon.id}`}
                className="group relative rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Card with color accent based on category */}
                <div className="bg-gray-800/90 h-full flex flex-col">
                  {/* Top accent bar with category-based gradient */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${categoryGradient}`}></div>
                  
                  <div className="p-4">
                    {/* Status badge and organizer */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-medium text-gray-400 bg-gray-800/80 border border-gray-700 px-2 py-0.5 rounded-md">
                        {hackathon.organizer}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        hackathon.status === "Registration Open" 
                          ? "bg-green-900/70 text-green-300 border border-green-500/30" 
                          : "bg-orange-900/70 text-orange-300 border border-orange-500/30"
                      }`}>
                        {hackathon.status === "Registration Open" && (
                          <span className="h-1.5 w-1.5 mr-1 rounded-full bg-green-400 animate-pulse"></span>
                        )}
                        {hackathon.status}
                      </span>
                    </div>
                    
                    {/* Logo and title */}
                    <div className="flex items-start mb-2">
                      <div className="h-12 w-12 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden border border-gray-700 mr-3">
                        <img 
                          src={hackathon.image} 
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
                            <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{hackathon.location}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Location Type Badge */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs ${locationTypeInfo.className}`}>
                        {locationTypeInfo.icon}
                        <span className="ml-1">{locationTypeInfo.label}</span>
                      </span>
                    </div>
                    
                    {/* Info grid - 2 columns */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Date */}
                      <div className="bg-gray-900/60 rounded-lg p-2">
                        <p className="text-gray-400 text-xs mb-1">Date</p>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 text-indigo-400 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-white text-xs font-medium whitespace-nowrap">{hackathon.date}</p>
                        </div>
                      </div>
                      
                      {/* Prize */}
                      <div className="bg-gray-900/60 rounded-lg p-2">
                        <p className="text-gray-400 text-xs mb-1">Prize</p>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 text-indigo-400 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-indigo-400 text-xs font-bold">{hackathon.prize}</p>
                        </div>
                      </div>
                      
                      {/* Participants Count */}
                      <div className="bg-gray-900/60 rounded-lg p-2">
                        <p className="text-gray-400 text-xs mb-1">Participants</p>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 text-indigo-400 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-indigo-400 text-xs font-medium">{hackathon.participants}</p>
                        </div>
                      </div>
                      
                      {/* Registration ends */}
                      <div className="bg-gray-900/60 rounded-lg p-2">
                        <p className="text-gray-400 text-xs mb-1">Registration</p>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 text-indigo-400 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-indigo-400 text-xs font-medium">Ends {hackathon.registrationEnds}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {hackathon.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className={`px-2 py-0.5 text-xs rounded-full border bg-opacity-30 ${
                            categoryGradient.includes('violet') ? 'bg-violet-900/30 text-violet-300 border-violet-700/30' :
                            categoryGradient.includes('blue') ? 'bg-blue-900/30 text-blue-300 border-blue-700/30' :
                            categoryGradient.includes('green') ? 'bg-green-900/30 text-green-300 border-green-700/30' :
                            categoryGradient.includes('rose') ? 'bg-rose-900/30 text-rose-300 border-rose-700/30' :
                            categoryGradient.includes('purple') ? 'bg-purple-900/30 text-purple-300 border-purple-700/30' :
                            categoryGradient.includes('amber') ? 'bg-amber-900/30 text-amber-300 border-amber-700/30' :
                            categoryGradient.includes('teal') ? 'bg-teal-900/30 text-teal-300 border-teal-700/30' :
                            categoryGradient.includes('cyan') ? 'bg-cyan-900/30 text-cyan-300 border-cyan-700/30' :
                            categoryGradient.includes('fuchsia') ? 'bg-fuchsia-900/30 text-fuchsia-300 border-fuchsia-700/30' :
                            'bg-indigo-900/30 text-indigo-300 border-indigo-700/30'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Footer with action buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/hackathon/${hackathon.id}`}
                        className="flex-1 px-3 py-1.5 text-center bg-gray-800/70 hover:bg-gray-800 text-gray-300 hover:text-white text-xs rounded-lg border border-gray-700 transition-colors"
                      >
                        Details
                      </Link>
                      {hackathon.status === "Registration Open" && (
                        <Link
                          to={`/registration/${hackathon.id}`}
                          className={`flex-1 px-3 py-1.5 text-center text-white text-xs rounded-lg transition-colors bg-gradient-to-r ${categoryGradient} hover:brightness-110`}
                        >
                          Register
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
              </Link>
            );
          })}
        </div>
        
        {/* Empty state */}
        {filteredHackathons.length === 0 && (
          <div className="flex flex-col items-center justify-center bg-gray-800/50 rounded-lg p-8 mt-4 border border-gray-700/50">
            <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-gray-300 text-lg font-medium mb-2">No hackathons found</h3>
            <p className="text-gray-400 text-center mb-4">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedMode('all');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default UpcomingList;