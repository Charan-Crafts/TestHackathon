import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hackathonAPI, registrationAPI } from '../../../services/api';
import { handleApiError } from '../../../services/api';

// Import components
import ParticipantStatsCards from './participants/components/ParticipantStatsCards';
import ParticipantSkillsFilter from './participants/components/ParticipantSkillsFilter';
import ExportParticipantsModal from './participants/components/ExportParticipantsModal';

// Import custom styles
import '../../../styles/CustomScrollbar.css';

const ParticipantsDashboard = ({ user }) => {
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
    totalHackathons: 0,
    totalTeams: 0
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch hackathons and participants data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch hackathons
        const hackathonsResponse = await hackathonAPI.getMyHackathons();
        let hackathonsData = hackathonsResponse.data.data;
        // Parse technology field if it's a string
        hackathonsData = hackathonsData.map(h => {
          let technology = h.technology;
          if (typeof technology === 'string') {
            try {
              technology = JSON.parse(technology);
            } catch {
              technology = [];
            }
          }
          return { ...h, technology };
        });
        setHackathons(hackathonsData);

        // Fetch participants for all hackathons
        const registrationsResponse = await registrationAPI.getRegistrations();
        const registrationsData = registrationsResponse.data.data;

        // Transform registration data to match our UI format
        const transformedParticipants = registrationsData.map(reg => ({
          id: reg._id,
          name: `${reg.personalInfo.firstName} ${reg.personalInfo.lastName}`,
          email: reg.personalInfo.email,
          hackathonId: reg.hackathonId._id,
          hackathonName: reg.hackathonId.title,
          hackathonLogo: reg.hackathonId.image,
          registrationDate: reg.createdAt,
          status: reg.status,
          teamId: reg.teamId?._id,
          teamName: reg.teamInfo?.teamName,
          skills: reg.professionalInfo?.skills || []
        }));

        setParticipants(transformedParticipants);

        // Extract unique skills from all participants
        const allSkills = new Set();
        transformedParticipants.forEach(participant => {
          participant.skills.forEach(skill => allSkills.add(skill));
        });
        setAvailableSkills(Array.from(allSkills));

        // Calculate stats
        const calculateStats = (data) => {
          return {
            total: data.length,
            active: data.filter(p => p.status === 'approved').length,
            pending: data.filter(p => p.status === 'pending').length,
            rejected: data.filter(p => p.status === 'rejected').length,
            totalHackathons: [...new Set(data.map(p => p.hackathonId))].length,
            totalTeams: [...new Set(data.filter(p => p.teamId).map(p => p.teamId))].length
          };
        };

        setStats(calculateStats(transformedParticipants));
      } catch (err) {
        setError(handleApiError(err).message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter participants based on selected filter and search text and skills
  const filteredParticipants = participants.filter(participant => {
    const matchesFilter = filter === 'all' || participant.status === filter;
    const matchesSearch = !searchText ||
      participant.name.toLowerCase().includes(searchText.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchText.toLowerCase()) ||
      participant.hackathonName.toLowerCase().includes(searchText.toLowerCase()) ||
      (participant.teamName && participant.teamName.toLowerCase().includes(searchText.toLowerCase()));
    const matchesSkills = selectedSkills.length === 0 ||
      participant.skills.some(skill => selectedSkills.includes(skill));

    return matchesFilter && matchesSearch && matchesSkills;
  });

  // Handle invite participants
  const handleInviteParticipants = () => {
    alert('Invite participants feature coming soon');
  };

  // Handle export participants
  const handleExportParticipants = () => {
    setShowExportModal(true);
  };

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  // Handle viewing a participant
  const handleViewParticipant = (id) => {
    alert(`View participant ${id} details`);
  };

  // Handle editing a participant
  const handleEditParticipant = (id) => {
    alert(`Edit participant ${id}`);
  };

  // Handle approving a participant
  const handleApproveParticipant = async (id) => {
    try {
      await registrationAPI.reviewRegistration(id, { status: 'approved' });
      setParticipants(prevParticipants =>
        prevParticipants.map(p =>
          p.id === id ? { ...p, status: 'approved' } : p
        )
      );
    } catch (err) {
      console.error('Error approving participant:', err);
      alert('Failed to approve participant. Please try again.');
    }
  };

  // Handle rejecting a participant
  const handleRejectParticipant = async (id) => {
    try {
      await registrationAPI.reviewRegistration(id, { status: 'rejected' });
      setParticipants(prevParticipants =>
        prevParticipants.map(p =>
          p.id === id ? { ...p, status: 'rejected' } : p
        )
      );
    } catch (err) {
      console.error('Error rejecting participant:', err);
      alert('Failed to reject participant. Please try again.');
    }
  };

  // Handle sending a message to a participant
  const handleMessageParticipant = (id) => {
    alert(`Message participant ${id}`);
  };

  // Handle viewing a team
  const handleViewTeam = (teamId) => {
    navigate(`/dashboard/organizer/teams/detail/${teamId}`);
  };

  // Handle selecting a hackathon
  const handleSelectHackathon = (hackathon) => {
    setSelectedHackathon(hackathon);
    // Filter participants for the selected hackathon
    const hackathonParticipants = participants.filter(p => p.hackathonId === hackathon._id);
    setParticipants(hackathonParticipants);
  };

  // Handle going back to hackathon list
  const handleBackToHackathons = async () => {
    try {
      setLoading(true);
      const registrationsResponse = await registrationAPI.getRegistrations();
      const registrationsData = registrationsResponse.data.data;

      // Transform registration data to match our UI format
      const transformedParticipants = registrationsData.map(reg => ({
        id: reg._id,
        name: `${reg.personalInfo.firstName} ${reg.personalInfo.lastName}`,
        email: reg.personalInfo.email,
        hackathonId: reg.hackathonId._id,
        hackathonName: reg.hackathonId.title,
        hackathonLogo: reg.hackathonId.image,
        registrationDate: reg.createdAt,
        status: reg.status,
        teamId: reg.teamId?._id,
        teamName: reg.teamInfo?.teamName,
        skills: reg.professionalInfo?.skills || []
      }));

      setParticipants(transformedParticipants);
      setSelectedHackathon(null);
    } catch (err) {
      console.error('Error fetching all participants:', err);
      alert('Failed to load all participants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render hackathon cards
  const renderHackathonCards = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((hackathon) => {
          const hackathonParticipants = participants.filter(p => p.hackathonId === hackathon._id);
          const participantCount = hackathonParticipants.length;
          const activeCount = hackathonParticipants.filter(p => p.status === 'approved').length;
          const pendingCount = hackathonParticipants.filter(p => p.status === 'pending').length;

          return (
            <div
              key={hackathon._id}
              onClick={() => handleSelectHackathon(hackathon)}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-purple-900/5 cursor-pointer hover:shadow-purple-900/20 transition-all duration-300 hover:border-purple-500/50"
            >
              <div className="relative h-48">
                <img
                  src={hackathon.image}
                  alt={hackathon.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{hackathon.title}</h3>
                  <p className="text-gray-300 text-sm">{hackathon.organizer}</p>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <span className="text-cyan-400 font-medium">{participantCount}</span>
                    <span className="text-gray-400 ml-1">Participants</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 font-medium">{activeCount}</span>
                    <span className="text-gray-400 ml-1">Active</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 font-medium">{pendingCount}</span>
                    <span className="text-gray-400 ml-1">Pending</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Technology badges removed as per user request */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render participants table
  const renderParticipantsTable = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Page Header with Back Button */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToHackathons}
              className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
                <svg className="w-7 h-7 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {selectedHackathon?.title} - Participants
              </h1>
              <p className="text-gray-400">View and manage hackathon participants</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportParticipants}
              className="inline-flex items-center px-4 py-3 bg-gradient-to-br from-cyan-700/70 to-indigo-800/70 hover:from-cyan-600/80 hover:to-indigo-700/80 rounded-lg text-cyan-300 font-medium shadow-lg border border-cyan-500/50 hover:border-cyan-400/70 hover:shadow-cyan-500/20 transform transition-all duration-100 backdrop-blur-sm"
            >
              <svg className="w-5 h-5 mr-2 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            <button
              onClick={handleInviteParticipants}
              className="inline-flex items-center px-4 py-3 bg-gradient-to-br from-purple-700/70 to-indigo-800/70 hover:from-purple-600/80 hover:to-indigo-700/80 rounded-lg text-cyan-300 font-medium shadow-lg border border-cyan-500/50 hover:border-cyan-400/70 hover:shadow-cyan-500/20 transform transition-all duration-100 backdrop-blur-sm"
            >
              <svg className="w-5 h-5 mr-2 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Invite Participants
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <ParticipantStatsCards stats={stats} setFilter={setFilter} />

        {/* Filter Controls and Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === 'all'
                ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-800'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === 'approved'
                ? 'bg-green-900/50 text-green-300 border border-green-800'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === 'pending'
                ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-800'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === 'rejected'
                ? 'bg-red-900/50 text-red-300 border border-red-800'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search participants..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={toggleFilterPanel}
              className={`p-2 rounded-lg border ${selectedSkills.length > 0
                ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700 hover:bg-indigo-800/50'
                : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700/70'
                } transition-colors relative`}
              aria-label="Filter options"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {selectedSkills.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {selectedSkills.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-purple-900/5 mb-8">
          <div className="overflow-x-auto" style={{ maxWidth: "100%", width: "100%" }}>
            <table className="min-w-full divide-y divide-gray-800/70">
              <thead className="bg-gray-800/50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Participant
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Team
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Registered
                  </th>
                  <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-sm font-medium text-cyan-300">{participant.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{participant.name}</div>
                            <div className="text-xs text-gray-500">{participant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        {participant.status === 'approved' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-green-900/30 text-green-400 border border-green-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                            Active
                          </span>
                        )}
                        {participant.status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1"></span>
                            Pending
                          </span>
                        )}
                        {participant.status === 'rejected' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-red-900/30 text-red-400 border border-red-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1"></span>
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-300">
                        {participant.teamName ? (
                          <div className="flex items-center">
                            <svg className="w-3 h-3 text-cyan-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <button
                              onClick={() => handleViewTeam(participant.teamId)}
                              className="hover:text-purple-400 transition-colors hover:underline focus:outline-none"
                            >
                              {participant.teamName}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(participant.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewParticipant(participant.id)}
                            className="text-cyan-500 hover:text-cyan-400 transition-colors"
                            title="View Participant"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {participant.status === 'pending' && (
                            <button
                              onClick={() => handleApproveParticipant(participant.id)}
                              className="text-green-500 hover:text-green-400 transition-colors"
                              title="Approve Participant"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}

                          <button
                            onClick={() => handleEditParticipant(participant.id)}
                            className="text-indigo-500 hover:text-indigo-400 transition-colors"
                            title="Edit Participant"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          {participant.status === 'pending' && (
                            <button
                              onClick={() => handleRejectParticipant(participant.id)}
                              className="text-red-500 hover:text-red-400 transition-colors"
                              title="Reject Participant"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}

                          <button
                            onClick={() => handleMessageParticipant(participant.id)}
                            className="text-blue-500 hover:text-blue-400 transition-colors"
                            title="Message Participant"
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
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No participants found</p>
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
    );
  };

  return (
    <div className="px-4 py-6">
      {selectedHackathon ? renderParticipantsTable() : renderHackathonCards()}

      {/* Slide-in Filter Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-gray-900/95 border-l border-gray-700/50 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${showFilterPanel ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col p-5 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-medium text-white">Filter Options</h3>
            <button
              onClick={toggleFilterPanel}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Skills Filter Component */}
          <ParticipantSkillsFilter
            availableSkills={availableSkills}
            selectedSkills={selectedSkills}
            onSkillsChange={setSelectedSkills}
          />

          {/* Filter Summary */}
          <div className="mt-auto pt-6">
            <div className="p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-lg">
              <p className="text-sm text-indigo-300 font-medium mb-1">Current Filters</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {filter !== 'all' && (
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-800/50">
                    Status: {filter}
                  </span>
                )}
                {selectedSkills.length > 0 && selectedSkills.map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-800/50 flex items-center">
                    {skill}
                    <button
                      onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                      className="ml-1 text-indigo-400 hover:text-indigo-300"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {filter === 'all' && selectedSkills.length === 0 && (
                  <span className="text-xs text-gray-400">No filters applied</span>
                )}
              </div>
              <p className="text-sm text-gray-300">
                Showing {filteredParticipants.length} of {participants.length} participants
              </p>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => {
                  setSelectedSkills([]);
                  setFilter('all');
                  toggleFilterPanel();
                }}
                className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700"
              >
                Clear All
              </button>
              <button
                onClick={toggleFilterPanel}
                className="px-3 py-2 bg-indigo-700 text-indigo-100 rounded-lg border border-indigo-600 hover:bg-indigo-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for filter panel */}
      {showFilterPanel && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleFilterPanel}
        ></div>
      )}

      {/* Export Modal */}
      <ExportParticipantsModal
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        participants={participants}
        hackathons={hackathons}
      />
    </div>
  );
};

export default ParticipantsDashboard; 