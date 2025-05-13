import React, { useState } from 'react';

const TeamCommunication = ({ team, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('announcement');
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Sample message history
  const [messageHistory, setMessageHistory] = useState([
    {
      id: 1,
      type: 'announcement',
      content: 'Team registration has been approved. Welcome to the hackathon!',
      sentAt: new Date('2023-11-10T14:32:00'),
      sentBy: 'System',
      readBy: ['member1', 'member2', 'member3']
    },
    {
      id: 2,
      type: 'reminder',
      content: 'Project submission deadline is in 48 hours. Please make sure to complete your submission on time.',
      sentAt: new Date('2023-11-15T09:15:00'),
      sentBy: 'Admin',
      readBy: ['member1', 'member2']
    },
    {
      id: 3,
      type: 'notification',
      content: 'Your team has been assigned to the "AI & Machine Learning" track.',
      sentAt: new Date('2023-11-16T11:23:00'),
      sentBy: 'System',
      readBy: ['member1']
    }
  ]);
  
  // Message templates
  const messageTemplates = [
    {
      title: 'Welcome Message',
      content: 'Welcome to the hackathon! Your team registration has been confirmed.',
      type: 'announcement'
    },
    {
      title: 'Submission Reminder',
      content: 'This is a friendly reminder that your project submission is due in 24 hours.',
      type: 'reminder'
    },
    {
      title: 'Schedule Update',
      content: 'We have updated the schedule for the demo day. Please check the updated schedule on the dashboard.',
      type: 'notification'
    },
    {
      title: 'Feedback Request',
      content: 'We would appreciate your feedback on the hackathon experience so far. Please fill out the survey sent to your email.',
      type: 'notification'
    }
  ];
  
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    setIsSending(true);
    
    try {
      // In a real application, this would be an API call
      // await sendTeamMessage(team.id, messageText, messageType);
      
      // For demo purposes, we'll add the message to history locally
      const newMessage = {
        id: Date.now(),
        type: messageType,
        content: messageText,
        sentAt: new Date(),
        sentBy: 'Organizer',
        readBy: []
      };
      
      setMessageHistory([newMessage, ...messageHistory]);
      setMessageText('');
      
      // Call the parent handler
      if (onSendMessage) {
        onSendMessage(team, messageText, messageType);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Show error notification
    } finally {
      setIsSending(false);
    }
  };
  
  const applyTemplate = (template) => {
    setMessageText(template.content);
    setMessageType(template.type);
    setIsTemplateMenuOpen(false);
  };
  
  const getTypeIcon = (type) => {
    switch(type) {
      case 'announcement':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
      case 'reminder':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'notification':
        return (
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
    }
  };
  
  const formatDate = (date) => {
    if (!date) return '';

    // Check if date is already a Date object, if not, create one
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700/50 shadow-lg shadow-purple-900/10">
      <div className="p-4 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Team Communication
        </h3>
      </div>
      
      <div className="p-4 bg-gray-800/30 max-h-96 overflow-y-auto">
        {messageHistory.length > 0 ? (
          <div className="space-y-4">
            {messageHistory.map((message) => (
              <div key={message.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {getTypeIcon(message.type)}
                    <span className="ml-2 text-gray-300 font-medium">
                      {message.sentBy}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(message.sentAt)}
                  </span>
                </div>
                <div className="mt-2 text-gray-300">
                  {message.content}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">
                      Read by: {message.readBy.length} members
                    </span>
                    <div className="flex -space-x-2">
                      {message.readBy.map((member, idx) => (
                        <div 
                          key={idx} 
                          className="w-6 h-6 rounded-full bg-indigo-600 border border-gray-800 flex items-center justify-center text-xs text-white"
                          title={`Read by ${member}`}
                        >
                          {member.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      Resend
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <svg className="mx-auto w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="mt-2 text-gray-500">No messages yet</p>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-700/50">
        <div className="mb-3 flex justify-between">
          <div>
            <span className="text-sm text-gray-400">Message Type:</span>
            <div className="mt-1 flex space-x-2">
              <button 
                onClick={() => setMessageType('announcement')}
                className={`px-3 py-1 rounded-full text-xs flex items-center ${
                  messageType === 'announcement' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                }`}
              >
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Announcement
              </button>
              
              <button 
                onClick={() => setMessageType('reminder')}
                className={`px-3 py-1 rounded-full text-xs flex items-center ${
                  messageType === 'reminder' 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                }`}
              >
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reminder
              </button>
              
              <button 
                onClick={() => setMessageType('notification')}
                className={`px-3 py-1 rounded-full text-xs flex items-center ${
                  messageType === 'notification' 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                }`}
              >
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notification
              </button>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700 text-xs flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Templates
            </button>
            
            {isTemplateMenuOpen && (
              <div className="absolute right-0 mt-1 w-60 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-700">
                    Select a template
                  </div>
                  {messageTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyTemplate(template)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <div className="font-medium">{template.title}</div>
                      <div className="text-xs text-gray-500 truncate">{template.content}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Message will be sent to all {team?.members?.length || 0} team members
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || isSending}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
              !messageText.trim() || isSending
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isSending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamCommunication; 