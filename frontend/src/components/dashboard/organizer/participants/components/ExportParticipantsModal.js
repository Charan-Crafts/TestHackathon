import React, { useState } from 'react';

const ExportParticipantsModal = ({ show, onClose, participants, hackathons }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeFields, setIncludeFields] = useState({
    name: true,
    email: true,
    hackathon: true,
    team: true,
    status: true,
    skills: true,
    registrationDate: true
  });
  const [selectedHackathons, setSelectedHackathons] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Toggle field selection
  const toggleField = (field) => {
    setIncludeFields({
      ...includeFields,
      [field]: !includeFields[field]
    });
  };

  // Toggle hackathon selection
  const toggleHackathon = (hackathonId) => {
    if (selectedHackathons.includes(hackathonId)) {
      setSelectedHackathons(selectedHackathons.filter(id => id !== hackathonId));
    } else {
      setSelectedHackathons([...selectedHackathons, hackathonId]);
    }
  };

  // Toggle status selection
  const toggleStatus = (status) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // Filter participants based on selected criteria
  const getFilteredParticipants = () => {
    return participants.filter(participant => {
      const matchesHackathon = selectedHackathons.length === 0 || 
        selectedHackathons.includes(participant.hackathonId);
      const matchesStatus = selectedStatuses.length === 0 || 
        selectedStatuses.includes(participant.status);
      return matchesHackathon && matchesStatus;
    });
  };

  // Handle export
  const handleExport = () => {
    const filteredParticipants = getFilteredParticipants();
    const selectedFieldKeys = Object.keys(includeFields).filter(key => includeFields[key]);
    
    if (exportFormat === 'csv') {
      // Create CSV header
      let csvContent = selectedFieldKeys.join(',') + '\n';
      
      // Add data rows
      filteredParticipants.forEach(participant => {
        const row = selectedFieldKeys.map(field => {
          if (field === 'skills') {
            return `"${participant.skills?.join(', ') || ''}"`;
          }
          return `"${participant[field] || ''}"`;
        }).join(',');
        csvContent += row + '\n';
      });
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'participants.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (exportFormat === 'json') {
      // Create JSON with only selected fields
      const jsonData = filteredParticipants.map(participant => {
        const obj = {};
        selectedFieldKeys.forEach(field => {
          obj[field] = participant[field];
        });
        return obj;
      });
      
      // Create download link
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'participants.json');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    onClose();
  };

  if (!show) return null;

  const filteredParticipants = getFilteredParticipants();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border border-gray-700 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5">
          <div className="flex justify-between items-start mb-5">
            <h2 className="text-xl font-bold text-white">Export Participants</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Export Format */}
          <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Export Format</h3>
            <div className="flex gap-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                  className="h-4 w-4 text-indigo-600 border-gray-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
                />
                <span className="ml-2 text-gray-300">CSV</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                  className="h-4 w-4 text-indigo-600 border-gray-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
                />
                <span className="ml-2 text-gray-300">JSON</span>
              </label>
            </div>
          </div>
          
          {/* Fields to Include */}
          <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Fields to Include</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(includeFields).map(field => (
                <label key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeFields[field]}
                    onChange={() => toggleField(field)}
                    className="h-4 w-4 rounded text-indigo-600 border-gray-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
                  />
                  <span className="ml-2 text-gray-300 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Filter by Hackathon */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Filter by Hackathon</h3>
              <div className="max-h-40 overflow-y-auto p-2 bg-gray-800/50 rounded-lg">
                {hackathons.map(hackathon => (
                  <label key={hackathon.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedHackathons.includes(hackathon.id)}
                      onChange={() => toggleHackathon(hackathon.id)}
                      className="h-4 w-4 rounded text-indigo-600 border-gray-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
                    />
                    <span className="ml-2 text-gray-300 text-sm">{hackathon.name || hackathon.title}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {selectedHackathons.length === 0 ? 'All hackathons included' : `${selectedHackathons.length} hackathons selected`}
              </p>
            </div>
            
            {/* Filter by Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Filter by Status</h3>
              <div className="p-2 bg-gray-800/50 rounded-lg">
                {['active', 'pending', 'rejected'].map(status => (
                  <label key={status} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => toggleStatus(status)}
                      className="h-4 w-4 rounded text-indigo-600 border-gray-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
                    />
                    <span className="ml-2 text-gray-300 text-sm capitalize">{status}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {selectedStatuses.length === 0 ? 'All statuses included' : `${selectedStatuses.length} statuses selected`}
              </p>
            </div>
          </div>
          
          {/* Export Summary */}
          <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-3 my-5">
            <p className="text-indigo-300 text-sm font-medium">Export Summary</p>
            <p className="text-gray-300 text-sm">
              {filteredParticipants.length} participants will be exported
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Format: {exportFormat.toUpperCase()} | 
              Fields: {Object.keys(includeFields).filter(k => includeFields[k]).length} |
              Filters: {selectedHackathons.length + selectedStatuses.length}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-indigo-700 text-indigo-100 rounded-lg border border-indigo-600 hover:bg-indigo-600 flex items-center"
              disabled={filteredParticipants.length === 0}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export {filteredParticipants.length} Participants
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportParticipantsModal; 