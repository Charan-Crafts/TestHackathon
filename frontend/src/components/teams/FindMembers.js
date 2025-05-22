import React, { useState } from 'react';
import { UserIcon, UsersIcon, AcademicCapIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

const FindMembers = ({ user }) => {
    // Mock data for demonstration
    const [teamListings] = useState([
        {
            id: 1,
            teamName: "Tech Innovators",
            hackathonName: "Global Innovation Hackathon 2024",
            currentMembers: 3,
            maxMembers: 5,
            requiredSkills: ["React", "Node.js", "UI/UX"],
            description: "Looking for frontend and backend developers to join our team.",
            leader: {
                name: "Sarah Chen",
                role: "Full Stack Developer",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
            }
        },
        {
            id: 2,
            teamName: "Data Wizards",
            hackathonName: "AI/ML Hackathon 2024",
            currentMembers: 2,
            maxMembers: 4,
            requiredSkills: ["Python", "Machine Learning", "Data Analysis"],
            description: "Seeking ML engineers and data scientists for an AI project.",
            leader: {
                name: "John Smith",
                role: "Data Scientist",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
            }
        }
    ]);

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4">Find Team Members</h1>
                    <p className="text-gray-400">Connect with participants looking for team members or create your own team listing.</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center">
                            <UsersIcon className="h-8 w-8 text-indigo-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Active Teams</p>
                                <p className="text-2xl font-semibold text-white">24</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center">
                            <UserIcon className="h-8 w-8 text-purple-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Looking for Teams</p>
                                <p className="text-2xl font-semibold text-white">45</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center">
                            <AcademicCapIcon className="h-8 w-8 text-emerald-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Open Positions</p>
                                <p className="text-2xl font-semibold text-white">67</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Listings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {teamListings.map((team) => (
                        <div key={team.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-indigo-500 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-1">{team.teamName}</h3>
                                    <p className="text-indigo-400 text-sm">{team.hackathonName}</p>
                                </div>
                                <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full text-sm">
                                    {team.currentMembers}/{team.maxMembers} Members
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center mb-2">
                                    <CodeBracketIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <div className="flex flex-wrap gap-2">
                                        {team.requiredSkills.map((skill, index) => (
                                            <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mt-2">{team.description}</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img
                                        src={team.leader.avatar}
                                        alt={team.leader.name}
                                        className="h-8 w-8 rounded-full border border-gray-600"
                                    />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">{team.leader.name}</p>
                                        <p className="text-xs text-gray-400">{team.leader.role}</p>
                                    </div>
                                </div>
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Contact Team
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FindMembers; 