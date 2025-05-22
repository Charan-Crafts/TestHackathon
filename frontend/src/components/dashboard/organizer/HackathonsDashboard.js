import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hackathonAPI } from '../../../services/api';
import { getImageUrl } from '../../../utils/imageHelper';

// Import components
import HackathonStatsCards from './hackathons/components/HackathonStatsCards';
import HackathonFilters from './hackathons/components/HackathonFilters';
import HackathonTable from './hackathons/components/HackathonTable';

// Import hooks
import useHackathonFilters from './hackathons/hooks/useHackathonFilters';

const HackathonsManagement = ({ user }) => {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [loading, setLoading] = useState(true);

  // Fetch hackathons created by the current organizer
  useEffect(() => {
    setLoading(true);
    hackathonAPI.getMyHackathons(1, 100)
      .then(res => {
        if (res.data && res.data.success) {
          // Map backend fields to frontend expected fields
          const mapped = res.data.data.map(hackathon => ({
            ...hackathon,
            id: hackathon._id,
            name: hackathon.title,
            logo: getImageUrl(hackathon.imagePath),
            image: getImageUrl(hackathon.imagePath),
            status: hackathon.status === 'approved' ? 'live' : hackathon.status === 'pending' ? 'draft' : hackathon.status,
            stats: {
              participants: hackathon.participants || 0,
              teams: hackathon.teams || 0,
              submissions: hackathon.submissionCount || 0,
              daysActive: 0,
              viewCount: hackathon.viewCount || 0,
            },
            lastUpdated: hackathon.updatedAt,
            rejectionReason: hackathon.rejectionReason || null,
          }));
          setHackathons(mapped);
        } else {
          setHackathons([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setHackathons([]);
        setLoading(false);
      });
  }, []);

  // Use the custom hook for filtering
  const { filter, setFilter, searchText, setSearchText, stats, filteredHackathons } = useHackathonFilters(hackathons);

  // Handle hackathon creation
  const handleCreateHackathon = () => {
    navigate('/host/create');
  };

  // Handle publishing a draft hackathon
  const handlePublishHackathon = (id) => {
    setHackathons(prevHackathons =>
      prevHackathons.map(hack =>
        hack.id === id ? { ...hack, status: 'live' } : hack
      )
    );
  };

  // Handle viewing a hackathon
  const handleViewHackathon = (id) => {
    console.log("handleViewHackathon called with ID:", id);

    // Force navigate to the absolute path to ensure correct routing
    const orgHackathonDetailUrl = `/dashboard/organizer/hackathons/${id}`;
    console.log("Navigating to:", orgHackathonDetailUrl);

    // Use window.location for a hard navigation instead of React Router
    window.location.href = orgHackathonDetailUrl;

    // Prevent further execution
    return;
  };

  // Handle editing a hackathon
  const handleEditHackathon = (id) => {
    navigate(`/host/edit/${id}`);
  };

  // Handle deleting a hackathon
  const handleDeleteHackathon = (hackathon) => {
    setHackathons(prevHackathons =>
      prevHackathons.filter(hack => hack.id !== hackathon.id)
    );
  };

  // Handle duplicating a hackathon
  const handleDuplicateHackathon = (id) => {
    const hackathonToDuplicate = hackathons.find(h => h.id === id);
    if (hackathonToDuplicate) {
      const newHackathon = {
        ...hackathonToDuplicate,
        id: Math.max(...hackathons.map(h => h.id)) + 1,
        name: `${hackathonToDuplicate.name} (Copy)`,
        status: 'draft',
        lastUpdated: new Date().toISOString()
      };

      setHackathons(prevHackathons => [...prevHackathons, newHackathon]);
    }
  };

  // Handle archiving a hackathon
  const handleArchiveHackathon = (id) => {
    // In a real app, we would call an API to archive the hackathon
    // For this demo, we'll just change its status or remove it from the displayed list
    setHackathons(prevHackathons =>
      prevHackathons.filter(hack => hack.id !== id)
    );
  };

  // Handle exporting hackathon data
  const handleExportHackathon = (id) => {
    const hackathonToExport = hackathons.find(h => h.id === id);
    if (hackathonToExport) {
      // In a real app, we would generate and download a file
      // For this demo, we'll just show an alert
      alert(`Exporting data for: ${hackathonToExport.name}`);
    }
  };

  // Get status color based on hackathon status
  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'green';
      case 'draft': return 'blue';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="px-4 py-6">
      {/* Page Header with Create Button */}
      <div className="mb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
            <svg className="w-7 h-7 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            Hackathon Management
          </h1>
          <p className="text-gray-400">Organize, publish and track your hackathon events</p>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleCreateHackathon}
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-br from-purple-700/70 to-indigo-800/70 hover:from-purple-600/80 hover:to-indigo-700/80 rounded-lg text-cyan-300 font-medium shadow-lg border border-cyan-500/50 hover:border-cyan-400/70 hover:shadow-cyan-500/20 transform transition-all duration-100 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 mr-2 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Hackathon
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <HackathonStatsCards stats={stats} setFilter={setFilter} />

      {/* Filter and Search Section */}
      <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700/40 mb-3 shadow-lg shadow-purple-900/5">
        {/* Filter Tabs - With horizontal scrolling on mobile */}
        <div className="relative py-2 px-4 border-b border-gray-700/40">
          <div className="overflow-x-auto pb-2 -mx-1 px-1 flex scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="flex space-x-3 sm:space-x-4 md:space-x-6 min-w-max">
              <button
                onClick={() => setFilter('all')}
                className={`relative px-3 py-2.5 text-sm font-medium transition-colors duration-200 rounded-md border border-transparent
                  ${filter === 'all'
                    ? 'bg-indigo-900/40 text-cyan-400 border-cyan-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'}`}
              >
                <span>All Hackathons</span>
                {filter === 'all' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"></span>
                )}
              </button>

              <button
                onClick={() => setFilter('live')}
                className={`relative px-3 py-2.5 text-sm font-medium transition-colors duration-200 rounded-md border border-transparent flex items-center
                  ${filter === 'live'
                    ? 'bg-green-900/40 text-green-400 border-green-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'}`}
              >
                <span className={`w-2 h-2 rounded-full bg-green-400 mr-2 ${filter !== 'live' ? 'animate-pulse' : ''}`}></span>
                <span>Live ({stats.live})</span>
                {filter === 'live' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400"></span>
                )}
              </button>

              <button
                onClick={() => setFilter('draft')}
                className={`relative px-3 py-2.5 text-sm font-medium transition-colors duration-200 rounded-md border border-transparent flex items-center
                  ${filter === 'draft'
                    ? 'bg-yellow-900/40 text-yellow-400 border-yellow-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'}`}
              >
                <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                <span>Drafts ({stats.draft})</span>
                {filter === 'draft' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"></span>
                )}
              </button>

              <button
                onClick={() => setFilter('rejected')}
                className={`relative px-3 py-2.5 text-sm font-medium transition-colors duration-200 rounded-md border border-transparent flex items-center
                  ${filter === 'rejected'
                    ? 'bg-red-900/40 text-red-400 border-red-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'}`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                <span>Rejected ({stats.rejected})</span>
                {filter === 'rejected' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400"></span>
                )}
              </button>
            </div>
          </div>

          {/* Scroll indicator for mobile */}
          <div className="sm:hidden flex justify-center mt-1">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
            </div>
          </div>
        </div>

        {/* Search and View Toggle - Improved mobile layout */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search Box - Full width on all screens */}
            <div className="relative lg:col-span-4">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search hackathons..."
                className="w-full bg-gray-900/60 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z" />
                </svg>
              </div>
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* View Toggle - Centered on mobile, right-aligned on desktop */}
            <div className="lg:col-span-2">
              <div className="flex items-center bg-gray-800/50 p-1 rounded-lg border border-gray-700 h-full">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center px-4 py-2 rounded-md flex-1 justify-center ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`flex items-center px-4 py-2 rounded-md flex-1 justify-center ${viewMode === 'card' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hackathons Display (Table or Card View) */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <HackathonTable
            hackathons={filteredHackathons}
            onView={handleViewHackathon}
            onEdit={handleEditHackathon}
            onPublish={handlePublishHackathon}
            onShowRejection={(hackathon) => handleEditHackathon(hackathon.id)}
            onDuplicate={handleDuplicateHackathon}
            onExport={handleExportHackathon}
            onArchive={handleArchiveHackathon}
            onDelete={handleDeleteHackathon}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredHackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              className={`bg-gradient-to-br from-${getStatusColor(hackathon.status)}-900/20 to-${getStatusColor(hackathon.status)}-800/10 border border-${getStatusColor(hackathon.status)}-700/30 hover:border-${getStatusColor(hackathon.status)}-600/50 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl backdrop-blur-sm`}
            >
              {/* Card Header with Logo and Status */}
              <div className="relative">
                <div className="h-28 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 overflow-hidden relative">
                  {hackathon.image && (
                    <img
                      src={hackathon.image}
                      alt={hackathon.name}
                      className="w-full h-full object-cover opacity-30"
                    />
                  )}

                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-${getStatusColor(hackathon.status)}-900/70 text-${getStatusColor(hackathon.status)}-300 border border-${getStatusColor(hackathon.status)}-700/50`}>
                    {hackathon.status.toUpperCase()}
                  </div>
                </div>

                {/* Logo */}
                <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-lg border-4 border-gray-800 overflow-hidden bg-gray-700">
                  {hackathon.logo ? (
                    <img
                      src={hackathon.logo}
                      alt={`${hackathon.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-800 text-white font-bold text-lg">
                      {hackathon.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="px-4 pt-12 pb-4">
                <h3 className="text-lg font-semibold text-white mb-1 truncate">{hackathon.name}</h3>
                <p className="text-sm text-gray-400 mb-4">by {hackathon.organizer}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-md p-2">
                    <div className="text-xs text-gray-500 mb-1">Participants</div>
                    <div className="text-sm font-medium text-white">{hackathon.stats.participants}</div>
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-md p-2">
                    <div className="text-xs text-gray-500 mb-1">Teams</div>
                    <div className="text-sm font-medium text-white">{hackathon.stats.teams}</div>
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-md p-2">
                    <div className="text-xs text-gray-500 mb-1">Submissions</div>
                    <div className="text-sm font-medium text-white">{hackathon.stats.submissions}</div>
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-md p-2">
                    <div className="text-xs text-gray-500 mb-1">Last Update</div>
                    <div className="text-sm font-medium text-white">{formatDate(hackathon.lastUpdated)}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={() => handleViewHackathon(hackathon.id)}
                    className="px-3 py-2 bg-indigo-600/60 hover:bg-indigo-600 text-white text-sm rounded-md transition-colors"
                  >
                    View Details
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditHackathon(hackathon.id)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-blue-400 rounded-md transition-colors"
                      title="Edit Hackathon"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {hackathon.status === 'draft' && (
                      <button
                        onClick={() => handlePublishHackathon(hackathon.id)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 text-green-400 rounded-md transition-colors"
                        title="Publish Hackathon"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteHackathon(hackathon)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-red-400 rounded-md transition-colors"
                      title="Delete Hackathon"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HackathonsManagement; 