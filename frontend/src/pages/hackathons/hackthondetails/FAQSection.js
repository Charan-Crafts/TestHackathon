import React, { useState } from 'react';

function FAQsAndDiscussionSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [newDiscussion, setNewDiscussion] = useState('');
  const [discussions, setDiscussions] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState('faqs');
  const [replyText, setReplyText] = useState('');
  
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };
  
  const handleSubmitDiscussion = (e) => {
    e.preventDefault();
    
    if (newDiscussion.trim() === '') return;
    
    const discussion = {
      id: Date.now(),
      text: newDiscussion,
      user: {
        name: 'Current User',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      date: new Date().toLocaleDateString(),
      replies: [],
      showReplyForm: false
    };
    
    setDiscussions([discussion, ...discussions]);
    setNewDiscussion('');
    setShowConfirmation(true);
    
    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };
  
  const toggleReplyForm = (discussionId) => {
    setDiscussions(discussions.map(discussion => 
      discussion.id === discussionId 
        ? { ...discussion, showReplyForm: !discussion.showReplyForm }
        : discussion
    ));
    setReplyText('');
  };

  const handleReplySubmit = (discussionId, e) => {
    e.preventDefault();
    
    if (replyText.trim() === '') return;
    
    const reply = {
      id: Date.now(),
      text: replyText,
      user: {
        name: 'Current User',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      date: new Date().toLocaleDateString()
    };
    
    setDiscussions(discussions.map(discussion => 
      discussion.id === discussionId 
        ? { 
            ...discussion, 
            replies: [...discussion.replies, reply],
            showReplyForm: false
          }
        : discussion
    ));
    
    setReplyText('');
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-xl overflow-hidden border border-gray-700/50 p-3 sm:p-4">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">FAQs & Discussion</h3>
      
      {/* Tabs for FAQs and Discussion */}
      <div className="flex space-x-2 border-b border-gray-700 mb-4">
        <button 
          onClick={() => setActiveTab('faqs')} 
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'faqs' 
              ? 'text-blue-400 border-b-2 border-blue-500' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          FAQs
        </button>
        <button 
          onClick={() => setActiveTab('discussion')} 
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'discussion' 
              ? 'text-blue-400 border-b-2 border-blue-500' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Discussion
        </button>
      </div>
      
      {/* Confirmation message */}
      {showConfirmation && activeTab === 'discussion' && (
        <div className="mb-4 p-3 bg-green-900/70 border border-green-700 rounded-lg text-green-200 animate-slide-up">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Thank you! Your discussion has been posted successfully.</span>
          </div>
        </div>
      )}
      
      {/* FAQ Content */}
      {activeTab === 'faqs' && (
        <>
          <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-5">
            Find answers to common questions about the hackathon. If you don't see your question here, feel free to contact us.
          </p>
          
          <div className="space-y-2.5">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border ${openIndex === index ? 'border-blue-500/50 bg-blue-900/10' : 'border-gray-700/50 bg-gray-800/50'} rounded-lg transition-colors`}
              >
                <button 
                  className="flex justify-between items-center w-full p-2.5 sm:p-3 text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <h4 className="font-medium text-white text-sm sm:text-base">{faq.question}</h4>
                  <svg 
                    className={`h-4 w-4 sm:h-5 sm:w-5 text-blue-400 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div 
                  className={`px-2.5 sm:px-3 pb-2.5 sm:pb-3 overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-300 text-xs sm:text-sm">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-5 p-3 sm:p-4 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-lg border border-gray-700/50">
            <h4 className="text-base sm:text-lg font-medium text-white mb-1.5 sm:mb-2">Still have questions?</h4>
            <p className="text-gray-300 text-xs sm:text-sm mb-3">
              Can't find the answer you're looking for? Please contact our support team or join the discussion.
            </p>
            <div className="flex flex-wrap gap-2">
              <a 
                href="mailto:support@hackathon.com"
                className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
              >
                <svg className="h-4 w-4 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </a>
              <button 
                className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
                onClick={() => setActiveTab('discussion')}
              >
                <svg className="h-4 w-4 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Join Discussion
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Discussion Content */}
      {activeTab === 'discussion' && (
        <>
          <p className="text-gray-300 text-sm sm:text-base mb-4">
            Join the conversation about this hackathon. Ask questions, share tips, and connect with other participants.
          </p>
          
          {/* Add discussion form */}
          <form onSubmit={handleSubmitDiscussion} className="mb-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-lg border border-gray-700/50 p-3 sm:p-4">
            <h4 className="text-base sm:text-lg font-medium text-white mb-2">Start a Discussion</h4>
            
            <div className="mb-3">
              <textarea
                value={newDiscussion}
                onChange={(e) => setNewDiscussion(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg border border-gray-600 p-2 text-sm"
                rows="3"
                placeholder="Ask a question or share information about this hackathon..."
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Post
            </button>
          </form>
          
          {/* Discussions list */}
          <div className="space-y-4">
            {discussions.length > 0 ? (
              discussions.map((discussion) => (
                <div key={discussion.id} className="p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-start">
                    <img
                      src={discussion.user.image}
                      alt={discussion.user.name}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="text-white font-medium">{discussion.user.name}</h5>
                        <span className="text-gray-400 text-xs">{discussion.date}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{discussion.text}</p>
                      
                      {/* Reply button */}
                      <div className="mt-2">
                        <button 
                          onClick={() => toggleReplyForm(discussion.id)}
                          className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          {discussion.showReplyForm ? 'Cancel Reply' : 'Reply'}
                        </button>
                      </div>
                      
                      {/* Reply form */}
                      {discussion.showReplyForm && (
                        <form onSubmit={(e) => handleReplySubmit(discussion.id, e)} className="mt-3 pl-3 border-l-2 border-gray-700">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-lg border border-gray-600 p-2 text-sm"
                            rows="2"
                            placeholder="Write your reply..."
                            required
                          ></textarea>
                          <button
                            type="submit"
                            className="mt-2 px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-xs"
                          >
                            Submit Reply
                          </button>
                        </form>
                      )}
                      
                      {/* Replies */}
                      {discussion.replies.length > 0 && (
                        <div className="mt-3 space-y-3 pl-3 border-l-2 border-gray-700">
                          {discussion.replies.map((reply) => (
                            <div key={reply.id} className="p-2 bg-gray-800/70 rounded-lg">
                              <div className="flex items-start">
                                <img
                                  src={reply.user.image}
                                  alt={reply.user.name}
                                  className="h-6 w-6 rounded-full mr-2"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <h6 className="text-white text-xs font-medium">{reply.user.name}</h6>
                                    <span className="text-gray-400 text-xs">{reply.date}</span>
                                  </div>
                                  <p className="text-gray-300 text-xs">{reply.text}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">No discussions yet. Be the first to start a conversation!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default FAQsAndDiscussionSection; 