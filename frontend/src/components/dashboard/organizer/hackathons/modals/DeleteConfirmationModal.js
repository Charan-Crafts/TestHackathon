import React from 'react';

const DeleteConfirmationModal = ({ show, onClose, onDelete, hackathon }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-70"></div>
      <div className="relative bg-gray-900 rounded-xl max-w-md w-full mx-auto border border-red-500/30 shadow-lg shadow-red-500/20 p-6 z-10">
        <div className="text-center mb-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/40 mb-6 border border-red-500/30">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Delete Hackathon</h3>
          <p className="text-gray-300 mb-1">Are you sure you want to delete this hackathon?</p>
          <p className="text-red-400 font-medium">{hackathon?.name}</p>
          <p className="text-gray-500 mt-3 text-sm">This action cannot be undone.</p>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 