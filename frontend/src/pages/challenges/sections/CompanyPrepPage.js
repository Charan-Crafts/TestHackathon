import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingIndicator from '../../../components/common/LoadingIndicator';

// Mock companies data
const COMPANIES = [
  {
    id: 'google',
    name: 'Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png',
    description: 'Google LLC is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics.',
    numChallenges: 42,
    difficulty: 'Hard',
    topics: ['Arrays', 'Dynamic Programming', 'System Design', 'Trees & Graphs'],
    interviewStages: ['Phone Screen', 'Technical Coding', 'System Design', 'Behavioral'],
    successRate: '18%'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
    description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.',
    numChallenges: 36,
    difficulty: 'Medium',
    topics: ['Arrays', 'Sorting', 'Linked Lists', 'OOP Design'],
    interviewStages: ['Online Assessment', 'Phone Screen', 'Onsite Coding', 'Behavioral'],
    successRate: '24%'
  },
  {
    id: 'facebook',
    name: 'Meta',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/800px-Meta_Platforms_Inc._logo.svg.png',
    description: 'Meta Platforms, Inc., doing business as Meta and formerly named Facebook, Inc., is an American multinational technology conglomerate based in Menlo Park, California.',
    numChallenges: 38,
    difficulty: 'Hard',
    topics: ['Graph Algorithms', 'Dynamic Programming', 'System Design', 'Arrays & Strings'],
    interviewStages: ['Phone Screen', 'Technical Interview', 'System Design', 'Behavioral'],
    successRate: '15%'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/800px-Microsoft_logo.svg.png',
    description: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, personal computers, and related services.',
    numChallenges: 45,
    difficulty: 'Medium',
    topics: ['Trees & Graphs', 'Dynamic Programming', 'Design Patterns', 'Problem Solving'],
    interviewStages: ['Phone Screen', 'Online Assessment', 'Onsite Coding', 'Behavioral'],
    successRate: '22%'
  },
  {
    id: 'apple',
    name: 'Apple',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png',
    description: 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services.',
    numChallenges: 30,
    difficulty: 'Medium',
    topics: ['iOS Development', 'Algorithms', 'System Design', 'Problem Solving'],
    interviewStages: ['Phone Screen', 'Technical Interview', 'System Design', 'Behavioral'],
    successRate: '20%'
  }
];

// Mock challenges for a company
const COMPANY_CHALLENGES = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    solved: true
  },
  {
    id: 2,
    title: 'LRU Cache',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Linked List', 'Design'],
    solved: false
  },
  {
    id: 3,
    title: 'Minimum Spanning Tree',
    difficulty: 'Hard',
    tags: ['Graph', 'Union Find', 'Minimum Spanning Tree'],
    solved: false
  },
  {
    id: 4,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    solved: true
  },
  {
    id: 5,
    title: 'Design Search Autocomplete System',
    difficulty: 'Hard',
    tags: ['Design', 'Trie', 'String'],
    solved: false
  }
];

// Mock resources for a company
const COMPANY_RESOURCES = [
  {
    id: 1,
    title: 'Top Google Interview Questions',
    type: 'Article',
    source: 'Leetcode'
  },
  {
    id: 2,
    title: 'How to Prepare for Google Interviews',
    type: 'Video',
    source: 'YouTube'
  },
  {
    id: 3,
    title: 'System Design for Google',
    type: 'Course',
    source: 'Educative'
  },
  {
    id: 4,
    title: 'Google Interview Experience',
    type: 'Blog Post',
    source: 'Medium'
  }
];

