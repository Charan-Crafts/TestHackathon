import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { hackathonAPI } from '../../../services/api';

// Import components
import RoundSubmissions from './submissions/components/RoundSubmissions';

// Import styles
import '../../../styles/CustomScrollbar.css';

const SubmissionsDashboard = ({ user }) => {
  const { id: routeHackathonId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryHackathonId = searchParams.get('hackathon');
  const hackathonId = routeHackathonId || queryHackathonId;

  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch hackathons
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setLoading(true);
        const response = await hackathonAPI.getMyHackathons(1, 100);
        if (response.data.success) {
          setHackathons(response.data.data);
          // If hackathonId is provided in URL, select that hackathon
          if (hackathonId) {
            const hackathon = response.data.data.find(h => h._id === hackathonId);
            if (hackathon) {
              setSelectedHackathon(hackathon);
              setRounds(hackathon.rounds || []);
            }
          }
        }
      } catch (err) {
        setError('Failed to fetch hackathons');
        console.error('Error fetching hackathons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, [hackathonId]);

  // Handle hackathon selection
  const handleHackathonSelect = (hackathon) => {
    setSelectedHackathon(hackathon);
    setRounds(hackathon.rounds || []);
    setSelectedRound(null);
  };

  // Handle back to hackathons
  const handleBackToHackathons = () => {
    setSelectedHackathon(null);
    setRounds([]);
    setSelectedRound(null);
  };

  const handleRoundSelect = (round) => {
    setSelectedRound(round);
  };

  // Render hackathons list
  const renderHackathonsList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
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
        {hackathons.map((hackathon) => (
          <div
            key={hackathon._id}
            onClick={() => handleHackathonSelect(hackathon)}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 cursor-pointer hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-lg overflow-hidden">
                  <img
                    src={hackathon.imageFile?.fileUrl || `https://picsum.photos/seed/${hackathon._id}/400/300`}
                    alt={hackathon.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {hackathon.title}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {hackathon.description || 'No description available'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
              <span>{new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${hackathon.status === 'active' ? 'bg-green-900/30 text-green-400' :
                hackathon.status === 'completed' ? 'bg-blue-900/30 text-blue-400' :
                  'bg-yellow-900/30 text-yellow-400'
                }`}>
                {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render rounds list
  const renderRoundsList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
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
        {rounds.map((round) => (
          <div
            key={round._id}
            onClick={() => handleRoundSelect(round)}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 cursor-pointer hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className={`h-16 w-16 rounded-lg flex items-center justify-center ${round.status === 'active' ? 'bg-green-900/30' :
                  round.status === 'completed' ? 'bg-blue-900/30' :
                    'bg-yellow-900/30'
                  }`}>
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {round.name}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {round.description || 'No description available'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
              <span>{new Date(round.startDate).toLocaleDateString()} - {new Date(round.endDate).toLocaleDateString()}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${round.status === 'active' ? 'bg-green-900/30 text-green-400' :
                round.status === 'completed' ? 'bg-blue-900/30 text-blue-400' :
                  'bg-yellow-900/30 text-yellow-400'
                }`}>
                {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 py-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
            <svg className="w-7 h-7 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {selectedHackathon ? (selectedRound ? 'Submission Management' : 'Rounds') : 'Hackathons'}
          </h1>
          <p className="text-gray-400">
            {selectedHackathon
              ? (selectedRound
                ? `Review and manage project submissions for ${selectedRound.name}`
                : `Select a round to view and manage submissions for ${selectedHackathon.title}`)
              : 'Select a hackathon to manage its submissions'}
          </p>
        </div>

        {selectedHackathon && (
          <button
            onClick={handleBackToHackathons}
            className="px-4 py-2 text-sm rounded-lg bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-800 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Hackathons
          </button>
        )}
      </div>

      {!selectedHackathon ? (
        renderHackathonsList()
      ) : !selectedRound ? (
        renderRoundsList()
      ) : (
        <RoundSubmissions
          selectedHackathon={selectedHackathon}
          selectedRound={selectedRound}
        />
      )}
    </div>
  );
};

export default SubmissionsDashboard;