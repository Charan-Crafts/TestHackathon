import React, { useState, useEffect } from 'react';

const Rounds = ({ hackathon, setHackathon }) => {
  const [isAddRoundModalOpen, setIsAddRoundModalOpen] = useState(false);
  const [isEditRoundModalOpen, setIsEditRoundModalOpen] = useState(false);
  const [currentRound, setCurrentRound] = useState(null);
  const [newRoundName, setNewRoundName] = useState('');
  const [newRoundDescription, setNewRoundDescription] = useState('');
  const [newRoundStartDate, setNewRoundStartDate] = useState('');
  const [newRoundEndDate, setNewRoundEndDate] = useState('');
  const [newRoundSubmissionType, setNewRoundSubmissionType] = useState('code');
  const [isConfirmAdvanceModalOpen, setIsConfirmAdvanceModalOpen] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [currentTasksRound, setCurrentTasksRound] = useState(null);

  // Use hackathon rounds data from props or fallback to mock data
  const [rounds, setRounds] = useState([]);

  // Initialize rounds from hackathon data or create mockup rounds
  useEffect(() => {
    // Skip if we don't have hackathon data yet
    if (!hackathon) return;

    // Skip if rounds are already initialized with valid data
    if (rounds.length > 0 && rounds.some(r => r.id)) return;

    console.log('Initializing rounds');

    // Create fixed set of rounds - 2 completed and 3 upcoming
    const enhancedRounds = [
      // Round 1: Registration (completed)
      {
        id: 'round-registration',
        name: 'Registration',
        description: 'Registration period for all participants',
        status: 'completed',
        startDate: new Date(2001, 4, 15, 12, 0).toISOString(),
        endDate: new Date(2023, 4, 10, 12, 0).toISOString(),
        submissions: 32,
        submissionType: 'document',
        advancement: {
          type: 'top-percentage',
          value: 100
        },
        tasks: [
          {
            id: 'task-1',
            title: 'Review registration applications',
            description: 'Screen all participant registrations for eligibility',
            status: 'completed',
            dueDate: new Date(2023, 4, 5).toISOString(),
            type: 'review'
          },
          {
            id: 'task-2',
            title: 'Send welcome emails',
            description: 'Send welcome emails to all accepted participants',
            status: 'completed',
            dueDate: new Date(2023, 4, 7).toISOString(),
            type: 'communication'
          },
          {
            id: 'task-3',
            title: 'Team formation support',
            description: 'Facilitate team formation for solo participants',
            status: 'completed',
            dueDate: new Date(2023, 4, 9).toISOString(),
            type: 'support'
          }
        ]
      },

      // Round 2: Development (completed)
      {
        id: 'round-development',
        name: 'Development',
        description: 'Main development period for projects',
        status: 'completed',
        startDate: new Date(2023, 4, 10, 12, 0).toISOString(),
        endDate: new Date(2023, 4, 18, 12, 0).toISOString(),
        submissions: 28,
        submissionType: 'code',
        advancement: {
          type: 'top-count',
          value: 10
        },
        tasks: [
          {
            id: 'task-4',
            title: 'Host mentor sessions',
            description: 'Organize 3 mentor sessions during development phase',
            status: 'completed',
            dueDate: new Date(2023, 4, 15).toISOString(),
            type: 'event'
          },
          {
            id: 'task-5',
            title: 'Technical troubleshooting',
            description: 'Provide technical support to teams',
            status: 'completed',
            dueDate: new Date(2023, 4, 17).toISOString(),
            type: 'support'
          },
          {
            id: 'task-6',
            title: 'Review code submissions',
            description: 'Initial review of code submissions for completeness',
            status: 'completed',
            dueDate: new Date(2023, 4, 18).toISOString(),
            type: 'review'
          }
        ]
      },

      // Round 3: Finals (upcoming)
      {
        id: 'round-finals',
        name: 'Finals',
        description: 'Final presentations and judging',
        status: 'upcoming',
        startDate: new Date(2023, 4, 20, 12, 0).toISOString(),
        endDate: new Date(2023, 4, 25, 12, 0).toISOString(),
        submissions: 0,
        submissionType: 'code',
        advancement: {
          type: 'top-count',
          value: 3
        },
        tasks: [
          {
            id: 'task-7',
            title: 'Assign judges',
            description: 'Confirm judges and assign to projects',
            status: 'pending',
            dueDate: new Date(2023, 4, 21).toISOString(),
            type: 'admin'
          },
          {
            id: 'task-8',
            title: 'Technical setup for demos',
            description: 'Prepare technical environment for project demos',
            status: 'pending',
            dueDate: new Date(2023, 4, 22).toISOString(),
            type: 'setup'
          },
          {
            id: 'task-9',
            title: 'Collect judge feedback',
            description: 'Consolidate feedback from all judges',
            status: 'pending',
            dueDate: new Date(2023, 4, 24).toISOString(),
            type: 'review'
          }
        ]
      },

      // Round 4: Presentation (upcoming)
      {
        id: 'round-presentation',
        name: 'Presentation',
        description: 'Teams present their projects to judges and audience',
        status: 'upcoming',
        startDate: new Date(2023, 4, 26, 12, 0).toISOString(),
        endDate: new Date(2023, 4, 28, 12, 0).toISOString(),
        submissions: 0,
        submissionType: 'presentation',
        advancement: {
          type: 'top-count',
          value: 2
        },
        tasks: [
          {
            id: 'task-10',
            title: 'Prepare presentation schedule',
            description: 'Create and share presentation schedule with teams',
            status: 'pending',
            dueDate: new Date(2023, 4, 26).toISOString(),
            type: 'admin'
          },
          {
            id: 'task-11',
            title: 'Presentation rehearsals',
            description: 'Optional rehearsals for finalist teams',
            status: 'pending',
            dueDate: new Date(2023, 4, 27).toISOString(),
            type: 'support'
          },
          {
            id: 'task-12',
            title: 'Live audience voting',
            description: 'Set up and monitor audience choice voting',
            status: 'pending',
            dueDate: new Date(2023, 4, 28).toISOString(),
            type: 'event'
          }
        ]
      },

      // Round 5: Awards Ceremony (upcoming)
      {
        id: 'round-awards',
        name: 'Awards Ceremony',
        description: 'Final judging and awards presentation',
        status: 'upcoming',
        startDate: new Date(2023, 4, 29, 18, 0).toISOString(),
        endDate: new Date(2023, 4, 29, 21, 0).toISOString(),
        submissions: 0,
        submissionType: 'presentation',
        advancement: {
          type: 'top-count',
          value: 1
        },
        tasks: [
          {
            id: 'task-13',
            title: 'Finalize winners',
            description: 'Confirm winners in all categories',
            status: 'pending',
            dueDate: new Date(2023, 4, 29, 16, 0).toISOString(),
            type: 'admin'
          },
          {
            id: 'task-14',
            title: 'Prepare award certificates',
            description: 'Generate certificates for all winners',
            status: 'pending',
            dueDate: new Date(2023, 4, 29, 17, 0).toISOString(),
            type: 'admin'
          },
          {
            id: 'task-15',
            title: 'Post-event survey',
            description: 'Prepare and send post-event survey',
            status: 'pending',
            dueDate: new Date(2023, 4, 29, 21, 30).toISOString(),
            type: 'feedback'
          }
        ]
      }
    ];

    setRounds(enhancedRounds);

    // Add animation trigger after rounds are loaded
    setTimeout(() => {
      setAnimated(true);
    }, 100);
  }, [hackathon?.id]); // Only re-run if hackathon ID changes

  // Update hackathon object when rounds change
  useEffect(() => {
    // Skip if we don't have hackathon or callback
    if (!hackathon || !setHackathon) return;

    // Skip if rounds are empty
    if (rounds.length === 0) return;

    // Compare current rounds with hackathon rounds
    const currentRoundIds = [...rounds].map(r => r.id).sort().join(',');
    const hackathonRoundIds = hackathon.rounds ?
      [...hackathon.rounds].map(r => r.id).sort().join(',') : '';

    // Only update if rounds have changed
    if (currentRoundIds !== hackathonRoundIds) {
      setHackathon(prev => ({
        ...prev,
        rounds: rounds
      }));
    }
  }, [rounds]);

  // Open modal to add new round
  const openAddRoundModal = () => {
    setNewRoundName('');
    setNewRoundDescription('');
    setNewRoundStartDate('');
    setNewRoundEndDate('');
    setNewRoundSubmissionType('code');
    setIsAddRoundModalOpen(true);
  };

  // Handle adding new round
  const handleAddRound = () => {
    const newRound = {
      id: `round-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newRoundName,
      description: newRoundDescription,
      status: 'upcoming',
      startDate: newRoundStartDate,
      endDate: newRoundEndDate,
      submissionType: newRoundSubmissionType,
      submissions: 0,
      advancement: {
        type: 'top-count',
        value: 3
      }
    };

    setRounds([...rounds, newRound]);
    setIsAddRoundModalOpen(false);
  };

  // Open modal to edit round
  const openEditRoundModal = (round) => {
    setCurrentRound(round);
    setNewRoundName(round.name);
    setNewRoundDescription(round.description);
    setNewRoundStartDate(round.startDate.split('T')[0]);
    setNewRoundEndDate(round.endDate.split('T')[0]);
    setNewRoundSubmissionType(round.submissionType || 'code');
    setIsEditRoundModalOpen(true);
  };

  // Handle editing round
  const handleEditRound = () => {
    const updatedRounds = rounds.map(round =>
      round.id === currentRound.id ? {
        ...round,
        name: newRoundName,
        description: newRoundDescription,
        startDate: newRoundStartDate,
        endDate: newRoundEndDate,
        submissionType: newRoundSubmissionType
      } : round
    );

    setRounds(updatedRounds);
    setIsEditRoundModalOpen(false);
  };

  // Open confirm advance round modal
  const openAdvanceRoundModal = () => {
    setIsConfirmAdvanceModalOpen(true);
  };

  // Handle advancing to next round
  const handleAdvanceRound = () => {
    // If there's no active round, start the first upcoming round
    if (!activeRound) {
      const updatedRounds = rounds.map(round => {
        if (round.status === 'upcoming' &&
          rounds.findIndex(r => r.status === 'upcoming') === rounds.findIndex(r => r.id === round.id)) {
          return { ...round, status: 'active' };
        }
        return round;
      });
      setRounds(updatedRounds);
    } else {
      // If there's an active round, just complete it without starting the next one
      const updatedRounds = rounds.map(round => {
        if (round.status === 'active') {
          return { ...round, status: 'completed' };
        }
        return round;
      });
      setRounds(updatedRounds);
    }

    setIsConfirmAdvanceModalOpen(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get current round
  const activeRound = rounds.find(round => round.status === 'active');

  // Calculate time remaining in current round
  const calculateTimeRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;

    if (diffTime <= 0) return 'Ended';

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h remaining`;
    } else {
      return `${diffHours}h ${Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))}m remaining`;
    }
  };

  // Calculate progress percentage safely
  const calculateProgressPercentage = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // If the round hasn't started yet
    if (now < start) return 0;

    // If the round has ended
    if (now > end) return 100;

    // Calculate progress percentage
    const totalDuration = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100); // Clamp between 0-100
  };

  // Determine if the hackathon has a next round
  const hasNextRound = rounds.some(round => round.status === 'upcoming');

  // Open tasks modal
  const openTasksModal = (round) => {
    setCurrentTasksRound(round);
    setIsTasksModalOpen(true);
  };

  // Group tasks by type
  const getGroupedTasks = (tasks) => {
    const grouped = {};
    if (!tasks) return {};

    tasks.forEach(task => {
      if (!grouped[task.type]) {
        grouped[task.type] = [];
      }
      grouped[task.type].push(task);
    });

    return grouped;
  };

  // State for expanded task groups
  const [expandedGroups, setExpandedGroups] = useState({});

  // Toggle task group expansion
  const toggleGroupExpansion = (groupName, roundId) => {
    const key = `${roundId}-${groupName}`;
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // State for expanded rounds
  const [expandedTasks, setExpandedTasks] = useState({});

  // Toggle tasks expansion for a round
  const toggleTasksExpansion = (roundId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [roundId]: !prev[roundId]
    }));
  };

  // Mark a task as completed
  const markTaskAsCompleted = (roundId, taskId) => {
    const updatedRounds = rounds.map(round => {
      if (round.id === roundId) {
        const updatedTasks = round.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, status: task.status === 'completed' ? 'pending' : 'completed' };
          }
          return task;
        });
        return { ...round, tasks: updatedTasks };
      }
      return round;
    });
    setRounds(updatedRounds);
  };

  // Mark a task as in-progress
  const markTaskAsInProgress = (roundId, taskId) => {
    const updatedRounds = rounds.map(round => {
      if (round.id === roundId) {
        const updatedTasks = round.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, status: task.status === 'in-progress' ? 'pending' : 'in-progress' };
          }
          return task;
        });
        return { ...round, tasks: updatedTasks };
      }
      return round;
    });
    setRounds(updatedRounds);
  };

  return (
    <div>
      {/* Rounds Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Rounds</h2>
          <p className="text-gray-400">Manage hackathon rounds, schedules, and progression</p>
        </div>

        <div className="flex items-center gap-3">
          {activeRound && hasNextRound && (
            <button
              onClick={openAdvanceRoundModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                Complete & Advance
              </div>
            </button>
          )}

          {!activeRound && hasNextRound && (
            <button
              onClick={openAdvanceRoundModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Next Round
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Current Round Summary */}
      {activeRound ? (
        <div className="bg-gradient-to-br from-indigo-900/50 to-cyan-900/30 rounded-xl border border-indigo-500/30 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-300 border border-green-600/30 mb-3">
                Active Round
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{activeRound.name}</h3>
              <p className="text-gray-300 mb-4 max-w-2xl">{activeRound.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Start Date</div>
                  <div className="text-white">{formatDate(activeRound.startDate)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">End Date</div>
                  <div className="text-white">{formatDate(activeRound.endDate)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Submissions</div>
                  <div className="text-white">{activeRound.submissions}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Submission Type</div>
                  <div className="text-white capitalize">{activeRound.submissionType}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 min-w-[200px]">
              <div className="text-center">
                <div className="text-gray-300 text-sm mb-2">Time Remaining</div>
                <div className="text-2xl font-bold text-white mb-3">
                  {calculateTimeRemaining(activeRound.endDate)}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${calculateProgressPercentage(activeRound.startDate, activeRound.endDate)}%` }}
                  ></div>
                </div>
                <div className="text-gray-400 text-xs mb-4">
                  {activeRound.advancement ?
                    `Top ${activeRound.advancement.type === 'top-percentage' ? `${activeRound.advancement.value}%` : activeRound.advancement.value} will advance`
                    : 'No advancement criteria specified'}
                </div>

                {hasNextRound && (
                  <button
                    onClick={openAdvanceRoundModal}
                    className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                  >
                    <div className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Complete Round
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-8 text-center mb-8">
          <div className="flex flex-col items-center justify-center">
            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-300 text-xl">No active round</p>
            <p className="text-gray-500 text-sm mt-1 mb-4">Start a round from the timeline below to continue</p>
            {hasNextRound && (
              <button
                onClick={openAdvanceRoundModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Next Round
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Round Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 text-center">
          <div className="text-gray-400 text-sm mb-1">Completed</div>
          <div className="text-white text-2xl font-bold">
            {rounds.filter(r => r.status === 'completed').length}
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 text-center">
          <div className="text-gray-400 text-sm mb-1">Active</div>
          <div className="text-white text-2xl font-bold">
            {rounds.filter(r => r.status === 'active').length}
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-4 text-center">
          <div className="text-gray-400 text-sm mb-1">Upcoming</div>
          <div className="text-white text-2xl font-bold">
            {rounds.filter(r => r.status === 'upcoming').length}
          </div>
        </div>
      </div>

      {/* Rounds Timeline with clear section header */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Rounds Timeline</h3>
          <p className="text-gray-400 text-sm">Manage the progression of rounds throughout your hackathon</p>
        </div>

        <div className="p-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-indigo-500 to-gray-700">
              {activeRound && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-green-500 via-indigo-500 to-gray-700 animate-pulse-subtle"></div>
              )}
            </div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {rounds.map((round, index) => (
                <div
                  key={round.id}
                  className={`relative pl-14 transform transition-all duration-500 ${animated ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Timeline Icon */}
                  <div className={`absolute left-0 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${round.status === 'completed'
                    ? 'bg-green-900/30 border-green-500'
                    : round.status === 'active'
                      ? 'bg-indigo-900/30 border-indigo-500 animate-pulse shadow-lg shadow-indigo-500/20'
                      : 'bg-gray-800 border-gray-600'
                    }`}>
                    {round.status === 'completed' ? (
                      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : round.status === 'active' ? (
                      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>

                  {/* Round Card */}
                  <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border transition-all duration-300 ${round.status === 'completed'
                    ? 'border-green-700/40'
                    : round.status === 'active'
                      ? 'border-indigo-700/40 shadow-lg shadow-indigo-900/20'
                      : 'border-gray-700/40'
                    } overflow-hidden`}>
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-medium text-white">{round.name}</h4>
                            {round.status === 'completed' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/30 text-green-300 border border-green-600/30">
                                Completed
                              </span>
                            )}
                            {round.status === 'active' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-900/30 text-indigo-300 border border-indigo-600/30">
                                Active
                              </span>
                            )}
                            {round.status === 'upcoming' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-900/30 text-gray-300 border border-gray-600/30">
                                Upcoming
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400">{round.description}</p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          {/* Remove tasks button */}

                          {/* Round action buttons based on status */}
                          {round.status === 'upcoming' && !activeRound && index === rounds.findIndex(r => r.status === 'upcoming') && (
                            <button
                              onClick={openAdvanceRoundModal}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors"
                            >
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Start Round
                              </div>
                            </button>
                          )}

                          {round.status === 'active' && (
                            <button
                              onClick={openAdvanceRoundModal}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                            >
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Complete Round
                              </div>
                            </button>
                          )}

                          <button
                            onClick={() => openEditRoundModal(round)}
                            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-md transition-colors"
                          >
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <div className="text-gray-500 text-sm mb-1">Start Date</div>
                          <div className="text-gray-300">{formatDate(round.startDate)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm mb-1">End Date</div>
                          <div className="text-gray-300">{formatDate(round.endDate)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm mb-1">Submissions</div>
                          <div className="text-gray-300">{round.submissions}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm mb-1">Advancement</div>
                          <div className="text-gray-300">
                            {round.advancement ?
                              `Top ${round.advancement.type === 'top-percentage' ? `${round.advancement.value}%` : round.advancement.value}`
                              : 'Not specified'}
                          </div>
                        </div>
                      </div>

                      {round.status === 'active' && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-gray-500 text-sm">Round Progress</div>
                            <div className="text-gray-300 text-sm">{calculateTimeRemaining(round.endDate)}</div>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
                              style={{
                                width: `${calculateProgressPercentage(round.startDate, round.endDate)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Tasks section toggle */}
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <button
                          onClick={() => toggleTasksExpansion(round.id)}
                          className="w-full flex items-center justify-between text-gray-300 hover:text-white transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>Tasks ({round.tasks?.length || 0})</span>
                          </div>
                          <svg
                            className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${expandedTasks[round.id] ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Expandable tasks section */}
                        <div className={`transition-all duration-500 overflow-hidden ${expandedTasks[round.id] ? 'max-h-[5000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                          {/* Task summary */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-gray-800/60 rounded-lg p-3 text-center border border-gray-700">
                              <div className="text-gray-400 text-xs mb-1">Total</div>
                              <div className="text-white text-xl font-semibold">{round.tasks?.length || 0}</div>
                            </div>
                            <div className="bg-gray-800/60 rounded-lg p-3 text-center border border-gray-700">
                              <div className="text-gray-400 text-xs mb-1">Completed</div>
                              <div className="text-green-400 text-xl font-semibold">
                                {round.tasks?.filter(t => t.status === 'completed').length || 0}
                              </div>
                            </div>
                            <div className="bg-gray-800/60 rounded-lg p-3 text-center border border-gray-700">
                              <div className="text-gray-400 text-xs mb-1">Pending</div>
                              <div className="text-yellow-400 text-xl font-semibold">
                                {round.tasks?.filter(t => t.status !== 'completed').length || 0}
                              </div>
                            </div>
                          </div>

                          {round.tasks && round.tasks.length > 0 ? (
                            <div className="space-y-3">
                              {/* Group tasks by type */}
                              {Object.entries(getGroupedTasks(round.tasks)).map(([groupName, tasks]) => (
                                <div key={`${round.id}-${groupName}`} className="border border-gray-700 rounded-lg overflow-hidden">
                                  {/* Group header */}
                                  <div
                                    className="bg-gray-800 p-3 flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleGroupExpansion(groupName, round.id)}
                                  >
                                    <div className="flex items-center gap-2">
                                      {/* Group icon based on type */}
                                      {groupName === 'review' && (
                                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                      )}
                                      {groupName === 'admin' && (
                                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                      )}
                                      {groupName === 'support' && (
                                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                      )}
                                      {groupName === 'event' && (
                                        <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                      {groupName === 'setup' && (
                                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                        </svg>
                                      )}
                                      {groupName === 'communication' && (
                                        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                      {groupName === 'feedback' && (
                                        <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                      )}

                                      <span className="text-white capitalize">{groupName}</span>
                                      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                                        {tasks.length}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-400">
                                        {tasks.filter(t => t.status === 'completed').length} of {tasks.length} completed
                                      </span>
                                      <svg
                                        className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${expandedGroups[`${round.id}-${groupName}`] ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>

                                  {/* Task list (collapsible) */}
                                  <div className={`transition-all duration-300 overflow-hidden ${expandedGroups[`${round.id}-${groupName}`] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-3 space-y-2">
                                      {tasks.map(task => (
                                        <div
                                          key={task.id}
                                          className={`bg-gray-900/70 rounded-lg border p-3 ${task.status === 'completed'
                                            ? 'border-green-600/20'
                                            : task.status === 'in-progress'
                                              ? 'border-yellow-600/20'
                                              : 'border-gray-700'
                                            }`}
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                              {task.status === 'completed' ? (
                                                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                              ) : task.status === 'in-progress' ? (
                                                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                              ) : (
                                                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                              )}
                                              <span className="font-medium text-white">{task.title}</span>
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${task.status === 'completed'
                                              ? 'bg-green-900/30 text-green-300 border border-green-600/30'
                                              : task.status === 'in-progress'
                                                ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-600/30'
                                                : 'bg-gray-900/30 text-gray-300 border border-gray-600/30'
                                              }`}>
                                              {task.status === 'completed' ? 'Completed' : task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                                            </span>
                                          </div>

                                          <p className="text-gray-400 text-sm ml-8 mb-2">
                                            {task.description}
                                          </p>

                                          <div className="flex justify-between ml-8">
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => markTaskAsCompleted(round.id, task.id)}
                                                className={`px-2 py-1 text-xs rounded ${task.status === 'completed'
                                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                  : 'bg-green-700/40 text-green-300 hover:bg-green-700/60'
                                                  }`}
                                              >
                                                {task.status === 'completed' ? 'Undo Complete' : 'Mark Completed'}
                                              </button>

                                              {task.status !== 'completed' && (
                                                <button
                                                  onClick={() => markTaskAsInProgress(round.id, task.id)}
                                                  className={`px-2 py-1 text-xs rounded ${task.status === 'in-progress'
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    : 'bg-yellow-700/40 text-yellow-300 hover:bg-yellow-700/60'
                                                    }`}
                                                >
                                                  {task.status === 'in-progress' ? 'Mark Pending' : 'Mark In Progress'}
                                                </button>
                                              )}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                              Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <p className="text-gray-400">No tasks have been added for this round yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action guidance footer */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 mb-8">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-gray-300 text-sm">
              <span className="font-medium">Managing Rounds:</span> Rounds progress in sequence from registration to final awards.
              {!activeRound && hasNextRound ? " Start the next round to begin accepting submissions." : ""}
              {activeRound ? " When a round is complete, advance to the next round to continue the hackathon." : ""}
              {!hasNextRound && rounds.some(r => r.status === 'completed') ? " All rounds have been completed for this hackathon." : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Add Round Modal - HIDDEN, KEEPING CODE FOR REFERENCE */}
      {isAddRoundModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">
                  Add New Round
                </h3>
                <button
                  onClick={() => setIsAddRoundModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Round Name
                  </label>
                  <input
                    type="text"
                    value={newRoundName}
                    onChange={(e) => setNewRoundName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="e.g. Initial Idea Submission"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRoundDescription}
                    onChange={(e) => setNewRoundDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Describe the requirements and expectations for this round..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={newRoundStartDate}
                      onChange={(e) => setNewRoundStartDate(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      value={newRoundEndDate}
                      onChange={(e) => setNewRoundEndDate(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Submission Type
                  </label>
                  <select
                    value={newRoundSubmissionType}
                    onChange={(e) => setNewRoundSubmissionType(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="code">Code Submission</option>
                    <option value="document">Document Submission</option>
                    <option value="prototype">Prototype Demo</option>
                    <option value="presentation">Presentation</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAddRoundModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRound}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                  disabled={!newRoundName || !newRoundStartDate || !newRoundEndDate}
                >
                  Add Round
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Round Modal */}
      {isEditRoundModalOpen && currentRound && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">
                  Edit Round
                </h3>
                <button
                  onClick={() => setIsEditRoundModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Round Name
                  </label>
                  <input
                    type="text"
                    value={newRoundName}
                    onChange={(e) => setNewRoundName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRoundDescription}
                    onChange={(e) => setNewRoundDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={newRoundStartDate}
                      onChange={(e) => setNewRoundStartDate(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      value={newRoundEndDate}
                      onChange={(e) => setNewRoundEndDate(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Submission Type
                  </label>
                  <select
                    value={newRoundSubmissionType}
                    onChange={(e) => setNewRoundSubmissionType(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="code">Code Submission</option>
                    <option value="document">Document Submission</option>
                    <option value="prototype">Prototype Demo</option>
                    <option value="presentation">Presentation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Status
                  </label>
                  <div className="text-white bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                    {currentRound.status === 'completed' && "Completed"}
                    {currentRound.status === 'active' && "Active"}
                    {currentRound.status === 'upcoming' && "Upcoming"}
                    <span className="text-gray-500 text-sm ml-2">(Status can only be changed by advancing rounds)</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditRoundModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditRound}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                  disabled={!newRoundName || !newRoundStartDate || !newRoundEndDate}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Advance Round Modal */}
      {isConfirmAdvanceModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-900/30 text-indigo-400 mb-4">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {activeRound ? "Advance to Next Round" : "Start First Round"}
                </h3>
                <p className="text-gray-400">
                  {activeRound
                    ? "Are you sure you want to advance to the next round? The current round will be marked as completed."
                    : "Are you sure you want to start the first round of the hackathon?"
                  }
                </p>
              </div>

              <div className="bg-indigo-900/20 border border-indigo-600/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white">
                    {activeRound
                      ? "This action will finalize the current round and allow participants to submit to the next round. This action cannot be undone."
                      : "This will start the hackathon round and allow participants to submit their entries."
                    }
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsConfirmAdvanceModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdvanceRound}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  {activeRound ? "Advance Round" : "Start Round"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-subtle {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Rounds; 