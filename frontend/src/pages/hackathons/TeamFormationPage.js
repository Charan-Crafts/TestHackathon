import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';

const TeamFormationPage = () => {
  const [loading, setLoading] = useState(true);
  const [teamProfiles, setTeamProfiles] = useState([]);
  const [individualProfiles, setIndividualProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('teams');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState('all');
  const [upcomingHackathons, setUpcomingHackathons] = useState([]);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);

  // List of skills for filtering
  const availableSkills = [
    'Frontend', 'Backend', 'UI/UX', 'Data Science', 'Machine Learning', 
    'AI', 'Blockchain', 'DevOps', 'Mobile', 'Cloud', 'Cybersecurity', 
    'AR/VR', 'Game Dev', 'IoT', 'Robotics'
  ];

  // Simulate API call to fetch profiles and hackathons
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock hackathon data
      const mockHackathons = [
        { id: '1', title: 'Global AI Innovation Challenge', startDate: '2023-05-15T09:00:00Z' },
        { id: '2', title: 'Blockchain Revolution Hackathon', startDate: '2023-06-22T09:00:00Z' },
        { id: '3', title: 'Sustainable Tech Summit', startDate: '2023-07-10T09:00:00Z' },
        { id: '4', title: 'Health Tech Innovators', startDate: '2023-08-05T09:00:00Z' }
      ];
      
      // Mock team profiles
      const mockTeamProfiles = [
        {
          id: '1',
          name: 'CodeCrafters',
          description: 'We\'re a team of 3 looking for a UI/UX designer and a backend developer to join us for the Global AI Innovation Challenge.',
          members: 3,
          maxMembers: 5,
          skills: ['Frontend', 'Machine Learning', 'Data Science'],
          lookingFor: ['UI/UX', 'Backend'],
          hackathonId: '1',
          hackathonName: 'Global AI Innovation Challenge',
          image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
          contactEmail: 'team@codecrafters.dev'
        },
        {
          id: '2',
          name: 'Blockchain Builders',
          description: 'Looking for blockchain enthusiasts to join our team for the upcoming Blockchain Revolution Hackathon.',
          members: 2,
          maxMembers: 4,
          skills: ['Smart Contracts', 'Frontend'],
          lookingFor: ['Backend', 'UI/UX', 'DevOps'],
          hackathonId: '2',
          hackathonName: 'Blockchain Revolution Hackathon',
          image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
          contactEmail: 'join@blockchainbuilders.io'
        },
        {
          id: '3',
          name: 'EcoTech Solutions',
          description: 'Passionate about using technology to solve environmental challenges. Looking for like-minded developers to join us.',
          members: 2,
          maxMembers: 5,
          skills: ['Data Science', 'IoT', 'Backend'],
          lookingFor: ['Frontend', 'Mobile', 'UI/UX'],
          hackathonId: '3',
          hackathonName: 'Sustainable Tech Summit',
          image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
          contactEmail: 'team@ecotechsolutions.org'
        }
      ];
      
      // Mock individual profiles
      const mockIndividualProfiles = [
        {
          id: '1',
          name: 'Sarah Chen',
          title: 'Full Stack Developer',
          bio: 'Passionate about creating beautiful and functional web applications. Looking to join a team for the AI Innovation Challenge.',
          skills: ['Frontend', 'Backend', 'UI/UX'],
          interests: ['AI', 'Machine Learning', 'Web3'],
          hackathonId: '1',
          hackathonInterest: 'Global AI Innovation Challenge',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
          github: 'github.com/sarahchen',
          linkedin: 'linkedin.com/in/sarahchen',
          contactEmail: 'sarah.chen@example.com'
        },
        {
          id: '2',
          name: 'Miguel Rodriguez',
          title: 'ML Engineer',
          bio: 'Machine learning specialist with experience in NLP and computer vision. Looking for a team working on cutting-edge AI applications.',
          skills: ['Python', 'Machine Learning', 'Data Science', 'AI'],
          interests: ['Computer Vision', 'NLP', 'Reinforcement Learning'],
          hackathonId: '1',
          hackathonInterest: 'Global AI Innovation Challenge',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
          github: 'github.com/miguelrod',
          linkedin: 'linkedin.com/in/miguelrodriguez',
          contactEmail: 'miguel.rodriguez@example.com'
        },
        {
          id: '3',
          name: 'Priya Sharma',
          title: 'Blockchain Developer',
          bio: 'Blockchain enthusiast with experience in smart contracts and DeFi. Looking to collaborate on innovative blockchain projects.',
          skills: ['Blockchain', 'Smart Contracts', 'Solidity', 'Web3'],
          interests: ['DeFi', 'NFTs', 'DAOs'],
          hackathonId: '2',
          hackathonInterest: 'Blockchain Revolution Hackathon',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
          github: 'github.com/priyasharma',
          linkedin: 'linkedin.com/in/priyasharma',
          contactEmail: 'priya.sharma@example.com'
        },
        {
          id: '4',
          name: 'David Kim',
          title: 'UX/UI Designer',
          bio: 'UX/UI designer with a passion for creating intuitive and engaging user experiences. Looking to join a team for the Sustainable Tech Summit.',
          skills: ['UI/UX', 'Figma', 'Prototyping', 'User Research'],
          interests: ['Sustainable Design', 'Accessibility', 'Product Design'],
          hackathonId: '3',
          hackathonInterest: 'Sustainable Tech Summit',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
          github: 'github.com/davidkim',
          linkedin: 'linkedin.com/in/davidkim',
          contactEmail: 'david.kim@example.com'
        }
      ];
      
      setTeamProfiles(mockTeamProfiles);
      setIndividualProfiles(mockIndividualProfiles);
      setUpcomingHackathons(mockHackathons);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Filter profiles based on search term, selected skills, and hackathon
  const filteredTeamProfiles = teamProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          profile.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkills = selectedSkills.length === 0 || 
                          selectedSkills.some(skill => 
                            profile.lookingFor.includes(skill) || profile.skills.includes(skill)
                          );
    
    const matchesHackathon = selectedHackathon === 'all' || profile.hackathonId === selectedHackathon;
    
    return matchesSearch && matchesSkills && matchesHackathon;
  });
  
  const filteredIndividualProfiles = individualProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          profile.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkills = selectedSkills.length === 0 || 
                          selectedSkills.some(skill => profile.skills.includes(skill));
    
    const matchesHackathon = selectedHackathon === 'all' || profile.hackathonId === selectedHackathon;
    
    return matchesSearch && matchesSkills && matchesHackathon;
  });

  // Toggle skill selection
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingIndicator size="large" message="Please wait..." />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Team Formation</h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Find teammates or join a team for upcoming hackathons. Connect with developers, designers, and innovators who share your passion.
            </p>
          </div>
          
          {/* Filters and Actions */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-xl overflow-hidden border border-gray-700/50 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <input 
                  type="text" 
                  placeholder="Search by name, description, or skills..."
                  className="w-full bg-gray-800/80 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="md:w-1/3">
                <label className="block text-sm font-medium text-gray-300 mb-2">Hackathon</label>
                <select 
                  className="w-full bg-gray-800/80 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedHackathon}
                  onChange={(e) => setSelectedHackathon(e.target.value)}
                >
                  <option value="all">All Hackathons</option>
                  {upcomingHackathons.map(hackathon => (
                    <option key={hackathon.id} value={hackathon.id}>{hackathon.title}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Skills</label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map(skill => (
                  <button 
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button 
                  onClick={() => setActiveTab('teams')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'teams'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Teams Looking for Members
                </button>
                <button 
                  onClick={() => setActiveTab('individuals')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'individuals'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Individuals Looking for Teams
                </button>
              </div>
              <button 
                onClick={() => setShowCreateProfileModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-colors"
              >
                Create Profile
              </button>
            </div>
          </div>
          
          {/* Team Profiles */}
          {activeTab === 'teams' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Teams Looking for Members</h2>
              
              {filteredTeamProfiles.length === 0 ? (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
                  <svg className="h-12 w-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No matching teams found</h3>
                  <p className="text-gray-400 mb-4">Try adjusting your search filters or create a new team profile</p>
                  <button 
                    onClick={() => setShowCreateProfileModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                  >
                    Create Team Profile
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTeamProfiles.map(team => (
                    <div key={team.id} className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-xl overflow-hidden border border-gray-700/50 transition-transform hover:transform hover:scale-[1.02]">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                            <img src={team.image} alt={team.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white">{team.name}</h3>
                            <p className="text-sm text-blue-400">{team.hackathonName}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{team.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Team Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {team.skills.map(skill => (
                              <span 
                                key={skill} 
                                className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-700/50"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Looking For</h4>
                          <div className="flex flex-wrap gap-2">
                            {team.lookingFor.map(skill => (
                              <span 
                                key={skill} 
                                className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded-full border border-green-700/50"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                          <span>Team Members: {team.members}/{team.maxMembers}</span>
                        </div>
                        
                        <a 
                          href={`mailto:${team.contactEmail}`}
                          className="block w-full py-2 text-center bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                        >
                          Contact Team
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Individual Profiles */}
          {activeTab === 'individuals' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Individuals Looking for Teams</h2>
              
              {filteredIndividualProfiles.length === 0 ? (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
                  <svg className="h-12 w-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No matching individuals found</h3>
                  <p className="text-gray-400 mb-4">Try adjusting your search filters or create a new profile</p>
                  <button 
                    onClick={() => setShowCreateProfileModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                  >
                    Create Individual Profile
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIndividualProfiles.map(profile => (
                    <div key={profile.id} className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-xl overflow-hidden border border-gray-700/50 transition-transform hover:transform hover:scale-[1.02]">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                            <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white">{profile.name}</h3>
                            <p className="text-sm text-blue-400">{profile.title}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{profile.bio}</p>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map(skill => (
                              <span 
                                key={skill} 
                                className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-700/50"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Interested In</h4>
                          <div className="flex flex-wrap gap-2">
                            {profile.interests.map(interest => (
                              <span 
                                key={interest} 
                                className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-700/50"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                          <span>Interested in: {profile.hackathonInterest}</span>
                        </div>
                        
                        <div className="flex space-x-3 mb-4">
                          <a 
                            href={`https://${profile.github}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                          </a>
                          <a 
                            href={`https://${profile.linkedin}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        </div>
                        
                        <a 
                          href={`mailto:${profile.contactEmail}`}
                          className="block w-full py-2 text-center bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                        >
                          Contact
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Pagination (simplified) */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 rounded-lg bg-gray-800 text-gray-400 cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-2 rounded-lg bg-blue-600 text-white">1</button>
              <button className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">2</button>
              <button className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">3</button>
              <button className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">
                Next
              </button>
            </nav>
          </div>
          
          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl overflow-hidden border border-blue-800/50 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to find your perfect team?</h2>
            <p className="text-blue-200 mb-6 max-w-3xl mx-auto">
              Create a profile to showcase your skills and interests, or browse available teams for upcoming hackathons.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowCreateProfileModal(true)}
                className="px-6 py-3 bg-white text-indigo-900 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Create Your Profile
              </button>
              <Link 
                to="/hackathons"
                className="px-6 py-3 bg-indigo-800/60 text-white font-medium rounded-lg border border-indigo-600 hover:bg-indigo-800 transition-colors"
              >
                Browse Hackathons
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Profile Modal (Placeholder - Simplified) */}
      {showCreateProfileModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Create Your Profile</h3>
                <button 
                  onClick={() => setShowCreateProfileModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6">
                Complete your profile to connect with potential team members or find a team to join.
              </p>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <button className="flex-1 p-6 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-center">
                    <svg className="h-12 w-12 mx-auto mb-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h4 className="text-lg font-medium text-white mb-2">I'm looking for a team</h4>
                    <p className="text-gray-400">Create a profile as an individual looking to join a team</p>
                  </button>
                  
                  <button className="flex-1 p-6 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-center">
                    <svg className="h-12 w-12 mx-auto mb-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h4 className="text-lg font-medium text-white mb-2">Our team needs members</h4>
                    <p className="text-gray-400">Create a team profile to find additional team members</p>
                  </button>
                </div>
                
                <p className="text-center text-gray-400">
                  Note: This is a simplified demo. In a full implementation, clicking either option would show a detailed form.
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-700 flex justify-end">
              <button 
                onClick={() => setShowCreateProfileModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg mr-3 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Profile creation would be implemented in a full version');
                  setShowCreateProfileModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamFormationPage; 