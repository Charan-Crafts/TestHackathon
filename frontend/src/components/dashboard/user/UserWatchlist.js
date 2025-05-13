import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHackathonById } from '../../../data/hackathons';

const UserWatchlist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [filterType, setFilterType] = useState('all');
  
  useEffect(() => {
    // Load watchlisted hackathons from localStorage
    const fetchWatchlist = async () => {
      try {
        // Get hackathon IDs from localStorage
        const watchlistedHackathonIds = JSON.parse(localStorage.getItem('hackathon_watchlist') || '[]');
        
        // Create mock items for other content types
        const mockItems = [
          { 
            id: 1, 
            type: 'challenge', 
            title: 'Dynamic Programming Master Class', 
            difficulty: 'hard', 
            category: 'Algorithms',
            addedDate: '2 days ago',
            dueDate: 'In 5 days',
            progress: 0,
            thumbnail: 'https://images.unsplash.com/photo-1550645612-83f5d594b671?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            link: '/challenges/dynamic-programming'
          },
          { 
            id: 3, 
            type: 'project', 
            title: 'Cloud-Based Task Manager', 
            difficulty: 'medium', 
            category: 'Web Development',
            addedDate: '3 days ago',
            dueDate: null,
            progress: 15,
            thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            link: '/projects/cloud-task-manager'
          },
          { 
            id: 4, 
            type: 'challenge', 
            title: 'Binary Tree Visualization', 
            difficulty: 'easy', 
            category: 'Data Structures',
            addedDate: '1 day ago',
            dueDate: null,
            progress: 0,
            thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            link: '/challenges/binary-tree-vis'
          },
          { 
            id: 5, 
            type: 'learning', 
            title: 'Advanced React Patterns', 
            difficulty: 'medium', 
            category: 'Frontend',
            addedDate: '5 days ago',
            dueDate: null,
            progress: 45,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            link: '/learning/advanced-react'
          }
        ];
        
        // Get hackathon data for each watchlisted hackathon
        const watchlistedHackathons = watchlistedHackathonIds.map(id => {
          const hackathon = getHackathonById(parseInt(id));
          if (hackathon) {
            return {
              id: hackathon.id,
              type: 'hackathon',
              title: hackathon.name,
              difficulty: 'medium', // Default difficulty
              category: 'Hackathon',
              addedDate: '1 week ago', // Mock date
              dueDate: `Deadline: ${hackathon.registrationDeadline}`,
              progress: 0,
              thumbnail: hackathon.bannerImage || hackathon.logo,
              link: `/hackathon/${hackathon.id}`,
              hackathon: hackathon // Store full hackathon data
            };
          }
          return null;
        }).filter(Boolean); // Remove null items
        
        // Combine watchlisted hackathons with mock items
        setWatchlistItems([...watchlistedHackathons, ...mockItems]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching watchlist items:', error);
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, []);
  
  // Helper functions for styling
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
  
  const getTypeClass = (type) => {
    switch(type.toLowerCase()) {
      case 'challenge':
        return 'bg-indigo-900/30 text-indigo-400 border-indigo-500/50';
      case 'hackathon':
        return 'bg-purple-900/30 text-purple-400 border-purple-500/50';
      case 'project':
        return 'bg-blue-900/30 text-blue-400 border-blue-500/50';
      case 'learning':
        return 'bg-cyan-900/30 text-cyan-400 border-cyan-500/50';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-500/50';
    }
  };

  // Remove item from watchlist
  const removeFromWatchlist = (item) => {
    if (item.type === 'hackathon') {
      // Get current watchlist from localStorage
      const watchlist = JSON.parse(localStorage.getItem('hackathon_watchlist') || '[]');
      // Remove item
      const updatedWatchlist = watchlist.filter(id => id !== item.id.toString());
      // Update localStorage
      localStorage.setItem('hackathon_watchlist', JSON.stringify(updatedWatchlist));
    }
    
    // Update state
    setWatchlistItems(watchlistItems.filter(i => !(i.id === item.id && i.type === item.type)));
  };
  
  // Filter items by type
  const filteredItems = filterType === 'all' 
    ? watchlistItems 
    : watchlistItems.filter(item => item.type === filterType);
  
  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading watchlist...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <svg className="w-6 h-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Your Watchlist
        </h1>
        <p className="text-gray-400 mb-4">Track and manage your saved items from across the platform.</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">Filter by:</span>
          <select 
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-gray-300 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500/30"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="challenge">Challenges</option>
            <option value="hackathon">Hackathons</option>
            <option value="project">Projects</option>
            <option value="learning">Learning Resources</option>
          </select>
        </div>
        <div className="text-gray-400 text-sm">
          {filteredItems.length} items saved
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-indigo-900/5">
        <div className="px-6 py-4 border-b border-gray-700/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved Items
            </h2>
          </div>
        </div>
        
        <div className="overflow-hidden">
          {filteredItems.length > 0 ? (
            <div className="divide-y divide-gray-700/30">
              {filteredItems.map((item) => (
                <div key={`${item.type}-${item.id}`} className="p-4 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-16 h-16 rounded object-cover shadow-md border border-gray-700/50" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link to={item.link} className="text-white font-medium hover:text-blue-400 transition-colors block">
                        {item.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${getTypeClass(item.type)}`}>
                          {item.type}
                        </span>
                        {item.type === 'hackathon' && item.hackathon && (
                          <span className="text-xs text-gray-400">
                            {item.hackathon.dates}
                          </span>
                        )}
                        {item.type !== 'hackathon' && (
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${getDifficultyClass(item.difficulty)}`}>
                            {item.difficulty}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{item.category}</span>
                        {item.dueDate && (
                          <span className="text-xs text-red-400 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {item.dueDate}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">Added {item.addedDate}</span>
                      </div>
                      
                      {item.progress > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center text-xs">
                            <div className="flex-1 h-1.5 bg-gray-700/50 rounded-full overflow-hidden mr-2">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-400">{item.progress}% complete</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex flex-col space-y-2">
                      <Link 
                        to={item.type === 'hackathon' ? `/registration/${item.id}` : item.link}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium flex items-center justify-center whitespace-nowrap transition-colors">
                        {item.type === 'hackathon' ? 'Register' : item.progress > 0 ? 'Continue' : 'Start'} 
                      </Link>
                      <button 
                        onClick={() => removeFromWatchlist(item)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-sm flex items-center justify-center whitespace-nowrap transition-colors">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-gray-500 mb-4">Your watchlist is empty</p>
              <Link to="/hackathons" className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Browse hackathons to add to your watchlist
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserWatchlist; 