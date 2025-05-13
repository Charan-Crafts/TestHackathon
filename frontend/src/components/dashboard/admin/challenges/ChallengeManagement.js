import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CodeBracketIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

const ChallengeManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  
  // Mock challenge data
  const [challenges] = useState([
    {
      id: 1,
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "Easy",
      category: "Algorithms",
      tags: ["Array", "Hash Table"],
      createdAt: "2023-04-15",
      status: "active",
      completions: 1245
    },
    {
      id: 2,
      title: "Linked List Cycle",
      description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
      difficulty: "Medium",
      category: "Data Structures",
      tags: ["Linked List", "Two Pointers"],
      createdAt: "2023-05-20",
      status: "active",
      completions: 876
    },
    {
      id: 3,
      title: "Valid Parentheses",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      difficulty: "Easy",
      category: "Data Structures",
      tags: ["Stack", "String"],
      createdAt: "2023-03-10",
      status: "active",
      completions: 1532
    },
    {
      id: 4,
      title: "Binary Tree Level Order Traversal",
      description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
      difficulty: "Medium",
      category: "Data Structures",
      tags: ["Tree", "BFS"],
      createdAt: "2023-06-05",
      status: "draft",
      completions: 0
    },
    {
      id: 5,
      title: "Merge Intervals",
      description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
      difficulty: "Medium",
      category: "Algorithms",
      tags: ["Array", "Sorting"],
      createdAt: "2023-04-25",
      status: "active",
      completions: 943
    },
    {
      id: 6,
      title: "LRU Cache",
      description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
      difficulty: "Hard",
      category: "System Design",
      tags: ["Hash Table", "Linked List", "Design"],
      createdAt: "2023-07-18",
      status: "active",
      completions: 612
    },
    {
      id: 7,
      title: "Word Search",
      description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
      difficulty: "Hard",
      category: "Algorithms",
      tags: ["Array", "Backtracking", "Matrix"],
      createdAt: "2023-06-15",
      status: "active",
      completions: 734
    },
    {
      id: 8,
      title: "Database Design Challenge",
      description: "Design a normalized database schema for an e-commerce application.",
      difficulty: "Hard",
      category: "System Design",
      tags: ["Database", "SQL", "Normalization"],
      createdAt: "2023-08-01",
      status: "draft",
      completions: 0
    }
  ]);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'algorithms', name: 'Algorithms' },
    { id: 'data-structures', name: 'Data Structures' },
    { id: 'system-design', name: 'System Design' },
    { id: 'web-development', name: 'Web Development' },
    { id: 'database', name: 'Database' }
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
    { id: 'a-z', name: 'A-Z' },
    { id: 'z-a', name: 'Z-A' },
    { id: 'most-completed', name: 'Most Completed' }
  ];

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
      if (sortBy === 'a-z') return a.title.localeCompare(b.title);
      if (sortBy === 'z-a') return b.title.localeCompare(a.title);
      if (sortBy === 'most-completed') return b.completions - a.completions;
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

  // Get status class for badges
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-900/30 text-green-300 border-green-500/30';
      case 'draft':
        return 'bg-gray-700 text-gray-300 border-gray-500/30';
      case 'archived':
        return 'bg-red-900/30 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-500/30';
    }
  };

  // Handle delete challenge
  const handleDeleteClick = (challenge) => {
    setChallengeToDelete(challenge);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // Here you would call an API to delete the challenge
    console.log(`Deleting challenge: ${challengeToDelete.id}`);
    setIsDeleteModalOpen(false);
    setChallengeToDelete(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900/70 via-purple-900/40 to-gray-900/70 rounded-xl p-4 backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-lg bg-green-900/50">
                <CodeBracketIcon className="w-8 h-8 text-green-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl text-white font-bold">Challenge Management</h2>
                <p className="text-gray-300 text-sm sm:text-base">Create and manage coding challenges for users</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link 
                to="/dashboard/admin/challenges/create" 
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Create Challenge
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Search challenges by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="flex items-center">
              <FunnelIcon className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-400 mr-2">Filters:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block py-2 px-3 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="block py-2 px-3 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {difficultyLevels.map((difficulty) => (
                <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center ml-auto">
            <ArrowsUpDownIcon className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-400 mr-2">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block py-2 px-3 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                    Title
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300 hidden md:table-cell">
                    Category
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-center text-gray-300">
                    Difficulty
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-center text-gray-300 hidden lg:table-cell">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-center text-gray-300 hidden md:table-cell">
                    Created
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-center text-gray-300 hidden lg:table-cell">
                    Completions
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-right text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {filteredChallenges.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                      No challenges found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredChallenges.map((challenge) => (
                    <tr key={challenge.id} className="hover:bg-gray-800/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-1">
                            <div className="text-sm font-medium text-white">{challenge.title}</div>
                            <div className="text-xs text-gray-400 truncate max-w-xs">{challenge.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-300">{challenge.category}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold border ${getDifficultyClass(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center hidden lg:table-cell">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold border ${getStatusClass(challenge.status)}`}>
                          {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center hidden md:table-cell">
                        <div className="text-sm text-gray-300">{new Date(challenge.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center hidden lg:table-cell">
                        <div className="text-sm text-gray-300">{challenge.completions.toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="text-blue-400 hover:text-blue-300"
                            title="View Challenge"
                            onClick={() => window.open(`/challenges/${challenge.id}`, '_blank')}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <Link 
                            to={`/dashboard/admin/challenges/edit/${challenge.id}`}
                            className="text-green-400 hover:text-green-300"
                            title="Edit Challenge"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button 
                            className="text-red-400 hover:text-red-300"
                            title="Delete Challenge"
                            onClick={() => handleDeleteClick(challenge)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredChallenges.length}</span> of{' '}
              <span className="font-medium">{filteredChallenges.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center text-red-500 mr-4">
                <TrashIcon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Challenge</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">{challengeToDelete?.title}</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeManagement; 