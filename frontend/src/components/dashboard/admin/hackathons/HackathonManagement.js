import React, { useState, useEffect } from 'react';
import { RocketLaunchIcon, CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const HackathonManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Move fetchHackathons outside useEffect so it can be called from anywhere
  const fetchHackathons = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hackathons', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched hackathons:', data.data); // Debug log
      if (data.success) {
        // Map backend fields to frontend expected fields
        const mapped = data.data.map(hackathon => ({
          ...hackathon,
          approved: hackathon.approvalStatus === 'approved',
          status: (
            hackathon.status === 'active' ? 'active' :
              hackathon.status === 'upcoming' ? 'upcoming' :
                hackathon.status === 'completed' ? 'completed' :
                  hackathon.status === 'Coming Soon' ? 'upcoming' :
                    hackathon.status === 'pending' ? 'upcoming' :
                      'upcoming'
          ),
          organizer: hackathon.organizer || (hackathon.organizerId && hackathon.organizerId.name) || 'N/A',
          title: hackathon.title || hackathon.name || 'Untitled',
        }));
        setHackathons(mapped);
      } else {
        toast.error(data.message || 'Failed to fetch hackathons');
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      toast.error(error.message || 'Error fetching hackathons. Please try again later.');
      setHackathons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  // Filter hackathons based on search query
  const filteredHackathons = hackathons.filter(hackathon =>
    hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hackathon.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status badge style helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-900/70 text-green-300';
      case 'rejected':
        return 'bg-red-900/70 text-red-300';
      case 'active':
        return 'bg-green-900/70 text-green-300';
      case 'upcoming':
        return 'bg-blue-900/70 text-blue-300';
      case 'completed':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  // Handle View Hackathon Details
  const handleViewHackathon = (hackathon) => {
    setSelectedHackathon(hackathon);
    setShowDetailsModal(true);
  };

  // Add this function to update a single hackathon's status and approval
  const updateHackathonStatus = (id, newStatus, newApprovalStatus) => {
    setHackathons(prev =>
      prev.map(h =>
        h._id === id
          ? { ...h, status: newStatus, approvalStatus: newApprovalStatus, approved: newApprovalStatus === 'approved' }
          : h
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900/70 via-purple-900/40 to-gray-900/70 rounded-xl p-4 backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-lg bg-purple-900/50">
                <RocketLaunchIcon className="w-8 h-8 text-purple-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl text-white font-bold">Hackathon Management</h2>
                <p className="text-gray-300 text-sm sm:text-base">Manage hackathons, approve submissions, and feature events</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-md transition-colors">
                Create Hackathon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search hackathons by title or organizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select className="block w-full py-2 px-3 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            <select className="block w-full py-2 px-3 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="">All Hackathons</option>
              <option value="featured">Featured</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hackathons Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                    Hackathon
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                    Organizer
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                    Date
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-center text-gray-300">
                    Participants
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-center text-gray-300">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-center text-gray-300">
                    Featured
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-center text-gray-300">
                    Approved
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-right text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-4 text-center text-gray-300">Loading...</td>
                  </tr>
                ) : filteredHackathons.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-4 text-center text-gray-300">No hackathons found</td>
                  </tr>
                ) : (
                  filteredHackathons.map((hackathon) => {
                    let statusLabel = '';
                    if (hackathon.approvalStatus === 'approved') {
                      statusLabel = 'Verified';
                    } else if (hackathon.approvalStatus === 'rejected') {
                      statusLabel = 'Rejected';
                    } else {
                      statusLabel = hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1);
                    }
                    return (
                      <tr key={hackathon._id} className="hover:bg-gray-800/50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="ml-1">
                              <div className="text-sm font-medium text-white">{hackathon.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-300">{hackathon.organizer}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-300">
                            {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="text-sm text-gray-300">{hackathon.participants || 0}</div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(statusLabel.toLowerCase())}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button className={`${hackathon.featured ? 'text-yellow-400' : 'text-gray-500'} hover:text-yellow-300`}>
                            <StarIcon className="h-5 w-5 mx-auto" />
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {hackathon.approved ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewHackathon(hackathon)}
                              className="px-3 py-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors text-xs font-medium shadow-sm"
                            >
                              View Details
                            </button>
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium shadow-sm">
                              Edit
                            </button>
                            <button className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs font-medium shadow-sm">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{' '}
              <span className="font-medium">6</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-900 text-sm font-medium text-white hover:bg-gray-700">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Hackathon Details Modal */}
      {showDetailsModal && selectedHackathon && (
        <HackathonDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          hackathon={selectedHackathon}
          updateHackathonStatus={updateHackathonStatus}
        />
      )}
    </div>
  );
};

const HackathonDetailsModal = ({ isOpen, onClose, hackathon, updateHackathonStatus }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Handle status change (approve/reject)
  const handleStatusChange = (newStatus) => {
    setActionType(newStatus);
    setShowConfirmModal(true);
  };

  // Confirm status change
  const confirmStatusChange = async () => {
    setIsLoading(true);
    try {
      let body = { status: actionType === 'approve' ? 'approved' : 'rejected' };
      if (actionType === 'reject') {
        if (!rejectionReason) {
          toast.error('Please provide a rejection reason.');
          setIsLoading(false);
          return;
        }
        body.rejectionReason = rejectionReason;
      }
      const response = await fetch(`http://localhost:5000/api/hackathons/${hackathon._id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        toast.success(`Hackathon ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
        setShowConfirmModal(false);
        setRejectionReason('');
        // Refresh hackathon list in parent
        if (updateHackathonStatus) updateHackathonStatus(hackathon._id, actionType === 'approve' ? 'active' : 'upcoming', actionType === 'approve' ? 'approved' : 'rejected');
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-gray-900/70 via-purple-900/40 to-gray-900/70 p-4 border-b border-purple-500/30 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{hackathon.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Status and Action Buttons */}
            <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-purple-500/30">
              <div className="flex items-center space-x-3">
                <div>
                  <span className="text-sm font-medium text-gray-300">Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${hackathon.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : hackathon.status === 'upcoming'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-500/20 text-gray-400'
                    }`}>
                    {hackathon.status?.charAt(0).toUpperCase() + hackathon.status?.slice(1) || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-300">Approval Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${hackathon.approved
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                    }`}>
                    {hackathon.approved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                {!hackathon.approved && (
                  <>
                    <button
                      onClick={() => handleStatusChange('approve')}
                      disabled={isLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {isLoading && actionType === 'approve' ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleStatusChange('reject')}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {isLoading && actionType === 'reject' ? 'Processing...' : 'Reject'}
                    </button>
                  </>
                )}
                {hackathon.approved && (
                  <button
                    onClick={() => handleStatusChange('reject')}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isLoading ? 'Processing...' : 'Reject'}
                  </button>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
                Basic Information
              </h3>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/30 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-purple-400">Hackathon Name</p>
                    <p className="text-white">{hackathon.title || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-purple-400">Short Description</p>
                    <p className="text-white">{hackathon.description || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-purple-400">Detailed Description</p>
                  <p className="text-white text-sm">{hackathon.longDescription || 'Not provided'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-purple-400">Start Date</p>
                    <p className="text-white">{hackathon.startDate ? formatDate(hackathon.startDate) : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-400">End Date</p>
                    <p className="text-white">{hackathon.endDate ? formatDate(hackathon.endDate) : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-400">Registration Deadline</p>
                    <p className="text-white">{hackathon.registrationDeadline ? formatDate(hackathon.registrationDeadline) : 'Not set'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-purple-400">Category</p>
                    <p className="text-white">{hackathon.category || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-400">Format</p>
                    <p className="text-white capitalize">{hackathon.locationType || 'Not specified'}</p>
                  </div>
                </div>
                {(hackathon.locationType === 'offline' || hackathon.locationType === 'hybrid') && (
                  <div>
                    <p className="text-sm text-purple-400">Location</p>
                    <p className="text-white">{hackathon.location || 'Not provided'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rounds */}
            {hackathon.rounds && hackathon.rounds.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">Rounds</h3>
                <div className="space-y-3">
                  {hackathon.rounds.map((round, idx) => (
                    <div key={idx} className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium text-lg">{round.name}</p>
                          <p className="text-purple-400 text-sm mt-1">Type: {round.type || 'hackathon'}</p>
                        </div>
                        <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded">Round {idx + 1}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-purple-400">Start</p>
                          <p className="text-white">{round.startDate ? formatDate(round.startDate) : 'Not set'} at {round.startTime || '06:00'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-purple-400">End</p>
                          <p className="text-white">{round.endDate ? formatDate(round.endDate) : 'Not set'} at {round.endTime || '21:00'}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-purple-400">Submission Type</p>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-cyan-400 border border-cyan-600/30">
                          {round.submissionType || 'Not specified'}
                        </span>
                      </div>
                      {round.platformLink && (
                        <div className="mt-3">
                          <p className="text-sm text-purple-400">Platform Link</p>
                          <a href={round.platformLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm break-all">{round.platformLink}</a>
                        </div>
                      )}
                      {round.description && (
                        <div className="mt-3">
                          <p className="text-sm text-purple-400">Description</p>
                          <p className="text-gray-300 text-sm mt-1">{round.description}</p>
                        </div>
                      )}
                      {round.evaluationCriteria && round.evaluationCriteria.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-purple-400">Evaluation Criteria</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {round.evaluationCriteria.map((criteria, cidx) => (
                              <span key={cidx} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                {criteria.name} ({criteria.weight}%)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prizes */}
            {hackathon.prizeDetails && hackathon.prizeDetails.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">Prizes</h3>
                <div className="space-y-3">
                  {hackathon.prizeDetails.map((prize, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 items-center p-2 rounded-lg bg-gray-800/50">
                      <div className="sm:col-span-3">
                        <p className="text-fuchsia-400 font-medium">{prize.place}</p>
                      </div>
                      <div className="sm:col-span-3">
                        <p className="text-white">{prize.amount}</p>
                      </div>
                      <div className="sm:col-span-6">
                        <p className="text-gray-300 text-sm">{prize.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Judges */}
            {hackathon.judges && hackathon.judges.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">Judges</h3>
                <div className="space-y-4 mt-2">
                  {hackathon.judges.map((judge, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-3 rounded-lg bg-gray-800/50">
                      <div className="sm:col-span-12">
                        <p className="text-white font-medium">{judge.name}</p>
                        <p className="text-purple-400 text-sm">{judge.title}{judge.company && ` at ${judge.company}`}</p>
                        {judge.bio && <p className="text-gray-300 text-sm mt-1">{judge.bio}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {hackathon.faqs && hackathon.faqs.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">FAQs</h3>
                <div className="space-y-4">
                  {hackathon.faqs.map((faq, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-gray-800/50">
                      <p className="text-white font-medium mb-1">{faq.question}</p>
                      <p className="text-gray-300 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer Info */}
            <div>
              <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">Organizer</h3>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/30 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-purple-400">Organizer Name</p>
                    <p className="text-white">{hackathon.organizer || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-purple-400">About</p>
                    <p className="text-white">{hackathon.aboutEvent || 'Not provided'}</p>
                  </div>
                </div>
                {hackathon.coOrganizers && hackathon.coOrganizers.length > 0 && (
                  <div>
                    <p className="text-sm text-purple-400 mb-2">Co-Organizers</p>
                    <div className="space-y-3">
                      {hackathon.coOrganizers.map((org, idx) => (
                        <div key={idx} className="bg-gray-800/50 p-2 rounded grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <p className="text-white">{org.name || 'No name'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">{org.contact || 'No contact'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">{org.email || 'No email'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {hackathon.registrationFees && Object.keys(hackathon.registrationFees).length > 0 && (
                  <div>
                    <p className="text-sm text-purple-400 mb-2">Registration Fees</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(hackathon.registrationFees).map(([teamSize, fee]) => (
                        <div key={teamSize} className="bg-gray-800/50 p-2 rounded">
                          <p className="text-white text-sm">{teamSize} {parseInt(teamSize) === 1 ? 'Member' : 'Members'}: ₹{fee}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-gray-900/70 via-purple-900/40 to-gray-900/70 p-4 border-b border-purple-500/30 rounded-t-xl">
              <h3 className="text-xl font-bold text-white">
                Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-300 mb-6">
                Are you sure you want to {actionType === 'approve' ? 'approve' : 'reject'} the hackathon "{hackathon.title}"?
                {actionType === 'approve'
                  ? ' This hackathon will be visible to all users.'
                  : ' This hackathon will be removed from public view.'}
              </p>
              {actionType === 'reject' && (
                <div className="mb-4">
                  <label className="block text-sm text-red-300 mb-1">Rejection Reason <span className="text-red-500">*</span></label>
                  <textarea
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                    rows={3}
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    disabled={isLoading}
                  />
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  disabled={isLoading}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
                >
                  {isLoading ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HackathonManagement; 