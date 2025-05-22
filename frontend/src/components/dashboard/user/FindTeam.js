import React, { useState, useEffect } from 'react';
import { UserGroupIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { teamMatchingAPI } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';

const FindTeam = () => {
    const { user } = useAuth();
    console.log('User from auth:', user);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [userTeams, setUserTeams] = useState([]);

    // Fetch teams data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Starting to fetch teams...');

                // Get all teams
                const teamsResponse = await teamMatchingAPI.getAllTeams();
                console.log('Raw teams response:', teamsResponse);
                console.log('Teams data:', teamsResponse?.data);

                // Set all teams from the response
                if (teamsResponse?.data?.data) {
                    console.log('Setting all teams:', teamsResponse.data.data);
                    setTeams(teamsResponse.data.data);
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
                toast.error('Failed to load teams. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Just return all teams without any filtering
    const filteredTeams = teams;
    console.log('Teams to display:', filteredTeams);

    // Get array of team IDs user has joined
    const userTeamIds = userTeams.map(team => team.teamId);
    console.log('User team IDs:', userTeamIds);

    // Extract all unique skills and roles from valid team data
    const allSkills = [...new Set(teams.flatMap(team =>
        (team.professionalInfo?.skills || []).filter(Boolean)
    ))];
    console.log('Available skills:', allSkills);

    const allRoles = [...new Set(teams.flatMap(team =>
        (team.teamInfo?.lookingForRoles || []).filter(Boolean)
    ))];
    console.log('Available roles:', allRoles);

    const handleRequestToJoin = async (teamId) => {
        try {
            console.log("Attempting to join team with ID:", teamId);
            const response = await teamMatchingAPI.requestToJoinTeam(teamId);

            if (response.data.success) {
                toast.success('Join request sent successfully!');
                setShowConfirmModal(false);
                setSelectedTeam(null);
            } else {
                toast.error(response.data.message || 'Failed to send join request');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Failed to send join request. Please try again.');
        }
    };

    const openConfirmModal = (team) => {
        setSelectedTeam(team);
        setShowConfirmModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-3xl font-bold leading-7 text-white sm:text-4xl sm:truncate">
                                Find Your Perfect Team
                            </h2>
                            <p className="mt-3 text-lg text-purple-200">
                                Connect with teams looking for your skills and expertise
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg shadow-xl p-6 border border-purple-500/20">
                    <div className="space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Search teams or hackathons..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Skills Filter */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
                                    <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-purple-400" />
                                    Filter by Skills
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {allSkills.map((skill) => (
                                        <button
                                            key={skill}
                                            onClick={() => {
                                                if (selectedSkills.includes(skill)) {
                                                    setSelectedSkills(selectedSkills.filter(s => s !== skill));
                                                } else {
                                                    setSelectedSkills([...selectedSkills, skill]);
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedSkills.includes(skill)
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Roles Filter */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
                                    <UserGroupIcon className="h-5 w-5 mr-2 text-purple-400" />
                                    Filter by Roles
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {allRoles.map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => {
                                                if (selectedRoles.includes(role)) {
                                                    setSelectedRoles(selectedRoles.filter(r => r !== role));
                                                } else {
                                                    setSelectedRoles([...selectedRoles, role]);
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedRoles.includes(role)
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredTeams.length === 0 ? (
                    <div className="text-center py-12">
                        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-400">No teams found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try adjusting your search filters or check back later.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTeams.map((team) => (
                            <div key={team.teamId} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/10 overflow-hidden hover:border-purple-500/30 transition-all duration-300">
                                {/* Team Header */}
                                <div className="p-6 bg-gradient-to-r from-purple-900/50 to-indigo-900/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{team.teamName}</h3>
                                            <p className="text-sm text-purple-200">{team.hackathon?.title}</p>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200 border border-purple-500/30">
                                            {team.teamInfo?.teammates?.length || 0}/{team.teamInfo?.teamSize} Members
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Team Members */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-300 mb-3">Team Members</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-3 bg-gray-700/30 rounded-lg p-2">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                                                        <span className="text-white text-sm font-medium">
                                                            {team.personalInfo?.firstName?.[0]}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {team.personalInfo?.firstName} {team.personalInfo?.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {team.professionalInfo?.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Looking For */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-300 mb-3">Looking for</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {team.teamInfo?.lookingForRoles?.map((role, index) => (
                                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tech Stack */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-300 mb-3">Tech Stack</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {team.professionalInfo?.skills?.map((tech, index) => (
                                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 border border-purple-500/30">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-700">
                                    <button
                                        onClick={() => openConfirmModal(team)}
                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 shadow-lg shadow-purple-500/30"
                                    >
                                        Request to Join
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && selectedTeam && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
                        <div className="bg-gradient-to-r from-gray-900/70 via-indigo-900/40 to-gray-900/70 p-4 border-b border-indigo-500/30 rounded-t-xl">
                            <h3 className="text-xl font-bold text-white">
                                Confirm Join Request
                            </h3>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to send a join request to team "{selectedTeam.teamName}"?
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowConfirmModal(false);
                                        setSelectedTeam(null);
                                    }}
                                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleRequestToJoin(selectedTeam.teamId)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                                >
                                    Confirm Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindTeam;
