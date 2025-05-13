import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for challenge cards
const CHALLENGE_CATEGORIES = [
  {
    id: 'algorithms',
    name: 'Algorithms',
    icon: '🧮',
    color: 'from-blue-900/30 to-indigo-900/30',
    borderColor: 'border-blue-800/40',
    count: 87
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    icon: '📊',
    color: 'from-green-900/30 to-teal-900/30',
    borderColor: 'border-green-800/40',
    count: 64
  },
  {
    id: 'system-design',
    name: 'System Design',
    icon: '🏗️',
    color: 'from-purple-900/30 to-pink-900/30',
    borderColor: 'border-purple-800/40',
    count: 42
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    icon: '🌐',
    color: 'from-orange-900/30 to-red-900/30',
    borderColor: 'border-orange-800/40',
    count: 56
  }
];

function ChallengeCards() {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Challenge Cards</h2>
          <p className="text-gray-300">Browse challenges by category or difficulty</p>
        </div>
        <Link 
          to="/challenges/cards"
          className="text-blue-400 text-sm hover:text-blue-300 flex items-center"
        >
          View All
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CHALLENGE_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to={`/challenges/cards/${category.id}`}
            className="bg-gradient-to-br rounded-lg p-5 overflow-hidden relative group hover:translate-y-[-4px] transition-all"
            style={{backgroundImage: `linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))`}}
          >
            <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${category.color}`}></div>
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${category.color}`}></div>
            
            <div className="relative">
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
              <p className="text-gray-400 text-sm">{category.count} challenges</p>
              
              <div className="flex items-center mt-4 text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                Explore
                <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="bg-gray-800/50 rounded-lg p-4 flex items-start">
          <div className="rounded-full bg-blue-900/30 p-2 mr-4">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-1">Weekly Updates</h4>
            <p className="text-xs text-gray-400">
              Challenge Cards are updated every Monday with new problems across different categories and difficulty levels
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeCards; 