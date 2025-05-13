import React from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipantStatsCards = ({ stats, setFilter }) => {
  const navigate = useNavigate();
  
  const handleViewTeams = () => {
    navigate('/dashboard/organizer/teams');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 will-change-transform transform-gpu">
      {/* Total Participants Card */}
      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/40 backdrop-blur-sm rounded-xl border border-cyan-700/30 overflow-hidden group hover:border-cyan-500/50 transition-all duration-100 hover:shadow-lg hover:shadow-cyan-900/20 will-change-transform">
        <div className="px-4 pt-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-cyan-900/70 flex items-center justify-center group-hover:bg-cyan-800/90 transition-colors">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
            <div className="text-sm text-gray-400">Total Participants</div>
          </div>
        </div>
        
        {/* Status breakdown */}
        <div className="h-12 px-4 mt-3 flex items-end space-x-1 mb-1">
          {stats.total > 0 && (
            <>
              <div 
                className="bg-green-500/50 hover:bg-green-500/70 transition-colors rounded-t" 
                style={{ width: `${(stats.active/stats.total) * 100}%`, height: '100%' }}
              ></div>
              <div 
                className="bg-yellow-500/50 hover:bg-yellow-500/70 transition-colors rounded-t" 
                style={{ width: `${(stats.pending/stats.total) * 100}%`, height: '100%' }}
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
                <span className="text-green-400">{stats.active}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500/70 mr-1"></span>
                <span className="text-yellow-400">{stats.pending}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500/70 mr-1"></span>
                <span className="text-red-400">{stats.rejected}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Participants Card */}
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
              <div className="text-3xl font-bold text-white">{stats.active}</div>
              <div className="text-green-400 text-sm font-medium ml-2">active</div>
            </div>
            <div className="text-sm text-gray-400">Active Participants</div>
          </div>
        </div>
        
        {/* Registration trend visualization */}
        <div className="h-12 px-4 mt-3">
          <div className="relative w-full h-full bg-gradient-to-r from-green-900/20 to-green-800/30 rounded-lg overflow-hidden">
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-green-400">{Math.floor(Math.random() * 20) + 10}</span>
                <span className="text-xs text-gray-500">new this week</span>
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
              <span>+{Math.floor(Math.random() * 10) + 5}% growth</span>
            </div>
            <div className="text-xs text-green-400 flex items-center">
              <span className="mr-1">Team placement</span>
              <div className="w-full bg-green-900/50 h-1.5 rounded-full overflow-hidden w-12 ml-1">
                <div className="bg-green-500 h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pending Participants Card */}
      <div className="bg-gradient-to-br from-yellow-900/30 to-amber-800/40 backdrop-blur-sm rounded-xl border border-yellow-700/30 overflow-hidden group hover:border-yellow-500/50 transition-all duration-100 hover:shadow-lg hover:shadow-yellow-900/20 will-change-transform translate-z-0">
        <div className="px-4 pt-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-yellow-900/70 flex items-center justify-center group-hover:bg-yellow-800/90 transition-colors">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-1.5 py-0.5 bg-yellow-900/50 text-yellow-300 rounded-md">Need Review</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold text-white">{stats.pending}</div>
              <div className="text-yellow-400 text-sm font-medium ml-2">pending</div>
            </div>
            <div className="text-sm text-gray-400">Pending Applications</div>
          </div>
        </div>
        
        {/* Days since update visualization */}
        <div className="h-12 px-4 mt-3 flex items-center justify-center">
          <div className="text-center">
            <span className="text-sm text-yellow-400 font-medium">{Math.floor(Math.random() * 3) + 1} days</span>
            <span className="text-xs text-gray-500 ml-1">avg. waiting time</span>
          </div>
        </div>
        
        <div className="mt-1 border-t border-yellow-900/30 px-4 py-2 bg-gradient-to-r from-yellow-900/20 to-yellow-900/0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex flex-col">
                <span className="text-xs text-yellow-300 font-medium">Complete</span>
                <span className="text-xs text-gray-500">{Math.floor(stats.pending * 0.7)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-300">Needs Info</span>
                <span className="text-xs text-gray-500">{Math.floor(stats.pending * 0.3)}</span>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setFilter('pending')}
                className="text-xs rounded-md py-1 px-2 text-yellow-300 bg-yellow-900/30 hover:bg-yellow-800/50 transition-colors"
              >
                Review Pending
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Teams Card */}
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-800/40 backdrop-blur-sm rounded-xl border border-purple-700/30 overflow-hidden group hover:border-purple-500/50 transition-all duration-100 hover:shadow-lg hover:shadow-purple-900/20 will-change-transform">
        <div className="px-4 pt-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-purple-900/70 flex items-center justify-center group-hover:bg-purple-800/90 transition-colors">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-1.5 py-0.5 bg-purple-900/50 text-purple-300 rounded-md">Teams</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="grid grid-cols-2">
              <div className="border-r border-purple-800/30 pr-2">
                <div className="text-xl font-bold text-white">
                  {stats.totalTeams}
                </div>
                <div className="text-xs text-gray-400">Teams</div>
              </div>
              <div className="pl-2">
                <div className="text-xl font-bold text-white">
                  {stats.totalHackathons}
                </div>
                <div className="text-xs text-gray-400">Hackathons</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Team size visualization */}
        <div className="h-12 px-4 mt-3">
          <div className="relative w-full h-full bg-gradient-to-r from-purple-900/20 to-purple-800/30 rounded-lg overflow-hidden">
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-medium text-purple-400">
                  {stats.totalTeams > 0 ? Math.round((stats.active / stats.totalTeams) * 10) / 10 : 0}
                </span>
                <span className="text-xs text-gray-500">members / team</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-1 border-t border-purple-900/30 px-4 py-2 bg-gradient-to-r from-purple-900/20 to-purple-900/0">
          <div className="flex items-center justify-between">
            <div className="text-xs text-purple-300">
              <span className="font-medium">
                {stats.active > 0 ? Math.round((stats.totalTeams / stats.active) * 100) : 0}% 
              </span>
              <span className="text-gray-400 ml-1">team placement rate</span>
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleViewTeams}
                className="text-xs rounded-md py-1 px-2 text-purple-300 bg-purple-900/30 hover:bg-purple-800/50 transition-colors"
              >
                View Teams
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantStatsCards; 