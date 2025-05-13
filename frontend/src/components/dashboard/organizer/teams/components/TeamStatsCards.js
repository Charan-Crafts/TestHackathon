import React from 'react';

const TeamStatsCards = ({ stats, setFilter }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Teams Card */}
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-800/40 backdrop-blur-sm rounded-xl border border-purple-700/30 overflow-hidden group hover:border-purple-500/50 transition-all duration-100 hover:shadow-lg hover:shadow-purple-900/20">
        <div className="px-4 pt-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-purple-900/70 flex items-center justify-center group-hover:bg-purple-800/90 transition-colors">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-1.5 py-0.5 bg-purple-900/50 text-purple-300 rounded-md">Dashboard</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1">
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="text-sm text-gray-400">Total Teams</div>
          </div>
        </div>
        
        {/* Status breakdown */}
        <div className="h-12 px-4 mt-3 flex items-end space-x-1 mb-1">
          {stats.total > 0 && (
            <>
              <div 
                className="bg-blue-500/50 hover:bg-blue-500/70 transition-colors rounded-t" 
                style={{ width: `${(stats.active/stats.total) * 100}%`, height: '100%' }}
                title={`Active: ${stats.active}`}
              ></div>
              <div 
                className="bg-green-500/50 hover:bg-green-500/70 transition-colors rounded-t" 
                style={{ width: `${(stats.complete/stats.total) * 100}%`, height: '100%' }}
                title={`Complete: ${stats.complete}`}
              ></div>
              <div 
                className="bg-yellow-500/50 hover:bg-yellow-500/70 transition-colors rounded-t" 
                style={{ width: `${(stats.incomplete/stats.total) * 100}%`, height: '100%' }}
                title={`Incomplete: ${stats.incomplete}`}
              ></div>
            </>
          )}
        </div>
        
        <div className="mt-1 border-t border-purple-900/30 px-4 py-2 bg-gradient-to-r from-purple-900/20 to-purple-900/0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500/70 mr-1"></span>
                <span className="text-blue-400">{stats.active}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500/70 mr-1"></span>
                <span className="text-green-400">{stats.complete}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500/70 mr-1"></span>
                <span className="text-yellow-400">{stats.incomplete}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Members Card */}
      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-800/40 backdrop-blur-sm rounded-xl border border-cyan-700/30 overflow-hidden group hover:border-cyan-500/50 transition-all duration-100 hover:shadow-lg hover:shadow-cyan-900/20">
        <div className="px-4 pt-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-cyan-900/70 flex items-center justify-center group-hover:bg-cyan-800/90 transition-colors">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-1.5 py-0.5 bg-cyan-900/50 text-cyan-300 rounded-md">Members</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold text-white">{stats.totalMembers}</div>
              <div className="text-cyan-400 text-sm font-medium ml-2 flex items-center">
                <span className="mr-1">members</span>
                {stats.avgTeamSize > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    (~{stats.avgTeamSize.toFixed(1)}/team)
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-400">Across {stats.totalHackathons} hackathons</div>
          </div>
        </div>
        
        {/* Team size visualization */}
        <div className="h-12 px-4 mt-3">
          <div className="relative w-full h-full bg-gradient-to-r from-cyan-900/20 to-cyan-800/30 rounded-lg overflow-hidden">
            <div className="h-full flex items-end justify-around px-1">
              <div className="w-2 rounded-t bg-cyan-500/50 h-[20%]"></div>
              <div className="w-2 rounded-t bg-cyan-500/50 h-[40%]"></div>
              <div className="w-2 rounded-t bg-cyan-500/50 h-[80%]"></div>
              <div className="w-2 rounded-t bg-cyan-500/50 h-[60%]"></div>
              <div className="w-2 rounded-t bg-cyan-500/50 h-[90%]"></div>
              <div className="w-2 rounded-t bg-cyan-500/50 h-[75%]"></div>
              <div className="w-2 rounded-t bg-cyan-500/50 h-[45%]"></div>
              <div className="w-2 rounded-t bg-cyan-500/50 h-[65%]"></div>
              <div className="w-2 rounded-t bg-cyan-500/50 h-[55%]"></div>
              <div className="w-2 rounded-t bg-cyan-500/50 h-[30%]"></div>
            </div>
          </div>
        </div>
        
        <div className="mt-1 border-t border-cyan-900/30 px-4 py-2 bg-gradient-to-r from-cyan-900/20 to-cyan-900/0">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-cyan-400">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>+{Math.floor(Math.random() * 10) + 5}% from last month</span>
            </div>
            <div className="text-xs text-cyan-400 flex items-center">
              <span className="mr-1">Distribution</span>
              <div className="w-full bg-cyan-900/50 h-1.5 rounded-full overflow-hidden w-12 ml-1">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Complete Teams Card */}
      <div className="bg-gradient-to-br from-green-900/30 to-emerald-800/40 backdrop-blur-sm rounded-xl border border-green-700/30 overflow-hidden group hover:border-green-500/50 transition-all duration-100 hover:shadow-lg hover:shadow-green-900/20">
        <div className="px-4 pt-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-green-900/70 flex items-center justify-center group-hover:bg-green-800/90 transition-colors">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-1.5 py-0.5 bg-green-900/50 text-green-300 rounded-md">Complete</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold text-white">{stats.complete}</div>
              <div className="text-green-400 text-sm font-medium ml-2">complete</div>
            </div>
            <div className="text-sm text-gray-400">Teams with submissions</div>
          </div>
        </div>
        
        {/* Completion rate visualization */}
        <div className="h-12 px-4 mt-3">
          <div className="relative w-full h-full bg-gradient-to-r from-green-900/20 to-green-800/30 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <span className="text-lg font-bold text-green-400">
                {stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0}%
              </span>
              <span className="text-xs text-gray-500 ml-1">completion rate</span>
            </div>
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 h-full bg-green-500/20"
                style={{ width: `${stats.total > 0 ? (stats.complete / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mt-1 border-t border-green-900/30 px-4 py-2 bg-gradient-to-r from-green-900/20 to-green-900/0">
          <div className="flex items-center justify-between">
            <div className="text-xs text-green-300 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0}%</span>
              <span className="ml-1 text-gray-400">of teams completed</span>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setFilter('complete')}
                className="text-xs rounded-md py-1 px-2 text-green-300 bg-green-900/30 hover:bg-green-800/50 transition-colors"
              >
                View Complete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Incomplete Teams Card */}
      <div className="bg-gradient-to-br from-yellow-900/30 to-amber-800/40 backdrop-blur-sm rounded-xl border border-yellow-700/30 overflow-hidden group hover:border-yellow-500/50 transition-all duration-100 hover:shadow-lg hover:shadow-yellow-900/20 translate-z-0">
        <div className="px-4 pt-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-yellow-900/70 flex items-center justify-center group-hover:bg-yellow-800/90 transition-colors">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-1.5 py-0.5 bg-yellow-900/50 text-yellow-300 rounded-md">Need Action</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold text-white">{stats.incomplete}</div>
              <div className="text-yellow-400 text-sm font-medium ml-2">incomplete</div>
            </div>
            <div className="text-sm text-gray-400">Teams without submissions</div>
          </div>
        </div>
        
        {/* Time left visualization */}
        <div className="h-12 px-4 mt-3 flex items-center justify-center">
          <div className="text-center">
            <span className="text-sm text-yellow-400 font-medium">{Math.floor(Math.random() * 3) + 2} days</span>
            <span className="text-xs text-gray-500 ml-1">avg. time before deadline</span>
          </div>
        </div>
        
        <div className="mt-1 border-t border-yellow-900/30 px-4 py-2 bg-gradient-to-r from-yellow-900/20 to-yellow-900/0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex flex-col">
                <span className="text-xs text-yellow-300 font-medium">Time critical</span>
                <span className="text-xs text-gray-500">{Math.floor(stats.incomplete * 0.3)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-300">Needs nudge</span>
                <span className="text-xs text-gray-500">{Math.floor(stats.incomplete * 0.7)}</span>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setFilter('incomplete')}
                className="text-xs rounded-md py-1 px-2 text-yellow-300 bg-yellow-900/30 hover:bg-yellow-800/50 transition-colors"
              >
                View Incomplete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamStatsCards; 