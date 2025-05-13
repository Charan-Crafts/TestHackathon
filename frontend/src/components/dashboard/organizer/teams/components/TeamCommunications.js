import React, { useState } from 'react';

const TeamCommunications = ({ teams }) => {
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('announcement');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageFilter, setMessageFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [searchText, setSearchText] = useState('');
  
  // Sample message history data
  const [messageHistory, setMessageHistory] = useState([
    {
      id: 1,
      type: 'announcement',
      title: 'Project Submission Deadline',
      content: 'Reminder: Project submissions are due in 48 hours. Please make sure your code is committed and your demo is ready.',
      teams: 'all',
      sentBy: 'Organizer',
      sentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      recipients: 18
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Mid-hackathon Check-in',
      content: 'Don\'t forget to join the mid-hackathon check-in call at 3 PM today. We\'ll be discussing progress and any issues you might be facing.',
      teams: [3, 5, 8],
      sentBy: 'Organizer',
      sentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      recipients: 3
    },
    {
      id: 3,
      type: 'message',
      title: 'Question about your submission',
      content: 'We had a question about your project description. Could you please provide more details about the technology stack you\'re using?',
      teams: [5],
      sentBy: 'Judge',
      sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      recipients: 1
    }
  ]);
  
  // Sample message templates
  const messageTemplates = [
    { id: 'deadline', title: 'Submission Deadline', content: 'Reminder: Project submissions are due [date]. Please ensure all your code is committed and your presentation is ready.' },
    { id: 'checkin', title: 'Check-in Reminder', content: 'This is a reminder about our upcoming check-in meeting at [time] on [date]. Please be prepared to share your progress.' },
    { id: 'help', title: 'Need Assistance?', content: 'If you\'re experiencing any challenges or need technical assistance, please don\'t hesitate to reach out to the mentor team.' }
  ];

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !messageTitle.trim()) return;
    
    const newMessage = {
      id: messageHistory.length + 1,
      type: messageType,
      title: messageTitle,
      content: messageText,
      teams: selectedTeams.length > 0 ? selectedTeams : 'all',
      sentBy: 'Organizer',
      sentDate: new Date().toISOString(),
      recipients: selectedTeams.length || teams.length
    };
    
    setMessageHistory([newMessage, ...messageHistory]);
    
    // Reset form
    setMessageText('');
    setMessageTitle('');
    setSelectedTeams([]);
    
    // Show success notification
    alert(`Message sent to ${newMessage.recipients} teams!`);
  };
  
  // Apply template to current message
  const applyTemplate = (templateId) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setMessageTitle(template.title);
      setMessageText(template.content);
    }
  };
  
  // Filter message history by type
  const filteredMessages = messageHistory.filter(message => {
    const matchesFilter = messageFilter === 'all' || message.type === messageFilter;
    const matchesSearch = !searchText || 
      message.title.toLowerCase().includes(searchText.toLowerCase()) || 
      message.content.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Handle selecting a team for messaging
  const handleSelectTeam = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Message Composer - Left Panel */}
      <div className="lg:col-span-1">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-purple-900/5 p-5">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Compose Message
          </h2>
          
          <form onSubmit={handleSendMessage}>
            {/* Message Type */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Message Type</label>
              <div className="grid grid-cols-3 gap-2">
                <div 
                  className={`p-3 rounded-lg border cursor-pointer text-center text-sm ${
                    messageType === 'announcement' 
                      ? 'bg-indigo-900/40 border-indigo-700 text-indigo-300' 
                      : 'bg-gray-800/40 border-gray-700/50 text-gray-300 hover:bg-gray-800'
                  }`}
                  onClick={() => setMessageType('announcement')}
                >
                  <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  Announcement
                </div>
                <div 
                  className={`p-3 rounded-lg border cursor-pointer text-center text-sm ${
                    messageType === 'reminder' 
                      ? 'bg-yellow-900/40 border-yellow-700 text-yellow-300' 
                      : 'bg-gray-800/40 border-gray-700/50 text-gray-300 hover:bg-gray-800'
                  }`}
                  onClick={() => setMessageType('reminder')}
                >
                  <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Reminder
                </div>
                <div 
                  className={`p-3 rounded-lg border cursor-pointer text-center text-sm ${
                    messageType === 'message' 
                      ? 'bg-blue-900/40 border-blue-700 text-blue-300' 
                      : 'bg-gray-800/40 border-gray-700/50 text-gray-300 hover:bg-gray-800'
                  }`}
                  onClick={() => setMessageType('message')}
                >
                  <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message
                </div>
              </div>
            </div>
            
            {/* Templates */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Use Template</label>
              <select 
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-transparent"
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  if (e.target.value) applyTemplate(e.target.value);
                }}
              >
                <option value="">Select a template...</option>
                {messageTemplates.map(template => (
                  <option key={template.id} value={template.id}>{template.title}</option>
                ))}
              </select>
            </div>
            
            {/* Recipients */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-gray-400">Recipients</label>
                {selectedTeams.length > 0 && (
                  <button 
                    type="button"
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                    onClick={() => setSelectedTeams([])}
                  >
                    Clear Selection
                  </button>
                )}
              </div>
              
              <div className="p-3 bg-gray-800/40 border border-gray-700/50 rounded-lg mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="select-all-teams"
                    checked={selectedTeams.length === 0}
                    onChange={() => setSelectedTeams([])}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500/50 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="select-all-teams" className="ml-2 text-sm text-gray-300">
                    All Teams ({teams.length})
                  </label>
                </div>
              </div>
              
              <div className="max-h-32 overflow-y-auto custom-scrollbar mb-2">
                {selectedTeams.length === 0 ? (
                  <div className="text-xs text-gray-500 italic p-2 text-center">
                    Sending to all teams
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 p-2">
                    {selectedTeams.map(id => {
                      const team = teams.find(t => t.id === id);
                      return team ? (
                        <div key={id} className="bg-indigo-900/30 text-indigo-300 border border-indigo-800/50 rounded-full px-2 py-0.5 text-xs flex items-center">
                          {team.name}
                          <button 
                            type="button"
                            className="ml-1 text-indigo-400 hover:text-indigo-300"
                            onClick={() => handleSelectTeam(id)}
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Select specific teams or send to everyone
                </span>
              </div>
            </div>
            
            {/* Message Title */}
            <div className="mb-4">
              <label htmlFor="message-title" className="block text-sm text-gray-400 mb-2">Message Title</label>
              <input
                id="message-title"
                type="text"
                value={messageTitle}
                onChange={(e) => setMessageTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-transparent"
                placeholder="Enter message title"
                required
              />
            </div>
            
            {/* Message Content */}
            <div className="mb-4">
              <label htmlFor="message-content" className="block text-sm text-gray-400 mb-2">Message Content</label>
              <textarea
                id="message-content"
                rows={5}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-transparent"
                placeholder="Enter your message here..."
                required
              />
            </div>
            
            {/* Send Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!messageText.trim() || !messageTitle.trim()}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  !messageText.trim() || !messageTitle.trim()
                    ? 'bg-indigo-900/30 text-indigo-400/70 cursor-not-allowed'
                    : 'bg-indigo-700 text-indigo-100 border border-indigo-600 hover:bg-indigo-600'
                }`}
              >
                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Message History - Right Panel */}
      <div className="lg:col-span-2">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-purple-900/5 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Message History
            </h2>
            
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full sm:w-48 px-3 py-1.5 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Message Type Tabs */}
          <div className="flex space-x-1 mb-4 border-b border-gray-800">
            <button
              onClick={() => setMessageFilter('all')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                messageFilter === 'all'
                  ? 'text-purple-300 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setMessageFilter('announcement')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                messageFilter === 'announcement'
                  ? 'text-indigo-300 border-b-2 border-indigo-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setMessageFilter('reminder')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                messageFilter === 'reminder'
                  ? 'text-yellow-300 border-b-2 border-yellow-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Reminders
            </button>
            <button
              onClick={() => setMessageFilter('message')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                messageFilter === 'message'
                  ? 'text-blue-300 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Messages
            </button>
          </div>
          
          {/* Messages List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {filteredMessages.length > 0 ? (
              filteredMessages.map(message => (
                <div key={message.id} className="p-4 bg-gray-800/40 border border-gray-700/50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-start">
                      {message.type === 'announcement' && (
                        <div className="h-8 w-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 border border-indigo-700/50 mr-3">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                          </svg>
                        </div>
                      )}
                      {message.type === 'reminder' && (
                        <div className="h-8 w-8 rounded-full bg-yellow-900/50 flex items-center justify-center text-yellow-300 border border-yellow-700/50 mr-3">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      {message.type === 'message' && (
                        <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-300 border border-blue-700/50 mr-3">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-white">{message.title}</h3>
                        <div className="text-xs text-gray-500 mt-0.5">
                          By {message.sentBy} • {new Date(message.sentDate).toLocaleDateString()} • 
                          <span className="ml-1">
                            {typeof message.teams === 'string' && message.teams === 'all' 
                              ? 'All Teams' 
                              : `${message.recipients} Teams`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full
                        ${message.type === 'announcement' ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-700/30' : ''}
                        ${message.type === 'reminder' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30' : ''}
                        ${message.type === 'message' ? 'bg-blue-900/30 text-blue-400 border border-blue-700/30' : ''}
                      `}>
                        {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pl-11 mt-1 text-sm text-gray-300">
                    {message.content}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-lg">No messages found</p>
                <p className="text-gray-600 text-sm mt-1">Try adjusting your filter or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCommunications; 