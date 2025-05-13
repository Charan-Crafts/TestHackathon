import React from 'react';

const TaskSubmissionView = ({ submission, onClose, formatDate }) => {
  if (!submission) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black/30 backdrop-blur-sm absolute inset-0" onClick={onClose}></div>
      <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 relative">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">
            Task Submission
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-5">
          {/* Submission content */}
          <div className="mb-6">
            <h4 className="text-gray-400 text-sm font-medium mb-2">Submission Content</h4>
            <div className="bg-gray-800/50 rounded-lg p-4 text-white">
              {submission.content}
            </div>
          </div>
          
          {/* Attachments */}
          {submission.attachments && submission.attachments.length > 0 && (
            <div className="mb-6">
              <h4 className="text-gray-400 text-sm font-medium mb-2">Attachments</h4>
              <div className="space-y-2">
                {submission.attachments.map((attachment, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3 bg-gray-700 rounded-lg p-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{attachment.name}</p>
                        <p className="text-gray-500 text-xs">{attachment.size}</p>
                      </div>
                    </div>
                    <a
                      href={attachment.url}
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Submission date */}
          <div className="text-gray-400 text-sm">
            Submitted: {formatDate(submission.submittedAt)}
          </div>
        </div>
        
        <div className="border-t border-gray-800 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskSubmissionView; 