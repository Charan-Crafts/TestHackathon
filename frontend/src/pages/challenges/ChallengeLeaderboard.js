import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';

// Mock leaderboard data
const LEADERBOARD_DATA = [
  {
    id: 1,
    username: "codingninja42",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    score: 4820,
    rank: 1,
    solvedCount: 243,
    problemsSolved: ["Two Sum", "Valid Parentheses", "Merge K Sorted Lists"],
    tier: "Diamond",
    country: "United States",
    streak: 42
  },
  {
    id: 2,
    username: "algorithm_master",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    score: 4615,
    rank: 2,
    solvedCount: 237,
    problemsSolved: ["Reverse Linked List", "LRU Cache", "Word Search"],
    tier: "Diamond",
    country: "India",
    streak: 38
  },
  {
    id: 3,
    username: "byte_cruncher",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    score: 4502,
    rank: 3,
    solvedCount: 229,
    problemsSolved: ["Two Sum", "Trapping Rain Water", "Regular Expression Matching"],
    tier: "Diamond",
    country: "Germany",
    streak: 25
  },
  {
    id: 4,
    username: "code_wizard",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    score: 4390,
    rank: 4,
    solvedCount: 220,
    problemsSolved: ["Valid Parentheses", "Binary Tree Level Order Traversal", "Median of Two Sorted Arrays"],
    tier: "Platinum",
    country: "Canada",
    streak: 31
  },
  {
    id: 5,
    username: "hackathon_hero",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    score: 4275,
    rank: 5,
    solvedCount: 215,
    problemsSolved: ["Letter Combinations of a Phone Number", "Longest Palindromic Substring", "Merge K Sorted Lists"],
    tier: "Platinum",
    country: "United Kingdom",
    streak: 27
  },
  {
    id: 6,
    username: "debugging_dynamo",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    score: 4120,
    rank: 6,
    solvedCount: 208,
    problemsSolved: ["Two Sum", "Binary Tree Level Order Traversal", "Regular Expression Matching"],
    tier: "Platinum",
    country: "Australia",
    streak: 19
  },
  {
    id: 7,
    username: "algo_artisan",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    score: 4050,
    rank: 7,
    solvedCount: 202,
    problemsSolved: ["Valid Parentheses", "LRU Cache", "Trapping Rain Water"],
    tier: "Platinum",
    country: "France",
    streak: 22
  },
  {
    id: 8,
    username: "silicon_savant",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    score: 3980,
    rank: 8,
    solvedCount: 198,
    problemsSolved: ["Reverse Linked List", "Word Search", "Median of Two Sorted Arrays"],
    tier: "Gold",
    country: "Japan",
    streak: 15
  },
  {
    id: 9,
    username: "binary_baron",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    score: 3890,
    rank: 9,
    solvedCount: 193,
    problemsSolved: ["Letter Combinations of a Phone Number", "Regular Expression Matching", "Merge K Sorted Lists"],
    tier: "Gold",
    country: "Brazil",
    streak: 12
  },
  {
    id: 10,
    username: "tech_titan",
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
    score: 3830,
    rank: 10,
    solvedCount: 190,
    problemsSolved: ["Two Sum", "Longest Palindromic Substring", "Trapping Rain Water"],
    tier: "Gold",
    country: "South Korea",
    streak: 18
  }
];

