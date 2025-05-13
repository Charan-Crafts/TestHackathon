import React, { useState } from 'react';
import ChatModal from '../../../shared/ChatModal';

const TeamSection = ({ team = { name: '', members: [] }, currentUser, onManageTeam }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isGroupMessage, setIsGroupMessage] = useState(false);

  // Return early if no team data
  if (!team || !team.members) {
    return (
      <div className="mb-6 bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <p className="text-gray-400 p-4">Loading team data...</p>
      </div>
    );
  }

  const handleMessageClick = (member) => {
    setSelectedMember(member);
    setIsGroupMessage(false);
    setShowMessageModal(true);
  };

  const handleMessageAll = () => {
    // Filter out current user from recipients
    const otherMembers = team.members.filter(member => member?.id !== currentUser?.id);
    setSelectedMember({
      id: 'team',
      name: team.name,
      avatar: null, // You could add a team avatar here
      role: 'Team',
      members: otherMembers
    });
    setIsGroupMessage(true);
    setShowMessageModal(true);
  };

  const handleSendMessage = async (formData) => {
    try {
      // Mock API call - replace with actual implementation
      console.log('Sending message:', {
        isGroup: isGroupMessage,
        recipients: isGroupMessage ? selectedMember.members.map(m => m?.id).filter(Boolean) : selectedMember?.id,
        message: formData.get('message'),
        files: formData.getAll('files')
      });
      
      setShowMessageModal(false);
      setSelectedMember(null);
      setIsGroupMessage(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <>
      <div className="mb-6 bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {team.name}
                </span>
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                {team.members.length} Members
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMessageAll}
                className="px-3 py-1.5 text-sm bg-indigo-600/50 hover:bg-indigo-500/50 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                title="Message All Team Members"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Message All</span>
              </button>
              <button 
                onClick={onManageTeam}
                className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Manage Team</span>
              </button>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {team.members.map((member) => member && (
              <div
                key={member.id || Math.random()}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                {/* Role Badge */}
                <div className="absolute -top-2 right-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    member.role === 'Team Leader' 
                      ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50' 
                      : 'bg-gray-800/80 text-gray-300 border border-gray-700/50'
                  }`}>
                    {member.role || 'Member'}
                  </span>
                </div>

                {/* Member Content */}
                <div className="flex flex-col items-center">
                  {/* Avatar with status indicator */}
                  <div className="relative">
                    <img
                      src={member.avatar || 'https://via.placeholder.com/64'}
                      alt={member.name || 'Team Member'}
                      className="w-16 h-16 rounded-full border-2 border-gray-700/50 group-hover:border-indigo-500/50 transition-colors duration-300"
                    />
                    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-gray-800"></div>
                  </div>

                  {/* Member Info */}
                  <div className="mt-3 text-center">
                    <h4 className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors duration-300">
                      {member.name || 'Unknown Member'}
                    </h4>
                    <p className="mt-1 text-xs text-gray-400">
                      {member.role === 'Team Leader' ? 'Leader' : member.role || 'Member'}
                    </p>
                  </div>

                  {/* Quick Actions */}
                  {member.id !== currentUser?.id && (
                    <div className="mt-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleMessageClick(member)}
                        className="p-1.5 rounded-full bg-gray-700/50 hover:bg-indigo-600/50 text-gray-400 hover:text-indigo-300 transition-colors"
                        title={`Message ${member.name}`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                      <button 
                        className="p-1.5 rounded-full bg-gray-700/50 hover:bg-indigo-600/50 text-gray-400 hover:text-indigo-300 transition-colors"
                        title="View Profile"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Stats */}
        <div className="px-4 py-3 bg-gray-900/30 border-t border-gray-700/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-400">Total Tasks</div>
              <div className="mt-1 text-lg font-semibold text-white">24</div>
            </div>
            <div className="text-center border-x border-gray-700/50">
              <div className="text-xs text-gray-400">Completed</div>
              <div className="mt-1 text-lg font-semibold text-green-400">18</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Team Score</div>
              <div className="mt-1 text-lg font-semibold text-indigo-400">92</div>
            </div>
          </div>
        </div>
      </div>

      <ChatModal
        isOpen={showMessageModal}
        onClose={() => {
          setShowMessageModal(false);
          setSelectedMember(null);
          setIsGroupMessage(false);
        }}
        recipient={selectedMember}
        onSendMessage={handleSendMessage}
        currentUser={currentUser}
        isGroupMessage={isGroupMessage}
      />
    </>
  );
};

export default TeamSection; 