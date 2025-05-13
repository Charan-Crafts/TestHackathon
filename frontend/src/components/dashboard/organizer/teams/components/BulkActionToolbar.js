import React, { useState } from 'react';

const BulkActionToolbar = ({ 
  selectedTeams, 
  onBulkAction, 
  onClearSelection, 
  availableStatuses
}) => {
  const [actionType, setActionType] = useState('');
  const [targetStatus, setTargetStatus] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  // Reset states when selection changes
  React.useEffect(() => {
    setActionType('');
    setTargetStatus('');
    setConfirmOpen(false);
  }, [selectedTeams]);
  
  const handleActionChange = (e) => {
    setActionType(e.target.value);
    // Reset status if not changing status
    if (e.target.value !== 'status') {
      setTargetStatus('');
    }
  };
  
  const handleStatusChange = (e) => {
    setTargetStatus(e.target.value);
  };
  
  const handleApplyAction = () => {
    if (actionType === 'status' && !targetStatus) {
      return; // Don't proceed without target status
    }
    
    if (['delete', 'message'].includes(actionType)) {
      setConfirmOpen(true);
    } else {
      executeBulkAction();
    }
  };
  
  const executeBulkAction = () => {
    const actionData = {
      type: actionType,
      teams: selectedTeams,
      ...(actionType === 'status' && { targetStatus }),
    };
    
    onBulkAction(actionData);
    setConfirmOpen(false);
  };
  
  const cancelAction = () => {
    setConfirmOpen(false);
  };

  if (selectedTeams.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900 p-3 border border-gray-700/50 rounded-lg shadow-lg shadow-purple-900/10 mb-5 transition-all">
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-indigo-500/20 px-3 py-1 rounded-md text-sm text-indigo-300 font-medium">
          {selectedTeams.length} {selectedTeams.length === 1 ? 'team' : 'teams'} selected
        </div>
        
        <div className="flex-1 flex flex-wrap items-center gap-3">
          <select 
            value={actionType} 
            onChange={handleActionChange}
            className="bg-gray-800 border border-gray-700 rounded-md text-gray-300 text-sm px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select action</option>
            <option value="status">Change status</option>
            <option value="message">Send message</option>
            <option value="export">Export data</option>
            <option value="delete">Delete</option>
          </select>
          
          {actionType === 'status' && (
            <select 
              value={targetStatus} 
              onChange={handleStatusChange}
              className="bg-gray-800 border border-gray-700 rounded-md text-gray-300 text-sm px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select new status</option>
              {availableStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          )}
          
          <button
            disabled={!actionType || (actionType === 'status' && !targetStatus)}
            onClick={handleApplyAction}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              !actionType || (actionType === 'status' && !targetStatus)
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } transition-colors`}
          >
            Apply
          </button>
          
          <button
            onClick={onClearSelection}
            className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors"
          >
            Clear selection
          </button>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      {confirmOpen && (
        <div className="mt-4 bg-gray-800 border border-gray-700 rounded-md p-4 text-gray-200">
          <h4 className="text-lg font-medium mb-2">
            {actionType === 'delete' ? 'Confirm Deletion' : 'Confirm Bulk Message'}
          </h4>
          
          {actionType === 'delete' ? (
            <p className="text-gray-400 mb-3">
              Are you sure you want to delete {selectedTeams.length} {selectedTeams.length === 1 ? 'team' : 'teams'}?
              This action cannot be undone.
            </p>
          ) : (
            <p className="text-gray-400 mb-3">
              You're about to send a message to {selectedTeams.length} {selectedTeams.length === 1 ? 'team' : 'teams'}.
              This will notify all team members.
            </p>
          )}
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={cancelAction}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-md transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={executeBulkAction}
              className={`px-3 py-1.5 text-white text-sm font-medium rounded-md ${
                actionType === 'delete' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } transition-colors`}
            >
              {actionType === 'delete' ? 'Delete' : 'Send Message'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionToolbar; 