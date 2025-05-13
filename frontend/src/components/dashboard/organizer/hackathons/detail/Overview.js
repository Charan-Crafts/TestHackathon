import React from 'react';

const Overview = ({ hackathon }) => {
  // Get the current active round
  const getCurrentRound = () => {
    const now = new Date();
    for (const round of hackathon.rounds || []) {
      const startDate = new Date(round.startDate);
      const endDate = new Date(round.endDate);
      
      if (now >= startDate && now <= endDate) {
        return round;
      }
    }
    return null;
  };
  
  const currentRound = getCurrentRound();
  
  return (
    <div>
      {/* Current Status Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Current Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-400 mb-2">Active Phase</h3>
            {currentRound ? (
              <div>
                <div className="text-lg font-semibold text-white">{currentRound.name}</div>
                <div className="text-sm text-gray-400 mt-1">
                  {currentRound.startDate} - {currentRound.endDate}
                </div>
                <div className="mt-2 text-gray-300">{currentRound.description}</div>
              </div>
            ) : (
              <div className="text-gray-500 italic">No active phase</div>
            )}
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-400 mb-2">Hackathon Status</h3>
            <div className="flex items-center">
              {hackathon.status === 'live' && (
                <span className="px-3 py-1 text-sm rounded-full bg-green-900/30 text-green-400 border border-green-700/40">
                  Live
                </span>
              )}
              {hackathon.status === 'draft' && (
                <span className="px-3 py-1 text-sm rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-700/40">
                  Draft
                </span>
              )}
              {hackathon.status === 'rejected' && (
                <span className="px-3 py-1 text-sm rounded-full bg-red-900/30 text-red-400 border border-red-700/40">
                  Rejected
                </span>
              )}
            </div>
            <div className="mt-6">
              <div className="flex items-start mb-2">
                <svg className="w-5 h-5 text-cyan-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-300">
                  {hackathon.status === 'draft'
                    ? "Your hackathon is in draft mode. Only you can see it. Publish it when you're ready."
                    : hackathon.status === 'live'
                    ? "Your hackathon is live and visible to all users."
                    : "Your hackathon has been rejected. Please review the feedback."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Timeline Overview */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Timeline Overview</h2>
        <div className="space-y-6">
          {(hackathon.rounds || []).map((round, index) => (
            <div key={index} className="relative">
              {/* Vertical line connecting phases */}
              {index < (hackathon.rounds || []).length - 1 && (
                <div className="absolute top-6 left-4 w-0.5 h-full -ml-[1px] bg-gray-700"></div>
              )}
              
              <div className="flex">
                {/* Circle indicator */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentRound && currentRound.name === round.name 
                    ? 'bg-cyan-900/50 border-cyan-500'
                    : 'bg-gray-800 border-gray-600'
                } mr-4`}>
                  {currentRound && currentRound.name === round.name ? (
                    <div className="animate-ping absolute h-3 w-3 rounded-full bg-cyan-500 opacity-75"></div>
                  ) : null}
                </div>
                
                {/* Phase content */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className={`text-lg font-semibold ${
                        currentRound && currentRound.name === round.name ? 'text-cyan-400' : 'text-white'
                      }`}>
                        {round.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {round.startDate} - {round.endDate}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      {currentRound && currentRound.name === round.name ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-900/50 text-cyan-300 border border-cyan-500/40">
                          <span className="relative flex h-2 w-2 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                          </span>
                          Active Now
                        </span>
                      ) : new Date(round.endDate) < new Date() ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                          Completed
                        </span>
                      ) : new Date(round.startDate) > new Date() ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                          Upcoming
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-300 text-sm">{round.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button 
            className="flex items-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700/60 hover:border-indigo-500/40"
          >
            <div className="p-2 rounded-lg bg-indigo-900/30 mr-3">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-gray-200">Send Notifications</span>
          </button>
          
          <button 
            className="flex items-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700/60 hover:border-cyan-500/40"
          >
            <div className="p-2 rounded-lg bg-cyan-900/30 mr-3">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-gray-200">Form Teams</span>
          </button>
          
          <button 
            className="flex items-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700/60 hover:border-purple-500/40"
          >
            <div className="p-2 rounded-lg bg-purple-900/30 mr-3">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-gray-200">Export Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview; 