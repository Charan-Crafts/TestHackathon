import React, { useState, useEffect } from 'react';

const CertificateGenerator = ({ participants, hackathons }) => {
  const [selectedHackathon, setSelectedHackathon] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [searchText, setSearchText] = useState('');
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [certificateHistory, setCertificateHistory] = useState([]);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [templateText, setTemplateText] = useState('');
  
  // Certificate templates
  const templates = [
    { id: 'standard', name: 'Standard Participation', preview: '/images/cert-standard.png' },
    { id: 'completion', name: 'Challenge Completion', preview: '/images/cert-completion.png' },
    { id: 'winner', name: 'Hackathon Winner', preview: '/images/cert-winner.png' },
    { id: 'mentor', name: 'Mentor Recognition', preview: '/images/cert-mentor.png' },
  ];
  
  // Initialize certificate history
  useEffect(() => {
    const initialHistory = [
      {
        id: 'cert-1',
        date: '2023-10-15',
        hackathonId: hackathons[0]?.id || '',
        templateId: 'standard',
        recipients: participants.slice(0, 15).map(p => p.id),
        sentBy: 'John Organizer'
      },
      {
        id: 'cert-2',
        date: '2023-09-20',
        hackathonId: hackathons[1]?.id || '',
        templateId: 'winner',
        recipients: participants.slice(16, 19).map(p => p.id),
        sentBy: 'Jane Organizer'
      }
    ];
    
    setCertificateHistory(initialHistory);
  }, [participants, hackathons]);
  
  // Filter participants when search or hackathon changes
  useEffect(() => {
    let filtered = participants;
    
    if (searchText) {
      filtered = filtered.filter(participant => 
        participant.name.toLowerCase().includes(searchText.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (selectedHackathon) {
      // In a real app, filter by participants who were in the selected hackathon
      // For demo, we'll just show all participants
    }
    
    setFilteredParticipants(filtered);
  }, [participants, searchText, selectedHackathon]);
  
  // Toggle participant selection
  const toggleParticipantSelection = (participantId) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };
  
  // Select all filtered participants
  const selectAllFiltered = () => {
    setSelectedParticipants(filteredParticipants.map(p => p.id));
  };
  
  // Clear all selections
  const clearSelection = () => {
    setSelectedParticipants([]);
  };
  
  // Generate and send certificates
  const generateCertificates = () => {
    if (!selectedHackathon || !selectedTemplate || selectedParticipants.length === 0) {
      alert('Please select a hackathon, template, and at least one participant');
      return;
    }
    
    // In a real app, this would create and send certificates
    const newCertBatch = {
      id: `cert-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      hackathonId: selectedHackathon,
      templateId: selectedTemplate,
      recipients: [...selectedParticipants],
      sentBy: 'Current Organizer'
    };
    
    setCertificateHistory(prev => [newCertBatch, ...prev]);
    setSelectedParticipants([]);
    alert(`Certificates generated and sent to ${selectedParticipants.length} participants`);
  };
  
  // Get hackathon name by ID
  const getHackathonName = (id) => {
    return hackathons.find(h => h.id === id)?.name || 'Unknown Hackathon';
  };
  
  // Get template name by ID
  const getTemplateName = (id) => {
    return templates.find(t => t.id === id)?.name || 'Unknown Template';
  };
  
  // Get participant names for a certificate batch
  const getRecipientNames = (recipientIds) => {
    const names = recipientIds.map(id => {
      const participant = participants.find(p => p.id === id);
      return participant?.name || 'Unknown';
    });
    
    if (names.length <= 2) return names.join(', ');
    return `${names[0]}, ${names[1]}, and ${names.length - 2} more`;
  };
  
  return (
    <div className="space-y-6">
      {/* Certificate Generator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 col-span-2">
          <h3 className="text-xl font-semibold text-white mb-4">Generate New Certificates</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Select Hackathon</label>
                <select
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
                  value={selectedHackathon}
                  onChange={(e) => setSelectedHackathon(e.target.value)}
                >
                  <option value="">Select a hackathon...</option>
                  {hackathons.map(hackathon => (
                    <option key={hackathon.id} value={hackathon.id}>
                      {hackathon.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Certificate Template</label>
                <select
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button 
                className="text-sm text-cyan-400 hover:text-cyan-300"
                onClick={() => setShowTemplateEditor(!showTemplateEditor)}
              >
                {showTemplateEditor ? 'Hide Template Editor' : 'Customize Template Text'}
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  {selectedParticipants.length} participant{selectedParticipants.length !== 1 ? 's' : ''} selected
                </span>
                <button 
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                  onClick={clearSelection}
                  disabled={selectedParticipants.length === 0}
                >
                  Clear
                </button>
              </div>
            </div>
            
            {showTemplateEditor && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Certificate Text</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white h-32"
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  placeholder="This certifies that {{participant.name}} has successfully participated in {{hackathon.name}} from {{hackathon.startDate}} to {{hackathon.endDate}}."
                />
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium"
                onClick={generateCertificates}
                disabled={!selectedHackathon || !selectedTemplate || selectedParticipants.length === 0}
              >
                Generate & Send Certificates
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4">
          <h3 className="text-xl font-semibold text-white mb-4">Template Preview</h3>
          
          {selectedTemplate ? (
            <div className="space-y-4">
              <div className="border border-gray-700 rounded-lg overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
                <img 
                  src={templates.find(t => t.id === selectedTemplate)?.preview || '/images/cert-placeholder.png'} 
                  alt="Certificate Template Preview" 
                  className="w-full h-auto object-contain"
                />
              </div>
              
              <div className="text-center">
                <h4 className="text-lg font-medium text-white">
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  Perfect for recognizing participants' achievements
                </p>
              </div>
              
              <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-gray-700 rounded-lg font-medium">
                Preview with Participant Data
              </button>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Select a template to preview
            </div>
          )}
        </div>
      </div>
      
      {/* Participant Selection */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden">
        <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700 flex flex-wrap items-center justify-between">
          <h3 className="text-lg font-medium text-white">Select Recipients</h3>
          
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Search participants..."
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white text-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            
            <button 
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm"
              onClick={selectAllFiltered}
            >
              Select All
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-cyan-600 rounded border-gray-700 bg-gray-800 focus:ring-cyan-500"
                    checked={filteredParticipants.length > 0 && filteredParticipants.every(p => selectedParticipants.includes(p.id))}
                    onChange={selectAllFiltered}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Participant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Skills
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Previous Certificates
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredParticipants.map((participant) => (
                <tr key={participant.id} className={`hover:bg-gray-800/30 ${selectedParticipants.includes(participant.id) ? 'bg-cyan-900/20' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-cyan-600 rounded border-gray-700 bg-gray-800 focus:ring-cyan-500"
                      checked={selectedParticipants.includes(participant.id)}
                      onChange={() => toggleParticipantSelection(participant.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-lg font-medium text-cyan-300">{participant.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{participant.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {participant.email}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {participant.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-cyan-400">
                          {skill}
                        </span>
                      ))}
                      {participant.skills.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400">
                          +{participant.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {certificateHistory.filter(cert => cert.recipients.includes(participant.id)).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Certificate History */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden">
        <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Certificate History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hackathon
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Certificate Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Recipients
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {certificateHistory.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-800/30">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {cert.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {getHackathonName(cert.hackathonId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {getTemplateName(cert.templateId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center">
                      <span>{getRecipientNames(cert.recipients)}</span>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400">
                        {cert.recipients.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-cyan-400 hover:text-cyan-300 mr-4">
                      View
                    </button>
                    <button className="text-cyan-400 hover:text-cyan-300">
                      Reissue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;