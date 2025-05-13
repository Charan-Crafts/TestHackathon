import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { hackathonAPI, roundResponseAPI } from '../../../services/api';

const roundIcons = {
    registration: '📝',
    ideation: '💡',
    assessment: '🧩',
    presentation: '🎤',
    implementation: '🚀',
    interview: '👨‍💼',
    default: '🔵'
};

const UserHackathonDetail = () => {
    const { hackathonId } = useParams();
    const [hackathon, setHackathon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roundQualifications, setRoundQualifications] = useState({});

    useEffect(() => {
        setLoading(true);
        hackathonAPI.getHackathonById(hackathonId)
            .then(res => {
                if (res.data && res.data.success) {
                    setHackathon(res.data.data);
                    // Check qualification status for each round
                    checkRoundQualifications(res.data.data.rounds);
                } else {
                    setError('Hackathon not found');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch hackathon');
                setLoading(false);
            });
    }, [hackathonId]);

    const checkRoundQualifications = async (rounds) => {
        const qualifications = {};
        for (const round of rounds) {
            try {
                const response = await roundResponseAPI.checkRoundQualification(hackathonId, round._id);
                if (response.data.success) {
                    qualifications[round._id] = response.data.data;
                }
            } catch (error) {
                console.error(`Error checking qualification for round ${round._id}:`, error);
            }
        }
        setRoundQualifications(qualifications);
    };

    if (loading) return <div className="text-center text-gray-300 py-10">Loading...</div>;
    if (error) return <div className="text-center text-red-400 py-10">{error}</div>;
    if (!hackathon || !hackathon.rounds) return null;

    // Progress bar logic
    const completedRounds = hackathon.rounds.filter(r => r.status === 'completed').length;
    const totalRounds = hackathon.rounds.length;
    const progressPercent = totalRounds > 0 ? Math.round((completedRounds / totalRounds) * 100) : 0;

    // Helper for status badge
    const getStatusBadge = (status) => {
        let color = 'bg-gray-700 text-gray-300';
        if (status === 'pending') color = 'bg-yellow-900/70 text-yellow-300';
        if (status === 'approved') color = 'bg-green-900/70 text-green-300';
        if (status === 'rejected') color = 'bg-red-900/70 text-red-300';
        return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status?.toUpperCase()}</span>;
    };

    // Helper for round status and qualification
    const getRoundStatus = (round) => {
        const qualification = roundQualifications[round._id];
        // If no qualification data and round is completed, treat as late submission
        if (!qualification) {
            if (round.status === 'completed') {
                return {
                    type: 'error',
                    message: 'Not qualified: Late submission',
                    icon: '❌'
                };
            }
            return null;
        }

        if (qualification.status === 'evaluated') {
            if (qualification.qualification === 'qualified') {
                return {
                    type: 'success',
                    message: 'Qualified for next round',
                    icon: '✅'
                };
            } else {
                // Show reviewComments if present
                let msg = 'Not qualified: Did not meet criteria';
                if (qualification.reviewComments) {
                    msg += ` (${qualification.reviewComments})`;
                }
                return {
                    type: 'error',
                    message: msg,
                    icon: '❌'
                };
            }
        }
        return null;
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
                <div className="text-gray-200">{hackathon.longDescription || hackathon.description}</div>
            </div>

            {/* Rounds Section */}
            <div className="bg-gray-900/70 rounded-xl border border-gray-700/40 p-6 mb-3">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Rounds</h3>
                <div className="space-y-4">
                    {hackathon.rounds.length > 0 ? hackathon.rounds.map((round, idx) => {
                        const roundStatus = getRoundStatus(round);
                        const isPreviousRoundUnqualified = idx > 0 &&
                            getRoundStatus(hackathon.rounds[idx - 1])?.type === 'error';

                        return (
                            <div key={idx} className={`bg-gray-800/60 rounded-lg p-4 mb-2 ${round.status === 'active' ? 'border-2 border-cyan-400' : ''} ${isPreviousRoundUnqualified ? 'opacity-50' : ''}`}>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-base font-bold text-white mb-1">{round.name}</div>
                                            {round.status === 'active' && (
                                                <span className="ml-2 px-2 py-0.5 rounded bg-cyan-800 text-cyan-300 text-xs font-semibold">
                                                    Active
                                                </span>
                                            )}
                                            {roundStatus && (
                                                <span className={`ml-2 px-2 py-0.5 rounded ${roundStatus.type === 'success'
                                                    ? 'bg-green-800 text-green-300'
                                                    : 'bg-red-800 text-red-300'
                                                    } text-xs font-semibold`}>
                                                    {roundStatus.icon} {roundStatus.message}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-400 mb-1">Deadline: {round.endDate ? new Date(round.endDate).toLocaleDateString() : 'N/A'}</div>
                                        <div className="text-xs text-gray-400">Description: {round.description || 'N/A'}</div>
                                    </div>
                                </div>
                                {isPreviousRoundUnqualified && (
                                    <div className="mt-2 p-2 bg-red-900/30 border border-red-700/30 rounded text-red-300 text-sm">
                                        You need to qualify in the previous round to access this round.
                                    </div>
                                )}
                                {/* Read-only round details */}
                                <div className="mt-4 bg-gray-900 rounded-xl p-6 border border-cyan-700 shadow-lg">
                                    <div className="mb-3">
                                        <div className="text-sm text-gray-400 mb-1">Platform Link:</div>
                                        <div className="text-white font-mono bg-gray-800 rounded p-2 flex-1">{round.platformLink || 'N/A'}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="text-sm text-gray-400 mb-1">Evaluation Criteria:</div>
                                        <div className="text-white bg-gray-800 rounded p-2 flex-1">
                                            {round.evaluationCriteria && round.evaluationCriteria.length > 0 ? (
                                                <ul className="list-disc pl-5">
                                                    {round.evaluationCriteria.map((crit, i) => (
                                                        <li key={i}>{crit.name ? `${crit.name} (${crit.weight || ''})` : crit}</li>
                                                    ))}
                                                </ul>
                                            ) : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : <div className="text-gray-400">No rounds defined.</div>}
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

export default UserHackathonDetail; 