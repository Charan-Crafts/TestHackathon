import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { hackathonsData } from '../../../data/hackathons';

// Import components
import TeamStatsCards from './teams/components/TeamStatsCards';
import BulkActionToolbar from './teams/components/BulkActionToolbar';
import TeamCommunication from './teams/components/TeamCommunication';
import TeamAnalytics from './teams/components/TeamAnalytics';

const TeamsDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { id: routeHackathonId } = useParams(); // Get hackathon ID from URL params
  const location = useLocation();
  
  // Parse query parameters to get hackathon ID if it exists
  const searchParams = new URLSearchParams(location.search);
  const queryHackathonId = searchParams.get('hackathon');
  
  // Use either route param or query param for the hackathon ID
  const hackathonId = routeHackathonId || queryHackathonId;
  
  const [teams, setTeams] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    complete: 0,
    incomplete: 0,
    totalHackathons: 0,
    totalMembers: 0,
    avgTeamSize: 0
  });
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('teams');
  
  // Available statuses for bulk actions
  const availableStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'complete', label: 'Complete' },
    { value: 'incomplete', label: 'Incomplete' }
  ];

  // Process team data on component mount
  useEffect(() => {
    // Generate sample team data based on hackathons
    const generateTeams = () => {
      let teamsData = [];
      let id = 1;
      
      // If hackathonId is provided, only generate teams for that hackathon
      const relevantHackathons = hackathonId 
        ? hackathonsData.filter(h => h.id.toString() === hackathonId.toString())
        : hackathonsData.slice(0, 6);
      
      relevantHackathons.forEach(hackathon => {
        // Generate random number of teams for this hackathon (3-10)
        const teamCount = Math.floor(Math.random() * 8) + 3;
        
        for (let i = 0; i < teamCount; i++) {
          const memberCount = Math.floor(Math.random() * 4) + 2; // 2-5 members per team
          const hasSubmission = Math.random() > 0.3; // 70% of teams have submissions
          const status = hasSubmission ? (Math.random() > 0.5 ? 'complete' : 'active') : 'incomplete';
          const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
          
          // Generate team members
          const teamMembers = [];
          for (let j = 0; j < memberCount; j++) {
            const memberId = id * 100 + j;
            teamMembers.push({
              id: memberId,
              name: `User ${memberId}`,
              email: `user${memberId}@example.com`,
              role: j === 0 ? 'Team Lead' : 'Member',
              joinedDate: new Date(createdDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString()
            });
          }
          
          teamsData.push({
            id: id,
            name: `Team ${id}`,
            hackathonId: hackathon.id,
            hackathonName: hackathon.name || hackathon.title,
            hackathonLogo: hackathon.image,
            createdDate: createdDate.toISOString(),
            status: status,
            members: teamMembers,
            memberCount: memberCount,
            hasSubmission: hasSubmission,
            submissionDate: hasSubmission ? 
              new Date(createdDate.getTime() + Math.random() * 25 * 24 * 60 * 60 * 1000).toISOString() : null,
            score: hasSubmission ? Math.floor(Math.random() * 40) + 60 : null // 60-100 score
          });
          
          // Increment the ID after adding the team to the array
          id++;
        }
      });
      
      return teamsData;
    };
    
    const teamsData = generateTeams();
    setTeams(teamsData);
    
    // Calculate stats
    const calculateStats = (data) => {
      const totalMembers = data.reduce((sum, team) => sum + team.memberCount, 0);
      return {
        total: data.length,
        active: data.filter(t => t.status === 'active').length,
        complete: data.filter(t => t.status === 'complete').length,
        incomplete: data.filter(t => t.status === 'incomplete').length,
        totalHackathons: [...new Set(data.map(t => t.hackathonId))].length,
        totalMembers: totalMembers,
        avgTeamSize: totalMembers / data.length || 0
      };
    };
    
    setStats(calculateStats(teamsData));
  }, [hackathonId]); // Add hackathonId as dependency

  // Filter teams based on selected filter and search text
  const filteredTeams = teams.filter(team => {
    const matchesFilter = filter === 'all' || team.status === filter;
    const matchesSearch = !searchText || 
      team.name.toLowerCase().includes(searchText.toLowerCase()) ||
      team.hackathonName.toLowerCase().includes(searchText.toLowerCase()) ||
      team.members.some(m => m.name.toLowerCase().includes(searchText.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Handle creating a new team
  const handleCreateTeam = () => {
    alert('Create team feature coming soon');
  };

  // Handle viewing a team
  const handleViewTeam = (id) => {
    navigate(`/dashboard/organizer/teams/detail/${id}`);
  };

  // Handle editing a team
  const handleEditTeam = (id) => {
    alert(`Edit team ${id}`);
  };

  // Handle messaging a team
  const handleMessageTeam = (id) => {
    setSelectedTeams([id]);
  };

  // Handle select/deselect all teams
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTeams(filteredTeams.map(team => team.id));
    } else {
      setSelectedTeams([]);
    }
  };

  // Handle selecting individual team
  const handleSelectTeam = (id) => {
    if (selectedTeams.includes(id)) {
      const newSelected = selectedTeams.filter(teamId => teamId !== id);
      setSelectedTeams(newSelected);
    } else {
      setSelectedTeams([...selectedTeams, id]);
    }
  };

  // Handle bulk actions
  const handleBulkAction = (actionData) => {
    if (actionData.teams.length === 0) return;
    
    switch(actionData.type) {
      case 'status':
        setTeams(prevTeams => 
          prevTeams.map(team => 
            selectedTeams.includes(team.id) ? { ...team, status: actionData.targetStatus } : team
          )
        );
        
        // Update stats after status change
        setStats(prevStats => {
          const updatedTeams = teams.map(team => 
            selectedTeams.includes(team.id) ? { ...team, status: actionData.targetStatus } : team
          );
          
          return {
            ...prevStats,
            active: updatedTeams.filter(t => t.status === 'active').length,
            complete: updatedTeams.filter(t => t.status === 'complete').length,
            incomplete: updatedTeams.filter(t => t.status === 'incomplete').length,
          };
        });
        break;
        
      case 'message':
        setActiveTab('communications');
        break;
        
      case 'export':
        alert(`Exporting data for ${selectedTeams.length} teams`);
        break;
        
      case 'delete':
        setTeams(prevTeams => 
          prevTeams.filter(team => !selectedTeams.includes(team.id))
        );
        setSelectedTeams([]);
        break;
        
      default:
        break;
    }
  };

  const handleClearSelection = () => {
    setSelectedTeams([]);
  };

  const handleSendMessage = (team, messageText, messageType) => {
    const teamNames = selectedTeams.map(id => 
      teams.find(team => team.id === id)?.name
    ).filter(Boolean);
    
    alert(`${messageType} sent to ${teamNames.join(', ')}: ${messageText}`);
    setSelectedTeams([]);
  };

  // Get selected team objects
  const selectedTeamObjects = selectedTeams.map(id => teams.find(team => team.id === id)).filter(Boolean);

  return (
    <div className="px-4 py-6">
      {/* Page Header with Create Team Button */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
            <svg className="w-7 h-7 mr-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Team Management
          </h1>
          <p className="text-gray-400">View and manage hackathon teams</p>
        </div>
        <button 
          onClick={handleCreateTeam}
          className="inline-flex items-center px-4 py-3 bg-gradient-to-br from-purple-700/70 to-indigo-800/70 hover:from-purple-600/80 hover:to-indigo-700/80 rounded-lg text-purple-300 font-medium shadow-lg border border-purple-500/50 hover:border-purple-400/70 hover:shadow-purple-500/20 transform transition-all duration-100 backdrop-blur-sm"
        >
          <svg className="w-5 h-5 mr-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Team
        </button>
      </div>

      {/* Stat Cards */}
      <TeamStatsCards stats={stats} setFilter={setFilter} />
      
      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-6 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('teams')}
            className={`py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'teams' 
                ? 'border-purple-500 text-purple-400' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Teams
          </button>
          
          <button
            onClick={() => setActiveTab('communications')}
            className={`py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'communications' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Communications
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'analytics' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </button>
          
          <button
            onClick={() => navigate('/dashboard/organizer/teams/formation')}
            className={`py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap 
              border-transparent text-gray-400 hover:text-gray-300
            `}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
            </svg>
            Team Formation
          </button>
        </nav>
      </div>
      
      {/* Teams Tab Content */}
      {activeTab === 'teams' && (
        <>
          {/* Filter and Search Section */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === 'all' 
                    ? 'bg-purple-900/50 text-purple-300 border border-purple-800' 
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                }`}
              >
                All ({stats.total})
              </button>
              <button 
                onClick={() => setFilter('active')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === 'active' 
                    ? 'bg-blue-900/50 text-blue-300 border border-blue-800' 
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                }`}
              >
                Active ({stats.active})
              </button>
              <button 
                onClick={() => setFilter('complete')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === 'complete' 
                    ? 'bg-green-900/50 text-green-300 border border-green-800' 
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                }`}
              >
                Complete ({stats.complete})
              </button>
              <button 
                onClick={() => setFilter('incomplete')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === 'incomplete' 
                    ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-800' 
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                }`}
              >
                Incomplete ({stats.incomplete})
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search teams..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Bulk Actions Toolbar */}
          {selectedTeams.length > 0 && (
            <BulkActionToolbar 
              selectedTeams={selectedTeams}
              onBulkAction={handleBulkAction}
              onClearSelection={handleClearSelection}
              availableStatuses={availableStatuses}
            />
          )}
          
          {/* Teams Table */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-purple-900/5 mb-8">
            <div className="overflow-x-auto" style={{ maxWidth: "100%", width: "100%" }}>
              <table className="min-w-full divide-y divide-gray-800/70">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTeams.length === filteredTeams.length && filteredTeams.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800"
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Team
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Hackathon
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Members
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Submission
                    </th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {filteredTeams.length > 0 ? (
                    filteredTeams.map((team) => (
                      <tr key={team.id} className="hover:bg-gray-800/30 transition-colors group">
                        <td className="px-3 py-4">
                          <input
                            type="checkbox"
                            checked={selectedTeams.includes(team.id)}
                            onChange={() => handleSelectTeam(team.id)}
                            className="h-4 w-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800"
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-700/50">
                              <span className="text-sm font-medium text-purple-300">{team.name.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                                <button onClick={() => handleViewTeam(team.id)} className="hover:underline focus:outline-none">
                                  {team.name}
                                </button>
                              </div>
                              <div className="text-xs text-gray-500">{new Date(team.createdDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-7 w-7">
                              <img className="h-7 w-7 rounded object-cover border border-gray-700/50" src={team.hackathonLogo} alt={team.hackathonName} />
                            </div>
                            <div className="ml-2 text-sm text-gray-300 truncate max-w-[180px]">{team.hackathonName}</div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {team.status === 'active' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-900/30 text-blue-400 border border-blue-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1 animate-pulse"></span>
                              Active
                            </span>
                          )}
                          {team.status === 'complete' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-green-900/30 text-green-400 border border-green-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></span>
                              Complete
                            </span>
                          )}
                          {team.status === 'incomplete' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1"></span>
                              Incomplete
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex items-center">
                            <div className="flex -space-x-2 mr-2">
                              {team.members.slice(0, 3).map((member, idx) => (
                                <div key={idx} className="h-6 w-6 rounded-full bg-gray-700 border border-gray-800 flex items-center justify-center">
                                  <span className="text-xs text-cyan-400">{member.name.charAt(0)}</span>
                                </div>
                              ))}
                              {team.members.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-gray-700 border border-gray-800 flex items-center justify-center">
                                  <span className="text-xs text-gray-400">+{team.members.length - 3}</span>
                                </div>
                              )}
                            </div>
                            <span>{team.memberCount} members</span>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          {team.hasSubmission ? (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-gray-300">
                                {new Date(team.submissionDate).toLocaleDateString()}
                              </span>
                              {team.score && (
                                <span className="ml-2 px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-300 text-xs">
                                  {team.score}/100
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewTeam(team.id)}
                              className="text-purple-500 hover:text-purple-400 transition-colors"
                              title="View Team"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            
                            <button
                              onClick={() => handleEditTeam(team.id)}
                              className="text-indigo-500 hover:text-indigo-400 transition-colors"
                              title="Edit Team"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            
                            <button
                              onClick={() => handleMessageTeam(team.id)}
                              className="text-blue-500 hover:text-blue-400 transition-colors"
                              title="Message Team"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-500 text-lg">No teams found</p>
                          <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Communications Tab Content */}
      {activeTab === 'communications' && (
        <div className="mb-8">
          <TeamCommunication 
            team={selectedTeamObjects.length === 1 ? selectedTeamObjects[0] : null} 
            onSendMessage={handleSendMessage} 
          />
        </div>
      )}
      
      {/* Analytics Tab Content */}
      {activeTab === 'analytics' && (
        <div className="mb-8">
          <TeamAnalytics teams={filteredTeams} />
        </div>
      )}
    </div>
  );
};

export default TeamsDashboard; 