function ChallengeLeaderboard() {
  const [timeFrame, setTimeFrame] = useState('all-time');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [userRank, setUserRank] = useState({
    rank: 347,
    username: "your_username",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    score: 1420,
    solvedCount: 78,
    tier: "Silver",
    country: "United States",
    streak: 5
  });
  
  // Time frame options
  const timeFrames = [
    { id: 'all-time', label: 'All Time' },
    { id: 'monthly', label: 'This Month' },
    { id: 'weekly', label: 'This Week' },
    { id: 'daily', label: 'Today' }
  ];
  
  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, would fetch data based on selected time frame
      setLeaderboardData(LEADERBOARD_DATA);
      setIsLoading(false);
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, 800);
  }, [timeFrame]);
  
  // Filter leaderboard based on search query
  const filteredLeaderboard = leaderboardData.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.country.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get tier color class
  const getTierColor = (tier) => {
    switch(tier) {
      case 'Diamond':
        return 'text-cyan-300 border-cyan-500/50 bg-cyan-900/20';
      case 'Platinum':
        return 'text-indigo-300 border-indigo-500/50 bg-indigo-900/20';
      case 'Gold':
        return 'text-amber-300 border-amber-500/50 bg-amber-900/20';
      case 'Silver':
        return 'text-gray-300 border-gray-500/50 bg-gray-700/20';
      case 'Bronze':
        return 'text-orange-300 border-orange-500/50 bg-orange-900/20';
      default:
        return 'text-gray-300 border-gray-600/50 bg-gray-800/20';
    }
  };
  
  // Get rank icon based on position
  const getRankIcon = (rank) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full text-black font-bold text-xs shadow-lg">
          1
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full text-black font-bold text-xs shadow-lg">
          2
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full text-white font-bold text-xs shadow-lg">
          3
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-gray-700 rounded-full text-gray-300 font-bold text-xs">
          {rank}
        </div>
      );
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <LoadingIndicator 
        type="scanning" 
        message="Please wait..." 
        skeletonType="table"
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 relative">
      {/* Grid background effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 to-purple-900/10" 
             style={{ 
               backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(128, 90, 213, 0.1) 25%, rgba(128, 90, 213, 0.1) 26%, transparent 27%, transparent 74%, rgba(128, 90, 213, 0.1) 75%, rgba(128, 90, 213, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(128, 90, 213, 0.1) 25%, rgba(128, 90, 213, 0.1) 26%, transparent 27%, transparent 74%, rgba(128, 90, 213, 0.1) 75%, rgba(128, 90, 213, 0.1) 76%, transparent 77%, transparent)",
               backgroundSize: '50px 50px' 
             }}>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero section */}
        <div className="text-center py-0 leading-none">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-0 relative inline-block">
            <span className="relative z-10">Coding <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Leaderboard</span></span>
            <span className="absolute -left-2 bottom-0 w-full h-3 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70 transform skew-x-12 z-0"></span>
          </h1>
        </div>
        
        {/* Your rank card */}
        <div className="-mt-8 mb-2">
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-3 backdrop-blur-sm border border-indigo-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative">
                  <img 
                    src={userRank.avatar} 
                    alt={userRank.username}
                    className="w-12 h-12 rounded-full border-2 border-indigo-500/50"
                  />
                  <div className={`absolute -bottom-1 -right-1 px-1.5 text-xs rounded-full border ${getTierColor(userRank.tier)}`}>
                    {userRank.tier}
                  </div>
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <h3 className="text-xl font-bold text-white">{userRank.username}</h3>
                    <div className="ml-2 flex items-center text-amber-400">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="ml-1 text-sm">{userRank.streak} day streak</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <div className="flex items-center mr-4">
                      <span className="font-medium text-indigo-400">#{userRank.rank}</span>
                      <span className="mx-1">•</span>
                      <span>{userRank.country}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{userRank.solvedCount} solved</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{userRank.score} points</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link 
                to="/dashboard/profile" 
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap"
              >
                View Your Profile
              </Link>
            </div>
          </div>
        </div>
        
        {/* Filter and search section */}
        <div className={`mb-2 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            {/* Time frame selector */}
            <div className="inline-flex p-1 bg-gray-800 rounded-lg">
              {timeFrames.map(frame => (
                <button
                  key={frame.id}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    timeFrame === frame.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setTimeFrame(frame.id)}
                >
                  {frame.label}
                </button>
              ))}
            </div>
            
            {/* Search input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full md:w-64 pl-10 pr-3 py-1 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search users or countries"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Leaderboard table */}
        <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700">
            {/* Table headers */}
            <div className="bg-gray-900/70 py-2 px-4 border-b border-gray-700 grid grid-cols-12 gap-2">
              <div className="col-span-1 text-gray-400 text-xs font-medium uppercase">Rank</div>
              <div className="col-span-4 text-gray-400 text-xs font-medium uppercase">User</div>
              <div className="col-span-2 text-gray-400 text-xs font-medium uppercase">Tier</div>
              <div className="col-span-2 text-gray-400 text-xs font-medium uppercase">Score</div>
              <div className="col-span-2 text-gray-400 text-xs font-medium uppercase">Solved</div>
              <div className="col-span-1 text-gray-400 text-xs font-medium uppercase">Streak</div>
            </div>
            
            {/* Loading state */}
            {isLoading ? (
              <div className="animate-pulse py-4 space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                  <div key={i} className="px-6 grid grid-cols-12 gap-2">
                    <div className="col-span-1 flex items-center">
                      <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="col-span-4 flex items-center">
                      <div className="h-10 w-10 bg-gray-700 rounded-full mr-3"></div>
                      <div className="w-2/3">
                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <div className="h-6 w-16 bg-gray-700 rounded"></div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <div className="h-4 w-16 bg-gray-700 rounded"></div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <div className="h-4 w-12 bg-gray-700 rounded"></div>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <div className="h-4 w-8 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Table rows */}
                <div className="divide-y divide-gray-700">
                  {filteredLeaderboard.map((user) => (
                    <div 
                      key={user.id} 
                      className="px-6 py-4 grid grid-cols-12 gap-2 hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="col-span-1 flex items-center">
                        {getRankIcon(user.rank)}
                      </div>
                      
                      <div className="col-span-4 flex items-center">
                        <div className="relative mr-3">
                          <img 
                            src={user.avatar} 
                            alt={user.username}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center">
                            <span className="text-xs" title={user.country}>
                              {user.country === 'United States' ? '🇺🇸' : 
                               user.country === 'India' ? '🇮🇳' : 
                               user.country === 'Germany' ? '🇩🇪' : 
                               user.country === 'Canada' ? '🇨🇦' : 
                               user.country === 'United Kingdom' ? '🇬🇧' : 
                               user.country === 'Australia' ? '🇦🇺' : 
                               user.country === 'France' ? '🇫🇷' : 
                               user.country === 'Japan' ? '🇯🇵' : 
                               user.country === 'Brazil' ? '🇧🇷' : 
                               user.country === 'South Korea' ? '🇰🇷' : '🌍'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Link to={`/user/${user.username}`} className="font-medium text-white hover:text-indigo-400">
                            {user.username}
                          </Link>
                          <div className="text-xs text-gray-400">
                            <span className="hover:underline cursor-pointer">
                              View Profile
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-2 flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getTierColor(user.tier)}`}>
                          {user.tier}
                        </span>
                      </div>
                      
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-white font-medium">{user.score}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-white">{user.solvedCount}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-1 flex items-center">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span className="text-white">{user.streak}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Empty state */}
                {filteredLeaderboard.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="inline-block text-4xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
                    <p className="text-gray-400 mb-6">Try a different search term</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-medium transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
                
                {/* Pagination */}
                <div className="px-4 py-2 border-t border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing <span className="font-medium text-white">{filteredLeaderboard.length}</span> of <span className="font-medium text-white">{LEADERBOARD_DATA.length}</span> users
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                      Previous
                    </button>
                    <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm">
                      1
                    </button>
                    <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm">
                      2
                    </button>
                    <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm">
                      3
                    </button>
                    <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm">
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Tier explanation */}
        <div className={`mt-2 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">How Ranking Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              <div className="bg-gray-900/70 rounded-lg p-2 border border-cyan-500/30">
                <div className={`inline-block px-2 py-1 rounded-full border mb-2 ${getTierColor('Diamond')}`}>
                  Diamond
                </div>
                <p className="text-sm text-gray-300">
                  Top 1% of users with exceptional problem-solving skills.
                </p>
              </div>
              <div className="bg-gray-900/70 rounded-lg p-2 border border-indigo-500/30">
                <div className={`inline-block px-2 py-1 rounded-full border mb-2 ${getTierColor('Platinum')}`}>
                  Platinum
                </div>
                <p className="text-sm text-gray-300">
                  Top 5% of users who excel at challenging problems.
                </p>
              </div>
              <div className="bg-gray-900/70 rounded-lg p-2 border border-amber-500/30">
                <div className={`inline-block px-2 py-1 rounded-full border mb-2 ${getTierColor('Gold')}`}>
                  Gold
                </div>
                <p className="text-sm text-gray-300">
                  Top 15% of users with strong problem-solving abilities.
                </p>
              </div>
              <div className="bg-gray-900/70 rounded-lg p-2 border border-gray-500/30">
                <div className={`inline-block px-2 py-1 rounded-full border mb-2 ${getTierColor('Silver')}`}>
                  Silver
                </div>
                <p className="text-sm text-gray-300">
                  Top 40% of users who are consistently improving.
                </p>
              </div>
              <div className="bg-gray-900/70 rounded-lg p-2 border border-orange-500/30">
                <div className={`inline-block px-2 py-1 rounded-full border mb-2 ${getTierColor('Bronze')}`}>
                  Bronze
                </div>
                <p className="text-sm text-gray-300">
                  Users who are starting their coding challenge journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeLeaderboard; 