import React, { useState, useEffect } from 'react';
import { roundResponseAPI } from '../../../../../services/api';

// Import components
import SubmissionStatsCards from './SubmissionStatsCards';
import JudgingPanel from './JudgingPanel';
import SubmissionDetail from './SubmissionDetail';

const RoundSubmissions = ({ selectedHackathon, selectedRound }) => {
    const [submissions, setSubmissions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        reviewed: 0,
        awarded: 0
    });
    const [selectedSubmissions, setSelectedSubmissions] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'submittedDate', direction: 'desc' });
    const [viewSubmission, setViewSubmission] = useState(null);
    const [reviewSubmission, setReviewSubmission] = useState(null);
    const [showTable, setShowTable] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch submissions when a round is selected
    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!selectedRound || !selectedHackathon) return;

            try {
                setLoading(true);
                const response = await roundResponseAPI.getAllResponses(selectedHackathon._id, selectedRound._id);
                console.log('API round responses:', response.data); // DEBUG LOG
                const submissionsData = response.data.map(response => {
                    let status = response.status;
                    // Treat qualified/unqualified as evaluated for UI
                    if (status === 'qualified' || status === 'unqualified') {
                        status = 'evaluated';
                    }
                    return {
                        id: response._id,
                        projectName: response.responses.find(r => r.fieldName === 'Project Name')?.value
                            || response.responses.find(r => r.fieldName === 'Title')?.value
                            || response.responses.find(r => r.fieldName === 'Name')?.value
                            || response.responses.find(r => r.fieldName === 'Project')?.value
                            || 'Untitled Project',
                        teamId: response.teamId,
                        teamName: response.responses.find(r => r.fieldName === 'Team Name')?.value
                            || (typeof response.userId === 'object' ? response.userId.email : response.userId)
                            || 'Unnamed Team',
                        memberCount: response.responses.find(r => r.fieldName === 'Team Size')?.value || 1,
                        hackathonId: response.hackathonId,
                        hackathonName: selectedHackathon.title,
                        hackathonLogo: selectedHackathon.imageFile?.fileUrl,
                        submittedDate: response.submittedAt,
                        lastUpdated: response.updatedAt,
                        status: status,
                        rawStatus: response.status, // keep original for display
                        description: response.responses.find(r => r.fieldName === 'Project Description')?.value
                            || response.responses.find(r => r.fieldName === 'Abstract')?.value
                            || '',
                        demoUrl: response.responses.find(r => r.fieldName === 'Demo Link')?.value,
                        repoUrl: response.responses.find(r => r.fieldName === 'Repository Link')?.value,
                        score: response.score,
                        qualification: response.qualification,
                        comments: response.responses.find(r => r.fieldName === 'Comments')?.value || [],
                        judges: response.responses.find(r => r.fieldName === 'Judges')?.value || [],
                        tags: response.responses.find(r => r.fieldName === 'Tags')?.value || [],
                        thumbnailUrl: response.responses.find(r => r.fieldName === 'Thumbnail')?.value || `https://picsum.photos/seed/${response._id}/400/300`,
                        responses: response.responses,
                        allResponses: response.responses
                    };
                });
                setSubmissions(submissionsData);
                calculateStats(submissionsData);
            } catch (err) {
                setError('Failed to fetch submissions');
                console.error('Error fetching submissions:', err);
                setSubmissions([]);
                calculateStats([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [selectedRound, selectedHackathon]);

    const calculateStats = (data) => {
        setStats({
            total: data.length,
            pending: data.filter(s => s.status === 'draft').length,
            reviewed: data.filter(s => s.status === 'under-review').length,
            awarded: data.filter(s => s.status === 'evaluated').length
        });
    };

    // Filter submissions based on selected filter and search text
    const getFilteredSubmissions = React.useCallback(() => {
        return submissions.filter(submission => {
            const matchesFilter = filter === 'all' || submission.status === filter;
            const matchesSearch = !searchText ||
                submission.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
                submission.teamName.toLowerCase().includes(searchText.toLowerCase()) ||
                submission.hackathonName.toLowerCase().includes(searchText.toLowerCase()) ||
                submission.description.toLowerCase().includes(searchText.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [submissions, filter, searchText]);

    // Sort submissions
    const sortedSubmissions = React.useMemo(() => {
        const filteredItems = getFilteredSubmissions();
        if (!sortConfig.key) return filteredItems;

        return [...filteredItems].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [sortConfig, getFilteredSubmissions]);

    // Request sort on a column
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Handle bulk actions
    const handleBulkReview = () => {
        if (selectedSubmissions.length === 0) return;

        setSubmissions(prevSubmissions =>
            prevSubmissions.map(sub =>
                selectedSubmissions.includes(sub.id) ? { ...sub, status: 'reviewed', score: 85 } : sub
            )
        );
        setSelectedSubmissions([]);

        // Update stats
        setStats(prevStats => ({
            ...prevStats,
            pending: prevStats.pending - selectedSubmissions.length,
            reviewed: prevStats.reviewed + selectedSubmissions.length
        }));
    };

    const handleBulkAward = () => {
        if (selectedSubmissions.length === 0) return;

        setSubmissions(prevSubmissions =>
            prevSubmissions.map(sub =>
                selectedSubmissions.includes(sub.id) ? { ...sub, status: 'evaluated' } : sub
            )
        );
        setSelectedSubmissions([]);

        // Update stats
        setStats(prevStats => ({
            ...prevStats,
            reviewed: prevStats.reviewed - selectedSubmissions.length,
            awarded: prevStats.awarded + selectedSubmissions.length
        }));
    };

    const handleBulkExport = () => {
        const selectedItems = submissions.filter(sub => selectedSubmissions.includes(sub.id));
        alert(`Exporting ${selectedItems.length} submissions`);
    };

    // Handle viewing a submission
    const handleViewSubmission = (id) => {
        const submission = submissions.find(sub => sub.id === id);
        if (submission) {
            setViewSubmission(submission);
            setShowTable(false);
        }
    };

    // Handle reviewing a submission
    const handleReviewSubmission = (id) => {
        const submission = submissions.find(sub => sub.id === id);
        if (submission) {
            setReviewSubmission(submission);
            setShowTable(false);
        }
    };

    // Handle closing views
    const handleCloseSubmissionView = () => {
        setViewSubmission(null);
        setReviewSubmission(null);
        setShowTable(true);
    };

    // Handle the review submission
    const handleSubmitReview = async (reviewData) => {
        if (!reviewSubmission) return;

        try {
            // Call API to update the review
            const response = await roundResponseAPI.reviewResponse(reviewSubmission.id, reviewData);

            if (response.data.success) {
                const updated = response.data.data;
                setSubmissions(prevSubmissions =>
                    prevSubmissions.map(sub =>
                        sub.id === reviewSubmission.id
                            ? {
                                ...sub,
                                status: (updated.status === 'qualified' || updated.status === 'unqualified') ? 'evaluated' : updated.status,
                                rawStatus: updated.status,
                                score: updated.score,
                                qualification: updated.qualification,
                                awardType: updated.awardType,
                                awardTitle: updated.awardTitle,
                                reviewComments: updated.reviewComments,
                                reviewedAt: updated.reviewedAt
                            }
                            : sub
                    )
                );
                setReviewSubmission(null);
                setShowTable(true);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
    };

    // Handle select/deselect all submissions
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedSubmissions(sortedSubmissions.map(item => item.id));
        } else {
            setSelectedSubmissions([]);
        }
    };

    // Handle selecting individual submission
    const handleSelectSubmission = (id) => {
        if (selectedSubmissions.includes(id)) {
            setSelectedSubmissions(selectedSubmissions.filter(itemId => itemId !== id));
        } else {
            setSelectedSubmissions([...selectedSubmissions, id]);
        }
    };

    // Handle submission deletion
    const handleDeleteSubmission = async (id) => {
        if (!window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
            return;
        }

        try {
            // TODO: Add API call to delete submission
            // await roundResponseAPI.deleteResponse(hackathonId, selectedRound._id, id);

            // Update local state
            setSubmissions(prevSubmissions => prevSubmissions.filter(sub => sub.id !== id));

            // Update stats
            const deletedSubmission = submissions.find(sub => sub.id === id);
            if (deletedSubmission) {
                setStats(prevStats => {
                    const newStats = { ...prevStats };
                    newStats.total -= 1;

                    if (deletedSubmission.status === 'draft') newStats.pending -= 1;
                    if (deletedSubmission.status === 'under-review') newStats.reviewed -= 1;
                    if (deletedSubmission.status === 'evaluated') newStats.awarded -= 1;

                    return newStats;
                });
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
            alert('Failed to delete submission. Please try again.');
        }
    };

    return (
        <>
            {/* Stat Cards */}
            <SubmissionStatsCards stats={stats} setFilter={setFilter} />

            {/* Show judging panel if a submission is being reviewed */}
            {reviewSubmission && (
                <JudgingPanel
                    submission={reviewSubmission}
                    onJudge={handleSubmitReview}
                    onCancel={handleCloseSubmissionView}
                />
            )}

            {/* Show submission details if a submission is being viewed */}
            {viewSubmission && (
                <SubmissionDetail
                    submission={viewSubmission}
                    onClose={handleCloseSubmissionView}
                    onReview={() => {
                        setReviewSubmission(viewSubmission);
                        setViewSubmission(null);
                    }}
                />
            )}

            {/* Only show filter/search and table if not viewing/reviewing submission */}
            {showTable && (
                <>
                    {/* Filter and Search Section */}
                    <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === 'all'
                                    ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-800'
                                    : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                                    }`}
                            >
                                All ({stats.total})
                            </button>
                            <button
                                onClick={() => setFilter('draft')}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === 'draft'
                                    ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-800'
                                    : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                                    }`}
                            >
                                Draft ({stats.pending})
                            </button>
                            <button
                                onClick={() => setFilter('under-review')}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === 'under-review'
                                    ? 'bg-blue-900/50 text-blue-300 border border-blue-800'
                                    : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                                    }`}
                            >
                                Under Review ({stats.reviewed})
                            </button>
                            <button
                                onClick={() => setFilter('evaluated')}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === 'evaluated'
                                    ? 'bg-green-900/50 text-green-300 border border-green-800'
                                    : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                                    }`}
                            >
                                Evaluated ({stats.awarded})
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search submissions..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full sm:w-64 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 focus:border-transparent"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Submissions Table */}
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden shadow-lg shadow-purple-900/5 mb-8">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="min-w-full divide-y divide-gray-800/70">
                                <thead className="bg-gray-800/50">
                                    <tr>
                                        <th scope="col" className="pl-4 py-3">
                                            <div className="flex items-center">
                                                <input
                                                    id="select-all"
                                                    type="checkbox"
                                                    className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500/50 focus:ring-offset-gray-800"
                                                    checked={selectedSubmissions.length > 0 && selectedSubmissions.length === sortedSubmissions.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('teamName')}
                                        >
                                            <div className="flex items-center">
                                                Team
                                                {sortConfig.key === 'teamName' && (
                                                    <svg className={`w-3 h-3 ml-1 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('hackathonName')}
                                        >
                                            <div className="flex items-center">
                                                Hackathon
                                                {sortConfig.key === 'hackathonName' && (
                                                    <svg className={`w-3 h-3 ml-1 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('status')}
                                        >
                                            <div className="flex items-center">
                                                Status
                                                {sortConfig.key === 'status' && (
                                                    <svg className={`w-3 h-3 ml-1 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('submittedDate')}
                                        >
                                            <div className="flex items-center">
                                                Submitted
                                                {sortConfig.key === 'submittedDate' && (
                                                    <svg className={`w-3 h-3 ml-1 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('score')}
                                        >
                                            <div className="flex items-center">
                                                Score
                                                {sortConfig.key === 'score' && (
                                                    <svg className={`w-3 h-3 ml-1 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : sortedSubmissions.length > 0 ? (
                                        sortedSubmissions.map((submission) => (
                                            <tr key={submission.id} className="hover:bg-gray-800/30 transition-colors">
                                                <td className="pl-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <input
                                                            id={`select-${submission.id}`}
                                                            type="checkbox"
                                                            className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500/50 focus:ring-offset-gray-800"
                                                            checked={selectedSubmissions.includes(submission.id)}
                                                            onChange={() => handleSelectSubmission(submission.id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-300">{submission.teamName}</div>
                                                    <div className="text-xs text-gray-500">{submission.memberCount} members</div>
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-6 w-6">
                                                            <img className="h-6 w-6 rounded object-cover border border-gray-700/50" src={submission.hackathonLogo} alt={submission.hackathonName} />
                                                        </div>
                                                        <div className="ml-2 text-sm text-gray-300 truncate max-w-[120px]">{submission.hackathonName}</div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap">
                                                    {submission.status === 'draft' && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1"></span>
                                                            Draft
                                                        </span>
                                                    )}
                                                    {submission.status === 'submitted' && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-900/30 text-blue-400 border border-blue-500/30">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1"></span>
                                                            Submitted
                                                        </span>
                                                    )}
                                                    {submission.status === 'under-review' && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-purple-900/30 text-purple-400 border border-purple-500/30">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-1"></span>
                                                            Under Review
                                                        </span>
                                                    )}
                                                    {submission.status === 'evaluated' && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-green-900/30 text-green-400 border border-green-500/30">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></span>
                                                            {submission.rawStatus === 'qualified' ? 'Qualified' : submission.rawStatus === 'unqualified' ? 'Not Qualified' : 'Evaluated'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {new Date(submission.submittedDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap">
                                                    {typeof submission.score === 'number' ? (
                                                        <div className="text-sm font-medium text-white">{submission.score}/100</div>
                                                    ) : (
                                                        <span className="text-gray-500">—</span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        {submission.status !== 'draft' && (
                                                            <button
                                                                onClick={() => handleReviewSubmission(submission.id)}
                                                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors"
                                                                title="Evaluate Submission"
                                                            >
                                                                Evaluate
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteSubmission(submission.id)}
                                                            className="text-red-500 hover:text-red-400 transition-colors"
                                                            title="Delete Submission"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-gray-500 text-lg">No submissions found for this round</p>
                                                    <p className="text-gray-600 text-sm mt-1">Submissions will appear here once teams submit their projects</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default RoundSubmissions; 