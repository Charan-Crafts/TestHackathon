import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../../styles/CustomScrollbar.css';

const TestDetailsDashboard = ({ user }) => {
    const location = useLocation();

    console.log('Navigation state:', location.state);
    console.log('Data received:', location.state);

    const { testDetails, submissions, summary } = location.state;

    const renderTestDetails = () => (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">{testDetails.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span>Type: {testDetails.type}</span>
                <span>Category: {testDetails.category}</span>
                <span>Difficulty: {testDetails.difficulty}</span>
                <span>Total Marks: {testDetails.totalMarks}</span>
                <span>Passing Marks: {testDetails.passingMarks}</span>
                <span>Time Limit: {testDetails.timeLimit} minutes</span>
            </div>
        </div>
    );

    const renderSubmissions = () => (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Submissions</h2>
            {submissions.map((submission) => (
                <div key={submission.submissionId} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/40 mb-4">
                    <div className="text-white font-medium">Version: {submission.version}</div>
                    <div className="text-sm text-gray-400">Status: {submission.status}</div>
                    <div className="text-sm text-gray-400">Start Time: {new Date(submission.startTime).toLocaleString()}</div>
                    <div className="text-sm text-gray-400">End Time: {new Date(submission.endTime).toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Duration: {submission.duration} seconds</div>
                    <div className="text-sm text-gray-400">Total Score: {submission.scores.total}/{submission.scores.maxTotal}</div>
                    <div className="text-sm text-gray-400">Passed: {submission.scores.passed ? 'Yes' : 'No'}</div>
                </div>
            ))}
        </div>
    );

    const renderSummary = () => (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Summary</h2>
            <div className="text-sm text-gray-400">Total Attempts: {summary.totalAttempts}</div>
            <div className="text-sm text-gray-400">Best Score: {summary.bestScore}</div>
            <div className="text-sm text-gray-400">Average Score: {summary.averageScore}</div>
            <div className="text-sm text-gray-400">Latest Attempt: {new Date(summary.latestAttempt).toLocaleString()}</div>
            <div className="text-sm text-gray-400">First Attempt: {new Date(summary.firstAttempt).toLocaleString()}</div>
            <div className="text-sm text-gray-400">Passed Attempts: {summary.passedAttempts}</div>
        </div>
    );

    return (
        <div className="px-4 py-6">
            {testDetails && renderTestDetails()}
            {submissions && renderSubmissions()}
            {summary && renderSummary()}
        </div>
    );
};

export default TestDetailsDashboard; 