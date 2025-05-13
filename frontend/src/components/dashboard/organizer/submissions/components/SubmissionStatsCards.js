import React from 'react';

const SubmissionStatsCards = ({ stats, setFilter }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Submissions Card */}
      <div 
        className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-4 rounded-xl border border-gray-700/50 shadow-lg shadow-black/5 backdrop-blur-sm"
        onClick={() => setFilter('all')}
      >
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-green-900/30 border border-green-700/40 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Submissions</p>
            <h3 className="text-2xl font-bold text-white">{stats.total}</h3>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {stats.totalHackathons} hackathons
          </span>
          <button className="flex items-center text-xs text-green-400 hover:text-green-300">
            <span>View All</span>
            <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Pending Submissions Card */}
      <div 
        className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-4 rounded-xl border border-gray-700/50 shadow-lg shadow-black/5 backdrop-blur-sm"
        onClick={() => setFilter('pending')}
      >
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-yellow-900/30 border border-yellow-700/40 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Pending Review</p>
            <h3 className="text-2xl font-bold text-white">{stats.pending}</h3>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <span className={`text-xs ${stats.pending > 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
            {stats.pending > 0 ? 'Needs attention' : 'All reviewed'}
          </span>
          <button className="flex items-center text-xs text-yellow-400 hover:text-yellow-300">
            <span>Review</span>
            <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Reviewed Submissions Card */}
      <div 
        className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-4 rounded-xl border border-gray-700/50 shadow-lg shadow-black/5 backdrop-blur-sm"
        onClick={() => setFilter('reviewed')}
      >
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-blue-900/30 border border-blue-700/40 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Reviewed</p>
            <h3 className="text-2xl font-bold text-white">{stats.reviewed}</h3>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {Math.round((stats.reviewed / (stats.total || 1)) * 100)}% of total
          </span>
          <button className="flex items-center text-xs text-blue-400 hover:text-blue-300">
            <span>View</span>
            <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Awarded Submissions Card */}
      <div 
        className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-4 rounded-xl border border-gray-700/50 shadow-lg shadow-black/5 backdrop-blur-sm"
        onClick={() => setFilter('awarded')}
      >
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-purple-900/30 border border-purple-700/40 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Awarded</p>
            <h3 className="text-2xl font-bold text-white">{stats.awarded}</h3>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {Math.round((stats.awarded / (stats.total || 1)) * 100)}% of total
          </span>
          <button className="flex items-center text-xs text-purple-400 hover:text-purple-300">
            <span>Manage</span>
            <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Average Score Card */}
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-4 rounded-xl border border-gray-700/50 shadow-lg shadow-black/5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-indigo-900/30 border border-indigo-700/40 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Avg Score</p>
            <h3 className="text-2xl font-bold text-white">
              {stats.reviewed || stats.awarded ? '78' : '-'}/100
            </h3>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-gray-400">
            Based on {stats.reviewed + stats.awarded} submissions
          </span>
          <button className="flex items-center text-xs text-indigo-400 hover:text-indigo-300">
            <span>Analytics</span>
            <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionStatsCards; 