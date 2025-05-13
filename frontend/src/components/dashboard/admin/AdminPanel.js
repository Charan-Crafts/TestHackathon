import React from 'react';
import { 
  UsersIcon, 
  PresentationChartLineIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  CogIcon,
  RocketLaunchIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

const AdminPanel = ({ user }) => {
  // Mock stats for admin dashboard
  const quickStats = [
    { 
      id: 1, 
      name: 'Total Users', 
      value: 2845, 
      trend: '+125 this month',
      percentage: 78,
      color: 'blue'
    },
    { 
      id: 2, 
      name: 'Active Hackathons', 
      value: 12, 
      trend: '+3 this month',
      percentage: 65,
      color: 'purple'
    },
    { 
      id: 3, 
      name: 'Submissions', 
      value: 342, 
      trend: '+87 this week',
      percentage: 82,
      color: 'green'
    },
    { 
      id: 4, 
      name: 'Challenge Completions', 
      value: 1567, 
      trend: '+315 this month',
      percentage: 90,
      color: 'yellow'
    },
  ];

  // Admin sections data
  const adminSections = [
    {
      id: 'users',
      title: 'User Management',
      icon: <UsersIcon className="w-8 h-8" />,
      description: 'Manage users, roles, and permissions',
      link: '/dashboard/admin/users',
      color: 'bg-blue-600'
    },
    {
      id: 'hackathons',
      title: 'Hackathon Management',
      icon: <RocketLaunchIcon className="w-8 h-8" />,
      description: 'Manage, approve, and feature hackathons',
      link: '/dashboard/admin/hackathons',
      color: 'bg-purple-600'
    },
    {
      id: 'challenges',
      title: 'Challenge Management',
      icon: <CodeBracketIcon className="w-8 h-8" />,
      description: 'Manage coding challenges and difficulty levels',
      link: '/dashboard/admin/challenges',
      color: 'bg-green-600'
    },
    {
      id: 'moderation',
      title: 'Content Moderation',
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      description: 'Review and moderate user-generated content',
      link: '/dashboard/admin/moderation',
      color: 'bg-red-600'
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: <PresentationChartLineIcon className="w-8 h-8" />,
      description: 'View platform statistics and generate reports',
      link: '/dashboard/admin/analytics',
      color: 'bg-amber-600'
    },
    {
      id: 'system',
      title: 'System Settings',
      icon: <CogIcon className="w-8 h-8" />,
      description: 'Configure system settings and integrations',
      link: '/dashboard/admin/system',
      color: 'bg-cyan-600'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Admin Welcome Section */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900/70 via-purple-900/40 to-gray-900/70 rounded-xl p-4 backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-lg bg-purple-900/50">
                <ShieldCheckIcon className="w-8 h-8 text-purple-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl text-white font-bold">Admin Dashboard</h2>
                <p className="text-gray-300 text-sm sm:text-base">Manage all aspects of the platform</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-md transition-colors">
                View System Logs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat) => (
          <div key={stat.id} className="bg-gray-800/70 rounded-xl shadow-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-900/50 text-blue-300' : 
                  stat.color === 'purple' ? 'bg-purple-900/50 text-purple-300' : 
                  stat.color === 'green' ? 'bg-green-900/50 text-green-300' : 
                  'bg-yellow-900/50 text-yellow-300'
                }`}>
                  {stat.color === 'blue' ? <UsersIcon className="w-5 h-5" /> :
                   stat.color === 'purple' ? <RocketLaunchIcon className="w-5 h-5" /> :
                   stat.color === 'green' ? <DocumentCheckIcon className="w-5 h-5" /> :
                   <CodeBracketIcon className="w-5 h-5" />}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-green-400 bg-green-900/40 px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-white my-1">{stat.value}</p>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                  <div className={`h-1.5 rounded-full ${
                    stat.color === 'blue' ? 'bg-blue-500' : 
                    stat.color === 'purple' ? 'bg-purple-500' : 
                    stat.color === 'green' ? 'bg-green-500' : 
                    'bg-yellow-500'
                  }`} style={{ width: `${stat.percentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Sections */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center relative pl-2">
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></span>
          Admin Functions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminSections.map((section) => (
            <div 
              key={section.id} 
              className="bg-gray-800/70 rounded-xl shadow-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 p-4 hover:shadow-purple-900/20 hover:shadow-lg"
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg mr-4 ${section.color}`}>
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-1">{section.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{section.description}</p>
                  <a 
                    href={section.link} 
                    className="inline-block text-purple-400 hover:text-purple-300 font-medium text-sm"
                  >
                    Manage →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center relative pl-2">
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></span>
          System Overview
        </h3>
        <div className="bg-gray-800/70 rounded-xl shadow-lg border border-gray-700/50 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Server Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">CPU Usage</span>
                  <div className="w-2/3 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "23%" }}></div>
                  </div>
                  <span className="text-gray-300 text-sm">23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Memory</span>
                  <div className="w-2/3 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <span className="text-gray-300 text-sm">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Disk Space</span>
                  <div className="w-2/3 bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                  <span className="text-gray-300 text-sm">72%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Network</span>
                  <div className="w-2/3 bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "18%" }}></div>
                  </div>
                  <span className="text-gray-300 text-sm">18%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Recent Logs</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                <div className="text-sm text-gray-300 py-1 border-b border-gray-700">
                  <span className="text-green-400">[INFO]</span> System backup completed successfully
                </div>
                <div className="text-sm text-gray-300 py-1 border-b border-gray-700">
                  <span className="text-yellow-400">[WARN]</span> High memory usage detected
                </div>
                <div className="text-sm text-gray-300 py-1 border-b border-gray-700">
                  <span className="text-blue-400">[INFO]</span> 25 new users registered today
                </div>
                <div className="text-sm text-gray-300 py-1 border-b border-gray-700">
                  <span className="text-red-400">[ERROR]</span> Email service connection failed - retrying
                </div>
                <div className="text-sm text-gray-300 py-1 border-b border-gray-700">
                  <span className="text-green-400">[INFO]</span> Challenge database updated
                </div>
                <div className="text-sm text-gray-300 py-1">
                  <span className="text-blue-400">[INFO]</span> Daily reports generated
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 