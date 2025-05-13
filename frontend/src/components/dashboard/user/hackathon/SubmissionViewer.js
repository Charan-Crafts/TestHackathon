import React from 'react';
import { FiEdit, FiExternalLink } from 'react-icons/fi';
import { formatDate } from './HackathonData';

const SubmissionViewer = ({ submission, task, onEdit, onBack }) => {
  if (!submission) {
    return (
      <div className="border border-gray-700 rounded-lg bg-gray-800/70 p-4 text-center">
        <p className="text-gray-400 text-sm">No submission data available.</p>
      </div>
    );
  }
  
  // Extract data for viewing
  const { title, description, repoLink, demoLink, additionalNotes, files, submittedAt } = submission;
  
  // Format the date
  const formattedDate = formatDate(submittedAt);
  
  return (
    <div className="border border-gray-700 rounded-lg bg-gray-800/70 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-white">
          {task?.name || 'Task Submission'}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="flex items-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <FiEdit className="mr-1" />
            Edit
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mb-4">
        Submitted on {formattedDate}
      </div>
      
      <div className="space-y-4">
        {/* Title */}
        <div>
          <h4 className="text-xs font-medium text-gray-400">Submission Title</h4>
          <p className="text-sm text-white">{title}</p>
        </div>
        
        {/* Description */}
        <div>
          <h4 className="text-xs font-medium text-gray-400">Description</h4>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{description}</p>
        </div>
        
        {/* Repository Link */}
        {repoLink && (
          <div>
            <h4 className="text-xs font-medium text-gray-400">Repository Link</h4>
            <a 
              href={repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center transition-colors"
            >
              {repoLink}
              <FiExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        )}
        
        {/* Demo Link */}
        {demoLink && (
          <div>
            <h4 className="text-xs font-medium text-gray-400">Demo Link</h4>
            <a 
              href={demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center transition-colors"
            >
              {demoLink}
              <FiExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        )}
        
        {/* Files */}
        {files && files.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-400">Uploaded Files</h4>
            <ul className="mt-1 text-sm text-gray-300 space-y-1">
              {files.map((file, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {file}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Additional Notes */}
        {additionalNotes && (
          <div>
            <h4 className="text-xs font-medium text-gray-400">Additional Notes</h4>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{additionalNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionViewer; 