import React, { useState } from 'react';

const TeamAnalytics = ({ team }) => {
  // State for collapsible sections
  const [openSections, setOpenSections] = useState({
    teamActivity: true,
    skillDistribution: false,
    memberParticipation: false,
    projectProgress: false
  });

  // Toggle section visibility
  const toggleSection = (section) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };

  // Generate random activity data for demo
  const activityData = [
    { day: 'Mon', commits: Math.floor(Math.random() * 10), messages: Math.floor(Math.random() * 20) },
    { day: 'Tue', commits: Math.floor(Math.random() * 10), messages: Math.floor(Math.random() * 20) },
    { day: 'Wed', commits: Math.floor(Math.random() * 10), messages: Math.floor(Math.random() * 20) },
    { day: 'Thu', commits: Math.floor(Math.random() * 10), messages: Math.floor(Math.random() * 20) },
    { day: 'Fri', commits: Math.floor(Math.random() * 10), messages: Math.floor(Math.random() * 20) },
    { day: 'Sat', commits: Math.floor(Math.random() * 10), messages: Math.floor(Math.random() * 20) },
    { day: 'Sun', commits: Math.floor(Math.random() * 10), messages: Math.floor(Math.random() * 20) }
  ];

  // Sample skills data for the team
  const teamSkills = [
    { name: 'React', count: 3, level: 'Advanced' },
    { name: 'Node.js', count: 2, level: 'Intermediate' },
    { name: 'Python', count: 2, level: 'Advanced' },
    { name: 'UI/UX', count: 1, level: 'Expert' },
    { name: 'Data Science', count: 1, level: 'Intermediate' }
  ];

  // Sample member participation
  const memberParticipation = team?.members?.map(member => ({
    name: member.name || `Member ${Math.floor(Math.random() * 100)}`,
    commits: Math.floor(Math.random() * 30),
    messages: Math.floor(Math.random() * 50),
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
  })) || [
    { name: 'Alex Johnson', commits: 12, messages: 34, lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { name: 'Sam Davis', commits: 8, messages: 27, lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { name: 'Jordan Smith', commits: 15, messages: 19, lastActive: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000) },
    { name: 'Taylor Wilson', commits: 6, messages: 42, lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
  ];

  // Sample project milestones
  const projectMilestones = [
    { name: 'Project Setup', status: 'completed', percentage: 100 },
    { name: 'Backend Development', status: 'in-progress', percentage: 65 },
    { name: 'Frontend Development', status: 'in-progress', percentage: 45 },
    { name: 'Testing', status: 'not-started', percentage: 0 },
    { name: 'Deployment', status: 'not-started', percentage: 0 }
  ];

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Calculate the max value for the activity chart
  const maxActivity = Math.max(...activityData.map(d => Math.max(d.commits, d.messages)));

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700/50 shadow-lg shadow-purple-900/10">
      <div className="p-4 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Team Analytics
        </h3>
      </div>
      
      <div className="divide-y divide-gray-700/50">
        {/* Team Activity Section */}
        <div className="border-b border-gray-700/50">
          <button 
            onClick={() => toggleSection('teamActivity')}
            className="w-full p-4 flex items-center justify-between bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-gray-200 font-medium">Team Activity</span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${openSections.teamActivity ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {openSections.teamActivity && (
            <div className="p-4 bg-gray-800/10">
              <div className="text-xs text-gray-500 mb-2">Activity over the past week</div>
              <div className="flex items-end space-x-2 h-40 mt-4">
                {activityData.map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div className="w-full flex flex-col items-center space-y-1">
                      <div 
                        className="w-full bg-indigo-500/30 rounded-t"
                        style={{ height: `${(data.messages / maxActivity) * 100}%` }} 
                      />
                      <div
                        className="w-full bg-purple-500/30 rounded-t"
                        style={{ height: `${(data.commits / maxActivity) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{data.day}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-500/30 mr-2 rounded"></div>
                  <span className="text-xs text-gray-400">Messages</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500/30 mr-2 rounded"></div>
                  <span className="text-xs text-gray-400">Commits</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Total Messages</div>
                  <div className="text-xl text-indigo-400 font-semibold">
                    {activityData.reduce((sum, data) => sum + data.messages, 0)}
                  </div>
                </div>
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Total Commits</div>
                  <div className="text-xl text-purple-400 font-semibold">
                    {activityData.reduce((sum, data) => sum + data.commits, 0)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Skill Distribution Section */}
        <div className="border-b border-gray-700/50">
          <button 
            onClick={() => toggleSection('skillDistribution')}
            className="w-full p-4 flex items-center justify-between bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-gray-200 font-medium">Skill Distribution</span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${openSections.skillDistribution ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {openSections.skillDistribution && (
            <div className="p-4 bg-gray-800/10">
              <div className="text-xs text-gray-500 mb-4">Key skills represented in the team</div>
              
              <div className="space-y-3">
                {teamSkills.map((skill, idx) => (
                  <div key={idx} className="bg-gray-800/40 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-300 font-medium">{skill.name}</div>
                      <div className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                        {skill.count} {skill.count === 1 ? 'member' : 'members'}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">Skill Level</div>
                      <div className="flex items-center">
                        <div 
                          className={`h-2 rounded ${
                            skill.level === 'Expert' ? 'bg-green-500' : 
                            skill.level === 'Advanced' ? 'bg-blue-500' : 
                            skill.level === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{
                            width: `${
                              skill.level === 'Expert' ? '100%' : 
                              skill.level === 'Advanced' ? '75%' : 
                              skill.level === 'Intermediate' ? '50%' : '25%'
                            }`
                          }}
                        />
                        <span className="ml-2 text-xs text-gray-500">{skill.level}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Member Participation Section */}
        <div className="border-b border-gray-700/50">
          <button 
            onClick={() => toggleSection('memberParticipation')}
            className="w-full p-4 flex items-center justify-between bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-gray-200 font-medium">Member Participation</span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${openSections.memberParticipation ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {openSections.memberParticipation && (
            <div className="p-4 bg-gray-800/10">
              <div className="text-xs text-gray-500 mb-4">Individual member activity</div>
              
              <div className="space-y-3">
                {memberParticipation.map((member, idx) => (
                  <div key={idx} className="bg-gray-800/40 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-300 font-medium">{member.name}</div>
                      <div className="text-xs text-gray-500">
                        Last active: {formatDate(member.lastActive)}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <div>
                          <div className="text-sm text-gray-300">{member.commits}</div>
                          <div className="text-xs text-gray-500">Commits</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <div>
                          <div className="text-sm text-gray-300">{member.messages}</div>
                          <div className="text-xs text-gray-500">Messages</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                        <span>Participation Score</span>
                        <span>
                          {Math.floor((member.commits * 3 + member.messages) / 
                          ((Math.max(...memberParticipation.map(m => m.commits)) * 3 + 
                            Math.max(...memberParticipation.map(m => m.messages))) / 100))}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                          style={{
                            width: `${Math.floor((member.commits * 3 + member.messages) / 
                            ((Math.max(...memberParticipation.map(m => m.commits)) * 3 + 
                              Math.max(...memberParticipation.map(m => m.messages))) / 100))}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Project Progress Section */}
        <div>
          <button 
            onClick={() => toggleSection('projectProgress')}
            className="w-full p-4 flex items-center justify-between bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-gray-200 font-medium">Project Progress</span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${openSections.projectProgress ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {openSections.projectProgress && (
            <div className="p-4 bg-gray-800/10">
              <div className="text-xs text-gray-500 mb-4">Project milestones and completion status</div>
              
              <div className="space-y-4">
                {projectMilestones.map((milestone, idx) => (
                  <div key={idx} className="bg-gray-800/40 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {milestone.status === 'completed' ? (
                          <svg className="w-5 h-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : milestone.status === 'in-progress' ? (
                          <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        <span className="text-gray-300 font-medium">{milestone.name}</span>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                        {milestone.percentage}%
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            milestone.status === 'completed' ? 'bg-green-500' : 
                            milestone.status === 'in-progress' ? 'bg-yellow-500' : 
                            'bg-gray-600'
                          }`}
                          style={{ width: `${milestone.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 bg-gray-800/60 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300 font-medium">Overall Project Completion</div>
                  <div className="text-sm text-gray-300 font-medium">
                    {Math.floor(projectMilestones.reduce((sum, milestone) => sum + milestone.percentage, 0) / projectMilestones.length)}%
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                    style={{ 
                      width: `${Math.floor(projectMilestones.reduce((sum, milestone) => sum + milestone.percentage, 0) / projectMilestones.length)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamAnalytics; 