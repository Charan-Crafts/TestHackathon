import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamMatchingAPI } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const MyTeam = () => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingTeamId, setPendingTeamId] = useState(null);
    const navigate = useNavigate();

    // Debug log to show user data
    console.log('Current user data:', {
        _id: user?._id,
        fullUser: user
    });

    const handleLeaveTeam = async (teamId) => {
        try {
            await teamMatchingAPI.leaveTeam(teamId); // Call backend API
            // Remove team from local state
            const updatedTeams = teams.filter(team => team.id !== teamId);
            setTeams(updatedTeams);
            setSelectedTeam(null);
            // You can add a success message here if needed
        } catch (error) {
            console.error('Error leaving team:', error);
            setError('Failed to leave team. Please try again.');
        }
    };

    const confirmLeaveTeam = (teamId) => {
        setPendingTeamId(teamId);
        setShowConfirm(true);
    };

    const handleConfirmLeave = async () => {
        if (pendingTeamId) {
            await handleLeaveTeam(pendingTeamId);
            setShowConfirm(false);
            setPendingTeamId(null);
        }
    };

    const handleCancelLeave = () => {
        setShowConfirm(false);
        setPendingTeamId(null);
    };

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                const response = await teamMatchingAPI.getUserTeams(user._id);
                // Transform the response data to match the component's expected structure
                const transformedTeams = response.data.data.map(item => ({
                    id: item.teamId,
                    name: item.team.name,
                    hackathon: {
                        title: item.hackathon.name,
                        id: item.hackathon.id
                    },
                    members: item.team.members.map(member => ({
                        id: member.id,
                        name: member.name,
                        role: member.role,
                        status: 'online', // You can add logic to determine status
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`
                    })),
                    project: {
                        name: item.project.title,
                        description: item.project.description,
                        technologies: item.project.techStack,
                        progress: 0, // You can add logic to calculate progress
                        github: '' // Add if available in your data
                    },
                    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                }));

                setTeams(transformedTeams);
                setError(null);
            } catch (err) {
                console.error('Error fetching teams:', err);
                setError('Failed to load teams. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchTeams();
        }
    }, [user?._id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // If a team is selected, show detailed view
    if (selectedTeam) {
        return (
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => setSelectedTeam(null)}
                    className="mb-6 flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Teams
                </button>

                {/* Team Header */}
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg shadow-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{selectedTeam.name}</h1>
                            <p className="text-purple-200">{selectedTeam.hackathon?.title || 'Hackathon'}</p>
                        </div>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            Team Settings
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Team Members Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Team Members</h2>
                            <div className="space-y-4">
                                {selectedTeam.members?.map((member) => (
                                    <div key={member.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                                        <div className="relative">
                                            <img
                                                src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`}
                                                alt={member.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${member.status === 'online' ? 'bg-green-500' :
                                                member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                                                }`}></span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium">{member.name}</h3>
                                            <p className="text-sm text-purple-300">{member.role}</p>
                                        </div>
                                        {/* Add Leave Team button for non-leader members */}
                                        {member.id === user._id && member.role !== 'leader' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmLeaveTeam(selectedTeam.id);
                                                }}
                                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                            >
                                                Leave Team
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Project Details Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Project Details</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-2">{selectedTeam.project?.name || 'Project Name'}</h3>
                                    <p className="text-gray-300">{selectedTeam.project?.description || 'No project description available.'}</p>
                                </div>

                                {selectedTeam.project?.technologies && (
                                    <div>
                                        <h4 className="text-white font-medium mb-2">Technologies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTeam.project.technologies.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedTeam.project?.progress !== undefined && (
                                    <div>
                                        <h4 className="text-white font-medium mb-2">Project Progress</h4>
                                        <div className="w-full bg-gray-700 rounded-full h-4">
                                            <div
                                                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-4 rounded-full"
                                                style={{ width: `${selectedTeam.project.progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">{selectedTeam.project.progress}% Complete</p>
                                    </div>
                                )}

                                {selectedTeam.project?.github && (
                                    <div className="flex space-x-4">
                                        <a
                                            href={selectedTeam.project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                                            </svg>
                                            GitHub Repository
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Confirmation Modal */}
                {showConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                            <h2 className="text-lg text-white mb-4">Are you sure you want to leave the team?</h2>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleConfirmLeave}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Yes, Leave
                                </button>
                                <button
                                    onClick={handleCancelLeave}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Teams List View
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">My Teams</h1>
            </div>

            {teams.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                    <h3 className="text-xl text-gray-300 mb-4">You're not part of any teams yet</h3>
                    <p className="text-gray-400 mb-6">Join a team or create your own to participate in hackathons</p>
                    <button
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        onClick={() => navigate('/dashboard/find-team')}
                    >
                        Find a Team
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
                            onClick={() => setSelectedTeam(team)}
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={team.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                                    alt={team.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-2">{team.name}</h3>
                                <p className="text-purple-300 mb-4">{team.hackathon?.title || 'Hackathon'}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {team.members?.map((member) => (
                                            <img
                                                key={member.id}
                                                src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`}
                                                alt={member.name}
                                                className="w-8 h-8 rounded-full border-2 border-gray-800"
                                                title={member.name}
                                            />
                                        ))}
                                    </div>
                                    {team.project?.progress !== undefined && (
                                        <div className="flex items-center">
                                            <div className="w-16 h-1 bg-gray-700 rounded-full mr-2">
                                                <div
                                                    className="h-1 bg-purple-600 rounded-full"
                                                    style={{ width: `${team.project.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-400">{team.project.progress}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTeam; 