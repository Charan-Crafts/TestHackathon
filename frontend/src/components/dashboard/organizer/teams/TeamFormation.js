import React, { useState, useEffect } from 'react';
import { hackathonsData } from '../../../../data/hackathons';

const TeamFormation = () => {
  const [selectedHackathon, setSelectedHackathon] = useState('');
  const [soloParticipants, setSoloParticipants] = useState([]);
  const [incompleteTeams, setIncompleteTeams] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [showRecommendationsFor, setShowRecommendationsFor] = useState(null);
  const [skillFilters, setSkillFilters] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // Generate mock data on component mount
  useEffect(() => {
    // Generate skills list
    const skills = [
      'JavaScript', 'React', 'Python', 'Machine Learning', 'Data Science',
      'UI/UX Design', 'Node.js', 'AWS', 'DevOps', 'Mobile Development',
      'Blockchain', 'Game Development', 'Cybersecurity', 'IoT', 'AR/VR'
    ];
    setSkillFilters(skills);
    
    if (!selectedHackathon) return;
    
    // Generate solo participants
    const getRandomSkills = () => {
      const count = Math.floor(Math.random() * 4) + 1; // 1-4 skills
      const shuffled = [...skills].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };
    
    const mockSoloParticipants = [...Array(20)].map((_, i) => ({
      id: i + 1,
      name: `Participant ${i + 1}`,
      email: `participant${i+1}@example.com`,
      skills: getRandomSkills(),
      experience: Math.floor(Math.random() * 5) + 1, // 1-5 years
      interests: ['AI', 'Web', 'Mobile'][Math.floor(Math.random() * 3)],
      lookingFor: Math.random() > 0.5 ? 'Looking for a team' : 'Open to join',
      bio: 'Passionate developer looking to collaborate on innovative projects.',
      registered: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    // Generate incomplete teams
    const mockIncompleteTeams = [...Array(8)].map((_, i) => {
      const memberCount = Math.floor(Math.random() * 2) + 1; // 1-2 members
      const maxSize = Math.floor(Math.random() * 2) + 3; // 3-4 max size
      
      return {
        id: i + 1,
        name: `Team ${i + 1}`,
        currentSize: memberCount,
        maxSize: maxSize,
        openRoles: maxSize - memberCount,
        skills: getRandomSkills(),
        lookingFor: ['Frontend Developer', 'Backend Developer', 'Data Scientist', 'UI/UX Designer'][Math.floor(Math.random() * 4)],
        description: 'We are working on an innovative solution and looking for passionate teammates.',
        members: [...Array(memberCount)].map((_, j) => ({
          id: i * 10 + j + 1,
          name: `Member ${i * 10 + j + 1}`,
          role: j === 0 ? 'Team Lead' : 'Member',
          skills: getRandomSkills()
        })),
        created: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString()
      };
    });
    
    setSoloParticipants(mockSoloParticipants);
    setIncompleteTeams(mockIncompleteTeams);
    
    // Generate initial recommendations
    generateRecommendations(mockSoloParticipants, mockIncompleteTeams);
  }, [selectedHackathon]);
  
  // Filter handlers
  const filterParticipantsBySkills = (participants) => {
    if (selectedSkills.length === 0) return participants;
    return participants.filter(p => 
      p.skills.some(skill => selectedSkills.includes(skill))
    );
  };
  
  const filterTeamsBySkills = (teams) => {
    if (selectedSkills.length === 0) return teams;
    return teams.filter(t => 
      t.skills.some(skill => selectedSkills.includes(skill)) ||
      t.members.some(m => m.skills.some(skill => selectedSkills.includes(skill)))
    );
  };
  
  // Generate team recommendations based on skill matching
  const generateRecommendations = (participants, teams) => {
    const newRecommendations = {};
    
    // For each participant, find compatible teams
    participants.forEach(participant => {
      const compatibleTeams = teams
        .filter(team => team.openRoles > 0)
        .map(team => {
          // Calculate compatibility score based on shared skills
          const participantSkills = new Set(participant.skills);
          const teamSkills = new Set([
            ...team.skills,
            ...team.members.flatMap(member => member.skills)
          ]);
          
          // Count shared skills
          const sharedSkills = [...participantSkills].filter(skill => teamSkills.has(skill));
          
          // Count complementary skills (skills the team doesn't have)
          const complementarySkills = [...participantSkills].filter(skill => !teamSkills.has(skill));
          
          // Calculate score: shared skills are good, but complementary skills add value too
          const score = (sharedSkills.length * 2) + complementarySkills.length;
          
          return {
            team,
            score,
            sharedSkills,
            complementarySkills
          };
        })
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, 3); // Top 3 matches
      
      newRecommendations[participant.id] = compatibleTeams;
    });
    
    // For each team, find compatible participants
    teams.forEach(team => {
      if (team.openRoles <= 0) return;
      
      const compatibleParticipants = participants
        .map(participant => {
          // Calculate compatibility score
          const participantSkills = new Set(participant.skills);
          const teamSkills = new Set([
            ...team.skills,
            ...team.members.flatMap(member => member.skills)
          ]);
          
          // Count shared skills
          const sharedSkills = [...participantSkills].filter(skill => teamSkills.has(skill));
          
          // Count complementary skills
          const complementarySkills = [...participantSkills].filter(skill => !teamSkills.has(skill));
          
          // Calculate score
          const score = (sharedSkills.length * 2) + complementarySkills.length;
          
          return {
            participant,
            score,
            sharedSkills,
            complementarySkills
          };
        })
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, 5); // Top 5 matches
      
      newRecommendations[`team_${team.id}`] = compatibleParticipants;
    });
    
    setRecommendations(newRecommendations);
  };
  
  // Handle team formation
  const handleRequestJoin = (participantId, teamId) => {
    alert(`Join request sent from Participant ${participantId} to Team ${teamId}`);
  };
  
  const handleInviteToTeam = (teamId, participantId) => {
    alert(`Invitation sent from Team ${teamId} to Participant ${participantId}`);
  };
  
  // Handle showing/hiding recommendations
  const toggleRecommendations = (id) => {
    setShowRecommendationsFor(showRecommendationsFor === id ? null : id);
  };
  
  // Handle skill selection
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  const filteredSoloParticipants = filterParticipantsBySkills(soloParticipants);
  const filteredIncompleteTeams = filterTeamsBySkills(incompleteTeams);
  
  return (
    <div className="px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <svg className="w-7 h-7 mr-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Team Formation Assistant
        </h1>
        <p className="text-gray-400">Match participants and help form balanced teams</p>
      </div>
      
      {/* Hackathon Selector and Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Select Hackathon</label>
          <select
            value={selectedHackathon}
            onChange={(e) => setSelectedHackathon(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600/50"
          >
            <option value="">Select a hackathon</option>
            {hackathonsData.slice(0, 6).map(hackathon => (
              <option key={hackathon.id} value={hackathon.id}>
                {hackathon.name || hackathon.title}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Filter by Skills</label>
          <div className="flex flex-wrap gap-2">
            {skillFilters.slice(0, 8).map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-purple-900/60 text-purple-300 border border-purple-700'
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                }`}
              >
                {skill}
              </button>
            ))}
            <button className="px-3 py-1 text-xs rounded-full bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800">
              + More
            </button>
          </div>
        </div>
      </div>
      
      {selectedHackathon ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Participants Looking for Teams */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-medium">Participants Looking for Teams</h2>
              <span className="text-sm text-gray-400">{filteredSoloParticipants.length} participants</span>
            </div>
            
            {filteredSoloParticipants.length > 0 ? (
              <div className="space-y-4">
                {filteredSoloParticipants.map(participant => (
                  <div 
                    key={participant.id} 
                    className="bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden"
                  >
                    {/* Participant Card */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-purple-900/60 border border-purple-700/50 flex items-center justify-center">
                            <span className="text-purple-300 font-medium">{participant.name.charAt(0)}</span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-white font-medium">{participant.name}</h3>
                            <p className="text-sm text-gray-400">{participant.experience} years experience</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50">
                          {participant.lookingFor}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-300">{participant.bio}</p>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-xs uppercase text-gray-500 mb-1">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {participant.skills.map(skill => (
                            <span
                              key={skill}
                              className={`px-2 py-0.5 text-xs rounded-full bg-gray-700/50 border border-gray-600/50 ${
                                selectedSkills.includes(skill) 
                                  ? 'text-purple-300 bg-purple-900/20 border-purple-700/50' 
                                  : 'text-gray-300'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => toggleRecommendations(participant.id)}
                          className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
                        >
                          {showRecommendationsFor === participant.id ? 'Hide' : 'Show'} Recommendations
                          <svg className={`w-4 h-4 ml-1 transition-transform ${showRecommendationsFor === participant.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button className="text-sm text-purple-400 hover:text-purple-300">
                          View Profile
                        </button>
                      </div>
                    </div>
                    
                    {/* Recommendations */}
                    {showRecommendationsFor === participant.id && recommendations[participant.id]?.length > 0 && (
                      <div className="bg-indigo-900/20 border-t border-indigo-800/30 p-3">
                        <h4 className="text-sm text-indigo-300 mb-2">Recommended Teams</h4>
                        <div className="space-y-3">
                          {recommendations[participant.id].map(({ team, score, sharedSkills, complementarySkills }) => (
                            <div key={team.id} className="bg-gray-800/50 rounded p-3">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center">
                                  <span className="text-white font-medium">{team.name}</span>
                                  <span className="ml-2 text-xs bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded-full">
                                    {team.openRoles} {team.openRoles === 1 ? 'spot' : 'spots'} open
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  Match score: <span className="text-green-400 font-medium">{score}</span>
                                </div>
                              </div>
                              
                              {sharedSkills.length > 0 && (
                                <div className="mb-1">
                                  <span className="text-xs text-gray-400">Shared skills:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {sharedSkills.map(skill => (
                                      <span key={skill} className="px-1.5 py-0.5 text-xs rounded-full bg-green-900/30 text-green-300 border border-green-800/50">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {complementarySkills.length > 0 && (
                                <div className="mb-2">
                                  <span className="text-xs text-gray-400">You can contribute:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {complementarySkills.map(skill => (
                                      <span key={skill} className="px-1.5 py-0.5 text-xs rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleRequestJoin(participant.id, team.id)}
                                  className="px-3 py-1 text-xs rounded-lg bg-indigo-900/50 text-indigo-300 border border-indigo-700 hover:bg-indigo-800/60"
                                >
                                  Request to Join
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 text-center text-gray-400">
                No participants found matching your criteria.
              </div>
            )}
          </div>
          
          {/* Right Column: Teams Looking for Members */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-medium">Teams Looking for Members</h2>
              <span className="text-sm text-gray-400">{filteredIncompleteTeams.length} teams</span>
            </div>
            
            {filteredIncompleteTeams.length > 0 ? (
              <div className="space-y-4">
                {filteredIncompleteTeams.map(team => (
                  <div 
                    key={team.id} 
                    className="bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden"
                  >
                    {/* Team Card */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center">
                            <span className="text-indigo-300 font-medium">{team.name.charAt(0)}</span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-white font-medium">{team.name}</h3>
                            <p className="text-sm text-gray-400">
                              {team.currentSize}/{team.maxSize} members
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-300 border border-green-800/50">
                          {team.openRoles} {team.openRoles === 1 ? 'spot' : 'spots'} remaining
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-300">{team.description}</p>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-xs uppercase text-gray-500 mb-1">Looking for</h4>
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/50">
                          {team.lookingFor}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-xs uppercase text-gray-500 mb-1">Team Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {team.skills.map(skill => (
                            <span
                              key={skill}
                              className={`px-2 py-0.5 text-xs rounded-full bg-gray-700/50 border border-gray-600/50 ${
                                selectedSkills.includes(skill) 
                                  ? 'text-purple-300 bg-purple-900/20 border-purple-700/50' 
                                  : 'text-gray-300'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => toggleRecommendations(`team_${team.id}`)}
                          className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
                        >
                          {showRecommendationsFor === `team_${team.id}` ? 'Hide' : 'Show'} Recommendations
                          <svg className={`w-4 h-4 ml-1 transition-transform ${showRecommendationsFor === `team_${team.id}` ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button className="text-sm text-purple-400 hover:text-purple-300">
                          View Team
                        </button>
                      </div>
                    </div>
                    
                    {/* Recommendations */}
                    {showRecommendationsFor === `team_${team.id}` && recommendations[`team_${team.id}`]?.length > 0 && (
                      <div className="bg-indigo-900/20 border-t border-indigo-800/30 p-3">
                        <h4 className="text-sm text-indigo-300 mb-2">Recommended Participants</h4>
                        <div className="space-y-3">
                          {recommendations[`team_${team.id}`].map(({ participant, score, sharedSkills, complementarySkills }) => (
                            <div key={participant.id} className="bg-gray-800/50 rounded p-3">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center">
                                  <span className="text-white font-medium">{participant.name}</span>
                                  <span className="ml-2 text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded-full">
                                    {participant.experience} years exp.
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  Match score: <span className="text-green-400 font-medium">{score}</span>
                                </div>
                              </div>
                              
                              {sharedSkills.length > 0 && (
                                <div className="mb-1">
                                  <span className="text-xs text-gray-400">Shared skills:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {sharedSkills.map(skill => (
                                      <span key={skill} className="px-1.5 py-0.5 text-xs rounded-full bg-green-900/30 text-green-300 border border-green-800/50">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {complementarySkills.length > 0 && (
                                <div className="mb-2">
                                  <span className="text-xs text-gray-400">New skills they bring:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {complementarySkills.map(skill => (
                                      <span key={skill} className="px-1.5 py-0.5 text-xs rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleInviteToTeam(team.id, participant.id)}
                                  className="px-3 py-1 text-xs rounded-lg bg-indigo-900/50 text-indigo-300 border border-indigo-700 hover:bg-indigo-800/60"
                                >
                                  Invite to Team
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 text-center text-gray-400">
                No teams found matching your criteria.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-xl text-white font-medium mb-2">Select a Hackathon to Begin</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Choose a hackathon from the dropdown above to see participants looking for teams and teams looking for members.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamFormation; 