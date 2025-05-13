import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserChallenges = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    currentStreak: 0,
    totalPoints: 0,
    ranking: 0,
    weeklyProgress: 0,
    categoryBreakdown: []
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);

  useEffect(() => {
    // Simulate API fetch for user challenge data
    setTimeout(() => {
      // Mock data - in a real app, this would come from an API
      setStats({
        totalCompleted: 157,
        currentStreak: 12,
        totalPoints: 4250,
        ranking: 342,
        weeklyProgress: 65,
        categoryBreakdown: [
          { name: 'Algorithms', completed: 45, total: 87, percentage: 52 },
          { name: 'Data Structures', completed: 38, total: 64, percentage: 59 },
          { name: 'System Design', completed: 12, total: 42, percentage: 29 },
          { name: 'Web Development', completed: 22, total: 56, percentage: 39 }
        ]
      });

      setRecentActivity([
        { id: 1, type: 'completed', title: 'Binary Tree Level Order Traversal', difficulty: 'medium', category: 'Data Structures', points: 75, timestamp: '2 hours ago' },
        { id: 2, type: 'started', title: 'Design a URL Shortener', difficulty: 'hard', category: 'System Design', timestamp: '4 hours ago' },
        { id: 3, type: 'failed', title: 'Merge K Sorted Lists', difficulty: 'hard', category: 'Algorithms', timestamp: 'Yesterday' },
        { id: 4, type: 'completed', title: 'Two Sum', difficulty: 'easy', category: 'Algorithms', points: 30, timestamp: 'Yesterday' }
      ]);

      setUpcomingDeadlines([
        { id: 1, title: 'Daily Code Sprint Challenge', deadline: 'Today, 11:59 PM', category: 'Daily', difficulty: 'medium' },
        { id: 2, title: 'Weekly Contest #42', deadline: 'Saturday, 9:00 AM', category: 'Contest', difficulty: 'hard' },
        { id: 3, title: 'Company Prep: Google Edition', deadline: 'Next Monday', category: 'Company Prep', difficulty: 'medium' }
      ]);

      setRecommendedChallenges([
        { id: 1, title: 'Graph Traversal Techniques', difficulty: 'medium', category: 'Algorithms', matchPercentage: 92 },
        { id: 2, title: 'Implementing LRU Cache', difficulty: 'medium', category: 'System Design', matchPercentage: 88 },
        { id: 3, title: 'Dynamic Programming: Coin Change', difficulty: 'medium', category: 'Algorithms', matchPercentage: 85 },
        { id: 4, title: 'Hash Table Implementation', difficulty: 'easy', category: 'Data Structures', matchPercentage: 82 }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  // Helper functions for styling
  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-900/30 text-green-400 border-green-500/50';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/50';
      case 'hard':
        return 'bg-red-900/30 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusClass = (type) => {
    switch (type) {
      case 'completed':
        return 'bg-green-900/30 text-green-400 border-green-500/50';
      case 'started':
        return 'bg-blue-900/30 text-blue-400 border-blue-500/50';
      case 'failed':
        return 'bg-red-900/30 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusText = (type) => {
    switch (type) {
      case 'completed':
        return 'Completed';
      case 'started':
        return 'In Progress';
      case 'failed':
        return 'Unsuccessful';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading your challenge data...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Page Header with Key Metrics */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Challenge Dashboard
        </h2>

        {/* Key Stats Cards - Top Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Completed Challenges Card */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/40 backdrop-blur-sm rounded-xl border border-indigo-700/30 overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20">
            <div className="px-4 pt-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-900/70 flex items-center justify-center group-hover:bg-indigo-800/90 transition-all">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-auto">
                  <span className="text-xs px-1.5 py-0.5 bg-indigo-900/50 text-indigo-300 rounded-md">#1 Focus</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline space-x-1">
                  <div className="text-2xl font-bold text-white">{stats.totalCompleted}</div>
                  <div className="text-indigo-400 text-xs font-medium">/&nbsp;249</div>
                </div>
                <div className="text-xs text-gray-400">Challenges Completed</div>
              </div>
            </div>

            {/* Mini bar chart */}
            <div className="h-8 px-4 mt-2 flex items-end space-x-1">
              <div className="w-1/5 bg-indigo-600/30 hover:bg-indigo-500/50 transition-colors rounded-t h-2"></div>
              <div className="w-1/5 bg-indigo-600/30 hover:bg-indigo-500/50 transition-colors rounded-t h-4"></div>
              <div className="w-1/5 bg-indigo-600/30 hover:bg-indigo-500/50 transition-colors rounded-t h-6"></div>
              <div className="w-1/5 bg-indigo-600/30 hover:bg-indigo-500/50 transition-colors rounded-t h-5"></div>
              <div className="w-1/5 bg-indigo-600/30 hover:bg-indigo-500/50 transition-colors rounded-t h-7"></div>
            </div>

            <div className="mt-2 border-t border-indigo-900/30 px-4 py-1.5 bg-gradient-to-r from-indigo-900/20 to-indigo-900/0">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-green-400">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span>12 this week</span>
                </div>
                <div className="text-xs text-indigo-400 flex items-center">
                  <div className="w-full bg-indigo-900/50 h-1.5 rounded-full overflow-hidden w-12 mr-1">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '63%' }}></div>
                  </div>
                  <span>63%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Streak Card */}
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/40 backdrop-blur-sm rounded-xl border border-amber-700/30 overflow-hidden group hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/20">
            <div className="px-4 pt-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-amber-900/70 flex items-center justify-center group-hover:bg-amber-800/90 transition-all">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </div>
                {stats.currentStreak >= 10 && (
                  <div className="ml-auto">
                    <span className="text-xs px-1.5 py-0.5 bg-amber-900/50 text-amber-300 rounded-md">🔥 On Fire</span>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <div className="flex items-baseline">
                  <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
                  <div className="text-amber-400 text-xs font-medium ml-1">days</div>
                </div>
                <div className="text-xs text-gray-400">Current Streak</div>
              </div>
            </div>

            {/* Streak calendar visualization */}
            <div className="h-8 px-4 mt-2 flex items-center justify-between">
              <div className="flex space-x-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-sm ${i < 5 ? 'bg-amber-500/50' : 'bg-gray-700/50'} 
                    ${i === 4 ? 'ring-1 ring-amber-400' : ''}`}
                  ></div>
                ))}
              </div>
              <div className="text-xs text-amber-300">Last 7 days</div>
            </div>

            <div className="mt-2 border-t border-amber-900/30 px-4 py-1.5 bg-gradient-to-r from-amber-900/20 to-amber-900/0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-amber-300 font-medium">21d</span>
                    <span className="text-xs text-gray-500">Best</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-300">8d</span>
                    <span className="text-xs text-gray-500">Avg</span>
                  </div>
                </div>
                <div className="flex items-center text-xs text-amber-400">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>+4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Points Card */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/40 backdrop-blur-sm rounded-xl border border-purple-700/30 overflow-hidden group hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20">
            <div className="px-4 pt-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-purple-900/70 flex items-center justify-center group-hover:bg-purple-800/90 transition-all">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-auto">
                  <span className="text-xs px-1.5 py-0.5 bg-purple-900/50 text-purple-300 rounded-md">Silver Tier</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline">
                  <div className="text-2xl font-bold text-white">{stats.totalPoints.toLocaleString()}</div>
                  <div className="text-purple-400 text-xs font-medium ml-1">pts</div>
                </div>
                <div className="text-xs text-gray-400">Total Points</div>
              </div>
            </div>

            {/* Level progress visualization */}
            <div className="h-8 px-4 mt-2 flex flex-col justify-center">
              <div className="flex justify-between items-center text-xs mb-1">
                <div className="text-gray-500">Silver</div>
                <div className="text-purple-300 text-xs">5,000 pts (Gold)</div>
              </div>
              <div className="relative w-full bg-gray-700/50 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '85%' }}></div>
                <div className="absolute top-0 bottom-0 left-[85%] w-0.5 bg-white/70 animate-pulse"></div>
              </div>
            </div>

            <div className="mt-2 border-t border-purple-900/30 px-4 py-1.5 bg-gradient-to-r from-purple-900/20 to-purple-900/0">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-green-400">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span>+350 this week</span>
                </div>
                <div className="text-xs text-purple-300">750 to Gold</div>
              </div>
            </div>
          </div>

          {/* Global Ranking Card */}
          <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/40 backdrop-blur-sm rounded-xl border border-cyan-700/30 overflow-hidden group hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/20">
            <div className="px-4 pt-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-cyan-900/70 flex items-center justify-center group-hover:bg-cyan-800/90 transition-all">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-auto">
                  <span className="text-xs px-1.5 py-0.5 bg-cyan-900/50 text-cyan-300 rounded-md">Top 5%</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline">
                  <div className="text-lg font-bold text-white">#</div>
                  <div className="text-2xl font-bold text-white">{stats.ranking}</div>
                </div>
                <div className="text-xs text-gray-400">Global Ranking</div>
              </div>
            </div>

            {/* Ranking visualization */}
            <div className="h-8 px-4 mt-2 flex items-center">
              <div className="relative w-full flex justify-around">
                <div className="absolute h-0.5 bg-cyan-800/60 top-3 left-0 right-0"></div>
                <div className="relative w-5 flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mb-0.5 z-10"></div>
                  <div className="text-xs text-cyan-300">100</div>
                </div>
                <div className="relative w-5 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-cyan-500 mb-0.5 z-10 flex items-center justify-center text-xs text-white font-bold">
                    {stats.ranking}
                  </div>
                  <div className="text-xs text-cyan-300">You</div>
                </div>
                <div className="relative w-5 flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-600 mb-0.5 z-10"></div>
                  <div className="text-xs text-gray-500">500</div>
                </div>
              </div>
            </div>

            <div className="mt-2 border-t border-cyan-900/30 px-4 py-1.5 bg-gradient-to-r from-cyan-900/20 to-cyan-900/0">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-cyan-300">
                  <span>Next: Top 100</span>
                </div>
                <div className="flex items-center text-xs text-green-400">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span>↑28 positions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Progress and Activity */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Weekly Progress */}
          <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 shadow-lg shadow-purple-900/5">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Weekly Challenge Progress
            </h2>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-5 border border-gray-700/40 mb-5">
              <div className="flex justify-between items-center mb-3">
                <div className="text-white font-medium">Overall Completion</div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-white">{stats.weeklyProgress}</span>
                  <span className="text-gray-400 ml-1">%</span>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 background-animate"
                  style={{ width: `${stats.weeklyProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <div>0%</div>
                <div>50%</div>
                <div>100%</div>
              </div>
            </div>

            {/* Category Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {stats.categoryBreakdown.map((category, index) => (
                <div key={index} className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center mb-3">
                    <div className={`w-8 h-8 rounded-lg ${category.name === 'Algorithms' ? 'bg-purple-900/50 text-purple-400' :
                        category.name === 'Data Structures' ? 'bg-green-900/50 text-green-400' :
                          category.name === 'System Design' ? 'bg-pink-900/50 text-pink-400' :
                            'bg-amber-900/50 text-amber-400'
                      } flex items-center justify-center mr-3`}>
                      {category.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{category.name}</div>
                      <div className="text-xs text-gray-400">{category.completed} of {category.total} completed</div>
                    </div>
                    <div className="ml-auto">
                      <div className="text-lg font-bold text-white">{category.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${category.name === 'Algorithms' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
                          category.name === 'Data Structures' ? 'bg-gradient-to-r from-green-500 to-teal-500' :
                            category.name === 'System Design' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                              'bg-gradient-to-r from-amber-500 to-orange-500'
                        }`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 shadow-lg shadow-purple-900/5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activity
              </h2>
              <Link to="/activity" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center">
                View All
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-brand-500/60 before:via-indigo-500/60 before:to-purple-500/60">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className={`mb-5 ${index === recentActivity.length - 1 ? '' : 'pb-5 border-b border-gray-700/30'}`}>
                  <div className="absolute left-0 w-6 h-6 rounded-full border-2 border-gray-700 bg-gray-800 z-10 flex items-center justify-center">
                    {activity.type === 'completed' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-700"></span>
                    ) : activity.type === 'started' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-700"></span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    )}
                  </div>

                  <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-medium">{activity.title}</div>
                      <div className={`px-2.5 py-1 text-xs rounded-full ${getStatusClass(activity.type)}`}>
                        {getStatusText(activity.type)}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border mr-2 ${getDifficultyClass(activity.difficulty)}`}>
                        {activity.difficulty}
                      </span>
                      <span className="mr-3">{activity.category}</span>
                      {activity.points && (
                        <span className="flex items-center text-yellow-400 mr-3">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          {activity.points} pts
                        </span>
                      )}
                      <span className="text-xs ml-auto">{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Deadlines, Recommendations and Quick Access */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-purple-900/5">
            <div className="bg-gradient-to-r from-red-900/20 to-red-900/5 px-6 py-4 border-b border-gray-700/40">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Deadlines
                </h2>
                <Link to="/calendar" className="text-indigo-400 hover:text-indigo-300 text-sm">
                  View All
                </Link>
              </div>
            </div>

            <div className="px-6 py-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div
                  key={deadline.id}
                  className={`py-3 ${index < upcomingDeadlines.length - 1 ? 'border-b border-gray-700/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-white font-medium">{deadline.title}</div>
                    <span className={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full border ${getDifficultyClass(deadline.difficulty)}`}>
                      {deadline.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400">{deadline.category}</span>
                    <span className="ml-auto text-sm font-medium text-red-400">{deadline.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Challenges */}
          <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-purple-900/5">
            <div className="bg-gradient-to-r from-purple-900/20 to-purple-900/5 px-6 py-4 border-b border-gray-700/40">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Recommended
                </h2>
                <Link to="/challenges/recommended" className="text-indigo-400 hover:text-indigo-300 text-sm">
                  View All
                </Link>
              </div>
            </div>

            <div className="p-4">
              {recommendedChallenges.map((challenge, index) => (
                <div
                  key={challenge.id}
                  className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 mb-3 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg shadow-md flex items-center justify-center mr-3 ${getDifficultyClass(challenge.difficulty)}`}>
                      {challenge.difficulty.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-white font-medium truncate">{challenge.title}</div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-400 mr-2">{challenge.category}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-400 border border-purple-500/30">
                          {challenge.matchPercentage}% match
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-purple-900/5 p-5">
            <h2 className="text-lg font-semibold text-white mb-4 px-1">
              Quick Access
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/challenges/daily"
                className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-3 border border-indigo-700/30 hover:bg-indigo-800/30 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-indigo-800 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-sm text-white font-medium">Daily Sprint</div>
                </div>
              </Link>

              <Link
                to="/challenges/conquest"
                className="bg-purple-900/30 backdrop-blur-sm rounded-lg p-3 border border-purple-700/30 hover:bg-purple-800/30 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-purple-800 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="text-sm text-white font-medium">Code Conquest</div>
                </div>
              </Link>

              <Link
                to="/challenges/cards"
                className="bg-cyan-900/30 backdrop-blur-sm rounded-lg p-3 border border-cyan-700/30 hover:bg-cyan-800/30 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-cyan-800 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="text-sm text-white font-medium">Challenge Cards</div>
                </div>
              </Link>

              <Link
                to="/challenges/company"
                className="bg-pink-900/30 backdrop-blur-sm rounded-lg p-3 border border-pink-700/30 hover:bg-pink-800/30 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-pink-800 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-sm text-white font-medium">Company Prep</div>
                </div>
              </Link>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50 backdrop-blur-sm rounded-xl border border-indigo-700/40 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2">Ready for more?</h3>
              <p className="text-gray-300 text-sm mb-4">Explore our curated collection of interview prep questions.</p>
              <Link
                to="/challenges/premium"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium py-2 px-4 rounded-lg inline-block shadow-lg shadow-purple-900/30 transition-all duration-300 transform hover:scale-105"
              >
                Explore Premium
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animation */}
      <style jsx>{`
        .background-animate {
          background-size: 400%;
          animation: AnimateBackground 3s ease infinite;
        }
        
        @keyframes AnimateBackground {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default UserChallenges;
