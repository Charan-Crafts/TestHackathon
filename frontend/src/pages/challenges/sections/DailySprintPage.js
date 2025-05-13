import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../../components/common/LoadingIndicator';
import DAILY_CHALLENGES from '../../../data/challenges/sprintChallenges';
import SPRINT_CATEGORIES from '../../../data/challenges/sprintCategories';

function DailySprintPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('cards'); // 'cards' or 'topics'
  
  // Define these variables to fix the undefined variable errors
  const completedDays = 1; // User has completed day 1
  const currentDay = 3; // User is currently on day 2
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
  if (isLoading) {
    return (
      <LoadingIndicator 
        type="scanning" 
        message="Please wait..." 
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with title centered */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 relative inline-block">
            <span className="relative z-10">100 Days <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Coding Sprint</span></span>
            <span className="absolute -left-2 bottom-0 w-full h-3 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-70 transform skew-x-12 z-0"></span>
          </h1>
          <p className="text-gray-300 mt-2 text-sm">
            Build coding skills with daily challenges
          </p>
        </div>
        
        {/* Enhanced sprint intro section with leaderboard */}
        <div className="mb-8 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 p-6 rounded-xl border border-blue-800/40">
          <div className="flex flex-col md:flex-row justify-between">
            {/* Left side: Journey info */}
            <div className="md:w-1/2 mb-6 md:mb-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Your 100-Day Coding Journey</h2>
                  <p className="text-gray-300">Solve one problem every day to build your skills and consistency</p>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white font-medium">Your Progress</div>
                  <div className="text-blue-400 text-sm">Day {currentDay}/100</div>
                </div>
                
                <div className="bg-gray-700 rounded-full h-2 mb-4">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${currentDay}%` }}></div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-700/50 p-2 rounded">
                    <div className="text-green-500 font-bold">{completedDays}</div>
                    <div className="text-gray-400 text-xs">Completed</div>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded">
                    <div className="text-yellow-500 font-bold">1</div>
                    <div className="text-gray-400 text-xs">Streak</div>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded">
                    <div className="text-indigo-500 font-bold">100</div>
                    <div className="text-gray-400 text-xs">Points</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side: Leaderboard */}
            <div className="md:w-1/2 md:pl-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Sprint Leaderboard</h3>
                <Link to="/challenges/leaderboard" className="text-blue-400 text-sm hover:underline">View Full</Link>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
                <div className="px-4 py-2 bg-gray-800 border-b border-gray-700/50 text-xs text-gray-400 flex">
                  <div className="w-12 text-center">Rank</div>
                  <div className="flex-1">User</div>
                  <div className="w-16 text-center">Days</div>
                  <div className="w-16 text-center">Points</div>
                </div>
                
                <div className="divide-y divide-gray-700/50">
                  {/* Top user */}
                  <div className="px-4 py-3 flex items-center bg-yellow-900/20">
                    <div className="w-12 text-center">
                      <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center mx-auto">
                        <span className="text-xs text-yellow-900 font-bold">1</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center mr-2">
                        <span className="text-xs text-white font-bold">JD</span>
                      </div>
                      <span className="font-medium text-white">javadev92</span>
                    </div>
                    <div className="w-16 text-center text-gray-300">84</div>
                    <div className="w-16 text-center text-yellow-400 font-medium">8,420</div>
                  </div>
                  
                  {/* Second user */}
                  <div className="px-4 py-3 flex items-center bg-gray-700/20">
                    <div className="w-12 text-center">
                      <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center mx-auto">
                        <span className="text-xs text-gray-900 font-bold">2</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                        <span className="text-xs text-white font-bold">CS</span>
                      </div>
                      <span className="font-medium text-white">codesmith</span>
                    </div>
                    <div className="w-16 text-center text-gray-300">78</div>
                    <div className="w-16 text-center text-gray-300 font-medium">7,845</div>
                  </div>
                  
                  {/* Third user */}
                  <div className="px-4 py-3 flex items-center bg-orange-900/10">
                    <div className="w-12 text-center">
                      <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center mx-auto">
                        <span className="text-xs text-orange-900 font-bold">3</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center mr-2">
                        <span className="text-xs text-white font-bold">PY</span>
                      </div>
                      <span className="font-medium text-white">pythonista</span>
                    </div>
                    <div className="w-16 text-center text-gray-300">72</div>
                    <div className="w-16 text-center text-gray-300 font-medium">7,230</div>
                  </div>
                  
                  {/* Your rank */}
                  <div className="px-4 py-3 flex items-center bg-blue-900/20 border-2 border-blue-500/30">
                    <div className="w-12 text-center">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mx-auto">
                        <span className="text-xs text-white font-bold">42</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                        <span className="text-xs text-white font-bold">YU</span>
                      </div>
                      <span className="font-medium text-white">You</span>
                    </div>
                    <div className="w-16 text-center text-gray-300">{completedDays}</div>
                    <div className="w-16 text-center text-blue-400 font-medium">100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress stats section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="text-4xl font-bold text-blue-500 mb-2">2%</div>
            <div className="text-sm text-gray-400">Completion</div>
            <div className="mt-2 bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '2%' }}></div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="text-4xl font-bold text-green-500 mb-2">1</div>
            <div className="text-sm text-gray-400">Days Completed</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="text-4xl font-bold text-indigo-500 mb-2">100</div>
            <div className="text-sm text-gray-400">Points Earned</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="text-4xl font-bold text-yellow-500 mb-2">1</div>
            <div className="text-sm text-gray-400">Current Streak</div>
          </div>
        </div>
        
        {/* View toggle section */}
        <div className="mb-6 flex border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium ${activeView === 'cards' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveView('cards')}
          >
            Card View
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeView === 'topics' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveView('topics')}
          >
            Topics
          </button>
        </div>
        
        {/* Card View */}
        {activeView === 'cards' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Sprint Challenge Cards</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {DAILY_CHALLENGES.map((challenge) => (
                <div 
                  key={challenge.day} 
                  className={`bg-gray-800 border rounded-lg overflow-hidden transition-all hover:translate-y-[-4px] ${
                    challenge.completed 
                      ? 'border-green-600/40' 
                      : challenge.isToday
                        ? 'border-blue-600/40'
                        : 'border-gray-700'
                  }`}
                >
                  <div className={`px-4 py-3 flex justify-between items-center ${
                    challenge.isToday ? 'bg-blue-900/30' : 
                    challenge.completed ? 'bg-green-900/30' : 
                    'bg-gray-800'
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xl mr-2`}>
                        {challenge.icon}
                      </div>
                      <div className="font-medium text-white">Day {challenge.day}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      challenge.difficulty === 'Easy' 
                        ? 'bg-green-900/30 text-green-400'
                        : challenge.difficulty === 'Medium'
                          ? 'bg-yellow-900/30 text-yellow-400'
                          : 'bg-red-900/30 text-red-400'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-white mb-2">
                      {challenge.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-3 h-12 overflow-hidden">
                      {challenge.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {challenge.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {challenge.completed ? (
                      <div className="flex items-center justify-between">
                        <div className="text-green-500 text-sm font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {challenge.score} points
                        </div>
                        <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors">
                          Review
                        </button>
                      </div>
                    ) : challenge.isToday ? (
                      <div className="flex items-center justify-between">
                        <div className="text-blue-400 text-xs font-medium">
                          {challenge.timeRemaining}
                        </div>
                        <Link 
                          to={`/challenges/${challenge.day}`}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                        >
                          Solve Now
                        </Link>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm italic">
                        Unlocks on Day {challenge.day}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Topic Cards View */}
        {activeView === 'topics' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Sprint Topics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SPRINT_CATEGORIES.map((category) => (
                <div 
                  key={category.id}
                  className="bg-gradient-to-br rounded-lg p-5 overflow-hidden relative group hover:translate-y-[-4px] transition-all border border-gray-700"
                  style={{backgroundImage: `linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))`}}
                >
                  <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${category.color}`}></div>
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${category.color}`}></div>
                  
                  <div className="relative">
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{category.description}</p>
                    <p className="text-gray-400 text-sm">{category.count} challenges</p>
                    
                    <div className="flex items-center mt-4 text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                      View Challenges
                      <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailySprintPage; 