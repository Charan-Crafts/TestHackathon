import React from 'react';

const RejectionReasonModal = ({ show, onClose, onEdit, hackathon }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-70"></div>
      <div className="relative bg-gray-900 rounded-xl max-w-md w-full mx-auto border border-yellow-500/30 shadow-lg shadow-yellow-500/20 p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-900/40 mb-6 border border-yellow-500/30">
            <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Rejection Reason</h3>
          <p className="text-gray-300 mb-1">{hackathon?.name}</p>
        </div>
        <div className="bg-gray-800/70 rounded-lg p-4 mb-4 text-gray-300 border border-yellow-500/20 text-sm">
          {hackathon?.rejectionReason}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-gray-400 text-sm">
            You can address these concerns and resubmit your hackathon for review.
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => onEdit(hackathon.id)}
              className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit & Resubmit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectionReasonModal; 