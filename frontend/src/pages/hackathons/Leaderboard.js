import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';

function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('points'); // 'points' or 'name'
  
  // Simulate fetching leaderboard data
  useEffect(() => {
    setTimeout(() => {
      const sampleData = [
        { 
          id: 1, 
          name: 'Code Ninjas', 
          points: 3450, 
          challenges: 24, 
          hackathons: 5, 
          rank: 1, 
          members: [
            { id: 101, name: 'Alex Chen', role: 'Team Lead' },
            { id: 102, name: 'Maria Rodriguez', role: 'Developer' },
            { id: 103, name: 'Jason Li', role: 'Designer' },
            { id: 104, name: 'Sarah Johnson', role: 'Developer' }
          ], 
          category: 'student' 
        },
        { 
          id: 2, 
          name: 'ByteBenders', 
          points: 3270, 
          challenges: 22, 
          hackathons: 6, 
          rank: 2, 
          members: [
            { id: 201, name: 'David Kim', role: 'Full Stack' },
            { id: 202, name: 'Emma Wilson', role: 'Data Scientist' },
            { id: 203, name: 'Michael Brown', role: 'UI/UX' }
          ], 
          category: 'professional' 
        },
        { 
          id: 3, 
          name: 'The Algorithm Avengers', 
          points: 3150, 
          challenges: 20, 
          hackathons: 4, 
          rank: 3, 
          members: [
            { id: 301, name: 'Olivia Garcia', role: 'ML Engineer' },
            { id: 302, name: 'William Jones', role: 'Backend' },
            { id: 303, name: 'Sophia Martinez', role: 'Frontend' },
            { id: 304, name: 'Ethan Taylor', role: 'DevOps' },
            { id: 305, name: 'Ava Robinson', role: 'Data Analyst' }
          ], 
          category: 'student' 
        },
        { 
          id: 4, 
          name: 'Quantum Coders', 
          points: 2980, 
          challenges: 19, 
          hackathons: 4, 
          rank: 4, 
          members: [
            { id: 401, name: 'Noah Miller', role: 'Architect' },
            { id: 402, name: 'Isabella Davis', role: 'Security' },
            { id: 403, name: 'Liam Smith', role: 'Mobile Dev' },
            { id: 404, name: 'Charlotte Wilson', role: 'QA' }
          ], 
          category: 'professional' 
        },
        { 
          id: 5, 
          name: 'Data Wizards', 
          points: 2850, 
          challenges: 18, 
          hackathons: 5, 
          rank: 5, 
          members: [
            { id: 501, name: 'James Johnson', role: 'Data Scientist' },
            { id: 502, name: 'Amelia Brown', role: 'AI Engineer' },
            { id: 503, name: 'Benjamin Lee', role: 'Full Stack' }
          ], 
          category: 'professional' 
        },
        { 
          id: 6, 
          name: 'Binary Beasts', 
          points: 2710, 
          challenges: 17, 
          hackathons: 3, 
          rank: 6, 
          members: [
            { id: 601, name: 'Mia Thompson', role: 'Lead' },
            { id: 602, name: 'Lucas Garcia', role: 'Developer' },
            { id: 603, name: 'Evelyn Martinez', role: 'UX Researcher' },
            { id: 604, name: 'Logan Anderson', role: 'Data Engineer' }
          ], 
          category: 'student' 
        },
        { 
          id: 7, 
          name: 'Full Stack Foxes', 
          points: 2590, 
          challenges: 16, 
          hackathons: 4, 
          rank: 7, 
          members: [
            { id: 701, name: 'Harper Nelson', role: 'Full Stack' },
            { id: 702, name: 'Mason Carter', role: 'Backend' },
            { id: 703, name: 'Abigail Rivera', role: 'Frontend' }
          ], 
          category: 'professional' 
        },
        { 
          id: 8, 
          name: 'Pixel Pioneers', 
          points: 2480, 
          challenges: 15, 
          hackathons: 3, 
          rank: 8, 
          members: [
            { id: 801, name: 'Elijah Cook', role: 'Designer' },
            { id: 802, name: 'Elizabeth Morgan', role: 'Developer' }
          ], 
          category: 'student' 
        },
        { 
          id: 9, 
          name: 'DevOps Dragons', 
          points: 2320, 
          challenges: 14, 
          hackathons: 3, 
          rank: 9, 
          members: [
            { id: 901, name: 'Daniel Parker', role: 'DevOps' },
            { id: 902, name: 'Sofia Cooper', role: 'SRE' },
            { id: 903, name: 'Matthew Peterson', role: 'Backend' },
            { id: 904, name: 'Camila Reed', role: 'Frontend' }
          ], 
          category: 'professional' 
        },
        { 
          id: 10, 
          name: 'Neural Networks', 
          points: 2180, 
          challenges: 13, 
          hackathons: 2, 
          rank: 10, 
          members: [
            { id: 1001, name: 'Aiden Bailey', role: 'AI Specialist' },
            { id: 1002, name: 'Avery Phillips', role: 'ML Engineer' },
            { id: 1003, name: 'Victoria Howard', role: 'Data Scientist' },
            { id: 1004, name: 'Jackson Price', role: 'Backend' },
            { id: 1005, name: 'Scarlett Ross', role: 'Frontend' }
          ], 
          category: 'student' 
        },
        { 
          id: 11, 
          name: 'Cloud Crusaders', 
          points: 2050, 
          challenges: 12, 
          hackathons: 3, 
          rank: 11, 
          members: [
            { id: 1101, name: 'Leo Stewart', role: 'Cloud Architect' },
            { id: 1102, name: 'Lily Sanchez', role: 'Backend' },
            { id: 1103, name: 'Gabriel Morris', role: 'Frontend' },
            { id: 1104, name: 'Chloe Rogers', role: 'DevOps' }
          ], 
          category: 'professional' 
        },
        { 
          id: 12, 
          name: 'Blockchain Brigade', 
          points: 1930, 
          challenges: 11, 
          hackathons: 2, 
          rank: 12, 
          members: [
            { id: 1201, name: 'Ryan Collins', role: 'Blockchain Dev' },
            { id: 1202, name: 'Zoe Murphy', role: 'Smart Contracts' },
            { id: 1203, name: 'Julian Bell', role: 'Frontend' }
          ], 
          category: 'student' 
        },
      ];
      
      setTeamData(sampleData);
      setLoading(false);
    }, 1500);
  }, []);
  
  // Handle tab changes with loading state
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    
    setTabLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setTabLoading(false);
    }, 800); // Simulate a slight delay for the tab change
  };
  
  // Handle sort changes with loading state
  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    if (newSortOrder === sortOrder) return;
    
    setTabLoading(true);
    setTimeout(() => {
      setSortOrder(newSortOrder);
      setTabLoading(false);
    }, 600);
  };
  
  // Get avatar URL for a user
  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=64&font-size=0.33`;
  };
  
  // Filter and sort data based on active tab and sort order
  const filteredData = teamData.filter(team => {
    if (activeTab === 'all') return true;
    return team.category === activeTab;
  }).sort((a, b) => {
    if (sortOrder === 'points') {
      return b.points - a.points;
    } else if (sortOrder === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'hackathons') {
      return b.hackathons - a.hackathons;
    } else if (sortOrder === 'members') {
      return b.members.length - a.members.length;
    } else {
      // Default to points sorting
      return b.points - a.points;
    }
  });
  
  // Table skeleton loader component
  const TableSkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              {[...Array(6)].map((_, index) => (
                <th key={index} scope="col" className="px-6 py-4 text-left">
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {[...Array(8)].map((_, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/60'}>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-md"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-700/50 rounded w-24"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-6 bg-gray-700 rounded w-24"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-5 bg-gray-700 rounded w-20 mb-2"></div>
                  <div className="h-3 bg-gray-700/50 rounded w-28"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-8 bg-gray-700 rounded w-12"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-700"></div>
                      ))}
                    </div>
                    <div className="ml-3 h-4 bg-gray-700 rounded w-16"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  // Loading state
  if (loading) {
    return (
      <LoadingIndicator 
        type="scanning" 
        message="Please wait..." 
        title=""
        skeletonType="table"
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header Section with enhanced design */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="bg-purple-700 p-3 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L12 21.012 21.618 7.984z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Hackathon Leaderboard
              </h1>
            </div>
            <div className="h-1 w-40 bg-purple-500 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
              Top performing teams across all challenges and hackathons. See who's leading the competition!
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Teams Card */}
          <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-l-indigo-500 border border-gray-700 shadow-lg hover:transform hover:scale-102 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-gray-400 text-sm font-medium mb-1">Participating Teams</div>
                <div className="text-indigo-400 text-3xl font-bold mb-1">153</div>
                <div className="text-gray-300 text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0114 7z" clipRule="evenodd" />
                  </svg>
                  <span>12% increase this quarter</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500">Active Teams</span>
                  <div className="text-indigo-300 font-medium">124</div>
                </div>
                <div>
                  <span className="text-gray-500">Average Size</span>
                  <div className="text-indigo-300 font-medium">3.8 members</div>
                </div>
                <div>
                  <span className="text-gray-500">New Teams</span>
                  <div className="text-indigo-300 font-medium">18 (30d)</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hackathons Card */}
          <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-l-pink-500 border border-gray-700 shadow-lg hover:transform hover:scale-102 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-gray-400 text-sm font-medium mb-1">Completed Hackathons</div>
                <div className="text-pink-400 text-3xl font-bold mb-1">48</div>
                <div className="text-gray-300 text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0114 7z" clipRule="evenodd" />
                  </svg>
                  <span>3 completed this month</span>
                </div>
              </div>
              <div className="p-3 bg-pink-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500">In Progress</span>
                  <div className="text-pink-300 font-medium">5 active</div>
                </div>
                <div>
                  <span className="text-gray-500">Upcoming</span>
                  <div className="text-pink-300 font-medium">7 planned</div>
                </div>
                <div>
                  <span className="text-gray-500">Total Prizes</span>
                  <div className="text-pink-300 font-medium">$248K</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Points Card */}
          <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-l-purple-500 border border-gray-700 shadow-lg hover:transform hover:scale-102 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-gray-400 text-sm font-medium mb-1">Total Points Earned</div>
                <div className="text-purple-400 text-3xl font-bold mb-1">27.3K</div>
                <div className="text-gray-300 text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0114 7z" clipRule="evenodd" />
                  </svg>
                  <span>2.4K points this month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500">Avg. per Team</span>
                  <div className="text-purple-300 font-medium">178 points</div>
                </div>
                <div>
                  <span className="text-gray-500">Challenges</span>
                  <div className="text-purple-300 font-medium">476 completed</div>
                </div>
                <div>
                  <span className="text-gray-500">Top Team</span>
                  <div className="text-purple-300 font-medium">3,450 pts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sorting controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg">
          <div className="flex flex-wrap justify-between items-center mb-3">
            <div className="text-white font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Showing {filteredData.length} teams</span>
              {activeTab !== 'all' && (
                <span className="ml-2 text-sm text-gray-400">
                  (filtered by {activeTab === 'student' ? 'student' : 'professional'} teams)
                </span>
              )}
            </div>
            
            <div className="flex items-center mt-3 sm:mt-0">
              <div className="text-sm text-gray-400 mr-3">Sort by:</div>
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                disabled={tabLoading}
              >
                <option value="points">Most Points</option>
                <option value="name">Team Name</option>
                <option value="hackathons">Most Hackathons</option>
                <option value="members">Team Size</option>
              </select>
            </div>
          </div>
          
          {/* Filter Buttons in Header */}
          <div className="flex flex-wrap gap-2">
            <div className="text-sm text-gray-400 mr-2 flex items-center">Filter:</div>
            <button
              onClick={() => handleTabChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
              }`}
              disabled={tabLoading}
            >
              All Teams
            </button>
            <button
              onClick={() => handleTabChange('student')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'student' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
              }`}
              disabled={tabLoading}
            >
              Student Teams
            </button>
            <button
              onClick={() => handleTabChange('professional')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'professional' 
                  ? 'bg-pink-600 text-white shadow-md' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
              }`}
              disabled={tabLoading}
            >
              Professional Teams
            </button>
          </div>
        </div>
      </div>
      
      {/* Leaderboard Table with improved design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="p-4 bg-purple-900 border-b border-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L12 21.012 21.618 7.984z" />
            </svg>
            <span className="text-lg font-semibold text-white">Leaderboard Rankings</span>
            
            <div className="ml-auto text-sm text-purple-200 flex items-center">
              {tabLoading && (
                <span className="flex items-center mr-3">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              )}
              <span className="hidden sm:inline mr-2">Updated:</span> Today, 10:45 AM
            </div>
          </div>
          
          {tabLoading ? (
            <TableSkeletonLoader />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Team
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Points
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Hackathons
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Team Members
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredData.map((team, index) => (
                    <tr 
                      key={team.id} 
                      className={`hover:bg-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/60'}`}
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <div className={`flex items-center justify-center w-12 h-12 
                              ${index === 0 
                                ? 'bg-yellow-500 text-yellow-900 rounded-lg' 
                                : index === 1 
                                  ? 'bg-gray-300 text-gray-800 rounded-lg' 
                                  : 'bg-amber-600 text-amber-900 rounded-lg'
                              } font-bold text-xl`}>
                              {index + 1}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-700 text-gray-300 font-medium text-sm border border-gray-600">
                              {index + 1}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-12 ${
                            index < 3 ? (
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-300' : 'bg-amber-600'
                            ) : 'bg-transparent'
                          } rounded-l-lg mr-3`}></div>
                          <div>
                            <div className="text-md font-medium text-white">
                              {index < 3 ? (
                                <span className={`
                                  ${index === 0 ? 'text-yellow-300 font-bold' : index === 1 ? 'text-gray-300 font-bold' : 'text-amber-400 font-bold'}
                                `}>{team.name}</span>
                              ) : team.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              Team #{team.id} • Rank #{team.rank}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-medium rounded-md
                          ${team.category === 'student' 
                            ? 'bg-indigo-900 text-indigo-200 border border-indigo-700' 
                            : 'bg-pink-900 text-pink-200 border border-pink-700'
                          }`}>
                          {team.category === 'student' ? 'Student' : 'Professional'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-md font-bold text-white">
                            {team.points.toLocaleString()}
                          </div>
                          <span className="ml-2 text-xs text-purple-400 font-medium">points</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {team.challenges} challenges completed
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex items-center px-3 py-1.5 bg-gray-700 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-white font-medium">{team.hackathons}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="flex -space-x-2 mb-2 sm:mb-0">
                            {team.members.slice(0, 3).map((member, i) => (
                              <div key={i} className="relative group">
                                <img 
                                  src={getAvatarUrl(member.name)} 
                                  alt={member.name}
                                  className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-white transition-colors"
                                />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-10">
                                  {member.name}<br/><span className="text-gray-400">{member.role}</span>
                                </div>
                              </div>
                            ))}
                            {team.members.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-700 flex items-center justify-center text-xs text-white font-medium">
                                +{team.members.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-400 sm:ml-3">{team.members.length} members</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Back to Hackathons Link */}
        <div className="mt-8 flex justify-center">
          <Link 
            to="/hackathons" 
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Hackathons
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard; 