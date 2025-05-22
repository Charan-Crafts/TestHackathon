import React, { useState } from 'react';

// Add CSS animation for slide-in effect
const slideInStyles = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  .animate-slide-in-right {
    animation: slideInRight 0.3s ease-out;
  }
`;

const Submissions = ({ hackathon, setHackathon }) => {
  // Add the styles to the document
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = slideInStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [evaluationScore, setEvaluationScore] = useState(0);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [selectedRound, setSelectedRound] = useState('all');

  // Define the round progression
  const roundProgression = [
    'Registration',
    'Development',
    'Finals',
    'Presentation'
  ];

  // Mock submission data
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      title: 'AI-powered Sustainable Agriculture Platform',
      description: 'A platform that uses machine learning to optimize crop yields while minimizing environmental impact',
      teamName: 'Code Wizards',
      teamMembers: [
        { id: 1, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { id: 2, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
        { id: 3, name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/women/10.jpg' }
      ],
      submittedAt: '2023-04-18T14:30:00',
      round: 'Finals',
      status: 'submitted',
      demoLink: 'https://demo.example.com/agriculture-platform',
      repoLink: 'https://github.com/example/agriculture-platform',
      score: null,
      feedback: null,
      thumbnailUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybWluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      roundProgress: {
        'Registration': {
          completed: true,
          tasks: [
            { id: 1, title: 'Create team profile', completed: true },
            { id: 2, title: 'Submit project idea', completed: true },
            { id: 3, title: 'Complete registration form', completed: true }
          ]
        },
        'Development': {
          completed: true,
          tasks: [
            { id: 4, title: 'Submit project plan', completed: true },
            { id: 5, title: 'Create prototype', completed: true },
            { id: 6, title: 'Technical feasibility report', completed: true }
          ]
        },
        'Finals': {
          completed: false,
          tasks: [
            { id: 7, title: 'Submit working MVP', completed: true },
            { id: 8, title: 'Technical documentation', completed: false },
            { id: 9, title: 'Source code repository', completed: true }
          ]
        },
        'Presentation': {
          completed: false,
          tasks: [
            { id: 10, title: 'Create demo video', completed: false },
            { id: 11, title: 'Prepare presentation slides', completed: false },
            { id: 12, title: 'Submit final project', completed: false }
          ]
        }
      }
    },
    {
      id: 2,
      title: 'Smart City Waste Management System',
      description: 'An IoT-based solution for efficient waste collection and management in urban areas',
      teamName: 'Byte Bandits',
      teamMembers: [
        { id: 4, name: 'Michael Brown', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
        { id: 5, name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { id: 6, name: 'Chris Wilson', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
        { id: 7, name: 'Sarah Miller', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' }
      ],
      submittedAt: '2023-04-17T10:15:00',
      round: 'Finals',
      status: 'evaluated',
      demoLink: 'https://demo.example.com/waste-management',
      repoLink: 'https://github.com/example/waste-management',
      score: 85,
      feedback: 'Excellent implementation with a clear focus on solving a real urban problem. Consider expanding the sensor network capabilities.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FzdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      roundProgress: {
        'Registration': {
          completed: true,
          tasks: [
            { id: 1, title: 'Create team profile', completed: true },
            { id: 2, title: 'Submit project idea', completed: true },
            { id: 3, title: 'Complete registration form', completed: true }
          ]
        },
        'Development': {
          completed: true,
          tasks: [
            { id: 4, title: 'Submit project plan', completed: true },
            { id: 5, title: 'Create prototype', completed: true },
            { id: 6, title: 'Technical feasibility report', completed: true }
          ]
        },
        'Finals': {
          completed: true,
          tasks: [
            { id: 7, title: 'Submit working MVP', completed: true },
            { id: 8, title: 'Technical documentation', completed: true },
            { id: 9, title: 'Source code repository', completed: true }
          ]
        },
        'Presentation': {
          completed: false,
          tasks: [
            { id: 10, title: 'Create demo video', completed: false },
            { id: 11, title: 'Prepare presentation slides', completed: false },
            { id: 12, title: 'Submit final project', completed: false }
          ]
        }
      }
    },
    {
      id: 3,
      title: 'AR Navigation for Visually Impaired',
      description: 'Augmented reality application that provides audio guidance for navigation in complex environments',
      teamName: 'Tech Titans',
      teamMembers: [
        { id: 8, name: 'Robert Taylor', avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
        { id: 9, name: 'Lisa Anderson', avatar: 'https://randomuser.me/api/portraits/women/9.jpg' }
      ],
      submittedAt: '2023-04-15T09:45:00',
      round: 'Development',
      status: 'evaluated',
      demoLink: 'https://demo.example.com/ar-navigation',
      repoLink: 'https://github.com/example/ar-navigation',
      score: 92,
      feedback: 'Innovative solution with great potential for social impact. The UI could be improved for better user experience.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581303035695-1680962723a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YXVnbWVudGVkJTIwcmVhbGl0eXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      roundProgress: {
        'Registration': {
          completed: true,
          tasks: [
            { id: 1, title: 'Create team profile', completed: true },
            { id: 2, title: 'Submit project idea', completed: true },
            { id: 3, title: 'Complete registration form', completed: true }
          ]
        },
        'Development': {
          completed: true,
          tasks: [
            { id: 4, title: 'Submit project plan', completed: true },
            { id: 5, title: 'Create prototype', completed: true },
            { id: 6, title: 'Technical feasibility report', completed: true }
          ]
        },
        'Finals': {
          completed: false,
          tasks: [
            { id: 7, title: 'Submit working MVP', completed: false },
            { id: 8, title: 'Technical documentation', completed: false },
            { id: 9, title: 'Source code repository', completed: false }
          ]
        },
        'Presentation': {
          completed: false,
          tasks: [
            { id: 10, title: 'Create demo video', completed: false },
            { id: 11, title: 'Prepare presentation slides', completed: false },
            { id: 12, title: 'Submit final project', completed: false }
          ]
        }
      }
    }
  ]);

  // Filter submissions based on search term, active filter, and selected round
  const filteredSubmissions = submissions.filter(submission => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      submission.title.toLowerCase().includes(searchLower) ||
      submission.description.toLowerCase().includes(searchLower) ||
      submission.teamName.toLowerCase().includes(searchLower) ||
      submission.teamMembers.some(member => member.name.toLowerCase().includes(searchLower));

    // Status filter
    let statusMatch = true;
    if (activeFilter === 'evaluated') {
      statusMatch = submission.status === 'evaluated';
    } else if (activeFilter === 'pending') {
      statusMatch = submission.status === 'submitted';
    }

    // Round filter
    let roundMatch = true;
    if (selectedRound !== 'all') {
      roundMatch = submission.round === selectedRound ||
        (submission.roundProgress && submission.roundProgress[selectedRound]);
    }

    console.log('Filtering submission:', {
      id: submission.id,
      title: submission.title,
      matchesSearch,
      statusMatch,
      roundMatch,
      searchTerm,
      activeFilter,
      selectedRound
    });

    return matchesSearch && statusMatch && roundMatch;
  });

  // Sort submissions based on selected option
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    console.log('Sorting submissions:', {
      sortBy,
      a: { id: a.id, score: a.score, submittedAt: a.submittedAt },
      b: { id: b.id, score: b.score, submittedAt: b.submittedAt }
    });

    if (sortBy === 'newest') {
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.submittedAt) - new Date(b.submittedAt);
    } else if (sortBy === 'highestScore') {
      const scoreA = a.score !== null ? a.score : -1;
      const scoreB = b.score !== null ? b.score : -1;
      return scoreB - scoreA;
    } else if (sortBy === 'lowestScore') {
      const scoreA = a.score !== null ? a.score : 101;
      const scoreB = b.score !== null ? b.score : 101;
      return scoreA - scoreB;
    }
    return 0;
  });

  // Toggle submission details expand/collapse
  const toggleSubmissionExpand = (submissionId) => {
    if (expandedSubmissionId === submissionId) {
      setExpandedSubmissionId(null);
    } else {
      setExpandedSubmissionId(submissionId);
    }
  };

  // Open evaluation modal
  const openEvaluationModal = (submission) => {
    setCurrentSubmission(submission);
    setEvaluationScore(submission.score || 0);
    setEvaluationFeedback(submission.feedback || '');
    setIsEvaluationModalOpen(true);
  };

  // Toggle task completion status
  const toggleTaskCompletion = (submissionId, roundName, taskId) => {
    setSubmissions(submissions.map(submission => {
      if (submission.id === submissionId && submission.roundProgress[roundName]) {
        const updatedTasks = submission.roundProgress[roundName].tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );

        // Check if all tasks are completed to mark the round as completed
        const allTasksCompleted = updatedTasks.every(task => task.completed);

        return {
          ...submission,
          roundProgress: {
            ...submission.roundProgress,
            [roundName]: {
              completed: allTasksCompleted,
              tasks: updatedTasks
            }
          }
        };
      }
      return submission;
    }));
  };

  // Calculate round completion percentage
  const calculateRoundCompletion = (submission, roundName) => {
    if (!submission.roundProgress || !submission.roundProgress[roundName]) {
      return 0;
    }

    const tasks = submission.roundProgress[roundName].tasks;
    if (!tasks || tasks.length === 0) return 0;

    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Submit evaluation
  const submitEvaluation = () => {
    setSubmissions(submissions.map(submission =>
      submission.id === currentSubmission.id
        ? {
          ...submission,
          status: 'evaluated',
          score: evaluationScore,
          feedback: evaluationFeedback
        }
        : submission
    ));
    setIsEvaluationModalOpen(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // View task submission details
  const [viewingTaskSubmission, setViewingTaskSubmission] = useState(null);

  // Open task submission view
  const openTaskSubmission = (taskId) => {
    const submission = submissions.find(sub => sub.roundProgress[selectedRound]?.tasks.some(task => task.id === taskId));
    if (submission) {
      const task = submission.roundProgress[selectedRound].tasks.find(task => task.id === taskId);
      setViewingTaskSubmission({ content: task.content, attachments: task.attachments, submittedAt: submission.submittedAt });
    }
  };

  return (
    <div>
      {/* Submissions Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Project Submissions</h2>
          <p className="text-gray-400">View, manage, and evaluate hackathon project submissions</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 pr-8"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highestScore">Highest Score</option>
              <option value="lowestScore">Lowest Score</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Round Selection */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                console.log('Setting filter to: all');
                setActiveFilter('all');
              }}
              className={`px-3 py-1.5 text-sm rounded-md ${activeFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                }`}
            >
              All Submissions
            </button>
            <button
              onClick={() => {
                console.log('Setting filter to: evaluated');
                setActiveFilter('evaluated');
              }}
              className={`px-3 py-1.5 text-sm rounded-md ${activeFilter === 'evaluated'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                }`}
            >
              Evaluated
            </button>
            <button
              onClick={() => {
                console.log('Setting filter to: pending');
                setActiveFilter('pending');
              }}
              className={`px-3 py-1.5 text-sm rounded-md ${activeFilter === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                }`}
            >
              Pending Evaluation
            </button>
          </div>

          {/* Round Selection Dropdown */}
          <div className="relative flex items-center">
            <select
              value={selectedRound}
              onChange={(e) => {
                console.log('Setting round to:', e.target.value);
                setSelectedRound(e.target.value);
              }}
              className="appearance-none bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full md:w-48 py-2 px-3 pr-8"
            >
              <option value="all">All Rounds</option>
              {roundProgression.map((round, index) => (
                <option key={round} value={round}>
                  {index + 1}. {round}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-0 flex items-center px-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="relative ml-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  console.log('Search term changed:', e.target.value);
                  setSearchTerm(e.target.value);
                }}
                className="pl-10 pr-3 py-2 w-full md:w-64 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Search submissions..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Round Progress Indicator (when a round is selected) */}
      {selectedRound !== 'all' && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium text-white">
                {selectedRound} Round
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {selectedRound === 'Registration' && 'Teams register and submit initial project ideas'}
                {selectedRound === 'Development' && 'Teams develop prototypes and technical plans'}
                {selectedRound === 'Finals' && 'Teams submit their MVP and technical documentation'}
                {selectedRound === 'Presentation' && 'Teams present their final projects and demonstrations'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {roundProgression.map((round, index) => (
                <button
                  key={round}
                  onClick={() => setSelectedRound(round)}
                  className={`flex items-center ${selectedRound === round
                      ? 'text-cyan-300'
                      : roundProgression.indexOf(selectedRound) > index
                        ? 'text-green-400'
                        : 'text-gray-500'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${selectedRound === round
                      ? 'border-cyan-400 bg-cyan-900/30'
                      : roundProgression.indexOf(selectedRound) > index
                        ? 'border-green-500 bg-green-900/30'
                        : 'border-gray-700 bg-gray-800'
                    }`}>
                    {index + 1}
                  </div>
                  {index < roundProgression.length - 1 && (
                    <div className={`w-6 h-0.5 ${roundProgression.indexOf(selectedRound) > index
                        ? 'bg-green-500'
                        : 'bg-gray-700'
                      }`}></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submissions Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4">
          <h4 className="text-gray-400 text-sm font-medium mb-2">Total Submissions</h4>
          <div className="text-white text-2xl font-bold">{submissions.length}</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4">
          <h4 className="text-gray-400 text-sm font-medium mb-2">Evaluated</h4>
          <div className="text-green-400 text-2xl font-bold">
            {submissions.filter(s => s.status === 'evaluated').length}
          </div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4">
          <h4 className="text-gray-400 text-sm font-medium mb-2">Pending Evaluation</h4>
          <div className="text-yellow-400 text-2xl font-bold">
            {submissions.filter(s => s.status === 'submitted').length}
          </div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4">
          <h4 className="text-gray-400 text-sm font-medium mb-2">Average Score</h4>
          <div className="text-cyan-400 text-2xl font-bold">
            {(submissions.filter(s => s.score !== null).reduce((acc, s) => acc + s.score, 0) /
              (submissions.filter(s => s.score !== null).length || 1)).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {sortedSubmissions.length > 0 ? (
        <div className="space-y-6 mb-8">
          {sortedSubmissions.map(submission => (
            <div
              key={submission.id}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden"
            >
              {/* Submission Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-800/30 transition-colors"
                onClick={() => toggleSubmissionExpand(submission.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={submission.thumbnailUrl}
                        alt={submission.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {submission.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                        <span className="text-gray-400 text-sm">
                          <span className="font-medium text-gray-300">{submission.teamName}</span>
                        </span>
                        <span className="text-gray-400 text-sm">
                          {formatDate(submission.submittedAt)}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-900/30 text-indigo-300 border border-indigo-600/30">
                          {submission.round}
                        </span>
                        {submission.status === 'evaluated' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/30 text-green-300 border border-green-600/30">
                            Evaluated - Score: {submission.score}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/30 text-yellow-300 border border-yellow-600/30">
                            Pending Evaluation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Round Progress Indicators */}
                    {selectedRound === 'all' && (
                      <div className="hidden md:flex items-center gap-1 mr-3">
                        {roundProgression.map((round) => {
                          const progress = calculateRoundCompletion(submission, round);
                          return (
                            <div
                              key={round}
                              className="group relative"
                              title={`${round}: ${progress}% complete`}
                            >
                              <div className={`w-2.5 h-2.5 rounded-full ${progress === 100
                                  ? 'bg-green-500'
                                  : progress > 0
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-700'
                                }`}></div>
                              <div className="absolute bottom-full mb-1.5 hidden group-hover:block w-24 bg-gray-900 text-xs text-center p-1 rounded">
                                {round}: {progress}%
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {submission.status === 'submitted' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEvaluationModal(submission);
                        }}
                        className="px-3 py-1.5 bg-cyan-600/70 hover:bg-cyan-600 text-white text-sm rounded-md transition-colors"
                      >
                        Evaluate
                      </button>
                    )}
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedSubmissionId === submission.id ? 'transform rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Submission Details */}
              {expandedSubmissionId === submission.id && (
                <div className="border-t border-gray-700/50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-gray-400 font-medium mb-3">Project Description</h4>
                      <p className="text-gray-300 bg-gray-800/50 rounded-lg p-3">
                        {submission.description}
                      </p>

                      <h4 className="text-gray-400 font-medium mt-5 mb-3">Team Members</h4>
                      <div className="flex flex-wrap gap-3">
                        {submission.teamMembers.map(member => (
                          <div key={member.id} className="flex items-center bg-gray-800/50 rounded-lg p-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-white text-sm">{member.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-gray-400 font-medium mb-3">Project Links</h4>
                      <div className="space-y-3">
                        <a
                          href={submission.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                        <a
                          href={submission.repoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          Source Code
                        </a>
                      </div>

                      {/* Round Tasks */}
                      <div className="mt-5">
                        <h4 className="text-gray-400 font-medium mb-3">
                          {selectedRound !== 'all' ? `${selectedRound} Tasks` : `${submission.round} Tasks`}
                        </h4>
                        {/* Task checklist for the current round or selected round */}
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          {submission.roundProgress && (selectedRound !== 'all' ?
                            submission.roundProgress[selectedRound]?.tasks :
                            submission.roundProgress[submission.round]?.tasks)?.length > 0 ? (
                            <ul className="space-y-2">
                              {(selectedRound !== 'all' ?
                                submission.roundProgress[selectedRound]?.tasks :
                                submission.roundProgress[submission.round]?.tasks).map(task => (
                                  <li key={task.id} className="flex items-start">
                                    <div className="flex-shrink-0 pt-0.5">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleTaskCompletion(
                                            submission.id,
                                            selectedRound !== 'all' ? selectedRound : submission.round,
                                            task.id
                                          );
                                        }}
                                        className={`w-5 h-5 rounded ${task.completed ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'} flex items-center justify-center`}
                                      >
                                        {task.completed && (
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                          </svg>
                                        )}
                                      </button>
                                    </div>
                                    <div className="ml-3 flex-grow">
                                      <div className="flex items-center justify-between">
                                        <p className={`text-sm font-medium ${task.completed ? 'text-green-300' : 'text-white'}`}>
                                          {task.title}
                                        </p>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openTaskSubmission(task.id);
                                          }}
                                          className="text-cyan-400 hover:text-cyan-300 text-sm"
                                        >
                                          View Details
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No tasks defined for this round</p>
                          )}

                          {/* Round Progress Bar */}
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>
                                {calculateRoundCompletion(
                                  submission,
                                  selectedRound !== 'all' ? selectedRound : submission.round
                                )}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-cyan-500 h-2 rounded-full"
                                style={{
                                  width: `${calculateRoundCompletion(
                                    submission,
                                    selectedRound !== 'all' ? selectedRound : submission.round
                                  )}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {submission.status === 'evaluated' && (
                        <div className="mt-5">
                          <h4 className="text-gray-400 font-medium mb-3">Evaluation</h4>
                          <div className="bg-gray-800/50 rounded-lg p-3">
                            <div className="mb-3">
                              <div className="text-gray-400 text-sm mb-1">Score:</div>
                              <div className="flex items-center">
                                <div className="text-white text-lg font-bold">{submission.score}/100</div>
                                <div className="ml-3 bg-gray-700 h-2 rounded-full w-full max-w-[120px]">
                                  <div
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                                    style={{ width: `${submission.score}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-sm mb-1">Feedback:</div>
                              <p className="text-white">{submission.feedback}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {submission.status === 'submitted' && (
                        <div className="mt-5 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEvaluationModal(submission);
                            }}
                            className="inline-flex items-center px-4 py-2 bg-cyan-600/70 hover:bg-cyan-600 text-white text-sm rounded-md transition-colors"
                          >
                            <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Evaluate Submission
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-8 text-center mb-8">
          <div className="flex flex-col items-center justify-center">
            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-xl">No submissions found</p>
            <p className="text-gray-600 text-sm mt-1">Submissions matching your criteria will appear here</p>
          </div>
        </div>
      )}

      {/* Evaluation Modal */}
      {isEvaluationModalOpen && currentSubmission && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="bg-black/30 backdrop-blur-sm absolute inset-0" onClick={() => setIsEvaluationModalOpen(false)}></div>
          <div className="bg-gray-900 border-l border-gray-700 shadow-xl w-full max-w-md z-10 relative overflow-y-auto h-screen animate-slide-in-right">
            <div className="p-5 sticky top-0 bg-gray-900 border-b border-gray-800 z-10 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                Evaluate Submission
              </h3>
              <button
                onClick={() => setIsEvaluationModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={currentSubmission.thumbnailUrl}
                    alt={currentSubmission.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">{currentSubmission.title}</h4>
                  <p className="text-gray-400">by {currentSubmission.teamName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <a
                  href={currentSubmission.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Demo
                </a>
                <a
                  href={currentSubmission.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  View Code
                </a>
              </div>

              {/* Round Progress */}
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                <h5 className="text-gray-300 text-sm font-medium mb-3">Round Progress</h5>
                <div className="space-y-3">
                  {roundProgression.map((round) => {
                    const completion = calculateRoundCompletion(currentSubmission, round);
                    const isCurrentRound = currentSubmission.round === round;
                    const isPastRound = roundProgression.indexOf(round) < roundProgression.indexOf(currentSubmission.round);

                    return (
                      <div key={round} className="relative">
                        <div className="flex items-center mb-1">
                          <span className={`text-sm ${isCurrentRound ? 'text-cyan-300 font-medium' : isPastRound ? 'text-green-300' : 'text-gray-400'}`}>
                            {round}
                          </span>
                          <span className="ml-auto text-xs text-gray-400">{completion}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${isCurrentRound ? 'bg-cyan-500' : isPastRound ? 'bg-green-500' : 'bg-gray-600'}`}
                            style={{ width: `${completion}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Round Tasks */}
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                <h5 className="text-gray-300 text-sm font-medium mb-2">
                  {currentSubmission.round} Tasks
                </h5>
                {currentSubmission.roundProgress && currentSubmission.roundProgress[currentSubmission.round]?.tasks.length > 0 ? (
                  <ul className="space-y-2">
                    {currentSubmission.roundProgress[currentSubmission.round].tasks.map(task => (
                      <li key={task.id} className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          <button
                            onClick={() => toggleTaskCompletion(
                              currentSubmission.id,
                              currentSubmission.round,
                              task.id
                            )}
                            className={`w-5 h-5 rounded ${task.completed ? 'bg-green-500/60 text-white' : 'bg-gray-700 text-gray-400'} flex items-center justify-center`}
                          >
                            {task.completed && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${task.completed ? 'text-green-300' : 'text-white'}`}>
                            {task.title}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No tasks defined for this round</p>
                )}
              </div>

              {/* Project Description */}
              <div className="bg-gray-800/50 rounded-lg p-3 mb-5">
                <h5 className="text-gray-300 text-sm font-medium mb-2">Project Description</h5>
                <p className="text-gray-400 text-sm">{currentSubmission.description}</p>
              </div>

              <div className="mb-5">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Score (0-100)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={evaluationScore}
                    onChange={(e) => setEvaluationScore(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                  />
                  <span className="text-white text-lg font-medium w-12 text-center">{evaluationScore}</span>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Feedback
                </label>
                <textarea
                  value={evaluationFeedback}
                  onChange={(e) => setEvaluationFeedback(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Provide detailed feedback to the team..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-800 pt-4">
                <button
                  onClick={() => setIsEvaluationModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitEvaluation}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg transition-colors"
                >
                  Submit Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Submission View Modal */}
      {viewingTaskSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-black/30 backdrop-blur-sm absolute inset-0" onClick={() => setViewingTaskSubmission(null)}></div>
          <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 relative">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                Task Submission
              </h3>
              <button
                onClick={() => setViewingTaskSubmission(null)}
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
                  {viewingTaskSubmission.content}
                </div>
              </div>

              {/* Attachments */}
              {viewingTaskSubmission.attachments && viewingTaskSubmission.attachments.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-gray-400 text-sm font-medium mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {viewingTaskSubmission.attachments.map((attachment, index) => (
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
                Submitted: {formatDate(viewingTaskSubmission.submittedAt)}
              </div>
            </div>

            <div className="border-t border-gray-800 p-4 flex justify-end">
              <button
                onClick={() => setViewingTaskSubmission(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions; 