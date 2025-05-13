import React from 'react';

const HackathonFilters = ({ filter, setFilter, searchText, setSearchText, stats }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700/40 mb-6 p-4 shadow-lg shadow-purple-900/5">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Filter Tabs - New Underline Style */}
        <div className="relative overflow-hidden">
          <div className="flex space-x-6 border-b border-gray-700/40">
            <button 
              onClick={() => setFilter('all')} 
              className={`relative px-2 py-2 text-sm font-medium transition-all
                ${filter === 'all' ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <span>All Hackathons</span>
              {filter === 'all' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"></span>
              )}
            </button>
            
            <button 
              onClick={() => setFilter('live')} 
              className={`relative px-2 py-2 text-sm font-medium transition-all flex items-center
                ${filter === 'live' ? 'text-green-400' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <span className={`w-2 h-2 rounded-full bg-green-400 mr-2 ${filter !== 'live' ? 'animate-pulse' : ''}`}></span>
              <span>Live ({stats.live})</span>
              {filter === 'live' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400"></span>
              )}
            </button>
            
            <button 
              onClick={() => setFilter('draft')} 
              className={`relative px-2 py-2 text-sm font-medium transition-all flex items-center
                ${filter === 'draft' ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
              <span>Drafts ({stats.draft})</span>
              {filter === 'draft' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"></span>
              )}
            </button>
            
            <button 
              onClick={() => setFilter('rejected')} 
              className={`relative px-2 py-2 text-sm font-medium transition-all flex items-center
                ${filter === 'rejected' ? 'text-red-400' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
              <span>Rejected ({stats.rejected})</span>
              {filter === 'rejected' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400"></span>
              )}
            </button>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="relative w-full lg:w-64">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search hackathons..."
            className="w-full bg-gray-900/60 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z" />
            </svg>
          </div>
          {searchText && (
            <button 
              onClick={() => setSearchText('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonFilters; 