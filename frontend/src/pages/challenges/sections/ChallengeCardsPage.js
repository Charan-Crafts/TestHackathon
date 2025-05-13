import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../../components/common/LoadingIndicator';

// Mock data for challenges
const MOCK_CHALLENGES = [
  {
    id: 1,
    title: 'Binary Search Implementation',
    description: 'Implement a binary search algorithm that finds an element in a sorted array.',
    difficulty: 'Medium',
    tags: ['Algorithms', 'Searching', 'Arrays'],
    successRate: '76%',
    rating: 4.5,
    solved: false,
    category: 'Algorithms'
  },
  {
    id: 2,
    title: 'Linked List Cycle Detection',
    description: 'Detect if a linked list has a cycle using Floyd\'s Tortoise and Hare algorithm.',
    difficulty: 'Medium',
    tags: ['Data Structures', 'Linked Lists', 'Two Pointers'],
    successRate: '68%',
    rating: 4.2,
    solved: true,
    category: 'Data Structures'
  },
  {
    id: 3,
    title: 'Valid Parentheses',
    description: 'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    successRate: '82%',
    rating: 4.7,
    solved: false,
    category: 'Data Structures'
  },
  {
    id: 4,
    title: 'LRU Cache',
    description: 'Design and implement a data structure for Least Recently Used (LRU) cache.',
    difficulty: 'Hard',
    tags: ['Design', 'Hash Table', 'Linked List'],
    successRate: '41%',
    rating: 4.8,
    solved: false,
    category: 'System Design'
  },
  {
    id: 5,
    title: 'Merge Intervals',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    difficulty: 'Medium',
    tags: ['Arrays', 'Sorting'],
    successRate: '64%',
    rating: 4.3,
    solved: true,
    category: 'Algorithms'
  },
  {
    id: 6,
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    tags: ['Arrays', 'Hash Table'],
    successRate: '89%',
    rating: 4.6,
    solved: true,
    category: 'Algorithms'
  },
  {
    id: 7,
    title: 'Word Break',
    description: 'Given a string s and a dictionary of strings wordDict, determine if s can be segmented into a space-separated sequence of dictionary words.',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Trie', 'String'],
    successRate: '57%',
    rating: 4.4,
    solved: false,
    category: 'Dynamic Programming'
  },
  {
    id: 8,
    title: 'Course Schedule',
    description: 'There are a total of numCourses courses you have to take. Check if it\'s possible to finish all courses given the prerequisites list.',
    difficulty: 'Medium',
    tags: ['Graph', 'DFS', 'BFS', 'Topological Sort'],
    successRate: '52%',
    rating: 4.5,
    solved: false,
    category: 'Graph Theory'
  },
  {
    id: 9,
    title: 'Trapping Rain Water',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    difficulty: 'Hard',
    tags: ['Arrays', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    successRate: '37%',
    rating: 4.9,
    solved: false,
    category: 'Dynamic Programming'
  },
  {
    id: 10,
    title: 'Serialize and Deserialize Binary Tree',
    description: 'Design an algorithm to serialize and deserialize a binary tree.',
    difficulty: 'Hard',
    tags: ['Tree', 'DFS', 'BFS', 'Design'],
    successRate: '45%',
    rating: 4.7,
    solved: false,
    category: 'Data Structures'
  }
];

// Categories for filtering
const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'algorithms', name: 'Algorithms' },
  { id: 'data-structures', name: 'Data Structures' },
  { id: 'dynamic-programming', name: 'Dynamic Programming' },
  { id: 'graph-theory', name: 'Graph Theory' },
  { id: 'system-design', name: 'System Design' }
];

// Difficulty levels for filtering
const DIFFICULTY_LEVELS = [
  { id: 'all', name: 'All Levels' },
  { id: 'easy', name: 'Easy' },
  { id: 'medium', name: 'Medium' },
  { id: 'hard', name: 'Hard' }
];

function ChallengeCardsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setChallenges(MOCK_CHALLENGES);
      setIsLoading(false);
      
      // Trigger fade-in animations
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort challenges
  const filteredChallenges = challenges
    .filter(challenge => {
      const matchesCategory = selectedCategory === 'all' || 
                           challenge.category.toLowerCase() === selectedCategory.replace('-', ' ');
      const matchesDifficulty = selectedDifficulty === 'all' || 
                             challenge.difficulty.toLowerCase() === selectedDifficulty;
      const matchesSearch = searchQuery === '' || 
                          challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesDifficulty && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'success-rate') return parseInt(b.successRate) - parseInt(a.successRate);
      return 0;
    });

  // Loading spinner
  if (isLoading) {
    return (
      <LoadingIndicator 
        type="scanning" 
        message="Please wait..." 
      />
    );
  }

  // Get difficulty class
  const getDifficultyClass = (difficulty) => {
    switch(difficulty.toLowerCase()) {
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

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-purple-900/20 to-gray-900 py-12 relative">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero section */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 relative inline-block">
            <span className="relative z-10">Challenge <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Cards</span></span>
            <span className="absolute -left-2 bottom-0 w-full h-3 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70 transform skew-x-12 z-0"></span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm">
            Solve targeted challenges to enhance your programming skills
          </p>
        </div>
        
        {/* Info section */}
        <div className={`mb-12 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
          <div className="bg-gradient-to-r from-indigo-900/40 via-blue-900/30 to-indigo-900/40 p-8 rounded-xl border border-indigo-800/40 backdrop-blur-sm shadow-lg shadow-indigo-900/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-800/70 transition-colors border border-gray-700/50 hover:border-indigo-700/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-blue-200 shadow-lg shadow-blue-900/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Multiple Categories</div>
                  <div className="text-xs text-gray-400">From algorithms to system design</div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-800/70 transition-colors border border-gray-700/50 hover:border-green-700/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-green-200 shadow-lg shadow-green-900/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">All Difficulty Levels</div>
                  <div className="text-xs text-gray-400">Easy to hard challenges</div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-800/70 transition-colors border border-gray-700/50 hover:border-purple-700/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-purple-200 shadow-lg shadow-purple-900/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Detailed Solutions</div>
                  <div className="text-xs text-gray-400">Learn from comprehensive explanations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters and search */}
        <div className={`mb-10 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
          <div className="bg-gradient-to-r from-gray-800/60 via-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 shadow-lg shadow-purple-900/5">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Challenges
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search Challenges</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by title or description..."
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-900/80 border border-gray-700 hover:border-indigo-600/50 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white transition-colors shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2.5 appearance-none bg-gray-900/80 border border-gray-700 hover:border-indigo-600/50 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white transition-colors shadow-inner pr-10"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2.5 appearance-none bg-gray-900/80 border border-gray-700 hover:border-indigo-600/50 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white transition-colors shadow-inner pr-10"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                  >
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2.5 appearance-none bg-gray-900/80 border border-gray-700 hover:border-indigo-600/50 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white transition-colors shadow-inner pr-10"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rating</option>
                    <option value="success-rate">Success Rate</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results message */}
        <div className={`mb-6 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
          <div className="text-gray-400 text-sm px-4 py-3 bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/50 inline-block">
            Showing <span className="text-white font-medium">{filteredChallenges.length}</span> of <span className="text-white font-medium">{challenges.length}</span> challenges
            {selectedCategory !== 'all' && (
              <span> in <span className="text-indigo-400 font-medium">{CATEGORIES.find(c => c.id === selectedCategory)?.name}</span></span>
            )}
            {selectedDifficulty !== 'all' && (
              <span> with <span className="text-indigo-400 font-medium">{selectedDifficulty}</span> difficulty</span>
            )}
          </div>
        </div>
        
        {/* Challenge cards */}
        <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '500ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {filteredChallenges.map((challenge) => (
              <div 
                key={challenge.id} 
                className={`bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border ${
                  challenge.solved ? 'border-green-700/50' : 'border-gray-700/50'
                } hover:border-indigo-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-900/10 group`}
              >
                <div className="p-6 relative">
                  {/* Glow effect for solved challenges */}
                  {challenge.solved && (
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl"></div>
                  )}
                
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full border ${
                        getDifficultyClass(challenge.difficulty)
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    
                    {challenge.solved && (
                      <span className="inline-flex items-center text-green-400 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Solved
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-indigo-300 transition-colors">{challenge.title}</h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{challenge.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {challenge.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="inline-block px-2 py-1 text-xs bg-gray-900/70 text-indigo-300 rounded-full border border-indigo-800/30 hover:border-indigo-600/50 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white">{challenge.rating}</span>
                    </div>
                    
                    <div className="text-gray-400">
                      Success rate: <span className="text-indigo-300">{challenge.successRate}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-700/50">
                    <Link
                      to={`/challenges/${challenge.id}`}
                      className="block w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg text-center font-medium transition-colors shadow-lg shadow-indigo-900/30"
                    >
                      Solve Challenge
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className={`flex justify-center transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
            <div className="inline-flex rounded-lg shadow-lg shadow-purple-900/5 bg-gradient-to-r from-gray-800/60 via-gray-900/80 to-gray-800/60 backdrop-blur-sm p-1.5 border border-gray-700/50">
              <button className="px-4 py-2.5 text-gray-400 hover:text-white rounded-md transition-colors" disabled>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-md shadow-md shadow-purple-900/20">
                1
              </button>
              <button className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors">
                2
              </button>
              <button className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors">
                3
              </button>
              <button className="px-4 py-2.5 text-gray-400 hover:text-white rounded-md transition-colors">
                <span className="flex items-center">
                  Next
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeCardsPage; 