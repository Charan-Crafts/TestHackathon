import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hackathonsData } from '../../../../data/hackathons';

const TeamDetail = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  useEffect(() => {
    // Simulate fetching team data
    const fetchTeam = () => {
      setLoading(true);
      
      // This would be replaced with an actual API call
      // For now, we generate mock data similar to what's in TeamsDashboard
      setTimeout(() => {
        const id = parseInt(teamId);
        if (isNaN(id)) {
          setLoading(false);
          return;
        }
        
        // Mock data generation - similar to what's in TeamsDashboard.js
        const memberCount = Math.floor(Math.random() * 4) + 2; // 2-5 members per team
        const hasSubmission = Math.random() > 0.3; // 70% of teams have submissions
        const status = hasSubmission ? (Math.random() > 0.5 ? 'complete' : 'active') : 'incomplete';
        const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        // Select a random hackathon
        const hackathon = hackathonsData[Math.floor(Math.random() * hackathonsData.length)];
        
        // Generate team members - make sure we use the actual team ID for consistency
        const teamMembers = [];
        for (let j = 0; j < memberCount; j++) {
          const memberId = id * 100 + j;
          // Generate random number of hackathons the user has participated in (1-5)
          const hackathonParticipation = Math.floor(Math.random() * 5) + 1;
          
          teamMembers.push({
            id: memberId,
            name: `User ${memberId}`,
            email: `user${memberId}@example.com`,
            role: j === 0 ? 'Team Lead' : 'Member',
            joinedDate: new Date(createdDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${memberId}`,
            hackathonsParticipated: hackathonParticipation,
            skills: [
              'JavaScript',
              'React',
              'Node.js',
              'Python',
              'Machine Learning',
              'UI/UX Design'
            ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1)
          });
        }
        
        // Generate project details if team has submission
        const projectDetails = hasSubmission ? {
          title: `${hackathon.name} Solution by Team ${id}`,
          description: "Our team developed an innovative solution to address the challenge. We focused on creating a user-friendly interface while ensuring robust backend functionality.",
          technologies: ['React', 'Node.js', 'MongoDB', 'TailwindCSS'],
          repositoryUrl: 'https://github.com/team-project/repo',
          demoUrl: 'https://demo-project.vercel.app',
          submissionDate: new Date(createdDate.getTime() + Math.random() * 25 * 24 * 60 * 60 * 1000),
          score: Math.floor(Math.random() * 40) + 60, // 60-100 score
          feedback: "Great project! The solution is innovative and well-executed. The UI is intuitive and the documentation is comprehensive.",
          screenshots: [
            'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
          ]
        } : null;
        
        // Create the team object - Use the exact ID from the URL parameter
        const teamData = {
          id,
          name: `Team ${id}`, // Use the actual ID from URL
          hackathonId: hackathon.id,
          hackathonName: hackathon.name || hackathon.title,
          hackathonLogo: hackathon.image,
          createdDate,
          status,
          members: teamMembers,
          memberCount,
          hasSubmission,
          project: projectDetails,
          timeline: [
            { date: createdDate, event: 'Team Created' },
            ...teamMembers.map(member => ({ 
              date: new Date(member.joinedDate), 
              event: `${member.name} joined the team as ${member.role}` 
            })),
            ...(hasSubmission ? [{ 
              date: projectDetails.submissionDate, 
              event: 'Project Submitted' 
            }] : [])
          ].sort((a, b) => a.date - b.date)
        };
        
        setTeam(teamData);
        setLoading(false);
      }, 800);
    };
    
    fetchTeam();
  }, [teamId]);
  
  // Function to close the modal
  const closeModal = () => {
    setShowMemberModal(false);
    setTimeout(() => setSelectedMember(null), 200);
  };
  
  // Function to open the modal with a specific member
  const openMemberModal = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };
  
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading team details...</p>
        </div>
      </div>
    );
  }
  
  if (!team) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-lg p-8 bg-gray-800/50 rounded-xl border border-red-800/40">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">Team Not Found</h2>
          <p className="text-gray-400 mb-6">We couldn't find the team you're looking for. It may have been removed or you don't have access to it.</p>
          <button 
            onClick={() => navigate('/dashboard/organizer/teams')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      {/* Back button and actions header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <button
          onClick={() => navigate('/dashboard/organizer/teams')}
          className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Teams
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Team
          </button>
          
          <button
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Message
          </button>
        </div>
      </div>
      
      {/* Team Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <span className="text-lg font-bold text-white">{team.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{team.name}</h1>
            <div className="flex items-center mt-1">
              <div className="h-5 w-5 mr-2">
                <img src={team.hackathonLogo} alt={team.hackathonName} className="h-full w-full object-cover rounded" />
              </div>
              <span className="text-gray-400 text-sm">{team.hackathonName}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          {team.status === 'active' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-900/30 text-blue-400 border border-blue-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1 animate-pulse"></span>
              Active
            </span>
          )}
          {team.status === 'complete' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-900/30 text-green-400 border border-green-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></span>
              Complete
            </span>
          )}
          {team.status === 'incomplete' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1"></span>
              Incomplete
            </span>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Team info */}
        <div className="lg:col-span-1">
          {/* Team Members Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">Team Members</h2>
              <p className="text-gray-400 text-sm">{team.memberCount} members</p>
            </div>
            <div className="divide-y divide-gray-700">
              {team.members.map((member, index) => (
                <div key={index} className="p-4 hover:bg-gray-700/30 cursor-pointer" onClick={() => openMemberModal(member)}>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-700 flex-shrink-0">
                      <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-white truncate hover:text-indigo-400">{member.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          member.role === 'Team Lead' 
                            ? 'bg-purple-900/50 text-purple-300 border border-purple-800/50' 
                            : 'bg-blue-900/50 text-blue-300 border border-blue-800/50'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{member.email}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-gray-500 text-xs">Joined {member.joinedDate.toLocaleDateString()}</p>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 text-indigo-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs text-indigo-400">{member.hackathonsParticipated} hackathons</span>
                        </div>
                      </div>
                      
                      {member.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {member.skills.map((skill, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Team Timeline Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">Team Timeline</h2>
            </div>
            <div className="p-4">
              <div className="relative">
                {team.timeline.map((item, index) => (
                  <div key={index} className="mb-6 relative pl-6">
                    {/* Timeline connector */}
                    {index < team.timeline.length - 1 && (
                      <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-gray-700"></div>
                    )}
                    
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-purple-600"></div>
                    
                    {/* Content */}
                    <div>
                      <p className="text-gray-400 text-xs mb-1">{item.date.toLocaleDateString()}</p>
                      <p className="text-white text-sm">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Project details */}
        <div className="lg:col-span-2">
          {/* Project Information */}
          {team.hasSubmission && team.project ? (
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Project Submission</h2>
                <p className="text-gray-400 text-sm">Submitted on {team.project.submissionDate.toLocaleDateString()}</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-3">{team.project.title}</h3>
                
                <div className="mb-6">
                  <h4 className="text-gray-400 text-sm mb-2">Description</h4>
                  <p className="text-white">{team.project.description}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-gray-400 text-sm mb-2">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {team.project.technologies.map((tech, index) => (
                      <span key={index} className="px-2.5 py-1 bg-gray-700 text-gray-300 text-sm rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-gray-400 text-sm mb-2">Repository</h4>
                    <a 
                      href={team.project.repositoryUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                      </svg>
                      GitHub Repository
                    </a>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm mb-2">Demo</h4>
                    <a 
                      href={team.project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Live Demo
                    </a>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-gray-400 text-sm mb-2">Evaluation</h4>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="text-2xl font-bold text-white">{team.project.score}/100</div>
                      <div className="ml-auto">
                        <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              team.project.score >= 80 ? 'bg-green-500' : 
                              team.project.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${team.project.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <h5 className="text-white text-sm font-medium mb-1">Feedback</h5>
                    <p className="text-gray-300 text-sm">{team.project.feedback}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-gray-400 text-sm mb-3">Screenshots</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {team.project.screenshots.map((screenshot, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img src={screenshot} alt={`Screenshot ${index + 1}`} className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Project Status</h2>
              </div>
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-900/30 text-yellow-400 mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Project Submission Yet</h3>
                <p className="text-gray-400 mb-6">This team hasn't submitted their project for the hackathon.</p>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                  Send Reminder
                </button>
              </div>
            </div>
          )}
          
          {/* Team Activity Feed */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">Team Activity</h2>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-400 py-8">
                <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <h3 className="text-lg font-medium text-white mb-2">Activity Feed Coming Soon</h3>
                <p className="text-gray-400">
                  Real-time team activity tracking will be available in the next update.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Member Hackathon Details Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-700 p-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4 bg-gray-700">
                  <img src={selectedMember.avatar} alt={selectedMember.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{selectedMember.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedMember.role}</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Hackathon Participation
                </h4>
                
                {/* Generate random hackathon participation data */}
                {Array.from({ length: selectedMember.hackathonsParticipated }).map((_, i) => {
                  // Get a random hackathon for this participation
                  const randomHackathon = hackathonsData[Math.floor(Math.random() * hackathonsData.length)];
                  // Generate random date in the past year
                  const randomDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
                  // Random placement 1-4 or null
                  const randomPlacement = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : null;
                  
                  return (
                    <div key={i} className="bg-gray-700/30 rounded-lg p-4 mb-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden mr-3">
                          <img src={randomHackathon.image} alt={randomHackathon.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="text-white font-medium">{randomHackathon.name}</h5>
                            {randomPlacement && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                randomPlacement === 1 ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50' :
                                randomPlacement === 2 ? 'bg-gray-700/50 text-gray-300 border border-gray-600/50' :
                                'bg-amber-900/50 text-amber-300 border border-amber-700/50'
                              }`}>
                                {randomPlacement === 1 ? '🏆 1st Place' : 
                                 randomPlacement === 2 ? '🥈 2nd Place' : 
                                 '🥉 3rd Place'}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{randomDate.toLocaleDateString()}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {randomHackathon.technology && randomHackathon.technology.slice(0, 3).map((tech, index) => (
                              <span key={index} className="px-1.5 py-0.5 bg-indigo-900/30 text-indigo-300 text-xs rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-gray-400 text-xs">
                              {Math.random() > 0.5 ? 'Team Lead' : 'Member'}
                            </div>
                            <button className="text-xs text-indigo-400 hover:text-indigo-300">
                              View Project
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1.5 bg-gray-700 text-indigo-300 text-sm rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Contact Information
                </h4>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300">{selectedMember.email}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span className="text-gray-300">@{selectedMember.name.toLowerCase().replace(/\s+/g, '')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-700 p-4 flex justify-between">
              <button 
                onClick={closeModal} 
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
              >
                Close
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetail; 