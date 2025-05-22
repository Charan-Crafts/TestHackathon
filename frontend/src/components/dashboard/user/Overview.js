import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../../common/BottomNav';
import BottomNavStyles from '../../common/BottomNavStyles';
import { getApprovedHackathons, registrationAPI, teamAPI } from '../../../services/api';

// Add Font Awesome CSS and Custom Styles
const CustomStyles = () => {
  React.useEffect(() => {
    // Add Font Awesome
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(link);

    // Create style element for custom scrollbar
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        height: 6px;
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(30, 30, 40, 0.2);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(121, 92, 39, 0.6);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(180, 130, 50, 0.8);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);
  return null;
};

// Mock user data
const DEFAULT_USER_DATA = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://i.pravatar.cc/300?img=8',
  activeChallenges: 3,
  streak: 14,
  level: 'Advanced',
  score: 950,
};

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  // Use the passed user data if available, otherwise fall back to default data
  const userData = user || DEFAULT_USER_DATA;

  // State declarations
  const [teamRoles, setTeamRoles] = useState({});
  const [upcomingHackathons, setUpcomingHackathons] = useState([]);
  const [loadingHackathons, setLoadingHackathons] = useState(true);
  const [hackathonError, setHackathonError] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);

  // Calculate quick stats using useMemo to optimize performance
  const quickStats = React.useMemo(() => [
    {
      id: 1,
      name: 'Hackathons',
      value: userRegistrations.length || 0,
      icon: 'laptop-code',
      iconClass: 'fas fa-laptop-code',
      color: 'blue',
      trend: `${userRegistrations.length > 0 ? '+1 registered' : 'No registrations'}`,
      percentage: Math.min((userRegistrations.length / 10) * 100, 100), // Assuming 10 is max for 100%
      description: `${userRegistrations.length} hackathon${userRegistrations.length !== 1 ? 's' : ''} registered`
    },
    {
      id: 2,
      name: 'Teams',
      value: userRegistrations.filter(reg => reg.teamId || reg.team).length || 0,
      icon: 'users',
      iconClass: 'fas fa-users',
      color: 'yellow',
      trend: 'Active teams',
      percentage: Math.min((userRegistrations.filter(reg => reg.teamId || reg.team).length / 5) * 100, 100), // Assuming 5 is max for 100%
      description: 'Teams participated in'
    },
    {
      id: 3,
      name: 'Upcoming',
      value: upcomingHackathons.length || 0,
      icon: 'code',
      iconClass: 'fas fa-code',
      color: 'green',
      trend: 'Available',
      percentage: Math.min((upcomingHackathons.length / 10) * 100, 100), // Assuming 10 is max for 100%
      description: 'Upcoming hackathons'
    },
    {
      id: 4,
      name: 'Completed',
      value: userRegistrations.filter(reg => reg.status === 'completed').length || 0,
      icon: 'award',
      iconClass: 'fas fa-award',
      color: 'purple',
      trend: 'Finished',
      percentage: Math.min((userRegistrations.filter(reg => reg.status === 'completed').length / userRegistrations.length) * 100, 100),
      description: 'Completed hackathons'
    },
  ], [userRegistrations, upcomingHackathons]); // Dependencies for useMemo

  // Add function to check team role
  const checkTeamRole = async (hackathonId) => {
    try {
      console.log('Checking team role for hackathon:', hackathonId);
      const response = await teamAPI.checkTeamRole(hackathonId);
      console.log('Team role response:', response.data);

      if (response.data && response.data.success) {
        setTeamRoles(prev => ({
          ...prev,
          [hackathonId]: response.data.data
        }));
      }
    } catch (error) {
      console.error(`Error checking team role for hackathon ${hackathonId}:`, error);
      // Handle error state if needed
      setTeamRoles(prev => ({
        ...prev,
        [hackathonId]: {
          status: 'ERROR',
          message: 'Error checking team status',
          isRegistered: false,
          isTeamLeader: false,
          isTeamMember: false
        }
      }));
    }
  };

  // Modify the useEffect for loading hackathons
  useEffect(() => {
    setLoadingHackathons(true);
    getApprovedHackathons(5)
      .then(res => {
        if (res.data && res.data.success) {
          const hackathons = res.data.data;
          setUpcomingHackathons(hackathons);
          // Check team roles for each hackathon
          hackathons.forEach(hackathon => {
            const hackathonId = hackathon._id || hackathon.id;
            if (hackathonId) {
              checkTeamRole(hackathonId);
            }
          });
        } else {
          setUpcomingHackathons([]);
        }
        setLoadingHackathons(false);
      })
      .catch(err => {
        console.error('Error loading hackathons:', err);
        setHackathonError('Failed to load hackathons');
        setUpcomingHackathons([]);
        setLoadingHackathons(false);
      });
  }, []);

  // Fetch user's registrations
  useEffect(() => {
    if (user && user._id) {
      registrationAPI.getRegistrations({ userId: user._id })
        .then(res => {
          if (res.data && res.data.success) {
            setUserRegistrations(res.data.data);
          }
        })
        .catch(() => setUserRegistrations([]));
    }
  }, [user]);

  // Set of hackathon IDs the user is registered for
  const registeredHackathonIds = new Set(userRegistrations.map(r => (r.hackathonId?._id || r.hackathonId)));

  // Helper function to check if user is registered for a hackathon
  const isRegisteredForHackathon = (hackathonId) => {
    const isRegistered = userRegistrations.some(reg => {
      const registeredHackathonId = reg.hackathonId || (reg.hackathon && reg.hackathon._id);
      console.log(`Comparing hackathon IDs:`, {
        current: hackathonId,
        registered: registeredHackathonId,
        match: registeredHackathonId === hackathonId
      });
      return registeredHackathonId === hackathonId;
    });
    return isRegistered;
  };

  // eslint-disable-next-line no-unused-vars
  const learningProgress = [
    { id: 1, name: 'Web Development Fundamentals', progress: 85, category: 'Web Development' },
    { id: 2, name: 'Data Structures & Algorithms', progress: 60, category: 'Computer Science' },
    { id: 3, name: 'Machine Learning Basics', progress: 30, category: 'Data Science' },
    { id: 4, name: 'Mobile App Development', progress: 45, category: 'Mobile Development' },
  ];

  // Mock recent activity data
  const recentActivity = [
    {
      id: 1,
      type: 'challenge_completed',
      title: 'Sorting Algorithm Comparison',
      date: '2 days ago',
      description: 'Completed with score 92/100',
      icon: 'trophy',
      color: 'green'
    },
    {
      id: 2,
      type: 'hackathon_joined',
      title: 'Education Innovation Challenge',
      date: '5 days ago',
      description: 'Joined as part of Learning Crafters team',
      icon: 'users',
      color: 'blue'
    },
    {
      id: 3,
      type: 'project_updated',
      title: 'SmartAssistant',
      date: '1 week ago',
      description: 'Updated project description and added features',
      icon: 'edit',
      color: 'yellow'
    },
    {
      id: 4,
      type: 'certificate_earned',
      title: 'React Development',
      date: '2 weeks ago',
      description: 'Earned certificate with score 94/100',
      icon: 'certificate',
      color: 'purple'
    },
  ];

  // Dashboard sections data
  // eslint-disable-next-line no-unused-vars
  const dashboardSections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: 'user',
      description: 'Update your personal details, skills, and preferences',
      link: '/dashboard/profile',
      color: 'bg-brand-700'
    },
    {
      id: 'applications',
      title: 'Hackathon Status',
      icon: 'laptop-code',
      description: 'Track your hackathon applications',
      link: '/dashboard/user/hackathons',
      color: 'bg-yellow-500'
    },
    {
      id: 'hackathons',
      title: 'Hackathons',
      icon: 'laptop-code',
      description: 'Discover and join upcoming hackathons',
      link: '/dashboard/user/hackathons',
      color: 'bg-pink-500'
    },
    {
      id: 'watchlist',
      title: 'Watchlist',
      icon: 'bookmark',
      description: 'Manage your saved hackathons and content',
      link: '/dashboard/user/watchlist',
      color: 'bg-yellow-600'
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: 'project-diagram',
      description: 'Manage your hackathon projects and submissions',
      link: '/dashboard/user/projects',
      color: 'bg-purple-500'
    },
    {
      id: 'challenges',
      title: 'Coding Challenges',
      icon: 'code',
      description: 'Solve coding challenges and improve your skills',
      link: '/dashboard/user/challenges',
      color: 'bg-green-500'
    },
    {
      id: 'certificates',
      title: 'Certificates',
      icon: 'certificate',
      description: 'View and share your earned certificates',
      link: '/dashboard/user/certificates',
      color: 'bg-red-500'
    },
    {
      id: 'mentorship',
      title: 'Mentorship',
      icon: 'user-friends',
      description: 'Connect with mentors and manage mentorship sessions',
      link: '/dashboard/user/mentorship',
      color: 'bg-cyan-500'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell',
      description: 'Manage your notification preferences',
      link: '/dashboard/user/notifications',
      color: 'bg-orange-500'
    },
    {
      id: 'resources',
      title: 'Resources',
      icon: 'book',
      description: 'Access learning resources and documentation',
      link: '/dashboard/user/resources',
      color: 'bg-teal-500'
    },
    {
      id: 'networking',
      title: 'Community',
      icon: 'network-wired',
      description: 'Connect with other developers and teams',
      link: '/dashboard/user/community',
      color: 'bg-lime-500'
    },
    {
      id: 'calendar',
      title: 'Calendar',
      icon: 'calendar-alt',
      description: 'View upcoming events and deadlines',
      link: '/dashboard/user/calendar',
      color: 'bg-amber-500'
    }
  ];

  // eslint-disable-next-line no-unused-vars
  const getIconClass = (iconName, color) => {
    const colorMap = {
      blue: 'text-brand-700',
      yellow: 'text-yellow-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600',
      red: 'text-red-600',
      cyan: 'text-cyan-600',
      orange: 'text-orange-600',
      teal: 'text-teal-600',
      lime: 'text-lime-600',
      amber: 'text-amber-600',
      pink: 'text-pink-600'
    };
    return `fas fa-${iconName} ${colorMap[color] || 'text-gray-600'}`;
  };

  // Add handler for registration click
  const handleRegisterClick = (hackathonId) => {
    navigate(`/registration/${hackathonId}`);
  };

  return (
    <>
      <CustomStyles />
      <BottomNavStyles />
      <div className="px-4 py-6 bg-white">
        {/* User Welcome Section */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-indigo-900/50 rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-indigo-500/30 shadow-lg shadow-indigo-900/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <div className="mr-3 h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-lg shadow-purple-900/20">
                  <img src={userData.avatar} alt={userData.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl text-white font-bold flex flex-wrap items-center">
                    Welcome, {userData.name}
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white">
                      {userData.level}
                    </span>
                  </h2>
                  <p className="text-gray-300 text-xs sm:text-sm">{userData.email}</p>
                </div>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <div className="flex items-center justify-end text-purple-300 text-sm">
                  <i className="fas fa-fire mr-1 text-orange-400"></i>
                  <span className="mr-3">{userData.streak} day streak</span>
                  <i className="fas fa-star mr-1 text-yellow-400"></i>
                  <span>{userData.score} points</span>
                </div>
                <div className="mt-1">
                  <span className="px-2 py-0.5 text-xs bg-purple-900/50 rounded-full text-purple-200 border border-purple-500/30">
                    <i className="fas fa-code-branch mr-1"></i>
                    {userData.activeChallenges} active challenges
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center relative pl-2">
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-700 to-brand-900 rounded-full"></span>
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {quickStats.map((stat) => (
              <div key={stat.id} className="relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/95 rounded-xl shadow-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group">
                {/* Colored top border */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${stat.color === 'blue' ? 'bg-brand-700' :
                  stat.color === 'yellow' ? 'bg-yellow-500' :
                    stat.color === 'green' ? 'bg-green-500' :
                      'bg-purple-500'
                  }`}></div>

                <div className="p-3 sm:p-5">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    {/* Icon container */}
                    <div className={`p-2 sm:p-3 rounded-xl ${stat.color === 'blue' ? 'bg-brand-900/80 text-brand-300' :
                      stat.color === 'yellow' ? 'bg-yellow-900/80 text-yellow-300' :
                        stat.color === 'green' ? 'bg-green-900/80 text-green-300' :
                          'bg-purple-900/80 text-purple-300'
                      }`}>
                      <i className={`${stat.iconClass} text-base sm:text-lg`}></i>
                    </div>

                    {/* Trend indicator - Hidden on very small screens */}
                    <div className="hidden xs:flex flex-col items-end">
                      <span className="text-xs font-semibold text-green-400 bg-green-900/40 px-2 py-1 rounded-full flex items-center border border-green-700/40">
                        <i className="fas fa-arrow-up mr-1 text-[10px]"></i> {stat.trend}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs sm:text-sm font-medium text-gray-400">{stat.name}</p>
                    <div className="flex items-baseline">
                      <p className="text-xl sm:text-3xl font-extrabold text-white my-1">{stat.value}</p>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400">{stat.description}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-800/80 rounded-full h-1.5 mb-1">
                    <div
                      className={`h-1.5 rounded-full ${stat.color === 'blue' ? 'bg-brand-700' :
                        stat.color === 'yellow' ? 'bg-yellow-500' :
                          stat.color === 'green' ? 'bg-green-500' :
                            'bg-purple-500'
                        }`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-400">
                    <span>Progress</span>
                    <span className={
                      stat.color === 'blue' ? 'text-brand-700' :
                        stat.color === 'yellow' ? 'text-yellow-400' :
                          stat.color === 'green' ? 'text-green-400' :
                            'text-purple-400'
                    }>{stat.percentage}%</span>
                  </div>
                </div>

                {/* Background decoration */}
                <div className={`absolute -bottom-6 -right-6 w-16 sm:w-20 h-16 sm:h-20 rounded-full ${stat.color === 'blue' ? 'bg-brand-700/10' :
                  stat.color === 'yellow' ? 'bg-yellow-500/10' :
                    stat.color === 'green' ? 'bg-green-500/10' :
                      'bg-purple-500/10'
                  } opacity-50`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid layout for Upcoming Hackathons and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Left column - Upcoming Hackathons (2/3 width) */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center relative pl-2">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-700 to-brand-900 rounded-full"></span>
              Upcoming Hackathons
            </h3>
            <div className="bg-gradient-to-r from-brand-900/30 via-gray-900/40 to-brand-900/30 rounded-xl p-1 backdrop-blur-sm border border-brand-900/30 shadow-lg shadow-brand-900/5">
              <div className="bg-gray-900/50 rounded-xl p-3 sm:p-4">
                {loadingHackathons ? (
                  <div className="text-center text-brand-300 py-8">Loading hackathons...</div>
                ) : hackathonError ? (
                  <div className="text-center text-red-400 py-8">{hackathonError}</div>
                ) : upcomingHackathons.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">No approved hackathons found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {upcomingHackathons.map((hackathon) => {
                      const hackathonId = hackathon._id || hackathon.id;
                      const isRegistered = registeredHackathonIds.has(hackathonId);
                      const teamRole = teamRoles[hackathonId];

                      return (
                        <div key={hackathonId} className="bg-gradient-to-br from-gray-800/70 via-gray-800/60 to-gray-900/70 rounded-lg border border-gray-700/50 shadow-md p-3 sm:p-4 hover:shadow-brand-900/20 hover:border-brand-700/30 transition-all duration-300 hover:-translate-y-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-white text-sm sm:text-base">{hackathon.title || hackathon.name}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-300 border border-green-500/30`}>
                              {hackathon.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-3">
                            {hackathon.startDate ? new Date(hackathon.startDate).toLocaleDateString() : ''} -
                            {hackathon.endDate ? new Date(hackathon.endDate).toLocaleDateString() : ''}
                          </p>

                          {/* Add team role display */}
                          {teamRole && (
                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Team Status</span>
                                <span className={`px-2 py-0.5 rounded-full ${teamRole.status === 'TEAM_LEADER' ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30' :
                                  teamRole.status === 'TEAM_MEMBER' ? 'bg-blue-900/50 text-blue-300 border border-blue-500/30' :
                                    teamRole.status === 'REGISTERED_NO_TEAM' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30' :
                                      'bg-gray-900/50 text-gray-300 border border-gray-500/30'
                                  }`}>
                                  {teamRole.message}
                                </span>
                              </div>
                              {teamRole.team && (
                                <div className="text-xs text-gray-400">
                                  <div className="flex justify-between items-center">
                                    <span>Team: {teamRole.team.teamName}</span>
                                  </div>
                                  <div className="mt-1">
                                    <span>Members: {teamRole.team.currentSize}/{teamRole.team.maxSize}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-4">
                            <div className="text-xs bg-brand-900/50 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30 inline-flex items-center">
                              <i className="far fa-clock mr-1 text-xs sm:text-sm"></i>
                            </div>
                            {isRegistered || (teamRoles[hackathonId] && teamRoles[hackathonId].isTeamMember) ? (
                              <Link
                                to={`/dashboard/user/hackathons/${hackathonId}`}
                                className="text-xs bg-gradient-to-r from-brand-700/20 to-brand-900/20 hover:from-brand-700/30 hover:to-brand-900/30 text-brand-700 hover:text-brand-900 px-3 py-1 rounded-lg transition-colors border border-brand-500/30"
                              >
                                Details
                              </Link>
                            ) : (
                              <button
                                onClick={() => handleRegisterClick(hackathonId)}
                                className="text-xs bg-gradient-to-r from-green-700/20 to-green-900/20 hover:from-green-700/30 hover:to-green-900/30 text-green-700 hover:text-green-900 px-3 py-1 rounded-lg transition-colors border border-green-500/30"
                              >
                                Register
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-4 text-center">
                  <Link
                    to="/dashboard/user/hackathons"
                    className="inline-flex items-center justify-center text-sm text-brand-700 hover:text-brand-900 transition-all group"
                  >
                    View All Hackathons
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Recent Activity (1/3 width) */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center relative pl-2">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></span>
              Recent Activity
            </h3>
            <div className="bg-gradient-to-r from-cyan-900/30 via-gray-900/40 to-cyan-900/30 rounded-xl p-1 backdrop-blur-sm border border-cyan-800/30 shadow-lg shadow-cyan-900/5">
              <div className="bg-gray-900/50 rounded-xl p-3 sm:p-4">
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 rounded-lg border border-gray-700/50 p-2 sm:p-3 hover:border-cyan-500/30 transition-all duration-300">
                      <div className="flex items-start">
                        <div className={`p-2 sm:p-3 rounded-lg ${activity.color === 'green' ? 'bg-green-900/80 text-green-300' :
                          activity.color === 'blue' ? 'bg-blue-900/80 text-blue-300' :
                            activity.color === 'yellow' ? 'bg-yellow-900/80 text-yellow-300' :
                              'bg-purple-900/80 text-purple-300'
                          } mr-2 sm:mr-3 flex-shrink-0`}>
                          <i className={`fas fa-${activity.icon} text-base sm:text-lg`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-xs sm:text-sm truncate">{activity.title}</h4>
                          <p className="text-[10px] sm:text-xs text-gray-400 truncate">{activity.description}</p>
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0 ml-1 sm:ml-2">
                          {activity.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link
                    to="/dashboard/activity"
                    className="inline-flex items-center justify-center text-sm text-cyan-400 hover:text-cyan-300 transition-all group"
                  >
                    View All Activity
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Bottom Navigation - simplified with direct links */}
      <BottomNav />
    </>
  );
};

export default UserDashboard; 