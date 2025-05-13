import React, { useState, useEffect } from 'react';
import { roundResponseAPI, submissionAPI } from '../../../../../services/api';
import API from '../../../../../services/api';
import { useNavigate } from 'react-router-dom';

const JudgingPanel = ({ submission, onJudge, onCancel }) => {
  const navigate = useNavigate();
  const [score, setScore] = useState('');
  const [qualification, setQualification] = useState('qualified'); // 'qualified' or 'unqualified'
  const [awardTitle, setAwardTitle] = useState('');
  const [awardType, setAwardType] = useState('none');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileMeta, setFileMeta] = useState({});
  const [submissionData, setSubmissionData] = useState(null);
  const [isViewLoading, setIsViewLoading] = useState(false);

  const awardTypes = [
    { id: 'none', label: 'No Award (Review Only)' },
    { id: 'first', label: 'First Place' },
    { id: 'second', label: 'Second Place' },
    { id: 'third', label: 'Third Place' },
    { id: 'category', label: 'Category Award' },
    { id: 'honorable', label: 'Honorable Mention' }
  ];

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      if (submission?.id) {
        try {
          const response = await submissionAPI.getSubmissionById(submission.id);
          if (response.data.success) {
            setSubmissionData(response.data.data);
          }
        } catch (error) {
          setError('Failed to fetch submission details');
        }
      }
    };

    fetchSubmissionDetails();
  }, [submission?.id]);

  useEffect(() => {
    // Find all file IDs in all file fields
    const fileIds = [];
    submission.responses?.forEach(field => {
      if (field.fieldType === 'file' && Array.isArray(field.files)) {
        field.files.forEach(id => fileIds.push(id));
      }
    });
    // Remove duplicates
    const uniqueIds = [...new Set(fileIds)];
    if (uniqueIds.length === 0) return;

    // Fetch metadata for each file
    Promise.all(
      uniqueIds.map(id =>
        API.get(`/files/id/${id}`).then(res => ({ id, data: res.data.data })).catch(() => null)
      )
    ).then(results => {
      const meta = {};
      results.forEach(r => {
        if (r && r.data) meta[r.id] = r.data;
      });
      setFileMeta(meta);
    });
  }, [submission]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submission?.id) {
      setError('Invalid submission ID. Please try again.');
      return;
    }

    if (score === '' || isNaN(Number(score)) || Number(score) < 0 || Number(score) > 100) {
      setError('Please enter a valid score between 0 and 100.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const reviewData = {
        score: Number(score),
        qualification,
        awardType,
        awardTitle: qualification === 'qualified' && awardType !== 'none' ? awardTitle : null,
        reviewComments: comments,
        status: qualification === 'qualified' ? 'qualified' : 'unqualified'
      };

      const response = await roundResponseAPI.reviewResponse(submission.id, reviewData);

      if (response.data.success) {
        onJudge(response.data.data);
      } else {
        setError(response.data.message || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewSubmission = async () => {
    try {
      console.log('Fetching submission details...');

      // Fetch data from the external API
      const response = await fetch('https://testapi.nexterchat.com/api/submissions/test/uuid/e0f02bce-e01f-4136-b1e9-531a752b7150');
      const data = await response.json();

      console.log('API Response:', data);

      // Navigate to test details with the actual API data
      navigate('/dashboard/organizer/test-details', {
        state: data
      });
    } catch (error) {
      console.error('Error fetching submission details:', error);
      setError('Failed to fetch submission details');
    }
  };

  // Add debug info at the top of the panel
  if (!submission?.id) {
    return (
      <div className="bg-red-900/40 border border-red-700 rounded-xl p-5 mb-6">
        <h2 className="text-xl font-semibold text-red-300">Error: Invalid Submission</h2>
        <p className="text-red-200 mt-2">The submission data is missing or invalid. Please try refreshing the page.</p>
        <pre className="mt-4 p-3 bg-gray-800 rounded text-sm text-gray-300 overflow-x-auto">
          {JSON.stringify(submission, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Judging: {submission.projectName || 'Submission'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Submission Fields Display */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold text-gray-200">Submission Details</h3>
            <span
              onClick={handleViewSubmission}
              className={`text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors duration-200 flex items-center ${isViewLoading ? 'opacity-50' : ''}`}
              style={{ pointerEvents: isViewLoading ? 'none' : 'auto' }}
            >
              {isViewLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Submission
                </>
              )}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {submission.responses && submission.responses.map((field) => (
              <div key={field.fieldId} className="bg-gray-800/60 rounded-lg p-3 border border-gray-700">
                <div className="text-xs text-gray-400 font-medium mb-1">{field.fieldName}</div>
                <div className="text-sm text-gray-100 break-words">
                  {field.fieldType === 'file' && field.files && field.files.length > 0 ? (
                    field.files.map((fileId, idx) =>
                      fileMeta[fileId] ? (
                        <div key={fileId}>
                          <a
                            href={`http://localhost:5000/api/files/${fileMeta[fileId].fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 underline"
                          >
                            {fileMeta[fileId].originalName}
                          </a>
                        </div>
                      ) : (
                        <div key={fileId}>Loading file info...</div>
                      )
                    )
                  ) : field.fieldType === 'platform_link' ? (
                    <div>
                      <a
                        href={field.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 underline"
                        onClick={(e) => {
                          e.preventDefault();
                          const testId = field.value.split('/').pop();
                          console.log('Test ID:', testId);
                          window.open(field.value, '_blank');
                        }}
                      >
                        Access Platform
                      </a>
                      <div className="text-xs text-gray-400 mt-1">
                        Test ID: {field.value.split('/').pop()}
                      </div>
                    </div>
                  ) : (
                    field.value && typeof field.value === 'string' ? field.value : JSON.stringify(field.value)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Score Input */}
        <div className="mb-5">
          <label className="block text-gray-300 mb-2">Score (0-100)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={score}
              onChange={e => setScore(e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              required
            />
            <span className="text-lg font-semibold text-blue-400 w-12 text-right">{score || 0}/100</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Poor</span>
            <span>Average</span>
            <span>Excellent</span>
          </div>
        </div>
        {/* Qualification Decision */}
        <div className="mb-5">
          <h3 className="text-md font-medium text-white mb-3">Qualification</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${qualification === 'qualified'
                ? 'bg-green-900/40 border-green-700 text-green-300'
                : 'bg-gray-800/40 border-gray-700/50 text-gray-300 hover:bg-gray-800'
                }`}
              onClick={() => setQualification('qualified')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="qualified"
                  name="qualification"
                  checked={qualification === 'qualified'}
                  onChange={() => setQualification('qualified')}
                  className="h-4 w-4 text-green-600 bg-gray-800 border-gray-700 focus:ring-green-500/50 focus:ring-offset-gray-800"
                />
                <label htmlFor="qualified" className="ml-2 block text-sm">
                  Qualified
                </label>
              </div>
            </div>
            <div
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${qualification === 'unqualified'
                ? 'bg-red-900/40 border-red-700 text-red-300'
                : 'bg-gray-800/40 border-gray-700/50 text-gray-300 hover:bg-gray-800'
                }`}
              onClick={() => setQualification('unqualified')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="unqualified"
                  name="qualification"
                  checked={qualification === 'unqualified'}
                  onChange={() => setQualification('unqualified')}
                  className="h-4 w-4 text-red-600 bg-gray-800 border-gray-700 focus:ring-red-500/50 focus:ring-offset-gray-800"
                />
                <label htmlFor="unqualified" className="ml-2 block text-sm">
                  Unqualified
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Award Selection (only if qualified) */}
        {qualification === 'qualified' && (
          <div className="mb-5">
            <h3 className="text-md font-medium text-white mb-3">Award Decision</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {awardTypes.map(award => (
                <div
                  key={award.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${awardType === award.id
                    ? 'bg-indigo-900/40 border-indigo-700 text-indigo-300'
                    : 'bg-gray-800/40 border-gray-700/50 text-gray-300 hover:bg-gray-800'
                    }`}
                  onClick={() => setAwardType(award.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`award-${award.id}`}
                      name="awardType"
                      checked={awardType === award.id}
                      onChange={() => setAwardType(award.id)}
                      className="h-4 w-4 text-indigo-600 bg-gray-800 border-gray-700 focus:ring-indigo-500/50 focus:ring-offset-gray-800"
                    />
                    <label htmlFor={`award-${award.id}`} className="ml-2 block text-sm">
                      {award.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {awardType !== 'none' && (
              <div className="mb-4">
                <label htmlFor="awardTitle" className="block text-sm font-medium text-gray-300 mb-1">
                  Award Title
                </label>
                <input
                  type="text"
                  id="awardTitle"
                  name="awardTitle"
                  value={awardTitle}
                  onChange={(e) => setAwardTitle(e.target.value)}
                  placeholder={`e.g., Best ${submission.tags?.[0] || 'Innovation'} Project`}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-transparent"
                />
              </div>
            )}
          </div>
        )}
        {/* Comments */}
        <div className="mb-5">
          <label htmlFor="comments" className="block text-sm font-medium text-gray-300 mb-1">
            Feedback & Comments
          </label>
          <textarea
            id="comments"
            name="comments"
            rows="4"
            value={comments}
            onChange={e => setComments(e.target.value)}
            placeholder="Provide feedback for the team..."
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-transparent"
          />
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 text-blue-100 rounded-lg border border-blue-600 hover:bg-blue-600 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JudgingPanel; 