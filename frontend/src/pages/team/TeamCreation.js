import React, { useState } from 'react';

function TeamCreation() {
  const [isJoining, setIsJoining] = useState(false);
  const [teamCreated, setTeamCreated] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  // Form state for creating a team
  const [teamData, setTeamData] = useState({
    teamName: '',
    description: '',
    lookingFor: [],
    skillsNeeded: []
  });

  // Handle create team form changes
  const handleTeamDataChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle skill in the skillsNeeded array
  const toggleSkill = (skill) => {
    setTeamData(prev => {
      if (prev.skillsNeeded.includes(skill)) {
        return {
          ...prev,
          skillsNeeded: prev.skillsNeeded.filter(s => s !== skill)
        };
      } else {
        return {
          ...prev,
          skillsNeeded: [...prev.skillsNeeded, skill]
        };
      }
    });
  };

  // Toggle a role in the lookingFor array
  const toggleRole = (role) => {
    setTeamData(prev => {
      if (prev.lookingFor.includes(role)) {
        return {
          ...prev,
          lookingFor: prev.lookingFor.filter(r => r !== role)
        };
      } else {
        return {
          ...prev,
          lookingFor: [...prev.lookingFor, role]
        };
      }
    });
  };

  // Handle team creation submission
  const handleCreateTeam = (e) => {
    e.preventDefault();
    setCreateLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setCreateLoading(false);
      setTeamCreated(true);
    }, 1500);
  };

  // Handle team join submission
  const handleJoinTeam = (e) => {
    e.preventDefault();
    setJoinLoading(true);
    setJoinError(null);
    
    // Simulate API call and validation
    setTimeout(() => {
      setJoinLoading(false);
      
      // Simulate success or error
      if (joinCode.length < 5) {
        setJoinError('Invalid team code. Please check and try again.');
      } else {
        // Placeholder for navigation
      }
    }, 1500);
  };

  // List of skills for the form
  const skills = [
    'Front-end Development',
    'Back-end Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science',
    'DevOps',
    'Blockchain',
    'Machine Learning',
    'Game Development',
    'Hardware'
  ];

  // List of roles for the form
  const roles = [
    'Developer',
    'Designer',
    'Product Manager',
    'Data Scientist',
    'DevOps Engineer'
  ];

  // Success component
  const TeamCreatedSuccess = () => (
    <div className="bg-gray-800/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl text-center">
      <div className="w-20 h-20 bg-green-600/20 rounded-full mx-auto flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Team Created Successfully!</h2>
      <p className="text-gray-300 mb-4">Your team code is:</p>
      <div className="bg-gray-900 rounded-lg py-3 px-4 inline-block mb-6">
        <code className="text-2xl text-indigo-400 font-mono">TC-12345</code>
      </div>
      <p className="text-gray-300 mb-6">Share this code with others to invite them to your team.</p>
      <div className="space-x-4">
        <button 
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {teamCreated ? (
          <TeamCreatedSuccess />
        ) : (
          <div className="bg-gray-800/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setIsJoining(false)}
                className={`text-lg font-medium pb-2 px-1 ${
                  !isJoining 
                    ? 'text-white border-b-2 border-indigo-500' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Create a Team
              </button>
              <button
                onClick={() => setIsJoining(true)}
                className={`text-lg font-medium pb-2 px-1 ${
                  isJoining 
                    ? 'text-white border-b-2 border-indigo-500' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Join a Team
              </button>
            </div>
            
            {isJoining ? (
              <form onSubmit={handleJoinTeam} className="space-y-6">
                <div>
                  <label htmlFor="joinCode" className="block text-sm font-medium text-gray-300 mb-1">
                    Team Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="joinCode"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter the team code (e.g. TC-12345)"
                    required
                  />
                  {joinError && (
                    <p className="text-red-400 text-sm mt-1">{joinError}</p>
                  )}
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-300">
                    You can get a team code from someone who has already created a team. Once you join a team, you'll be able to collaborate on projects together.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={joinLoading}
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {joinLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Joining Team...</span>
                    </div>
                  ) : "Join Team"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateTeam} className="space-y-6">
                <div>
                  <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-1">
                    Team Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="teamName"
                    name="teamName"
                    value={teamData.teamName}
                    onChange={handleTeamDataChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter a name for your team"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Team Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={teamData.description}
                    onChange={handleTeamDataChange}
                    rows={3}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Briefly describe your team and what you're planning to build"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Skills Needed
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {skills.map((skill, idx) => (
                      <div 
                        key={idx}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${
                          teamData.skillsNeeded.includes(skill)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Looking For
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {roles.map((role, idx) => (
                      <div 
                        key={idx}
                        onClick={() => toggleRole(role)}
                        className={`px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${
                          teamData.lookingFor.includes(role)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {createLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Team...</span>
                    </div>
                  ) : "Create Team"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamCreation; 