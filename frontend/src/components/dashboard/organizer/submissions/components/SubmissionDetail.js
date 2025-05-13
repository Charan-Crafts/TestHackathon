import React from 'react';

const SubmissionDetail = ({ submission, onClose, onReview }) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl p-5 mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {submission.projectName}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Project Details */}
        <div>
          {/* Project Image/Banner */}
          <div className="h-48 rounded-lg overflow-hidden mb-4 bg-gray-800 flex items-center justify-center">
            <img
              src={submission.thumbnailUrl}
              alt={submission.projectName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Project Information */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 mb-4">
            <h3 className="font-medium text-white mb-2">About the Project</h3>
            <p className="text-gray-300 text-sm mb-4">{submission.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {submission.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-700/50 text-gray-300 border border-gray-600/50">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <a
                href={submission.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Demo
              </a>

              {submission.repoUrl && (
                <a
                  href={submission.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  View Code
                </a>
              )}
            </div>
          </div>

          {/* Team Information */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <h3 className="font-medium text-white mb-2">Team Information</h3>
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 border border-indigo-700/50 mr-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-medium">{submission.teamName}</h4>
                <p className="text-gray-400 text-sm">{submission.memberCount} team members</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="h-8 w-8 rounded mr-2 overflow-hidden">
                <img src={submission.hackathonLogo} alt={submission.hackathonName} className="h-8 w-8 object-cover" />
              </div>
              <div>
                <h4 className="text-white text-sm">{submission.hackathonName}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Review Status */}
        <div>
          {/* Status Information */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 mb-4">
            <h3 className="font-medium text-white mb-3">Submission Status</h3>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {submission.status === 'pending' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></span>
                    Pending Review
                  </span>
                )}
                {submission.status === 'reviewed' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-900/30 text-blue-400 border border-blue-500/30">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                    Reviewed
                  </span>
                )}
                {submission.status === 'awarded' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-900/30 text-green-400 border border-green-500/30">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    Awarded
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-400">
                Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
              </div>
            </div>

            {/* Show disqualification reason if not qualified */}
            {submission.status === 'evaluated' && submission.qualification === 'unqualified' && (
              <div className="mb-4 text-red-400 text-sm">
                Not qualified: Did not meet criteria{submission.reviewComments ? ` (${submission.reviewComments})` : ''}
              </div>
            )}
            {/* If status is pending and round is completed, show late submission */}
            {submission.status === 'pending' && submission.roundStatus === 'completed' && (
              <div className="mb-4 text-red-400 text-sm">
                Not qualified: Late submission
              </div>
            )}

            {submission.status !== 'pending' && (
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Score</span>
                  <span className="text-lg font-semibold text-blue-400">{submission.score}/100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${submission.score}%` }}></div>
                </div>
              </div>
            )}

            {submission.status === 'awarded' && submission.awardTitle && (
              <div className="p-3 bg-indigo-900/30 border border-indigo-800/50 rounded-lg mb-4 text-center">
                <svg className="w-8 h-8 text-yellow-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <h4 className="text-white font-medium">{submission.awardTitle}</h4>
                <p className="text-gray-400 text-sm">Congratulations to the team!</p>
              </div>
            )}

            {submission.lastUpdated && (
              <div className="text-sm text-gray-500">
                Last updated: {new Date(submission.lastUpdated).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Review Comments */}
          {submission.status !== 'pending' && submission.comments && submission.comments.length > 0 && (
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 mb-4">
              <h3 className="font-medium text-white mb-3">Review Comments</h3>

              <div className="space-y-3">
                {submission.comments.map((comment, index) => (
                  <div key={index} className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-900/50 flex-shrink-0 flex items-center justify-center text-blue-300 border border-blue-700/50 mr-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <h4 className="text-white text-sm font-medium">{submission.judges[index] || 'Judge'}</h4>
                          <span className="text-gray-500 text-xs ml-2">
                            {submission.reviewDate ? new Date(submission.reviewDate).toLocaleDateString() : 'Date unknown'}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {submission.status === 'pending' && (
              <button
                onClick={onReview}
                className="flex-1 px-4 py-3 bg-blue-700 text-blue-100 rounded-lg border border-blue-600 hover:bg-blue-600 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Review Submission
              </button>
            )}

            {submission.status === 'reviewed' && (
              <button
                onClick={onReview}
                className="flex-1 px-4 py-3 bg-indigo-700 text-indigo-100 rounded-lg border border-indigo-600 hover:bg-indigo-600 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Award Project
              </button>
            )}

            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700 flex items-center justify-center"
            >
              Back to Submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail; 