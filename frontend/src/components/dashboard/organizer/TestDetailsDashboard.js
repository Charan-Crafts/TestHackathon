import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../styles/CustomScrollbar.css';

const TestDetailsDashboard = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (location.state?.testData) {
            setTestData(location.state.testData);
            setLoading(false);
        } else {
            setError('No test data available');
            setLoading(false);
        }
    }, [location.state]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 py-6">
                <div className="bg-red-900/40 border border-red-700 rounded-xl p-5 mb-6">
                    <h2 className="text-xl font-semibold text-red-300">Error</h2>
                    <p className="text-red-200 mt-2">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!testData) {
        return (
            <div className="px-4 py-6">
                <div className="bg-yellow-900/40 border border-yellow-700 rounded-xl p-5 mb-6">
                    <h2 className="text-xl font-semibold text-yellow-300">No Test Data</h2>
                    <p className="text-yellow-200 mt-2">The test data could not be found.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-yellow-800 text-white rounded-lg hover:bg-yellow-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { testDetails, submissions, summary } = testData;

    const renderTestDetails = () => (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Test Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Title</h3>
                    <p className="text-white">{testDetails?.title || 'N/A'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Type</h3>
                    <p className="text-white">{testDetails?.type || 'N/A'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Category</h3>
                    <p className="text-white">{testDetails?.category || 'N/A'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Difficulty</h3>
                    <p className="text-white">{testDetails?.difficulty || 'N/A'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Total Marks</h3>
                    <p className="text-white">{testDetails?.totalMarks || 'N/A'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Passing Marks</h3>
                    <p className="text-white">{testDetails?.passingMarks || 'N/A'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Time Limit</h3>
                    <p className="text-white">{testDetails?.timeLimit ? `${testDetails.timeLimit} minutes` : 'N/A'}</p>
                </div>
            </div>
        </div>
    );

    const renderSubmissions = () => (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Submissions</h2>
            {submissions && submissions.length > 0 ? (
                submissions.map((submission, index) => (
                    <div key={index} className="bg-gray-800/60 rounded-lg p-4 mb-4">
                        <h3 className="text-lg font-medium text-white mb-2">Submission {submission.version}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
                            <div>Status: <span className="text-white">{submission.status || 'N/A'}</span></div>
                            <div>Start Time: <span className="text-white">{submission.startTime ? new Date(submission.startTime).toLocaleString() : 'N/A'}</span></div>
                            <div>End Time: <span className="text-white">{submission.endTime ? new Date(submission.endTime).toLocaleString() : 'N/A'}</span></div>
                            <div>Duration: <span className="text-white">{submission.duration ? `${submission.duration} seconds` : 'N/A'}</span></div>
                            <div>Total Score: <span className="text-white">{submission.scores?.total || 'N/A'}/{submission.scores?.maxTotal || 'N/A'}</span></div>
                            <div>Passed: <span className="text-white">{submission.scores?.passed ? 'Yes' : 'No'}</span></div>
                        </div>
                        {submission.results && Object.entries(submission.results).length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <h4 className="text-md font-medium text-gray-300 mb-2">Results Details</h4>
                                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                                    {JSON.stringify(submission.results, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-400">No submission data available.</p>
            )}
        </div>
    );

    const renderSummary = () => (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                <div>Total Attempts: <span className="text-white">{summary?.totalAttempts || 'N/A'}</span></div>
                <div>Best Score: <span className="text-white">{summary?.bestScore || 'N/A'}</span></div>
                <div>Average Score: <span className="text-white">{summary?.averageScore || 'N/A'}</span></div>
                <div>Latest Attempt: <span className="text-white">{summary?.latestAttempt ? new Date(summary.latestAttempt).toLocaleString() : 'N/A'}</span></div>
                <div>First Attempt: <span className="text-white">{summary?.firstAttempt ? new Date(summary.firstAttempt).toLocaleString() : 'N/A'}</span></div>
                <div>Passed Attempts: <span className="text-white">{summary?.passedAttempts || 'N/A'}</span></div>
            </div>
        </div>
    );

    return (
        <div className="px-4 py-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Test Details</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-sm rounded-lg bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-800 transition-colors"
                >
                    Go Back
                </button>
            </div>

            {testDetails && renderTestDetails()}
            {submissions && renderSubmissions()}
            {summary && renderSummary()}

        </div>
    );
};

export default TestDetailsDashboard; 