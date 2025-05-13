import React, { useState } from 'react';
import { formatDate, formatNumber, getStatusBadge } from '../utils/formatters';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import RejectionReasonModal from '../modals/RejectionReasonModal';
import { useNavigate } from 'react-router-dom';

const HackathonTable = ({ 
  hackathons, 
  onView, 
  onEdit, 
  onPublish, 
  onShowRejection, 
  onDuplicate, 
  onExport, 
  onArchive, 
  onDelete 
}) => {
  const navigate = useNavigate();
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // Handler for delete confirmation
  const handleDeleteConfirmation = (hackathon, e) => {
    e.stopPropagation(); // Stop event from bubbling to the row click handler
    setSelectedHackathon(hackathon);
    setShowDeleteModal(true);
  };

  // Handler for showing rejection reason
  const handleShowRejectionReason = (hackathon, e) => {
    e.stopPropagation(); // Stop event from bubbling to the row click handler
    setSelectedHackathon(hackathon);
    setShowRejectionModal(true);
  };

  // Handler for confirming deletion
  const handleDeleteHackathon = () => {
    onDelete(selectedHackathon);
    setShowDeleteModal(false);
  };

  // Handler for button clicks to prevent row click propagation
  const handleButtonClick = (e, callback, param) => {
    e.stopPropagation();
    console.log("Button clicked:", callback.name, "with parameter:", param);
    
    // Special handling for view function to ensure consistent navigation
    if (callback === onView) {
      console.log("View button clicked for hackathon ID:", param);
      const orgHackathonDetailUrl = `/dashboard/organizer/hackathons/${param}`;
      console.log("Direct navigation to:", orgHackathonDetailUrl);
      window.location.href = orgHackathonDetailUrl;
      return;
    }
    
    callback(param);
  };

  const handleParticipantsClick = (hackathon) => {
    navigate(`/dashboard/hackathon/${hackathon.id}/participants`);
  };

  return (
    <>
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-purple-900/5 mb-8">
        <div className="overflow-x-auto" style={{ maxWidth: "100%", width: "100%" }}>
          <table className="min-w-full divide-y divide-gray-800/70">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hackathon
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Participants
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Updated
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {hackathons.length > 0 ? (
                hackathons.map((hackathon) => (
                  <tr 
                    key={hackathon.id} 
                    className="hover:bg-gray-800/30 transition-colors group cursor-pointer"
                    onClick={(e) => {
                      // Use the onView callback for row clicks as well
                      handleButtonClick(e, onView, hackathon.id);
                    }}
                  >
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div 
                        className="block cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleButtonClick(e, onView, hackathon.id);
                        }}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-lg object-cover border border-gray-700/50" src={hackathon.logo} alt={hackathon.name} />
                          </div>
                          <div className="ml-4 max-w-[180px]">
                            <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors truncate">{hackathon.name}</div>
                            <div className="text-xs text-gray-500 truncate">{hackathon.description.substring(0, 60)}...</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {getStatusBadge(hackathon.status)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{hackathon.dates.split(" - ")[0]}</div>
                      <div className="text-xs text-gray-500">Reg: {hackathon.registrationDeadline.split(" ")[0]}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {hackathon.status === 'live' ? (
                        <>
                          <div className="flex items-center">
                            <svg className="w-3 h-3 text-cyan-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span 
                              className="text-sm text-white hover:text-cyan-400 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleParticipantsClick(hackathon);
                              }}
                            >
                              {formatNumber(hackathon.stats.participants)}
                              {hackathon.trend > 0 && (
                                <span className="ml-1 text-xs text-green-500">↑</span>
                              )}
                              {hackathon.trend < 0 && (
                                <span className="ml-1 text-xs text-red-500">↓</span>
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            <span 
                              className="hover:text-cyan-400 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/dashboard/hackathon/${hackathon.id}/teams`);
                              }}
                            >
                              T: {formatNumber(hackathon.stats.teams)}
                            </span>
                            <span className="mx-1">•</span>
                            <span 
                              className="hover:text-cyan-400 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/dashboard/hackathon/${hackathon.id}/submissions`);
                              }}
                            >
                              S: {formatNumber(hackathon.stats.submissions)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center">
                          <span className="text-lg font-light text-center" style={{ color: hackathon.status === 'draft' ? '#d97706' : '#ef4444' }}>—</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(hackathon.lastUpdated).split(", ")[0]}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => handleButtonClick(e, onView, hackathon.id)}
                          className="text-cyan-500 hover:text-cyan-400 transition-colors"
                          title="View Hackathon"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        
                        {hackathon.status === 'draft' && (
                          <button
                            onClick={(e) => handleButtonClick(e, onPublish, hackathon.id)}
                            className="text-green-500 hover:text-green-400 transition-colors"
                            title="Publish Hackathon"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => handleButtonClick(e, onEdit, hackathon.id)}
                          className="text-indigo-500 hover:text-indigo-400 transition-colors"
                          title="Edit Hackathon"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {hackathon.status === 'rejected' && (
                          <button
                            onClick={(e) => handleShowRejectionReason(hackathon, e)}
                            className="text-yellow-500 hover:text-yellow-400 transition-colors"
                            title="View Rejection Reason"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => handleDeleteConfirmation(hackathon, e)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Delete Hackathon"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                      <p className="text-gray-500 text-lg">No hackathons found</p>
                      <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteHackathon}
        hackathon={selectedHackathon}
      />
      
      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        show={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onEdit={(id) => {
          setShowRejectionModal(false);
          onEdit(id);
        }}
        hackathon={selectedHackathon}
      />
    </>
  );
};

export default HackathonTable; 