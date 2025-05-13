import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

const ChallengeList = () => {
  // State for challenges
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    status: '',
  });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [challengesPerPage] = useState(10);
  
  // State for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  
  // Fetch challenges
  useEffect(() => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      try {
        // This would be replaced with an actual API call
        const mockChallenges = [
          {
            id: '1',
            title: 'Two Sum',
            difficulty: 'Easy',
            category: 'Algorithms',
            tags: ['Array', 'Hash Table'],
            status: 'active',
            createdAt: '2023-01-15T12:00:00.000Z',
            submissions: 1243,
            successRate: 68,
          },
          {
            id: '2',
            title: 'Valid Parentheses',
            difficulty: 'Easy',
            category: 'Data Structures',
            tags: ['Stack', 'String'],
            status: 'active',
            createdAt: '2023-01-20T10:30:00.000Z',
            submissions: 987,
            successRate: 72,
          },
          {
            id: '3',
            title: 'Merge Two Sorted Lists',
            difficulty: 'Easy',
            category: 'Data Structures',
            tags: ['Linked List', 'Recursion'],
            status: 'active',
            createdAt: '2023-01-25T14:45:00.000Z',
            submissions: 856,
            successRate: 65,
          },
          {
            id: '4',
            title: 'Add Two Numbers',
            difficulty: 'Medium',
            category: 'Algorithms',
            tags: ['Linked List', 'Math'],
            status: 'active',
            createdAt: '2023-02-05T09:15:00.000Z',
            submissions: 742,
            successRate: 53,
          },
          {
            id: '5',
            title: 'LRU Cache',
            difficulty: 'Medium',
            category: 'System Design',
            tags: ['Hash Table', 'Linked List', 'Design'],
            status: 'active',
            createdAt: '2023-02-10T16:20:00.000Z',
            submissions: 531,
            successRate: 41,
          },
          {
            id: '6',
            title: 'Trapping Rain Water',
            difficulty: 'Hard',
            category: 'Algorithms',
            tags: ['Array', 'Two Pointers', 'Dynamic Programming'],
            status: 'active',
            createdAt: '2023-02-18T11:10:00.000Z',
            submissions: 412,
            successRate: 32,
          },
          {
            id: '7',
            title: 'Word Search II',
            difficulty: 'Hard',
            category: 'Algorithms',
            tags: ['Backtracking', 'Trie'],
            status: 'draft',
            createdAt: '2023-03-01T08:30:00.000Z',
            submissions: 0,
            successRate: 0,
          },
          {
            id: '8',
            title: 'Database Normalization',
            difficulty: 'Medium',
            category: 'Database',
            tags: ['SQL', 'Normalization'],
            status: 'draft',
            createdAt: '2023-03-10T13:45:00.000Z',
            submissions: 0,
            successRate: 0,
          },
          {
            id: '9',
            title: 'React Counter App',
            difficulty: 'Easy',
            category: 'Web Development',
            tags: ['React', 'JavaScript', 'Hooks'],
            status: 'archived',
            createdAt: '2023-01-05T10:00:00.000Z',
            submissions: 231,
            successRate: 88,
          },
          {
            id: '10',
            title: 'K-Means Clustering',
            difficulty: 'Hard',
            category: 'Machine Learning',
            tags: ['Clustering', 'Unsupervised Learning'],
            status: 'active',
            createdAt: '2023-03-20T14:30:00.000Z',
            submissions: 189,
            successRate: 28,
          },
        ];
        
        setChallenges(mockChallenges);
        setFilteredChallenges(mockChallenges);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch challenges. Please try again later.');
        setLoading(false);
      }
    }, 1000);
  }, []);
  
  // Filter challenges when search term or filters change
  useEffect(() => {
    let result = [...challenges];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(challenge => 
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply other filters
    if (filters.difficulty) {
      result = result.filter(challenge => challenge.difficulty === filters.difficulty);
    }
    
    if (filters.category) {
      result = result.filter(challenge => challenge.category === filters.category);
    }
    
    if (filters.status) {
      result = result.filter(challenge => challenge.status === filters.status);
    }
    
    setFilteredChallenges(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, challenges]);
  
  // Get current challenges for pagination
  const indexOfLastChallenge = currentPage * challengesPerPage;
  const indexOfFirstChallenge = indexOfLastChallenge - challengesPerPage;
  const currentChallenges = filteredChallenges.slice(indexOfFirstChallenge, indexOfLastChallenge);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      difficulty: '',
      category: '',
      status: '',
    });
  };
  
  // Handle challenge deletion
  const handleDelete = (challengeId) => {
    // Here you would make an API call to delete the challenge
    console.log(`Deleting challenge with ID: ${challengeId}`);
    
    // Update state to remove the challenge
    setChallenges(challenges.filter(challenge => challenge.id !== challengeId));
    setFilteredChallenges(filteredChallenges.filter(challenge => challenge.id !== challengeId));
    setDeleteConfirmation(null);
  };
  
  // Get unique categories and difficulties for filter options
  const categories = [...new Set(challenges.map(challenge => challenge.category))];
  const difficulties = [...new Set(challenges.map(challenge => challenge.difficulty))];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500/30 text-red-300 p-4 rounded-lg">
        <p>{error}</p>
        <button 
          className="mt-2 bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900/70 via-purple-900/40 to-gray-900/70 rounded-xl p-4 backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-lg bg-blue-900/50">
                <CodeBracketIcon className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl text-white font-bold">Coding Challenges</h2>
                <p className="text-gray-300 text-sm sm:text-base">Manage your coding challenges</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link 
                to="/dashboard/admin/challenges/create" 
                className="inline-flex items-center bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Challenge
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search challenges by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center ${
                showFilters ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-300 border-gray-700'
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
            
            {(searchTerm || filters.difficulty || filters.category || filters.status) && (
              <button
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-red-400 text-sm font-medium flex items-center hover:bg-gray-700"
                onClick={resetFilters}
              >
                <XCircleIcon className="h-4 w-4 mr-2" />
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              >
                <option value="">All Difficulties</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Challenge List */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
        {filteredChallenges.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-300">No challenges found. Try adjusting your filters.</p>
            <button
              className="mt-2 px-3 py-2 bg-blue-600 rounded-md text-white text-sm"
              onClick={resetFilters}
            >
              <ArrowPathIcon className="h-4 w-4 inline mr-1" />
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Challenge
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Submissions
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentChallenges.map((challenge) => (
                    <tr key={challenge.id} className="hover:bg-gray-800/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <div>
                            <div className="text-sm font-medium text-white">{challenge.title}</div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {challenge.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-900/30 text-purple-300 border border-purple-500/30"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            challenge.difficulty === 'Easy'
                              ? 'bg-green-900/50 text-green-300'
                              : challenge.difficulty === 'Medium'
                                ? 'bg-yellow-900/50 text-yellow-300'
                                : 'bg-red-900/50 text-red-300'
                          }`}
                        >
                          {challenge.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{challenge.category}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {challenge.status === 'active' ? (
                          <div>
                            <div className="text-sm text-gray-300">{challenge.submissions} submissions</div>
                            <div className="flex items-center mt-1">
                              <div className="w-16 bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    challenge.successRate >= 70
                                      ? 'bg-green-500'
                                      : challenge.successRate >= 40
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                  }`}
                                  style={{ width: `${challenge.successRate}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-400 ml-2">{challenge.successRate}% success</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">-</div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            challenge.status === 'active'
                              ? 'bg-green-900/30 text-green-300'
                              : challenge.status === 'draft'
                                ? 'bg-blue-900/30 text-blue-300'
                                : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {challenge.status === 'active' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
                          {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/dashboard/admin/challenges/preview/${challenge.id}`}
                            className="text-blue-400 hover:text-blue-300"
                            title="Preview"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/dashboard/admin/challenges/edit/${challenge.id}`}
                            className="text-yellow-400 hover:text-yellow-300"
                            title="Edit"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirmation(challenge.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredChallenges.length > challengesPerPage && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      Showing <span className="font-medium">{indexOfFirstChallenge + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastChallenge, filteredChallenges.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredChallenges.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium ${
                          currentPage === 1
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: Math.ceil(filteredChallenges.length / challengesPerPage) }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                              ? 'z-10 bg-blue-600 border-blue-500 text-white'
                              : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(Math.ceil(filteredChallenges.length / challengesPerPage), currentPage + 1))}
                        disabled={currentPage === Math.ceil(filteredChallenges.length / challengesPerPage)}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium ${
                          currentPage === Math.ceil(filteredChallenges.length / challengesPerPage)
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this challenge? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-600"
                onClick={() => setDeleteConfirmation(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={() => handleDelete(deleteConfirmation)}
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

export default ChallengeList; 