function CompanyPrepPage() {
  const { companyId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate loading data based on companyId
    const timer = setTimeout(() => {
      const company = COMPANIES.find(c => c.id === companyId) || COMPANIES[0];
      setSelectedCompany(company);
      setChallenges(COMPANY_CHALLENGES);
      setResources(COMPANY_RESOURCES);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [companyId]);

  if (isLoading) {
    return (
      <LoadingIndicator 
        type="scanning" 
        message="Please wait..." 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-purple-900/20 to-gray-900 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 relative inline-block">
            <span className="relative z-10">Company <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Prep</span></span>
            <span className="absolute -left-2 bottom-0 w-full h-3 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70 transform skew-x-12 z-0"></span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm">
            Practice with company-specific interview questions
          </p>
        </div>

        {/* Company header */}
        <div className="mb-12 bg-gradient-to-r from-gray-800/60 via-gray-900/80 to-gray-800/60 rounded-xl p-8 backdrop-blur-sm border border-gray-700/50 shadow-lg shadow-purple-900/5">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-shrink-0 flex justify-center">
              <div className="w-32 h-32 rounded-xl bg-white p-4 shadow-lg flex items-center justify-center">
                <img src={selectedCompany.logo} alt={`${selectedCompany.name} logo`} className="max-w-full max-h-full" />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedCompany.name}</h2>
              <p className="text-gray-300 mb-4">{selectedCompany.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-900/20 p-3 rounded-lg border border-indigo-800/40 group hover:border-indigo-600/50 transition-colors">
                  <div className="text-sm text-gray-400 group-hover:text-indigo-300 transition-colors">Challenges</div>
                  <div className="text-xl font-semibold text-white">{selectedCompany.numChallenges}</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 p-3 rounded-lg border border-purple-800/40 group hover:border-purple-600/50 transition-colors">
                  <div className="text-sm text-gray-400 group-hover:text-purple-300 transition-colors">Difficulty</div>
                  <div className="text-xl font-semibold text-white">{selectedCompany.difficulty}</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-900/20 p-3 rounded-lg border border-blue-800/40 group hover:border-blue-600/50 transition-colors">
                  <div className="text-sm text-gray-400 group-hover:text-blue-300 transition-colors">Success Rate</div>
                  <div className="text-xl font-semibold text-white">{selectedCompany.successRate}</div>
                </div>
                
                <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-900/20 p-3 rounded-lg border border-cyan-800/40 group hover:border-cyan-600/50 transition-colors">
                  <div className="text-sm text-gray-400 group-hover:text-cyan-300 transition-colors">Interview Stages</div>
                  <div className="text-xl font-semibold text-white">{selectedCompany.interviewStages.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div>
          <div className="bg-gradient-to-r from-gray-800/60 via-gray-900/80 to-gray-800/60 border border-gray-700/50 rounded-xl shadow-lg shadow-purple-900/5 mb-8 p-1">
            <div className="flex flex-wrap">
              <button
                className={`py-3 px-6 rounded-lg focus:outline-none ${
                  activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white font-medium shadow-md' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Overview
                </div>
              </button>
              <button
                className={`py-3 px-6 rounded-lg focus:outline-none ${
                  activeTab === 'challenges' 
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white font-medium shadow-md' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`}
                onClick={() => setActiveTab('challenges')}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                  Challenges
                </div>
              </button>
              <button
                className={`py-3 px-6 rounded-lg focus:outline-none ${
                  activeTab === 'resources' 
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white font-medium shadow-md' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`}
                onClick={() => setActiveTab('resources')}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Resources
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mb-12 relative" style={{ minHeight: '600px' }}>
          {/* Overview Tab */}
          <div className={`${activeTab === 'overview' ? 'relative opacity-100 visible' : 'absolute inset-0 opacity-0 invisible'}`}>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Interview Process
            </h3>
            <div className="bg-gradient-to-r from-gray-800/60 via-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8 shadow-lg shadow-purple-900/5">
              <div className="relative">
                {selectedCompany.interviewStages.map((stage, index) => (
                  <div key={index} className="mb-8 last:mb-0 relative group">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center z-10 relative text-white font-bold shadow-lg shadow-indigo-900/40 group-hover:scale-110 transition-transform duration-300">
                          {index + 1}
                        </div>
                        {index < selectedCompany.interviewStages.length - 1 && (
                          <div className="w-px h-full bg-gradient-to-b from-indigo-500/50 to-purple-600/20 absolute top-10 bottom-0 left-5"></div>
                        )}
                      </div>
                      <div className="ml-6">
                        <h4 className="text-lg font-medium text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">{stage}</h4>
                        <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700/70 hover:border-indigo-700/50 transition-colors group-hover:bg-gray-800 shadow-inner">
                          <p className="text-gray-300">
                            {stage === 'Phone Screen' && "A 30-45 minute technical phone interview focusing on basic problem-solving, data structures, and coding skills."}
                            {stage === 'Technical Coding' && "A 60 minute whiteboard coding interview where you'll solve 1-2 algorithmic problems while explaining your approach."}
                            {stage === 'System Design' && "A 45-60 minute interview focused on designing scalable systems architecture, discussing tradeoffs, and making design decisions."}
                            {stage === 'Behavioral' && "A 45 minute interview covering your past experiences, teamwork, leadership, and cultural fit."}
                            {stage === 'Online Assessment' && "A timed online coding assessment with 2-3 problems to solve within a fixed time limit."}
                            {stage === 'Onsite Coding' && "A series of in-person coding interviews where you'll solve algorithm and data structure problems on a whiteboard."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Common Topics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {selectedCompany.topics.map((topic, index) => (
                <div key={index} 
                  className="bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/50 rounded-xl p-5 flex flex-col items-center text-center shadow-lg transform hover:scale-[1.02] transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-900/80 to-purple-900/80 flex items-center justify-center mb-3 shadow-lg shadow-indigo-900/20">
                    <svg className="w-7 h-7 text-indigo-300 group-hover:text-indigo-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-medium text-white mb-2 group-hover:text-indigo-300 transition-colors">{topic}</h4>
                  <p className="text-gray-400 text-sm">Focus area for {selectedCompany.name} interviews</p>
                </div>
              ))}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Tips for Success
            </h3>
            <div className="bg-gradient-to-r from-gray-800/60 via-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg shadow-purple-900/5">
              <ul className="space-y-4">
                <li className="flex items-start transform hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500/30 to-green-700/30 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">Study {selectedCompany.name}'s core products and technologies before your interview</span>
                </li>
                <li className="flex items-start transform hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500/30 to-green-700/30 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">Practice explaining your thought process clearly while coding</span>
                </li>
                <li className="flex items-start transform hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500/30 to-green-700/30 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">Review company-specific challenges and practice similar problems</span>
                </li>
                <li className="flex items-start transform hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500/30 to-green-700/30 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">Prepare stories about past projects that demonstrate your technical skills and impact</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Challenges Tab */}
          <div className={`${activeTab === 'challenges' ? 'relative opacity-100 visible' : 'absolute inset-0 opacity-0 invisible'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
                Popular {selectedCompany.name} Challenges
              </h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">Filter:</span>
                <select className="bg-gray-800/90 text-white border border-gray-700 hover:border-indigo-500/50 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner transition-colors">
                  <option>All Levels</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-800/60 via-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-lg shadow-purple-900/5">
              <div className="divide-y divide-gray-700/50">
                {challenges.map((challenge, index) => (
                  <div 
                    key={challenge.id} 
                    className="p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg shadow-md flex items-center justify-center mr-4 ${
                          challenge.difficulty === 'Easy' ? 'bg-gradient-to-br from-green-600/30 to-green-800/30 text-green-400 border border-green-600/30' :
                          challenge.difficulty === 'Medium' ? 'bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 text-yellow-400 border border-yellow-600/30' :
                          'bg-gradient-to-br from-red-600/30 to-red-800/30 text-red-400 border border-red-600/30'
                        }`}>
                          {challenge.difficulty.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-white group-hover:text-indigo-300 hover:text-indigo-300 transition-colors">{challenge.title}</h4>
                          <div className="flex flex-wrap mt-1.5">
                            {challenge.tags.map((tag, idx) => {
                              // Define different colors for different tags
                              let tagColor;
                              switch(tag.toLowerCase()) {
                                case 'array':
                                  tagColor = 'bg-blue-900/40 text-blue-300 border-blue-500/40 hover:border-blue-500/70';
                                  break;
                                case 'hash table':
                                  tagColor = 'bg-green-900/40 text-green-300 border-green-500/40 hover:border-green-500/70';
                                  break;
                                case 'string':
                                  tagColor = 'bg-yellow-900/40 text-yellow-300 border-yellow-500/40 hover:border-yellow-500/70';
                                  break;
                                case 'linked list':
                                  tagColor = 'bg-purple-900/40 text-purple-300 border-purple-500/40 hover:border-purple-500/70';
                                  break;
                                case 'design':
                                  tagColor = 'bg-pink-900/40 text-pink-300 border-pink-500/40 hover:border-pink-500/70';
                                  break;
                                case 'graph':
                                  tagColor = 'bg-indigo-900/40 text-indigo-300 border-indigo-500/40 hover:border-indigo-500/70';
                                  break;
                                case 'sliding window':
                                  tagColor = 'bg-cyan-900/40 text-cyan-300 border-cyan-500/40 hover:border-cyan-500/70';
                                  break;
                                case 'trie':
                                  tagColor = 'bg-orange-900/40 text-orange-300 border-orange-500/40 hover:border-orange-500/70';
                                  break;
                                case 'union find':
                                  tagColor = 'bg-teal-900/40 text-teal-300 border-teal-500/40 hover:border-teal-500/70';
                                  break;
                                case 'minimum spanning tree':
                                  tagColor = 'bg-red-900/40 text-red-300 border-red-500/40 hover:border-red-500/70';
                                  break;
                                default:
                                  tagColor = 'bg-gray-900/80 text-gray-300 border-gray-500/40 hover:border-gray-500/70';
                              }
                              
                              return (
                                <span 
                                  key={idx} 
                                  className={`text-xs ${tagColor} px-2 py-1 rounded-full mr-2 mb-1 border hover:bg-opacity-70 transition-colors cursor-default`}
                                >
                                  {tag}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {challenge.solved ? (
                          <span className="inline-flex items-center text-green-400 mr-4 bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-700/30">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Solved
                          </span>
                        ) : (
                          <button className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-900/30 rounded-lg text-sm transform hover:scale-105 transition-all duration-300 mr-4">
                            Try Challenge
                          </button>
                        )}
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link to={`/challenges/company-prep/${selectedCompany.id}/all`} className="inline-block px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg shadow-lg shadow-purple-900/30 transform hover:scale-105 transition-all duration-300 font-medium">
                View All {selectedCompany.name} Challenges
              </Link>
            </div>
          </div>
          
          {/* Resources Tab */}
          <div className={`${activeTab === 'resources' ? 'relative opacity-100 visible' : 'absolute inset-0 opacity-0 invisible'}`}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Curated Resources for {selectedCompany.name} Interviews
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {resources.map((resource, index) => (
                <div 
                  key={resource.id} 
                  className="bg-gradient-to-br from-gray-800/70 via-gray-900/80 to-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-indigo-500/50 transition-all duration-300 shadow-lg shadow-purple-900/5 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                        resource.type === 'Article' ? 'bg-gradient-to-br from-purple-600/50 to-purple-900/50 text-purple-300 border border-purple-700/40' :
                        resource.type === 'Video' ? 'bg-gradient-to-br from-red-600/50 to-red-900/50 text-red-300 border border-red-700/40' :
                        resource.type === 'Course' ? 'bg-gradient-to-br from-blue-600/50 to-blue-900/50 text-blue-300 border border-blue-700/40' :
                        'bg-gradient-to-br from-green-600/50 to-green-900/50 text-green-300 border border-green-700/40'
                      }`}>
                        {resource.type === 'Article' && (
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                          </svg>
                        )}
                        {resource.type === 'Video' && (
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        )}
                        {resource.type === 'Course' && (
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                          </svg>
                        )}
                        {resource.type === 'Blog Post' && (
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">{resource.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-300">Source: {resource.source}</span>
                        <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-900/70 border border-gray-700/50 text-gray-300">{resource.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                    <div className="flex items-center text-gray-400 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Added 3 weeks ago</span>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg shadow-md shadow-indigo-900/30 transform hover:scale-105 transition-all duration-300 text-sm">
                      View Resource
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 rounded-xl border border-indigo-800/40 p-6 backdrop-blur-sm shadow-lg shadow-purple-900/10">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600/70 to-purple-700/70 flex items-center justify-center mb-4 md:mb-0 md:mr-6 shadow-lg shadow-indigo-900/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="md:flex-1 text-center md:text-left">
                  <h4 className="text-xl font-medium text-white mb-2">Company Insights Pro</h4>
                  <p className="text-gray-300 mb-4 md:mb-0">Subscribe to get exclusive {selectedCompany.name} interview insights and materials from our experienced coaches.</p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                  <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg shadow-lg shadow-purple-900/30 transform hover:scale-105 transition-all duration-300 font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 rounded-xl p-8 backdrop-blur-sm border border-indigo-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Crack the {selectedCompany.name} Interview?</h3>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
              Start solving {selectedCompany.name}-specific challenges today and increase your chances of landing your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/challenges" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-purple-900/30 transform hover:scale-105 transition-all duration-300"
              >
                View All Challenges
              </Link>
              <Link 
                to="/challenges/daily" 
                className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-gray-900/30 transform hover:scale-105 transition-all duration-300"
              >
                Start Practice
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyPrepPage; 