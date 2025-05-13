import React, { useState, useRef, useEffect } from 'react';

const ChatModal = ({ 
  isOpen, 
  onClose, 
  recipient, 
  onSendMessage,
  initialMessages = [],
  currentUser,
  isGroupMessage = false
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [files, setFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  // Remove file from selection
  const handleRemoveFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  // Handle message submission
  const handleSubmit = async () => {
    if (!message.trim() && files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('message', message);
    
    if (isGroupMessage) {
      // For group messages, append all recipient IDs
      recipient.members.forEach(member => {
        formData.append('recipientIds[]', member.id);
      });
    } else {
      formData.append('recipientId', recipient.id);
    }

    try {
      await onSendMessage(formData);
      
      // Add message to local state
      const newMessage = {
        id: Date.now(),
        content: message,
        files: files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        })),
        sender: currentUser,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setFiles([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle typing indicator
  const handleTyping = (e) => {
    setMessage(e.target.value);
    // setIsTyping(true);
    // Add debounced typing indicator logic here
  };

  if (!isOpen || !recipient) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Chat Modal */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isGroupMessage ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              ) : (
                <img 
                  src={recipient.avatar} 
                  alt={recipient.name}
                  className="w-10 h-10 rounded-full border border-gray-700/50"
                />
              )}
              <div>
                <h3 className="text-sm font-medium text-white">{recipient.name}</h3>
                <p className="text-xs text-gray-400">
                  {isGroupMessage ? (
                    `${recipient.members.length} recipients`
                  ) : (
                    recipient.role
                  )}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Recipients list for group messages */}
          {isGroupMessage && (
            <div className="mt-2 flex flex-wrap gap-2">
              {recipient.members.map(member => (
                <div 
                  key={member.id}
                  className="flex items-center space-x-1 bg-gray-800/50 rounded-full px-2 py-0.5"
                >
                  <img 
                    src={member.avatar}
                    alt={member.name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-xs text-gray-300">{member.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${msg.sender.id === currentUser.id ? 'bg-indigo-600/30' : 'bg-gray-700/30'} rounded-lg p-3`}>
                {/* Message Content */}
                {msg.content && (
                  <p className="text-sm text-white">{msg.content}</p>
                )}
                
                {/* Files */}
                {msg.files && msg.files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.files.map((file, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-2 p-2 rounded bg-gray-800/50 border border-gray-700/50"
                      >
                        {/* File Icon based on type */}
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        
                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        
                        {/* Download Button */}
                        <a 
                          href={file.url}
                          download={file.name}
                          className="p-1 rounded hover:bg-gray-700/50 text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Timestamp */}
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Selected Files Preview */}
        {files.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-700/50 flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 bg-gray-800/50 rounded px-2 py-1"
              >
                <span className="text-xs text-gray-300 truncate max-w-[100px]">
                  {file.name}
                </span>
                <button
                  onClick={() => handleRemoveFile(file)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Input Area */}
        <div className="p-4 border-t border-gray-700/50">
          <div className="flex items-end space-x-3">
            {/* File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-colors"
              title="Attach files"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            {/* Message Input */}
            <div className="flex-1">
              <textarea
                value={message}
                onChange={handleTyping}
                placeholder={`Write a message to ${recipient.name}...`}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>
            
            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={!message.trim() && files.length === 0}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;