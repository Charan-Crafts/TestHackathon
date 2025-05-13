import React, { useState } from 'react';

const Teams = ({ hackathon, setHackathon }) => {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'Code Wizards',
      members: [
        { id: 1, name: 'Jane Smith', role: 'Team Lead', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { id: 2, name: 'John Doe', role: 'Designer', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
        { id: 3, name: 'Alex Johnson', role: 'Developer', avatar: 'https://randomuser.me/api/portraits/women/10.jpg' }
      ],
      createdAt: '2023-04-12',
      project: 'AI-powered Sustainable Agriculture Platform',
      submissionCount: 2,
      status: 'active'
    },
    {
      id: 2,
      name: 'Byte Bandits',
      members: [
        { id: 4, name: 'Michael Brown', role: 'Team Lead', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
        { id: 5, name: 'Emily Davis', role: 'UI/UX Designer', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { id: 6, name: 'Chris Wilson', role: 'Backend Dev', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
        { id: 7, name: 'Sarah Miller', role: 'ML Engineer', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' }
      ],
      createdAt: '2023-04-10',
      project: 'Smart City Waste Management System',
      submissionCount: 1,
      status: 'active'
    },
    {
      id: 3,
      name: 'Tech Titans',
      members: [
        { id: 8, name: 'Robert Taylor', role: 'Team Lead', avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
        { id: 9, name: 'Lisa Anderson', role: 'Frontend Dev', avatar: 'https://randomuser.me/api/portraits/women/9.jpg' }
      ],
      createdAt: '2023-04-15',
      project: 'AR Navigation for Visually Impaired',
      submissionCount: 0,
      status: 'pending'
    }
  ]);

  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showConfirmDisband, setShowConfirmDisband] = useState(false);
  const [teamToDisband, setTeamToDisband] = useState(null);
  const [teamFormationEnabled, setTeamFormationEnabled] = useState(true);

  // Filter teams based on search term and active filter
  const filteredTeams = teams.filter(team => {
    const searchMatch = 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members.some(member => member.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeFilter === 'all') return searchMatch;
    if (activeFilter === 'active') return searchMatch && team.status === 'active';
    if (activeFilter === 'pending') return searchMatch && team.status === 'pending';
    
    return searchMatch;
  });

  // Toggle team details expand/collapse
  const toggleTeamExpand = (teamId) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
    }
  };

  // Handle team approval
  const handleApproveTeam = (teamId) => {
    // In a real app, this would make an API call
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, status: 'active' } : team
    ));
  };

  // Confirm disbanding a team
  const confirmDisbandTeam = (team) => {
    setTeamToDisband(team);
    setShowConfirmDisband(true);
  };

  // Handle team disbanding
  const handleDisbandTeam = () => {
    // In a real app, this would make an API call
    setTeams(teams.filter(team => team.id !== teamToDisband.id));
    setShowConfirmDisband(false);
    setTeamToDisband(null);
  };

  // Toggle team formation status
  const toggleTeamFormation = () => {
    // In a real app, this would update the hackathon settings
    setTeamFormationEnabled(!teamFormationEnabled);
  };

  return (
    <div>
      {/* Teams Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Teams Management</h2>
          <p className="text-gray-400">Manage hackathon teams and team formation</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTeamFormation}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
              teamFormationEnabled 
                ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
            }`}
          >
            <span className={`w-3 h-3 rounded-full mr-2 ${teamFormationEnabled ? 'bg-green-400' : 'bg-red-400'}`}></span>
            Team Formation {teamFormationEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
      
      {/* Team Formation Status */}
      <div className={`mb-6 p-4 rounded-lg border ${
        teamFormationEnabled
          ? 'bg-green-900/20 border-green-700/40 text-green-200'
          : 'bg-red-900/20 border-red-700/40 text-red-200'
      }`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {teamFormationEnabled ? (
              <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium">
              {teamFormationEnabled ? 'Team Formation is Active' : 'Team Formation is Paused'}
            </h3>
            <div className="mt-2 text-sm opacity-80">
              {teamFormationEnabled 
                ? 'Participants can currently create and join teams. You can manage team size limits and approval requirements in the settings tab.'
                : 'Participants cannot create or join teams at this time. Enable team formation to allow participants to form teams.'}
            </div>
            {teamFormationEnabled && (
              <div className="mt-3 text-sm">
                <span className="font-medium">Current constraints:</span> Min {hackathon.teamSettings?.minSize || 2} - Max {hackathon.teamSettings?.maxSize || 5} members per team
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                activeFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              All Teams
            </button>
            <button
              onClick={() => setActiveFilter('active')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                activeFilter === 'active'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                activeFilter === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              Pending Approval
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Search teams..."
            />
          </div>
        </div>
      </div>
      
      {/* Teams List */}
      {filteredTeams.length > 0 ? (
        <div className="space-y-4 mb-8">
          {filteredTeams.map(team => (
            <div 
              key={team.id} 
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden"
            >
              {/* Team Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-800/30 transition-colors flex items-center justify-between"
                onClick={() => toggleTeamExpand(team.id)}
              >
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-4">
                    {team.members.slice(0, 3).map(member => (
                      <div key={member.id} className="w-10 h-10 rounded-full border-2 border-gray-800 overflow-hidden">
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {team.members.length > 3 && (
                      <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-white text-xs font-medium">
                        +{team.members.length - 3}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white flex items-center">
                      {team.name}
                      {team.status === 'pending' && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/30 text-yellow-300 border border-yellow-600/30">
                          Pending Approval
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-400 text-sm">{team.members.length} members · Created on {team.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-gray-400 text-sm mr-4">
                    <span className="font-medium">{team.submissionCount}</span> submission{team.submissionCount !== 1 && 's'}
                  </div>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedTeamId === team.id ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Expanded Team Details */}
              {expandedTeamId === team.id && (
                <div className="border-t border-gray-700/50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-gray-400 font-medium mb-3">Team Members</h4>
                      <div className="space-y-3">
                        {team.members.map(member => (
                          <div key={member.id} className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="text-white text-sm font-medium">{member.name}</div>
                              <div className="text-gray-500 text-xs">{member.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-gray-400 font-medium mb-3">Project Details</h4>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <h5 className="text-white font-medium">{team.project}</h5>
                        {team.submissionCount > 0 ? (
                          <p className="text-cyan-400 text-sm mt-1">
                            {team.submissionCount} submission{team.submissionCount !== 1 && 's'} made to the hackathon
                          </p>
                        ) : (
                          <p className="text-yellow-400 text-sm mt-1">
                            No submissions yet
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-end space-x-2">
                        {team.status === 'pending' && (
                          <button
                            onClick={() => handleApproveTeam(team.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-green-600/70 hover:bg-green-600 text-white text-sm rounded-md transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve Team
                          </button>
                        )}
                        <button
                          onClick={() => confirmDisbandTeam(team)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600/70 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Disband Team
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-600/70 hover:bg-indigo-600 text-white text-sm rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Contact Team
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-8 text-center mb-8">
          <div className="flex flex-col items-center justify-center">
            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-xl">No teams found</p>
            <p className="text-gray-600 text-sm mt-1">Teams will appear here once they are formed</p>
          </div>
        </div>
      )}
      
      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4">
          <h4 className="text-gray-400 text-sm font-medium mb-2">Total Teams</h4>
          <div className="text-white text-3xl font-bold">{teams.length}</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4">
          <h4 className="text-gray-400 text-sm font-medium mb-2">Avg. Team Size</h4>
          <div className="text-white text-3xl font-bold">
            {(teams.reduce((acc, team) => acc + team.members.length, 0) / teams.length).toFixed(1)}
          </div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4">
          <h4 className="text-gray-400 text-sm font-medium mb-2">Teams with Submissions</h4>
          <div className="text-white text-3xl font-bold">
            {teams.filter(team => team.submissionCount > 0).length}
          </div>
        </div>
      </div>
      
      {/* Disband Team Confirmation Modal */}
      {showConfirmDisband && teamToDisband && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Disband Team
            </h3>
            <p className="text-gray-300 mb-2">
              Are you sure you want to disband the team <span className="font-medium text-white">{teamToDisband.name}</span>?
            </p>
            <p className="text-red-400 text-sm mb-6">
              This action cannot be undone. All team members will be notified and any submissions will remain but will be marked as from a disbanded team.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDisband(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisbandTeam}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Disband Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams; 