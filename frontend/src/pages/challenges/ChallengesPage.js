import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CodeBracketIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

const ChallengesPage = () => {
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'algorithms', name: 'Algorithms' },
    { id: 'data-structures', name: 'Data Structures' },
    { id: 'system-design', name: 'System Design' },
    { id: 'web-development', name: 'Web Development' },
    { id: 'database', name: 'Database' },
    { id: 'machine-learning', name: 'Machine Learning' }
  ];

  // Difficulty levels for filtering
  const difficultyLevels = [
    { id: 'all', name: 'All Levels' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' }
  ];

  // Sort options
  const sortOptions = [
    { id: 'newest', name: 'Newest First' },
    { id: 'oldest', name: 'Oldest First' },
    { id: 'most-solved', name: 'Most Solved' },
    { id: 'least-solved', name: 'Least Solved' },
    { id: 'a-z', name: 'A-Z' },
    { id: 'z-a', name: 'Z-A' }
  ];
  
  // Fetch challenges
  useEffect(() => {
    // This would be replaced with an actual API call
    setTimeout(() => {
      const mockChallenges = [
        {
          id: 1,
          title: "Two Sum",
          description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          difficulty: "Easy",
          category: "Algorithms",
          tags: ["Array", "Hash Table"],
          solvedCount: 8549,
          totalAttempts: 12000,
          createdAt: "2023-01-15"
        },
        {
          id: 2,
          title: "Reverse Linked List",
          description: "Reverse a singly linked list.",
          difficulty: "Easy",
          category: "Data Structures",
          tags: ["Linked List", "Recursion"],
          solvedCount: 7230,
          totalAttempts: 9800,
          createdAt: "2023-02-22"
        },
        {
          id: 3,
          title: "Valid Parentheses",
          description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
          difficulty: "Easy",
          category: "Algorithms",
          tags: ["String", "Stack"],
          solvedCount: 6120,
          totalAttempts: 10200,
          createdAt: "2023-03-10"
        },
        {
          id: 4,
          title: "Binary Tree Level Order Traversal",
          description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
          difficulty: "Medium",
          category: "Data Structures",
          tags: ["Tree", "BFS"],
          solvedCount: 4230,
          totalAttempts: 7100,
          createdAt: "2023-06-05"
        },
        {
          id: 5,
          title: "Merge Intervals",
          description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
          difficulty: "Medium",
          category: "Algorithms",
          tags: ["Array", "Sorting"],
          solvedCount: 3760,
          totalAttempts: 5900,
          createdAt: "2023-04-25"
        },
        {
          id: 6,
          title: "LRU Cache",
          description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
          difficulty: "Hard",
          category: "System Design",
          tags: ["Hash Table", "Linked List", "Design"],
          solvedCount: 2890,
          totalAttempts: 5200,
          createdAt: "2023-07-18"
        },
        {
          id: 7,
          title: "Word Search",
          description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
          difficulty: "Medium",
          category: "Algorithms",
          tags: ["Array", "Backtracking", "Matrix"],
          solvedCount: 3460,
          totalAttempts: 5900,
          createdAt: "2023-06-15"
        },
        {
          id: 8,
          title: "Database Design Challenge",
          description: "Design a normalized database schema for an e-commerce application.",
          difficulty: "Hard",
          category: "System Design",
          tags: ["Database", "SQL", "Normalization"],
          solvedCount: 1230,
          totalAttempts: 2800,
          createdAt: "2023-08-01"
        },
        {
          id: 9,
          title: "Container With Most Water",
          description: "Given n non-negative integers a1, a2, ..., an, where each represents a point at coordinate (i, ai), find the container that contains the most water.",
          difficulty: "Medium",
          category: "Algorithms",
          tags: ["Array", "Two Pointers", "Greedy"],
          solvedCount: 4120,
          totalAttempts: 7400,
          createdAt: "2023-05-12"
        },
        {
          id: 10,
          title: "Implement Trie (Prefix Tree)",
          description: "Implement a trie with methods for inserting, searching, and finding words with a prefix.",
          difficulty: "Medium",
          category: "Data Structures",
          tags: ["Trie", "Design", "String"],
          solvedCount: 3010,
          totalAttempts: 5100,
          createdAt: "2023-04-08"
        },
        {
          id: 11,
          title: "Median of Two Sorted Arrays",
          description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
          difficulty: "Hard",
          category: "Algorithms",
          tags: ["Array", "Binary Search", "Divide and Conquer"],
          solvedCount: 1890,
          totalAttempts: 5200,
          createdAt: "2023-07-01"
        },
        {
          id: 12,
          title: "Web Authentication System",
          description: "Design and implement a secure authentication system for a web application.",
          difficulty: "Hard",
          category: "Web Development",
          tags: ["Security", "API", "Authentication"],
          solvedCount: 980,
          totalAttempts: 2300,
          createdAt: "2023-07-25"
        }
      ];
      
      setChallenges(mockChallenges);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Filter and sort challenges
  const filteredChallenges = challenges
    .filter(challenge => {
      const matchesSearch = searchQuery === '' || 
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        challenge.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
      
      const matchesDifficulty = selectedDifficulty === 'all' || 
        challenge.difficulty.toLowerCase() === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'most-solved') return b.solvedCount - a.solvedCount;
      if (sortBy === 'least-solved') return a.solvedCount - b.solvedCount;
      if (sortBy === 'a-z') return a.title.localeCompare(b.title);
      if (sortBy === 'z-a') return b.title.localeCompare(a.title);
      return 0;
    });
  
  // Get difficulty class for badges
  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-900/30 text-green-300 border-green-500/30';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'hard':
        return 'bg-red-900/30 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-500/30';
    }
  };
  
  // Format the solve rate
  const formatSolveRate = (solved, attempts) => {
    const rate = (solved / attempts * 100).toFixed(1);
    return `${rate}%`;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-gray-900/70 via-blue-900/40 to-gray-900/70 rounded-xl p-6 backdrop-blur-sm border border-blue-500/30 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-4 p-3 rounded-lg bg-blue-900/50">
                <CodeBracketIcon className="w-10 h-10 text-blue-300" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl text-white font-bold">Coding Challenges</h1>
                <p className="text-gray-300 text-sm md:text-base">Improve your skills with our collection of coding problems</p>
              </div>
            </div>
            <div>
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border-0 bg-transparent placeholder-gray-400 text-white focus:outline-none focus:ring-0 sm:text-sm"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex items-center">
          <FunnelIcon className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-gray-400 mr-2">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block py-2 px-3 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="block py-2 px-3 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {difficultyLevels.map((difficulty) => (
              <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-grow"></div>
        
        {/* Sort dropdown */}
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-300 hover:bg-gray-700"
            onClick={() => setShowSortOptions(!showSortOptions)}
          >
            <ArrowsUpDownIcon className="h-5 w-5" />
            <span>Sort: {sortOptions.find(option => option.id === sortBy)?.name}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
          
          {showSortOptions && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
              <ul className="py-1">
                {sortOptions.map((option) => (
                  <li key={option.id}>
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        sortBy === option.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        setSortBy(option.id);
                        setShowSortOptions(false);
                      }}
                    >
                      {option.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400">
            <p className="text-xl mb-2">No challenges found matching your filters.</p>
            <p>Try adjusting your search or filters to find challenges.</p>
          </div>
        ) : (
          filteredChallenges.map((challenge) => (
            <Link
              key={challenge.id}
              to={`/challenges/${challenge.id}`}
              className="block bg-gray-900 border border-gray-700 rounded-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                  <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getDifficultyClass(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{challenge.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {challenge.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      <span className="text-xs">{tag}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-700">
                  <div>
                    <span className="text-gray-400">Solved by: </span>
                    <span className="text-green-400">{challenge.solvedCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Success Rate: </span>
                    <span className="text-green-400">{formatSolveRate(challenge.solvedCount, challenge.totalAttempts)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      
      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center">
        <nav className="inline-flex shadow-sm -space-x-px" aria-label="Pagination">
          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700">
            <span className="sr-only">Previous</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-900 text-sm font-medium text-white hover:bg-gray-700">
            1
          </button>
          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700">
            <span className="sr-only">Next</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ChallengesPage; 