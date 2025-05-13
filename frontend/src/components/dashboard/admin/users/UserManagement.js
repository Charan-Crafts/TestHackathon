import React, { useState, useEffect } from 'react';
import { UsersIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import API from '../../../../services/api';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const selectedFilters = {
    role: 'all',
    status: 'all'
  };

  // Helper functions for badge styling
  const getRoleColor = (role) => {
    if (!role) return { bg: 'rgba(75, 85, 99, 0.5)', text: '#d1d5db' };

    switch (role.toLowerCase()) {
      case 'admin':
        return { bg: 'rgba(126, 34, 206, 0.3)', text: '#c4b5fd' };
      case 'organizer':
        return { bg: 'rgba(79, 70, 229, 0.3)', text: '#a5b4fc' };
      case 'pending_organizer':
        return { bg: 'rgba(219, 39, 119, 0.3)', text: '#fbcfe8' };
      default:
        return { bg: 'rgba(75, 85, 99, 0.5)', text: '#d1d5db' };
    }
  };

  const getStatusColor = (status) => {
    if (!status) return { bg: 'rgba(75, 85, 99, 0.5)', text: '#d1d5db' };

    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
        return { bg: 'rgba(5, 150, 105, 0.3)', text: '#6ee7b7' };
      case 'pending':
        return { bg: 'rgba(245, 158, 11, 0.3)', text: '#fcd34d' };
      case 'rejected':
      case 'inactive':
      case 'blocked':
        return { bg: 'rgba(220, 38, 38, 0.3)', text: '#fca5a5' };
      default:
        return { bg: 'rgba(75, 85, 99, 0.5)', text: '#d1d5db' };
    }
  };

  // Fetch verification requests and users
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch verification requests
        const verificationResponse = await API.verificationAPI.getAllVerifications(pagination.page, pagination.limit);

        if (verificationResponse.data.success) {
          setVerificationRequests(verificationResponse.data.data);
          setPagination({
            page: verificationResponse.data.pagination.page,
            limit: verificationResponse.data.pagination.limit,
            total: verificationResponse.data.pagination.total,
            totalPages: verificationResponse.data.pagination.totalPages
          });
        }

        // Fetch users
        const usersResponse = await API.userAPI.getAllUsers(pagination.page, pagination.limit);
        if (usersResponse.data.success) {
          setUsers(usersResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data. Please try again later.');
        setUsers([]);
        setVerificationRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pagination.page, pagination.limit]);

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    // Check role and status filters
    const matchesFilters = (
      (selectedFilters.role === 'all' || user.role === selectedFilters.role) && 
      (selectedFilters.status === 'all' || user.status === selectedFilters.status)
    );

    // Check search query
    const matchesSearch = (
      !searchQuery || (
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    return matchesFilters && matchesSearch;
  });

  // Function to get verification request for a user
  const getVerificationForUser = (userId) => {
    return verificationRequests.find(req => (
      req.userId === userId
    ));
  };



  const handleViewOrganizer = async (user) => {
    setSelectedUser(user);
    setIsLoading(true);

    try {
      // Try to fetch verification details
      const verification = getVerificationForUser(user._id || user.id);

      if (verification) {
        // If we have the verification ID, fetch the complete details
        const response = await API.verificationAPI.getVerificationById(verification._id);
        if (response.data.success) {
          setSelectedVerification(response.data.data);
        }
      } else {
        setSelectedVerification(null);
      }
    } catch (error) {
      console.error('Error fetching verification details:', error);
      toast.error('Failed to load verification details');
      setSelectedVerification(null);
    } finally {
      setIsLoading(false);
      setShowOrganizerModal(true);
    }
  };

  const handleApproveVerification = async (verificationId) => {
    try {
      const response = await API.verificationAPI.reviewVerification(verificationId, {
        status: 'approved',
        notes: 'Approved by admin'
      });

      if (response.data.success) {
        toast.success('Organizer approved successfully');
        // Refresh verification requests
        const updatedResponse = await API.verificationAPI.getAllVerifications(pagination.page, pagination.limit);
        if (updatedResponse.data.success) {
          setVerificationRequests(updatedResponse.data.data);
        }
      }
    } catch (error) {
      console.error('Error approving verification:', error);
      toast.error('Failed to approve organizer');
    }
  };

  const handleRejectVerification = async (verificationId, reason = 'Rejected by admin') => {
    try {
      const response = await API.verificationAPI.reviewVerification(verificationId, {
        status: 'rejected',
        rejectionReason: reason
      });

      if (response.data.success) {
        toast.success('Organizer verification rejected');
        // Refresh verification requests
        const updatedResponse = await API.verificationAPI.getAllVerifications(pagination.page, pagination.limit);
        if (updatedResponse.data.success) {
          setVerificationRequests(updatedResponse.data.data);
        }
      }
    } catch (error) {
      console.error('Error rejecting verification:', error);
      toast.error('Failed to reject organizer verification');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900/70 via-purple-900/40 to-gray-900/70 rounded-xl p-4 backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-lg bg-blue-900/50">
                <UsersIcon className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl text-white font-bold">User Management</h2>
                <p className="text-gray-300 text-sm sm:text-base">Manage users, roles, and permissions</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition-colors">
                Add New User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Requests Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Organizer Verification Requests</h3>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                      Name
                    </th>
                    <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                      Email
                    </th>
                    <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                      Organization
                    </th>
                    <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                      Status
                    </th>
                    <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                      Submitted On
                    </th>
                    <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-center text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-400">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-3"></div>
                          Loading verification requests...
                        </div>
                      </td>
                    </tr>
                  ) : verificationRequests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-400">
                        No verification requests found
                      </td>
                    </tr>
                  ) : (
                    verificationRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-800/50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">
                              <span className="text-lg font-medium text-gray-300">{(request.fullName && request.fullName.charAt(0)) || '?'}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{request.fullName || 'Unknown User'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{request.email}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{request.organizationName}</div>
                          <div className="text-xs text-gray-500">{request.organizationType}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="px-2 py-1 text-xs font-medium rounded-full inline-flex"
                            style={{
                              backgroundColor: getStatusColor(request.status).bg,
                              color: getStatusColor(request.status).text
                            }}
                          >
                            {((request.status && request.status.charAt(0).toUpperCase()) + request.status.slice(1)) || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              className="px-3 py-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors text-xs font-medium shadow-sm"
                              onClick={() => handleViewOrganizer({ _id: request.userId, email: request.email, name: request.fullName })}
                            >
                              View Details
                            </button>
                            {request.status === 'pending' && (
                              <>
                                <button
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs font-medium shadow-sm"
                                  onClick={() => handleApproveVerification(request._id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs font-medium shadow-sm"
                                  onClick={() => handleRejectVerification(request._id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* All Users Section */}
      <h3 className="text-xl font-bold text-white mb-4">All Users</h3>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search users by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select className="block w-full py-2 px-3 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="host">Host</option>
              <option value="user">User</option>
            </select>
            <select className="block w-full py-2 px-3 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                    Name
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                    Email
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                    Role
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-left text-gray-300">
                    Join Date
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-center text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-300">{(user.name && user.name.charAt(0)) || '?'}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name || 'Unknown User'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{user.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="px-2 py-1 text-xs font-medium rounded-full inline-flex"
                        style={{
                          backgroundColor: getRoleColor(user.role).bg,
                          color: getRoleColor(user.role).text
                        }}
                      >
                        {(user.role && (user.role.charAt(0).toUpperCase() + user.role.slice(1))) || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="px-2 py-1 text-xs font-medium rounded-full inline-flex"
                        style={{
                          backgroundColor: getStatusColor(user.status).bg,
                          color: getStatusColor(user.status).text
                        }}
                      >
                        {(user.status && (user.status.charAt(0).toUpperCase() + user.status.slice(1))) || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="px-3 py-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors text-xs font-medium shadow-sm"
                          onClick={() => handleViewOrganizer(user)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page <= 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
            disabled={pagination.page >= pagination.totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Showing <span className="font-medium">{users.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-medium">{pagination.total}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page <= 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                // If totalPages <= 5, show all pages
                // If totalPages > 5, show current page and adjacent pages
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  // Calculate which pages to show in a 5-page window
                  const start = Math.max(1, pagination.page - 2);
                  const end = Math.min(pagination.totalPages, start + 4);
                  pageNum = start + i;

                  // Skip rendering if outside the visible range
                  if (pageNum > end) return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium ${pagination.page === pageNum
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              }).filter(Boolean)}

              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                disabled={pagination.page >= pagination.totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Organizer Details Modal */}
      {showOrganizerModal && selectedUser && (
        <ViewDetailsModal
          isOpen={showOrganizerModal}
          onClose={() => setShowOrganizerModal(false)}
          user={selectedUser}
          verification={selectedVerification}
        />
      )}
    </div>
  );
};

const ViewDetailsModal = ({ isOpen, onClose, user, verification }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [photoIdFileName, setPhotoIdFileName] = useState('');
  const [orgIdFileName, setOrgIdFileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Use the verification data if available
      if (verification) {
        setVerificationDetails({
          id: verification._id,
          personalDetails: {
            fullName: verification.fullName,
            email: verification.email,
            phoneNumber: verification.phoneNumber,
            linkedinProfile: verification.linkedinProfile || 'Not provided',
            photoIdProof: verification.photoIdProof || 'Not available'
          },
          organizationDetails: {
            organizationName: verification.organizationName,
            organizationType: verification.organizationType,
            website: verification.website || 'Not provided',
            role: verification.role,
            organizationEmail: verification.organizationEmail,
            organizationIdProof: verification.organizationIdProof || 'Not available'
          },
          submittedAt: verification.createdAt,
          updatedAt: verification.updatedAt,
          status: verification.status
        });
        // Fetch file names for proofs if they are IDs
        if (verification.photoIdProof && verification.photoIdProof.length === 24) {
          setPhotoIdFileName(''); // loading
          fetch(`http://localhost:5000/api/files/id/${verification.photoIdProof}`)
            .then(res => res.json())
            .then(data => setPhotoIdFileName(data.data.fileName))
            .catch(() => setPhotoIdFileName(null));
        } else {
          setPhotoIdFileName(null);
        }
        if (verification.organizationIdProof && verification.organizationIdProof.length === 24) {
          setOrgIdFileName(''); // loading
          fetch(`http://localhost:5000/api/files/id/${verification.organizationIdProof}`)
            .then(res => res.json())
            .then(data => setOrgIdFileName(data.data.fileName))
            .catch(() => setOrgIdFileName(null));
        } else {
          setOrgIdFileName(null);
        }
      } else {
        // If no verification data, use user data for basic display
        setVerificationDetails({
          personalDetails: {
            fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.email,
            phoneNumber: 'Not provided',
            linkedinProfile: 'Not provided',
            photoIdProof: 'Not provided'
          },
          organizationDetails: {
            organizationName: 'Not provided',
            organizationType: 'Not provided',
            website: 'Not provided',
            role: 'Not provided',
            organizationEmail: 'Not provided',
            organizationIdProof: 'Not provided'
          },
          submittedAt: user.createdAt || new Date().toISOString(),
          status: 'not submitted'
        });
        setPhotoIdFileName(null);
        setOrgIdFileName(null);
      }
    }
  }, [isOpen, user, verification]);

  const handleStatusChange = (newStatus) => {
    setActionType(newStatus);
    if (newStatus === 'rejected') {
      setShowRejectionForm(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const confirmStatusChange = async () => {
    if (!verification || !verification._id) {
      toast.error('Verification ID is missing');
      return;
    }

    setIsLoading(true);
    try {
      // Call the API to update the verification status
      const reviewData = {
        status: actionType,
        notes: actionType === 'approved' ? 'Approved by admin' : undefined,
        rejectionReason: actionType === 'rejected' ? rejectionReason : undefined
      };

      const response = await API.verificationAPI.reviewVerification(verification._id, reviewData);

      if (response.data.success) {
        // Update the local state
        setVerificationDetails(prev => ({
          ...prev,
          status: actionType
        }));

        // Show success message
        toast.success(`Organizer ${actionType === 'approved' ? 'approved' : 'rejected'} successfully`);

        // Close modals
        setShowRejectionForm(false);
        setShowConfirmModal(false);

        // Refresh the data
        window.location.reload();
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-gray-900/70 via-indigo-900/40 to-gray-900/70 p-4 border-b border-indigo-500/30">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Organizer Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {verificationDetails ? (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-300">Verification Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${!verificationDetails?.status ? 'bg-gray-500/20 text-gray-400' :
                      verificationDetails.status === 'approved'
                        ? 'bg-green-500/20 text-green-400'
                        : verificationDetails.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                      {
                        (!verificationDetails?.status) ? 'Unknown' :
                          (verificationDetails.status === 'pending') ? 'Pending' :
                            (verificationDetails.status === 'approved') ? 'Approved' :
                              (verificationDetails.status === 'rejected') ? 'Rejected' :
                                `${verificationDetails.status.charAt(0).toUpperCase()}${verificationDetails.status.slice(1)}`
                      }
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {verificationDetails.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange('approved')}
                          disabled={isLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {isLoading ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleStatusChange('rejected')}
                          disabled={isLoading}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {isLoading ? 'Processing...' : 'Reject'}
                        </button>
                      </>
                    )}
                    {verificationDetails.status === 'approved' && (
                      <button
                        onClick={() => handleStatusChange('rejected')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        {isLoading ? 'Processing...' : 'Revoke Approval'}
                      </button>
                    )}
                    {verificationDetails.status === 'rejected' && (
                      <button
                        onClick={() => handleStatusChange('approved')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        {isLoading ? 'Processing...' : 'Approve'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Personal Details Section */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-medium text-indigo-400 mb-4">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-white">{verificationDetails.personalDetails.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="text-white">{verificationDetails.personalDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-white">{verificationDetails.personalDetails.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">LinkedIn Profile</p>
                      <p className="text-white">
                        <a
                          href={verificationDetails.personalDetails.linkedinProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          {verificationDetails.personalDetails.linkedinProfile}
                        </a>
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Photo ID Proof</p>
                      <div className="flex items-center mt-1">
                        <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="ml-2 text-white">{verificationDetails.personalDetails.photoIdProof}</span>
                        {(verificationDetails.personalDetails.photoIdProof && verificationDetails.personalDetails.photoIdProof !== 'Not provided') && (
                          photoIdFileName === '' ? (
                            <span className="ml-2 text-xs text-gray-400">Loading...</span>
                          ) : photoIdFileName === null ? (
                            <span className="ml-2 text-xs text-red-400">File not found</span>
                          ) : (
                            <a
                              href={`http://localhost:5000/uploads/${photoIdFileName}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 px-2 py-1 bg-indigo-600/70 text-white text-xs rounded hover:bg-indigo-700 transition-colors flex items-center"
                            >
                              <svg className="h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Document
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization Details Section */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-medium text-indigo-400 mb-4">Organization Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Organization Name</p>
                      <p className="text-white">{verificationDetails.organizationDetails.organizationName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Organization Type</p>
                      <p className="text-white">{verificationDetails.organizationDetails.organizationType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role / Designation</p>
                      <p className="text-white">{verificationDetails.organizationDetails.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Official Website</p>
                      <p className="text-white">
                        <a
                          href={verificationDetails.organizationDetails.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          {verificationDetails.organizationDetails.website}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Organization Email</p>
                      <p className="text-white">{verificationDetails.organizationDetails.organizationEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Organization ID Proof</p>
                      <div className="flex items-center mt-1">
                        <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="ml-2 text-white">{verificationDetails.organizationDetails.organizationIdProof}</span>
                        {(verificationDetails.organizationDetails.organizationIdProof && verificationDetails.organizationDetails.organizationIdProof !== 'Not provided') && (
                          orgIdFileName === '' ? (
                            <span className="ml-2 text-xs text-gray-400">Loading...</span>
                          ) : orgIdFileName === null ? (
                            <span className="ml-2 text-xs text-red-400">File not found</span>
                          ) : (
                            <a
                              href={`http://localhost:5000/uploads/${orgIdFileName}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 px-2 py-1 bg-indigo-600/70 text-white text-xs rounded hover:bg-indigo-700 transition-colors flex items-center"
                            >
                              <svg className="h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Document
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submission Info */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-medium text-indigo-400 mb-4">Submission Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="text-white">
                        {new Date(verificationDetails.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-white">
                        {new Date(verificationDetails.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading verification details...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-gray-900/70 via-indigo-900/40 to-gray-900/70 p-4 border-b border-indigo-500/30 rounded-t-xl">
              <h3 className="text-xl font-bold text-white">
                Confirm {actionType === 'approved' ? 'Approval' : 'Rejection'}
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-300 mb-6">
                Are you sure you want to {actionType === 'approved' ? 'approve' : 'reject'} this organizer verification request?
                {actionType === 'approved' ?
                  ' This user will gain access to organizer features.' :
                  ' This user will need to submit a new verification request.'}
              </p>
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
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${actionType === 'approved'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
                >
                  {isLoading ? 'Processing...' : actionType === 'approved' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Form Modal */}
      {showRejectionForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-gray-900/70 via-red-900/40 to-gray-900/70 p-4 border-b border-red-500/30 rounded-t-xl">
              <h3 className="text-xl font-bold text-white">Provide Rejection Reason</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-300 mb-4">
                Please provide a reason for rejecting this verification request.
                This feedback will be shared with the user.
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white mb-4"
                rows={4}
                placeholder="Enter rejection reason..."
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectionForm(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  disabled={isLoading || !rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isLoading ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagement; 