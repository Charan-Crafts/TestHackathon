import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { hackathonAPI } from '../../../services/api';

const OrganizerHackathonDetail = () => {
    const { id } = useParams();
    const [hackathon, setHackathon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [isOrganizer, setIsOrganizer] = useState(false);

    // Remove modal state, use dropdown logic
    const [openRoundIdx, setOpenRoundIdx] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Timer logic (single timer for all rounds for now)
    const [timer, setTimer] = useState(72 * 60 * 60); // 72 hours in seconds
    useEffect(() => {
        let interval;
        if (openRoundIdx !== null && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [openRoundIdx, timer]);

    // When dropdown opens, set platform link value
    useEffect(() => {
        if (!hackathon || !hackathon.rounds) return;
        if (openRoundIdx !== null && hackathon.rounds[openRoundIdx]) {
            // Update form data with current round values
            const round = hackathon.rounds[openRoundIdx];
            setRoundFormData({
                name: round.name || '',
                type: round.type || '',
                description: round.description || '',
                startDate: round.startDate ? new Date(round.startDate).toISOString().split('T')[0] : '',
                endDate: round.endDate ? new Date(round.endDate).toISOString().split('T')[0] : '',
                startTime: round.startTime || '',
                endTime: round.endTime || '',
                platformLink: round.platformLink || '',
                submissionType: round.submissionType || 'github',
                evaluationCriteria: round.evaluationCriteria || []
            });
        }
    }, [openRoundIdx, hackathon]);

    useEffect(() => {
        setLoading(true);
        hackathonAPI.getHackathonById(id)
            .then(res => {
                if (res.data && res.data.success) {
                    setHackathon(res.data.data);
                } else {
                    setError('Hackathon not found');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch hackathon');
                setLoading(false);
            });
    }, [id]);

    // Add this effect to check organizer status
    useEffect(() => {
        if (hackathon && hackathon.organizerId) {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            setIsOrganizer(currentUser && currentUser._id === hackathon.organizerId._id);
        }
    }, [hackathon]);

    // Handler for activate/deactivate
    const handleToggleStatus = async () => {
        setStatusLoading(true);
        try {
            const newStatus = hackathon.status === 'approved' ? 'pending' : 'approved';
            await hackathonAPI.updateHackathon(hackathon._id, { status: newStatus });
            setHackathon({ ...hackathon, status: newStatus });
        } catch (e) {
            alert('Failed to update status');
        }
        setStatusLoading(false);
    };

    // Helper to fetch latest hackathon data
    const fetchHackathon = async () => {
        setLoading(true);
        try {
            const res = await hackathonAPI.getHackathonById(id);
            if (res.data && res.data.success) {
                setHackathon(res.data.data);
            } else {
                setError('Hackathon not found');
            }
        } catch (e) {
            setError('Failed to fetch hackathon');
        }
        setLoading(false);
    };

    // Add a helper to update round status
    const handleEndRound = async (idx) => {
        try {
            const round = hackathon.rounds[idx];
            const roundId = round._id || round.id;
            if (!roundId) return;
            await hackathonAPI.completeRound(hackathon._id, roundId);
            await fetchHackathon();
            setOpenRoundIdx(null);
        } catch (error) {
            alert('Failed to end round');
        }
    };

    // Add icon mapping for rounds
    const roundIcons = {
        registration: '📝',
        ideation: '💡',
        assessment: '🧩',
        presentation: '🎤',
        implementation: '🚀',
        interview: '👨‍💼',
        default: '🔵'
    };

    const handleStartRound = async (idx) => {
        try {
            console.log('Starting round activation for index:', idx);
            const round = hackathon.rounds[idx];
            console.log('Round data:', round);

            if (!round) {
                console.error('Round not found at index:', idx);
                alert('Round not found');
                return;
            }

            const roundId = round._id || round.id;
            if (!roundId) {
                console.error('No valid round identifier found');
                alert('Invalid round data');
                return;
            }

            if (!hackathon._id) {
                console.error('Hackathon ID is missing');
                alert('Invalid hackathon data');
                return;
            }

            // Create update data that preserves round history
            const updateData = {
                rounds: hackathon.rounds.map((r, i) => {
                    if (i === idx) {
                        return {
                            ...r,
                            status: 'active',
                            previousStatus: r.status,
                            reactivatedAt: new Date().toISOString(),
                            // Preserve existing submission data
                            submissions: r.submissions || [],
                            // Reset evaluation status but keep history
                            evaluationStatus: {
                                current: 'pending',
                                history: [...(r.evaluationStatus?.history || []), {
                                    status: 'pending',
                                    timestamp: new Date().toISOString(),
                                    reason: 'Round reactivated'
                                }]
                            }
                        };
                    }
                    return r;
                })
            };

            console.log('Calling API with update data:', updateData);
            const response = await hackathonAPI.updateHackathon(hackathon._id, updateData);
            console.log('API Response:', response);

            if (response.data && response.data.success) {
                await fetchHackathon();
                setOpenRoundIdx(null);
                console.log('Round activated successfully');
            } else {
                console.error('API returned unsuccessful response:', response);
                alert('Failed to activate round');
            }
        } catch (error) {
            console.error('Error activating round:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            alert('Failed to activate round: ' + (error.response?.data?.message || error.message));
        }
    };

    // Helper to check if any round is active
    const hasActiveRound = hackathon && hackathon.rounds ? hackathon.rounds.some(r => r.status === 'active') : false;

    // Add state for editing round details
    const [editingRoundIdx, setEditingRoundIdx] = useState(null);
    const [roundFormData, setRoundFormData] = useState({
        name: '',
        type: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        platformLink: '',
        submissionType: 'github',
        evaluationCriteria: []
    });

    // Modify the handleSaveRoundDetails function
    const handleSaveRoundDetails = async (idx) => {
        setSaveLoading(true);
        setSaveError(null);

        // Check if user is the organizer
        if (!isOrganizer) {
            setSaveError('You do not have permission to edit this hackathon. Only the organizer can make changes.');
            setSaveLoading(false);
            return;
        }

        try {
            const round = hackathon.rounds[idx];
            const roundId = round._id || round.id;

            // Debug logging
            console.log('Current user data:', JSON.parse(localStorage.getItem('user')));
            console.log('Hackathon data:', hackathon);
            console.log('Round being updated:', round);
            console.log('Round form data:', roundFormData);

            if (!roundId) {
                setSaveError('Invalid round data');
                return;
            }

            // Create a complete round update
            const updatedRound = {
                ...round,
                ...roundFormData,
                _id: roundId,
                id: roundId,
                status: round.status
            };

            // Create the update data with the complete round
            const updateData = {
                _id: hackathon._id,
                organizerId: hackathon.organizerId._id, // Send just the ID
                rounds: hackathon.rounds.map((r, i) => i === idx ? updatedRound : r)
            };

            // Debug logging
            console.log('Sending update request with data:', updateData);

            // Update using the general hackathon update endpoint
            const response = await hackathonAPI.updateHackathon(hackathon._id, updateData);

            if (response.data && response.data.success) {
                // Update local state
                const updatedRounds = hackathon.rounds.map((r, i) => {
                    if (i === idx) {
                        return {
                            ...r,
                            ...roundFormData,
                            _id: roundId,
                            id: roundId,
                            status: r.status
                        };
                    }
                    return r;
                });
                setHackathon({ ...hackathon, rounds: updatedRounds });
                setEditingRoundIdx(null);
            } else {
                setSaveError(response.data?.message || 'Failed to save round details');
            }
        } catch (e) {
            console.error('Failed to save round details:', e);
            console.error('Error details:', {
                status: e.response?.status,
                data: e.response?.data,
                headers: e.response?.headers,
                config: e.config,
                requestData: e.config?.data
            });

            if (e.response?.status === 403) {
                setSaveError('You do not have permission to update this hackathon. Please check your role and permissions.');
            } else if (e.response?.status === 401) {
                setSaveError('Session expired. Please login again.');
            } else {
                setSaveError(e.response?.data?.message || 'Failed to save round details');
            }
        }
        setSaveLoading(false);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        try {
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10));
            date.setMinutes(parseInt(minutes, 10));
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error("Error formatting time:", error);
            return timeString;
        }
    };

    if (loading) return <div className="text-center text-gray-300 py-10">Loading...</div>;
    if (error) return <div className="text-center text-red-400 py-10">{error}</div>;
    if (!hackathon || !hackathon.rounds) return null;

    // Now it's safe to access hackathon.rounds
    const completedRounds = hackathon.rounds.filter(r => r.status === 'completed').length;
    const totalRounds = hackathon.rounds.length;
    const progressPercent = totalRounds > 0 ? Math.round((completedRounds / totalRounds) * 100) : 0;

    // Helper for status badge
    const getStatusBadge = (status) => {
        let color = 'bg-gray-700 text-gray-300';
        if (status === 'pending') color = 'bg-yellow-900/70 text-yellow-300';
        if (status === 'approved') color = 'bg-green-900/70 text-green-300';
        if (status === 'rejected') color = 'bg-red-900/70 text-red-300';
        return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status.toUpperCase()}</span>;
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-2">
            {/* Main Card */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl shadow-lg border border-gray-700/40 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1 flex items-center">
                            {hackathon.title}
                            <span className="ml-3">{getStatusBadge(hackathon.status)}</span>
                        </h2>
                        <p className="text-gray-400">by {hackathon.organizer}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded-lg font-medium shadow ${hackathon.status === 'approved' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                            onClick={handleToggleStatus}
                            disabled={statusLoading}
                        >
                            {hackathon.status === 'approved' ? (statusLoading ? 'Deactivating...' : 'Deactivate') : (statusLoading ? 'Activating...' : 'Activate')}
                        </button>
                    </div>
                </div>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-800/60 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-400 mb-1">Prize Money</div>
                        <div className="text-lg font-bold text-cyan-300">₹{hackathon.prize}</div>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-400 mb-1">Registration Type</div>
                        <div className="text-lg font-bold text-cyan-300">{hackathon.locationType}</div>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-400 mb-1">Registration Fee</div>
                        <div className="text-lg font-bold text-cyan-300">₹{hackathon.registrationFees?.['1'] || 0}</div>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-400 mb-1">Time Left</div>
                        <div className="text-lg font-bold text-cyan-300">7 days remaining</div>
                    </div>
                </div>
            </div>

            {/* Problem Statement */}
            <div className="bg-gray-900/70 rounded-xl border border-gray-700/40 p-6 mb-6">
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">Problem Statement</h3>
                <div
                    className="text-gray-200 whitespace-pre-line break-words p-3 rounded-lg bg-gray-800/60 border border-cyan-900/30 shadow-inner"
                    style={{ maxHeight: '200px', overflowY: 'auto', lineHeight: '1.7', fontSize: '1rem' }}
                >
                    {hackathon.longDescription || hackathon.description}
                </div>
            </div>

            {/* Rounds Section */}
            <div className="bg-gray-900/70 rounded-xl border border-gray-700/40 p-6 mb-3">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Rounds</h3>
                <div className="space-y-4">
                    {hackathon && hackathon.rounds && hackathon.rounds.length > 0 ? hackathon.rounds.map((round, idx) => (
                        <div key={idx} className="bg-gray-800/60 rounded-lg p-4 mb-2">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-base font-bold text-white mb-1">{round.name}</div>
                                        {round.status === 'completed' && (
                                            <span className="ml-2 px-2 py-0.5 rounded bg-green-800 text-green-300 text-xs font-semibold">Round Completed</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400 mb-1">Deadline: {round.endDate ? new Date(round.endDate).toLocaleDateString() : 'N/A'}</div>
                                    <div className="text-xs text-gray-400">Description: {round.description || 'N/A'}</div>
                                </div>
                                <div className="flex gap-2 mt-2 md:mt-0">
                                    {/* Show Start/End Round only for status */}
                                    {round.status === 'pending' && !hasActiveRound && (
                                        <button
                                            className="px-3 py-1 bg-green-700/80 hover:bg-green-800 text-white text-xs rounded"
                                            onClick={() => handleStartRound(idx)}
                                        >
                                            Start Round
                                        </button>
                                    )}
                                    {round.status === 'active' && (
                                        <button
                                            className="px-3 py-1 bg-red-700/80 hover:bg-red-800 text-white text-xs rounded"
                                            onClick={() => handleEndRound(idx)}
                                        >
                                            End Round
                                        </button>
                                    )}
                                    {/* Add Links/Edit Details button */}
                                    <button
                                        className={`px-3 py-1 ${isOrganizer ? 'bg-cyan-700 hover:bg-cyan-800' : 'bg-gray-700 cursor-not-allowed'} text-white rounded text-sm flex items-center gap-1`}
                                        onClick={() => {
                                            if (!isOrganizer) return;
                                            setOpenRoundIdx(idx);
                                            setEditingRoundIdx(editingRoundIdx === idx ? null : idx);
                                        }}
                                        disabled={saveLoading || !isOrganizer}
                                        title={!isOrganizer ? "Only the organizer can edit this hackathon" : ""}
                                    >
                                        <span>✏️</span> {editingRoundIdx === idx ? 'Cancel' : 'Edit Round'}
                                    </button>
                                    {/* Organizer: Change round status dropdown */}
                                    {isOrganizer && (
                                        <select
                                            value={round.status}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;
                                                await hackathonAPI.setRoundStatus(hackathon._id, round._id || round.id, newStatus);
                                                fetchHackathon();
                                            }}
                                            className="bg-gray-700 text-white rounded px-2 py-1 text-xs ml-2"
                                            style={{ minWidth: 100 }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                            {/* Dropdown panel for round details */}
                            {openRoundIdx === idx && (
                                <div className="mt-4 bg-gray-900 rounded-xl p-6 border border-cyan-700 shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-cyan-300">Round Details</h3>
                                        <button
                                            className="px-3 py-1 bg-cyan-700 hover:bg-cyan-800 text-white rounded text-sm flex items-center gap-1"
                                            onClick={() => setEditingRoundIdx(editingRoundIdx === idx ? null : idx)}
                                            disabled={saveLoading}
                                        >
                                            <span>✏️</span> {editingRoundIdx === idx ? 'Cancel' : 'Edit Round'}
                                        </button>
                                    </div>

                                    {editingRoundIdx === idx ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Round Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                        value={roundFormData.name}
                                                        onChange={e => setRoundFormData({ ...roundFormData, name: e.target.value })}
                                                        placeholder="Enter round name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Round Type</label>
                                                    <select
                                                        className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                        value={roundFormData.type}
                                                        onChange={e => setRoundFormData({ ...roundFormData, type: e.target.value })}
                                                    >
                                                        <option value="pre-hackathon">Pre-hackathon</option>
                                                        <option value="hackathon">Hackathon</option>
                                                        <option value="post-hackathon">Post-hackathon</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                                <textarea
                                                    className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                    value={roundFormData.description}
                                                    onChange={e => setRoundFormData({ ...roundFormData, description: e.target.value })}
                                                    placeholder="Describe this round in detail. Include evaluation criteria, what participants should do, and any important instructions."
                                                    rows="3"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                                                    <input
                                                        type="date"
                                                        className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                        value={roundFormData.startDate}
                                                        onChange={e => setRoundFormData({ ...roundFormData, startDate: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                                                    <input
                                                        type="date"
                                                        className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                        value={roundFormData.endDate}
                                                        onChange={e => setRoundFormData({ ...roundFormData, endDate: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                                                    <input
                                                        type="time"
                                                        className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                        value={roundFormData.startTime}
                                                        onChange={e => setRoundFormData({ ...roundFormData, startTime: e.target.value })}
                                                    />
                                                    <div className="text-xs text-gray-400 mt-1">Please use 24-hour format. 06:00 = 6:00 AM, 15:00 = 3:00 PM, 21:00 = 9:00 PM</div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                                                    <input
                                                        type="time"
                                                        className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                        value={roundFormData.endTime}
                                                        onChange={e => setRoundFormData({ ...roundFormData, endTime: e.target.value })}
                                                    />
                                                    <div className="text-xs text-gray-400 mt-1">Please use 24-hour format. 06:00 = 6:00 AM, 15:00 = 3:00 PM, 21:00 = 9:00 PM</div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1">Platform Link</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                    value={roundFormData.platformLink}
                                                    onChange={e => setRoundFormData({ ...roundFormData, platformLink: e.target.value })}
                                                    placeholder="Enter platform link"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1">Submission Type</label>
                                                <select
                                                    className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                    value={roundFormData.submissionType}
                                                    onChange={e => setRoundFormData({ ...roundFormData, submissionType: e.target.value })}
                                                >
                                                    <option value="github">GitHub</option>
                                                    <option value="drive">Google Drive</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>

                                            {/* Custom Fields Section */}
                                            {round.customFields && round.customFields.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-400 mb-3">Custom Fields</h4>
                                                    <div className="space-y-3">
                                                        {round.customFields.map((field, fieldIndex) => (
                                                            <div key={field.id} className="bg-gray-800/50 rounded-lg p-3">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-medium text-gray-300">{field.name}</span>
                                                                        {field.required && (
                                                                            <span className="px-2 py-0.5 text-xs bg-red-900/50 text-red-300 rounded">Required</span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-xs text-gray-400">{field.type}</span>
                                                                </div>

                                                                {field.type === 'multiple_choice' || field.type === 'checkbox' || field.type === 'dropdown' ? (
                                                                    <div className="mt-2">
                                                                        <div className="text-xs text-gray-400 mb-1">Options:</div>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {field.options.map((option, optionIndex) => (
                                                                                <span
                                                                                    key={optionIndex}
                                                                                    className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                                                                                >
                                                                                    {option}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-2 mt-4">
                                                <button
                                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                                                    onClick={() => setEditingRoundIdx(null)}
                                                    disabled={saveLoading}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded text-sm flex items-center gap-1"
                                                    onClick={() => handleSaveRoundDetails(idx)}
                                                    disabled={saveLoading}
                                                >
                                                    {saveLoading ? 'Saving...' : (<><span>💾</span> Save Changes</>)}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-400">Round Name</h4>
                                                    <p className="text-white">{roundFormData.name}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-400">Type</h4>
                                                    <p className="text-white">{roundFormData.type}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-gray-400">Description</h4>
                                                <p className="text-white">{roundFormData.description}</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-400">Start Date & Time</h4>
                                                    <p className="text-white">{roundFormData.startDate} at {formatTime(roundFormData.startTime)}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-400">End Date & Time</h4>
                                                    <p className="text-white">{roundFormData.endDate} at {formatTime(roundFormData.endTime)}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-gray-400">Platform Link</h4>
                                                <p className="text-white break-all">{roundFormData.platformLink || 'Not set'}</p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-gray-400">Submission Type</h4>
                                                <p className="text-white">{roundFormData.submissionType}</p>
                                            </div>

                                            {/* Custom Fields Section */}
                                            {round.customFields && round.customFields.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-400 mb-3">Custom Fields</h4>
                                                    <div className="space-y-3">
                                                        {round.customFields.map((field, fieldIndex) => (
                                                            <div key={field.id} className="bg-gray-800/50 rounded-lg p-3">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-medium text-gray-300">{field.name}</span>
                                                                        {field.required && (
                                                                            <span className="px-2 py-0.5 text-xs bg-red-900/50 text-red-300 rounded">Required</span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-xs text-gray-400">{field.type}</span>
                                                                </div>

                                                                {field.type === 'multiple_choice' || field.type === 'checkbox' || field.type === 'dropdown' ? (
                                                                    <div className="mt-2">
                                                                        <div className="text-xs text-gray-400 mb-1">Options:</div>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {field.options.map((option, optionIndex) => (
                                                                                <span
                                                                                    key={optionIndex}
                                                                                    className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                                                                                >
                                                                                    {option}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {saveError && <div className="text-red-400 text-sm mt-4">{saveError}</div>}
                                </div>
                            )}
                        </div>
                    )) : <div className="text-gray-400">No rounds defined.</div>}
                </div>
                {/* Progress Bar for rounds */}
                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden mt-6 mb-2">
                    <div
                        className="h-full bg-cyan-400 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1 text-right">{progressPercent}% completed</div>
            </div>

            {/* Timeline Section (always visible, below rounds) */}
            <div className="bg-gray-900/70 rounded-xl border border-gray-700/40 p-6 mb-2">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Timeline</h3>
                <div className="flex items-center justify-between mb-4">
                    {hackathon.rounds.map((round, i) => {
                        // Pick icon based on round type or name
                        let icon = roundIcons.default;
                        if (round.type && roundIcons[round.type.toLowerCase()]) {
                            icon = roundIcons[round.type.toLowerCase()];
                        } else if (round.name) {
                            const key = round.name.toLowerCase();
                            icon =
                                roundIcons[key] ||
                                    Object.keys(roundIcons).find(k => key.includes(k)) ? roundIcons[Object.keys(roundIcons).find(k => key.includes(k))] : roundIcons.default;
                        }
                        return (
                            <React.Fragment key={i}>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-900 text-2xl mb-1">{icon}</div>
                                    <div className="text-xs text-center text-gray-200 w-24">{round.name}</div>
                                </div>
                                {i < hackathon.rounds.length - 1 && <div className="flex-1 h-1 bg-cyan-700 mx-2" />}
                            </React.Fragment>
                        );
                    })}
                </div>
                {/* Progress Bar */}
                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-cyan-400 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1 text-right">{progressPercent}% completed</div>
            </div>

            {/* Statistics Section */}
            <div className="bg-gray-900/70 rounded-xl border border-gray-700/40 p-6 mb-6">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/60 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-400 mb-1">Total Participants</div>
                        <div className="text-lg font-bold text-white">{hackathon.participants || 0}</div>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-400 mb-1">Solo Participants</div>
                        <div className="text-lg font-bold text-white">0</div>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-400 mb-1">Groups</div>
                        <div className="text-lg font-bold text-white">0</div>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-400 mb-1">Group Members</div>
                        <div className="text-lg font-bold text-white">0</div>
                    </div>
                </div>
            </div>

            {/* Payment Status Section */}
            <div className="bg-gray-900/70 rounded-xl border border-gray-700/40 p-6 mb-6">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Payment Status</h3>
                <div className="flex gap-4">
                    <div className="flex-1 bg-green-900/40 rounded-lg p-4 text-center border border-green-700/30">
                        <div className="text-xs text-green-300 mb-1">Completed</div>
                        <div className="text-lg font-bold text-green-200">0</div>
                    </div>
                    <div className="flex-1 bg-yellow-900/40 rounded-lg p-4 text-center border border-yellow-700/30">
                        <div className="text-xs text-yellow-300 mb-1">Pending</div>
                        <div className="text-lg font-bold text-yellow-200">0</div>
                    </div>
                    <div className="flex-1 bg-red-900/40 rounded-lg p-4 text-center border border-red-700/30">
                        <div className="text-xs text-red-300 mb-1">Rejected</div>
                        <div className="text-lg font-bold text-red-200">0</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerHackathonDetail; 