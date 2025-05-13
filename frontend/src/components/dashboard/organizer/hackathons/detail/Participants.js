import React, { useState } from 'react';

const Participants = ({ hackathon, setHackathon }) => {
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Mock participant data - in a real app, this would be fetched from an API
  const [participants, setParticipants] = useState([
    { 
      id: 1, 
      name: 'Jane Smith', 
      email: 'jane.smith@example.com', 
      status: 'approved', 
      role: 'developer',
      registrationDate: '2023-04-15',
      team: 'Code Wizards',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      skills: ['React', 'Node.js', 'UI/UX'],
      submissions: 2
    },
    { 
      id: 2, 
      name: 'John Doe', 
      email: 'john.doe@example.com', 
      status: 'approved', 
      role: 'designer',
      registrationDate: '2023-04-14',
      team: 'Code Wizards',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      skills: ['UI Design', 'Figma', 'Prototyping'],
      submissions: 1
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike.johnson@example.com', 
      status: 'pending', 
      role: 'developer',
      registrationDate: '2023-04-17',
      team: null,
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      skills: ['Python', 'Data Science', 'AI'],
      submissions: 0
    },
    { 
      id: 4, 
      name: 'Sarah Williams', 
      email: 'sarah.williams@example.com', 
      status: 'pending', 
      role: 'product manager',
      registrationDate: '2023-04-18',
      team: null,
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      skills: ['Product Management', 'Agile', 'Strategy'],
      submissions: 0
    },
    { 
      id: 5, 
      name: 'David Chen', 
      email: 'david.chen@example.com', 
      status: 'rejected', 
      role: 'developer',
      registrationDate: '2023-04-16',
      team: null,
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      skills: ['Java', 'Spring', 'Mobile Dev'],
      submissions: 0,
      rejectionReason: 'Did not meet eligibility criteria.'
    }
  ]);

  // Filter participants based on search term and active filter
  const filteredParticipants = participants.filter(participant => {
    const searchMatch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (participant.team && participant.team.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeFilter === 'all') return searchMatch;
    if (activeFilter === 'pending') return searchMatch && participant.status === 'pending';
    if (activeFilter === 'approved') return searchMatch && participant.status === 'approved';
    if (activeFilter === 'rejected') return searchMatch && participant.status === 'rejected';
    if (activeFilter === 'noteam') return searchMatch && !participant.team;
    
    return searchMatch;
  });

  // Handle select/deselect all participants
  const handleSelectAll = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(filteredParticipants.map(p => p.id));
    }
  };

  // Handle select/deselect individual participant
  const handleSelectParticipant = (id) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter(pId => pId !== id));
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  // Handle approve participants
  const handleApproveParticipants = () => {
    // In a real app, this would be an API call
    const updatedParticipants = participants.map(participant => {
      if (selectedParticipants.includes(participant.id)) {
        return { ...participant, status: 'approved' };
      }
      return participant;
    });
    
    setParticipants(updatedParticipants);
    setShowApproveModal(false);
    
    // Clear selection
    setSelectedParticipants([]);
  };

  // Handle reject participants
  const handleRejectParticipants = () => {
    // In a real app, this would be an API call
    const updatedParticipants = participants.map(participant => {
      if (selectedParticipants.includes(participant.id)) {
        return { 
          ...participant, 
          status: 'rejected',
          rejectionReason: rejectionReason || 'No reason provided'
        };
      }
      return participant;
    });
    
    setParticipants(updatedParticipants);
    setShowRejectModal(false);
    setRejectionReason('');
    
    // Clear selection
    setSelectedParticipants([]);
  };

  // Handle export participants
  const handleExportParticipants = () => {
    // In a real app, this would generate and download a CSV file
    alert('Export functionality would be implemented here.');
  };

  // Handle send email
  const handleSendEmail = () => {
    // In a real app, this would open an email composer
    alert('Email functionality would be implemented here.');
  };

  // Handle view participant details
  const handleViewDetails = (participant) => {
    setCurrentParticipant(participant);
    setShowDetailsModal(true);
  };

  return (
    <div>
      {/* Participants Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Participants Management</h2>
          <p className="text-gray-400">Manage hackathon participants and applications</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-400 text-sm">
            <span className="font-medium text-gray-300">Approval required:</span> 
            <span className="ml-2">{hackathon.settings?.requireApproval ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 flex-wrap">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              All Participants
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap ${
                activeFilter === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setActiveFilter('approved')}
              className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap ${
                activeFilter === 'approved'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveFilter('rejected')}
              className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap ${
                activeFilter === 'rejected'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setActiveFilter('noteam')}
              className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap ${
                activeFilter === 'noteam'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              No Team
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Search participants..."
            />
          </div>
        </div>
      </div>
      
      {/* Bulk Actions */}
      {selectedParticipants.length > 0 && (
        <div className="bg-cyan-900/30 border border-cyan-700/40 rounded-lg p-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="text-white">
            <span className="font-medium">{selectedParticipants.length}</span> participant(s) selected
          </div>
          <div className="flex items-center space-x-2 mt-3 sm:mt-0">
            <button
              onClick={() => setShowApproveModal(true)}
              className="inline-flex items-center px-3 py-1.5 bg-green-600/70 hover:bg-green-600 text-white text-sm rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="inline-flex items-center px-3 py-1.5 bg-red-600/70 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
            <button
              onClick={handleSendEmail}
              className="inline-flex items-center px-3 py-1.5 bg-indigo-600/70 hover:bg-indigo-600 text-white text-sm rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </button>
          </div>
        </div>
      )}
      
      {/* Participants Table */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-cyan-600 rounded border-gray-700 bg-gray-800 focus:ring-cyan-500"
                      checked={selectedParticipants.length === filteredParticipants.length && filteredParticipants.length > 0}
                      onChange={handleSelectAll}
                    />
                    <span className="ml-2">Participant</span>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Team
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Registration Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Submissions
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-cyan-600 rounded border-gray-700 bg-gray-800 focus:ring-cyan-500 mr-4"
                          checked={selectedParticipants.includes(participant.id)}
                          onChange={() => handleSelectParticipant(participant.id)}
                        />
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover" src={participant.avatar} alt={participant.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{participant.name}</div>
                          <div className="text-sm text-gray-500">{participant.email}</div>
                          <div className="text-xs text-cyan-500 mt-1 flex flex-wrap gap-1">
                            {participant.skills.map((skill, i) => (
                              <span key={i}>{skill}{i < participant.skills.length - 1 ? ',' : ''}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.status === 'approved' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-300 border border-green-600/30">
                          Approved
                        </span>
                      )}
                      {participant.status === 'pending' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-300 border border-yellow-600/30">
                          Pending
                        </span>
                      )}
                      {participant.status === 'rejected' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-300 border border-red-600/30">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.team ? (
                        <span className="text-sm text-white">{participant.team}</span>
                      ) : (
                        <span className="text-sm text-gray-500">No team</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {participant.registrationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {participant.submissions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {participant.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedParticipants([participant.id]);
                                setShowApproveModal(true);
                              }}
                              className="text-green-500 hover:text-green-400 transition-colors"
                              title="Approve"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedParticipants([participant.id]);
                                setShowRejectModal(true);
                              }}
                              className="text-red-500 hover:text-red-400 transition-colors"
                              title="Reject"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        )}
                        <button
                          className="text-cyan-500 hover:text-cyan-400 transition-colors"
                          title="View Details"
                          onClick={() => handleViewDetails(participant)}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          className="text-indigo-500 hover:text-indigo-400 transition-colors"
                          title="Email"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
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
      
      {/* Export Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={handleExportParticipants}
          className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export All Participants
        </button>
      </div>
      
      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Approve Participants
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to approve {selectedParticipants.length} participant(s)? They will be notified via email.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveParticipants}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Reject Participants
            </h3>
            <p className="text-gray-300 mb-4">
              Please provide a reason for rejecting {selectedParticipants.length} participant(s):
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6"
              rows="4"
              placeholder="Rejection reason..."
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectParticipants}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                disabled={!rejectionReason.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Participant Details Modal */}
      {showDetailsModal && currentParticipant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-xl max-w-2xl w-full">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <img 
                  src={currentParticipant.avatar} 
                  alt={currentParticipant.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{currentParticipant.name}</h3>
                  <p className="text-gray-400">{currentParticipant.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Status</h4>
                <div>
                  {currentParticipant.status === 'approved' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-300 border border-green-600/30">
                      Approved
                    </span>
                  )}
                  {currentParticipant.status === 'pending' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-300 border border-yellow-600/30">
                      Pending
                    </span>
                  )}
                  {currentParticipant.status === 'rejected' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-300 border border-red-600/30">
                      Rejected
                    </span>
                  )}
                </div>
                {currentParticipant.status === 'rejected' && currentParticipant.rejectionReason && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Rejection Reason</h4>
                    <p className="text-sm text-red-300">{currentParticipant.rejectionReason}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Team</h4>
                <p className="text-white">{currentParticipant.team || 'No team'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Role</h4>
                <p className="text-white capitalize">{currentParticipant.role}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Registration Date</h4>
                <p className="text-white">{currentParticipant.registrationDate}</p>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {currentParticipant.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-900/30 text-cyan-300 border border-cyan-600/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Submissions</h4>
                {currentParticipant.submissions > 0 ? (
                  <p className="text-white">{currentParticipant.submissions} submission(s)</p>
                ) : (
                  <p className="text-gray-500">No submissions yet</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 border-t border-gray-700 pt-4">
              {currentParticipant.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setSelectedParticipants([currentParticipant.id]);
                      setShowDetailsModal(false);
                      setShowApproveModal(true);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedParticipants([currentParticipant.id]);
                      setShowDetailsModal(false);
                      setShowRejectModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Participants; 