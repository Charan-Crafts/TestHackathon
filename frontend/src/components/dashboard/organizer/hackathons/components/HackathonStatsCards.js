import React from 'react';

const HackathonStatsCards = ({ stats, setFilter }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-2 will-change-transform transform-gpu">
      {/* Total Hackathons Card */}
      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/40 backdrop-blur-sm rounded-xl border border-cyan-700/30 overflow-hidden group hover:border-cyan-500/50 transition-all duration-100 hover:shadow-lg hover:shadow-cyan-900/20 will-change-transform">
        <div className="px-4 pt-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-cyan-900/70 flex items-center justify-center group-hover:bg-cyan-800/90 transition-colors">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-1.5 py-0.5 bg-cyan-900/50 text-cyan-300 rounded-md">Dashboard</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1">
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="text-sm text-gray-400">Total Hackathons</div>
          </div>
        </div>
        
        {/* Status breakdown */}
        <div className="h-12 px-4 mt-3 flex items-end space-x-1 mb-1">
          {stats.total > 0 && (
            <>
              <div 
                className="bg-green-500/50 hover:bg-green-500/70 transition-colors rounded-t" 
                style={{ width: `${(stats.live/stats.total) * 100}%`, height: '100%' }}
              ></div>
              <div 
                className="bg-yellow-500/50 hover:bg-yellow-500/70 transition-colors rounded-t" 
                style={{ width: `${(stats.draft/stats.total) * 100}%`, height: '100%' }}
              ></div>
              <div 
                className="bg-red-500/50 hover:bg-red-500/70 transition-colors rounded-t" 
                style={{ width: `${(stats.rejected/stats.total) * 100}%`, height: '100%' }}
              ></div>
            </>
          )}
        </div>
        
        <div className="mt-1 border-t border-cyan-900/30 px-4 py-2 bg-gradient-to-r from-cyan-900/20 to-cyan-900/0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500/70 mr-1"></span>
                <span className="text-green-400">{stats.live}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500/70 mr-1"></span>
                <span className="text-yellow-400">{stats.draft}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500/70 mr-1"></span>
                <span className="text-red-400">{stats.rejected}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Live Hackathons Card */}
      <div className="bg-gradient-to-br from-green-900/30 to-green-800/40 backdrop-blur-sm rounded-xl border border-green-700/30 overflow-hidden group hover:border-green-500/50 transition-all duration-100 hover:shadow-lg hover:shadow-green-900/20 will-change-transform">
        <div className="px-4 pt-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-green-900/70 flex items-center justify-center group-hover:bg-green-800/90 transition-colors">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center text-xs px-1.5 py-0.5 bg-green-900/50 text-green-300 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold text-white">{stats.live}</div>
              <div className="text-green-400 text-sm font-medium ml-2">live</div>
            </div>
            <div className="text-sm text-gray-400">Running Hackathons</div>
          </div>
        </div>
        
        {/* Participants visualization */}
        <div className="h-12 px-4 mt-3">
          <div className="relative w-full h-full bg-gradient-to-r from-green-900/20 to-green-800/30 rounded-lg overflow-hidden">
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-green-400">{stats.totalParticipants.toLocaleString()}</span>
                <span className="text-xs text-gray-500">participants</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-1 border-t border-green-900/30 px-4 py-2 bg-gradient-to-r from-green-900/20 to-green-900/0">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-green-400">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>+{Math.floor(Math.random() * 50) + 10} this week</span>
            </div>
            <div className="text-xs text-green-400 flex items-center">
              <span className="mr-1">Active participants</span>
              <div className="w-full bg-green-900/50 h-1.5 rounded-full overflow-hidden w-12 ml-1">
                <div className="bg-green-500 h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Draft Hackathons Card */}
      <div className="bg-gradient-to-br from-yellow-900/30 to-amber-800/40 backdrop-blur-sm rounded-xl border border-yellow-700/30 overflow-hidden group hover:border-yellow-500/50 transition-all duration-100 hover:shadow-lg hover:shadow-yellow-900/20 will-change-transform translate-z-0">
        <div className="px-4 pt-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-yellow-900/70 flex items-center justify-center group-hover:bg-yellow-800/90 transition-colors">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-1.5 py-0.5 bg-yellow-900/50 text-yellow-300 rounded-md">In Progress</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold text-white">{stats.draft}</div>
              <div className="text-yellow-400 text-sm font-medium ml-2">drafts</div>
            </div>
            <div className="text-sm text-gray-400">Unpublished Hackathons</div>
          </div>
        </div>
        
        {/* Days since update visualization */}
        <div className="h-12 px-4 mt-3 flex items-center justify-center">
          <div className="text-center">
            <span className="text-sm text-yellow-400 font-medium">{Math.floor(Math.random() * 14) + 2} days</span>
            <span className="text-xs text-gray-500 ml-1">avg. since last update</span>
          </div>
        </div>
        
        <div className="mt-1 border-t border-yellow-900/30 px-4 py-2 bg-gradient-to-r from-yellow-900/20 to-yellow-900/0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex flex-col">
                <span className="text-xs text-yellow-300 font-medium">Ready</span>
                <span className="text-xs text-gray-500">{Math.floor(stats.draft * 0.7)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-300">Needs Work</span>
                <span className="text-xs text-gray-500">{Math.floor(stats.draft * 0.3)}</span>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setFilter('draft')}
                className="text-xs rounded-md py-1 px-2 text-yellow-300 bg-yellow-900/30 hover:bg-yellow-800/50 transition-colors"
              >
                Manage Drafts
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Participants & Teams Card */}
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-800/40 backdrop-blur-sm rounded-xl border border-purple-700/30 overflow-hidden group hover:border-purple-500/50 transition-all duration-100 hover:shadow-lg hover:shadow-purple-900/20 will-change-transform">
        <div className="px-4 pt-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-purple-900/70 flex items-center justify-center group-hover:bg-purple-800/90 transition-colors">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-1.5 py-0.5 bg-purple-900/50 text-purple-300 rounded-md">Analytics</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="grid grid-cols-2">
              <div className="border-r border-purple-800/30 pr-2">
                <div className="text-xl font-bold text-white">
                  {typeof stats.totalParticipants === 'number' 
                    ? stats.totalParticipants.toLocaleString() 
                    : '0'}
                </div>
                <div className="text-xs text-gray-400">Participants</div>
              </div>
              <div className="pl-2">
                <div className="text-xl font-bold text-white">
                  {typeof stats.totalTeams === 'number' 
                    ? stats.totalTeams.toLocaleString() 
                    : '0'}
                </div>
                <div className="text-xs text-gray-400">Teams</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submissions visualization */}
        <div className="h-12 px-4 mt-3">
          <div className="relative w-full h-full bg-gradient-to-r from-purple-900/20 to-purple-800/30 rounded-lg overflow-hidden">
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-purple-400">
                  {typeof stats.totalSubmissions === 'number' 
                    ? stats.totalSubmissions 
                    : '0'}
                </span>
                <span className="text-xs text-gray-500">submissions</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-1 border-t border-purple-900/30 px-4 py-2 bg-gradient-to-r from-purple-900/20 to-purple-900/0">
          <div className="flex items-center justify-between">
            <div className="text-xs text-purple-300">
              <span className="font-medium">
                {stats.totalTeams > 0 ? ((stats.totalSubmissions / stats.totalTeams) * 100).toFixed(1) : 'NaN'}% 
              </span>
              <span className="text-gray-400 ml-1">submission rate</span>
            </div>
            <div className="flex items-center">
              <button className="text-xs rounded-md py-1 px-2 text-purple-300 bg-purple-900/30 hover:bg-purple-800/50 transition-colors">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonStatsCards; 