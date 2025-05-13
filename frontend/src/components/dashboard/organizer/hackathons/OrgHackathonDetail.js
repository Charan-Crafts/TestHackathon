import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHackathonById } from '../../../../data/hackathons';
import { formatDate } from './utils/formatters';

// Tab components will be imported from the detail folder
import Overview from './detail/Overview';
import Settings from './detail/Settings';
import Rounds from './detail/Rounds';
import Participants from './detail/Participants';
import Teams from './detail/Teams';
import Submissions from './detail/Submissions';
import Judging from './detail/Judging';

const OrgHackathonDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Fetch hackathon data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get hackathon by ID from the data source
        const data = getHackathonById(id);
        
        if (!data) {
          setError("Hackathon not found");
          return;
        }
        
        // Process hackathon data
        let processedHackathon = {
          ...data,
          logo: data.image,
          status: data.status === 'Registration Open' ? 'live' : data.status === 'Coming Soon' ? 'draft' : 'rejected',
          lastUpdated: new Date().toISOString(),
          stats: {
            participants: typeof data.participants === 'string' 
              ? parseInt(data.participants.replace(/[^\d]/g, ''), 10) 
              : data.participants || 0,
            teams: 0,
            submissions: 0,
            daysActive: 0,
            viewCount: Math.floor(Math.random() * 1000) + 200,
          },
          rounds: data.rounds || [
            { name: "Registration", startDate: data.dates?.split(' - ')[0], endDate: data.registrationDeadline, description: "Registration period for all participants" },
            { name: "Development", startDate: data.registrationDeadline, endDate: data.dates?.split(' - ')[1], description: "Main development period for projects" }
          ],
          // Add additional fields needed for comprehensive management
          settings: {
            requireApproval: true,
            allowTeamFormation: true,
            maxTeamSize: 4,
            autoStartRounds: true,
            judgesAssigned: [],
            judgingCriteria: [
              { name: "Innovation", weight: 25 },
              { name: "Technical Difficulty", weight: 25 },
              { name: "Completeness", weight: 25 },
              { name: "Presentation", weight: 25 }
            ]
          }
        };
        
        // Calculate teams and submissions based on participant count
        if (processedHackathon.status === 'live') {
          const participantCount = processedHackathon.stats.participants;
          processedHackathon.stats.teams = Math.floor(participantCount / 3);
          processedHackathon.stats.submissions = Math.floor(processedHackathon.stats.teams * 0.8);
          processedHackathon.stats.daysActive = Math.floor(Math.random() * 14) + 1;
        }
        
        setHackathon(processedHackathon);
      } catch (err) {
        console.error("Error fetching hackathon:", err);
        setError("Failed to load hackathon details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEditHackathon = () => {
    navigate(`/host/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/dashboard/organizer/hackathons');
  };

  const handlePublish = () => {
    if (hackathon.status === 'draft') {
      // In a real app, this would be an API call
      setHackathon({
        ...hackathon,
        status: 'live'
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading hackathon details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !hackathon) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-lg p-8 bg-gray-800/50 rounded-xl border border-red-800/40">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">{error || "Hackathon not found"}</h2>
          <p className="text-gray-400 mb-6">We couldn't find the hackathon you're looking for. It may have been removed or you don't have access to it.</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Back to Hackathons
          </button>
        </div>
      </div>
    );
  }

  // Render tabs and the active tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return <Overview hackathon={hackathon} />;
      case 'settings':
        return <Settings hackathon={hackathon} setHackathon={setHackathon} />;
      case 'rounds':
        return <Rounds hackathon={hackathon} setHackathon={setHackathon} />;
      case 'participants':
        return <Participants hackathon={hackathon} setHackathon={setHackathon} />;
      case 'teams':
        return <Teams hackathon={hackathon} setHackathon={setHackathon} />;
      case 'submissions':
        return <Submissions hackathon={hackathon} setHackathon={setHackathon} />;
      case 'judging':
        return <Judging hackathon={hackathon} setHackathon={setHackathon} />;
      default:
        return <Overview hackathon={hackathon} />;
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Back button and actions header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Hackathons
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEditHackathon}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Hackathon
          </button>
          
          {hackathon.status === 'draft' && (
            <button
              onClick={handlePublish}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Hackathon Overview */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-purple-900/5 mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Hackathon Logo */}
            <div className="w-24 h-24 flex-shrink-0">
              <img 
                src={hackathon.logo} 
                alt={hackathon.name} 
                className="w-24 h-24 rounded-lg object-cover border border-gray-700/50" 
              />
            </div>
            
            {/* Hackathon Details */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{hackathon.name}</h1>
                  <p className="text-gray-400 mb-4">{hackathon.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-cyan-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-300">{hackathon.dates}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-cyan-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-300">{hackathon.location}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-cyan-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-300">{hackathon.prizes}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {hackathon.tags?.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs rounded-md bg-indigo-900/40 text-indigo-300 border border-indigo-700/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="mb-2">
                    {hackathon.status === 'live' && (
                      <span className="px-3 py-1 text-sm rounded-full bg-green-900/30 text-green-400 border border-green-700/40">
                        Live
                      </span>
                    )}
                    {hackathon.status === 'draft' && (
                      <span className="px-3 py-1 text-sm rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-700/40">
                        Draft
                      </span>
                    )}
                    {hackathon.status === 'rejected' && (
                      <span className="px-3 py-1 text-sm rounded-full bg-red-900/30 text-red-400 border border-red-700/40">
                        Rejected
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated: {formatDate(hackathon.lastUpdated)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div 
          onClick={() => navigate(`/dashboard/organizer/participants?hackathon=${id}`)}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-indigo-900/30 mr-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Participants</div>
              <div className="text-xl font-semibold text-white">{hackathon.stats.participants.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => navigate(`/dashboard/organizer/teams?hackathon=${id}`)}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-cyan-900/30 mr-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Teams</div>
              <div className="text-xl font-semibold text-white">{hackathon.stats.teams.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => navigate(`/dashboard/organizer/submissions?hackathon=${id}`)}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-900/30 mr-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Submissions</div>
              <div className="text-xl font-semibold text-white">{hackathon.stats.submissions.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => navigate(`/dashboard/organizer/analytics?hackathon=${id}`)}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-900/30 mr-4">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Views</div>
              <div className="text-xl font-semibold text-white">{hackathon.stats.viewCount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('rounds')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'rounds'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Rounds
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'participants'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Participants
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'teams'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Teams
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'submissions'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Submissions
          </button>
          <button
            onClick={() => setActiveTab('judging')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'judging'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Judging
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[60vh]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default OrgHackathonDetail;
