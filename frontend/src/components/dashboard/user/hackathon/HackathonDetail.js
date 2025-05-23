import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { hackathonAPI } from '../../../../services/api';
import { roundResponseAPI, teamAPI } from '../../../../services/api';
import Confetti from 'react-confetti';
import EligibilityCheckStep from '../../../../pages/hackathons/registration/steps/EligibilityCheckStep';

const HackathonDetail = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [timers, setTimers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [submitMessage, setSubmitMessage] = useState({});
  const [customFieldResponses, setCustomFieldResponses] = useState({});
  const [roundStatuses, setRoundStatuses] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [teamRole, setTeamRole] = useState(null);
  const [showEligibilityCheck, setShowEligibilityCheck] = useState(false);
  const [eligibilityData, setEligibilityData] = useState({ branch: '', percentage: '' });
  const [eligibilityError, setEligibilityError] = useState('');
  const [isEligible, setIsEligible] = useState(false);

  // Add function to check team role
  const checkTeamRole = async () => {
    try {
      console.log('Checking team role for hackathon:', hackathonId);
      const response = await teamAPI.checkTeamRole(hackathonId);
      console.log('Team role response:', response.data);

      if (response.data && response.data.success) {
        setTeamRole(response.data.data);
      }
    } catch (error) {
      console.error(`Error checking team role for hackathon ${hackathonId}:`, error);
      setTeamRole({
        status: 'ERROR',
        message: 'Error checking team status',
        isRegistered: false,
        isTeamLeader: false,
        isTeamMember: false
      });
    }
  };

  useEffect(() => {
    if (!hackathonId) {
      setError('Hackathon ID is missing');
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      hackathonAPI.getHackathonById(hackathonId),
      checkTeamRole()
    ])
      .then(([res]) => {
        if (res.data && res.data.success) {
          console.log('Hackathon Data:', res.data.data);
          setHackathon(res.data.data);
        } else {
          setError('Hackathon not found');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching hackathon:', err);
        setError('Failed to fetch hackathon details');
        setLoading(false);
      });
  }, [hackathonId]);

  useEffect(() => {
    if (!hackathon || !hackathon.rounds) return;
    const interval = setInterval(() => {
      const now = new Date();
      const newTimers = {};
      hackathon.rounds.forEach((round, idx) => {
        if (round.status === 'active') {
          // Parse just the date part (YYYY-MM-DD) from endDate
          let datePart = round.endDate;
          if (datePart && datePart.includes('T')) {
            datePart = datePart.split('T')[0];
          }
          let endDateTime = datePart;
          if (round.endTime) {
            endDateTime = `${datePart}T${round.endTime}:00`;
          }
          const end = new Date(endDateTime);
          newTimers[idx] = Math.max(end - now, 0);
        }
      });
      setTimers(newTimers);
    }, 1000);
    return () => clearInterval(interval);
  }, [hackathon]);

  useEffect(() => {
    if (!hackathon || !hackathon.rounds) return;
    const fetchStatuses = async () => {
      const statuses = [];
      for (const round of hackathon.rounds) {
        try {
          const res = await roundResponseAPI.getResponse(hackathon._id, round._id || round.id);
          if (res.data) {
            statuses.push(res.data.status || 'draft');
            // Update submission status
            setSubmissionStatus(prev => ({
              ...prev,
              [round._id || round.id]: ['submitted', 'evaluated', 'reviewed', 'qualified', 'unqualified', 'awarded'].includes(res.data.status)
            }));
          } else {
            statuses.push('draft');
          }
        } catch (e) {
          statuses.push('draft');
        }
      }
      setRoundStatuses(statuses);
    };
    fetchStatuses();
  }, [hackathon]);

  // Add this effect to load existing responses
  useEffect(() => {
    if (!hackathon || !hackathon.rounds) return;

    const loadExistingResponses = async () => {
      for (const round of hackathon.rounds) {
        try {
          const response = await roundResponseAPI.getResponse(hackathon._id, round._id || round.id);
          if (response.data) {
            // Convert responses array to object format
            const responsesObj = {};
            response.data.responses.forEach(resp => {
              responsesObj[resp.fieldId] = resp.value;
            });
            setCustomFieldResponses(prev => ({
              ...prev,
              [round._id || round.id]: responsesObj
            }));
          }
        } catch (error) {
          // Ignore 404 errors (no response yet)
          if (error.response?.status !== 404) {
            console.error('Error loading response:', error);
          }
        }
      }
    };

    loadExistingResponses();
  }, [hackathon]);

  useEffect(() => {
    if (!hackathon || !hackathon.rounds) return;
    // Check if all rounds are completed and user is qualified in the last round
    const allCompleted = hackathon.rounds.every((r, idx) => roundStatuses[idx] && ['qualified', 'awarded'].includes(roundStatuses[idx]));
    if (allCompleted && hackathon.rounds.length > 0) {
      setShowCongrats(true);
    }
  }, [hackathon, roundStatuses]);

  // Add debug log for teamRole
  useEffect(() => {
    console.log('Team Role Data:', teamRole);
  }, [teamRole]);

  if (loading) return <div className="text-center text-gray-300 py-10">Loading...</div>;
  if (error) return (
    <div className="text-center py-10">
      <div className="text-red-400 mb-4">{error}</div>
      <Link to="/dashboard/user/hackathons" className="text-indigo-400 hover:text-indigo-300">
        ← Back to Hackathons
      </Link>
    </div>
  );
  if (!hackathon || !hackathon.rounds) return null;

  const handleManageTeam = () => {
    setIsTeamModalOpen(true);
  };

  const closeTeamModal = () => {
    setIsTeamModalOpen(false);
  };

  const addTeamMember = (email) => {
    // In a real app, this would send an invitation to the email
    console.log('Inviting team member:', email);

    // For demonstration purposes, add a mock member
    const updatedHackathon = { ...hackathon };
    const newMember = {
      id: `user-${updatedHackathon.team.members.length + 1}`,
      name: email.split('@')[0],
      role: 'Member',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email.split('@')[0]}`
    };

    updatedHackathon.team.members.push(newMember);
    setHackathon(updatedHackathon);
    return newMember;
  };

  const removeTeamMember = (memberId) => {
    // In a real app, this would remove the member from the team
    console.log('Removing team member:', memberId);

    const updatedHackathon = { ...hackathon };
    updatedHackathon.team.members = updatedHackathon.team.members.filter(
      member => member.id !== memberId
    );

    setHackathon(updatedHackathon);
  };

  // Helper for status badge
  const getStatusBadge = (status) => {
    let color = 'bg-gray-700 text-gray-300';
    if (status === 'pending') color = 'bg-yellow-900/70 text-yellow-300';
    if (status === 'approved') color = 'bg-green-900/70 text-green-300';
    if (status === 'rejected') color = 'bg-red-900/70 text-red-300';
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status.toUpperCase()}</span>;
  };

  // Add this function to handle ending a round
  const handleEndRound = async (idx) => {
    try {
      const round = hackathon.rounds[idx];
      const roundId = round._id || round.id;
      if (!roundId) return;
      // Call backend API to mark round as completed
      await hackathonAPI.completeRound(hackathon._id, roundId);
      // Update UI
      const updatedRounds = hackathon.rounds.map((r, i) =>
        i === idx ? { ...r, status: 'completed' } : r
      );
      setHackathon({ ...hackathon, rounds: updatedRounds });
    } catch (error) {
      alert('Failed to end round');
    }
  };

  // Helper to fetch latest hackathon data
  const fetchHackathon = async () => {
    setLoading(true);
    try {
      const res = await hackathonAPI.getHackathonById(hackathonId);
      if (res.data && res.data.success) {
        setHackathon(res.data.data);
      } else {
        setError('Hackathon not found');
      }
    } catch (e) {
      setError('Failed to fetch hackathon details');
    }
    setLoading(false);
  };

  // Helper to format time in AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return timeString;
    }
  };

  // Helper to format time left
  const formatTimeLeft = (ms) => {
    if (ms <= 0) return 'Ended';
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days > 0 ? days + 'd ' : ''}${hours}h ${minutes}m ${seconds}s`;
  };

  // Add this function to handle custom field input changes
  const handleCustomFieldChange = (roundId, fieldId, value) => {
    setCustomFieldResponses(prev => ({
      ...prev,
      [roundId]: {
        ...prev[roundId],
        [fieldId]: value
      }
    }));
  };

  // Helper: Should the form be editable?
  const isFormEditable = (status) => {
    return !status || status === 'draft';
  };

  // Helper: Should the round be accessible?
  const isRoundAccessible = (idx, roundStatuses) => {
    // First round is always accessible
    if (idx === 0) return true;

    const currentRound = hackathon.rounds[idx];
    const prevRound = hackathon.rounds[idx - 1];
    const prevRoundSubmitted = submissionStatus[prevRound._id || prevRound.id];
    const currentRoundSubmitted = submissionStatus[currentRound._id || currentRound.id];

    // If this round has been submitted, it should be accessible to view
    if (currentRoundSubmitted) {
      return true;
    }

    // If previous round is unqualified, block access
    if (roundStatuses[idx - 1] === 'unqualified') {
      return false;
    }

    // If previous round is submitted and current round is active/completed, allow access
    if (prevRoundSubmitted && (currentRound.status === 'active' || currentRound.status === 'completed')) {
      return true;
    }

    return false;
  };

  // Modify handleSubmitSolution to use roundResponseAPI
  const handleSubmitSolution = async (round) => {
    setSubmitting(prev => ({ ...prev, [round._id || round.id]: true }));
    setSubmitMessage(prev => ({ ...prev, [round._id || round.id]: '' }));

    try {
      const roundId = round._id || round.id;

      // Validate required fields
      const missingRequiredFields = round.customFields
        ?.filter(field => field.required)
        .filter(field => !customFieldResponses[roundId]?.[field.id]);

      if (missingRequiredFields?.length > 0) {
        setSubmitMessage(prev => ({
          ...prev,
          [roundId]: `Please fill in all required fields: ${missingRequiredFields.map(f => f.name).join(', ')}`
        }));
        setSubmitting(prev => ({ ...prev, [roundId]: false }));
        return;
      }

      // First save as draft to get response ID
      const submissionData = {
        hackathonId: hackathon._id,
        roundId: roundId,
        userId: JSON.parse(localStorage.getItem('user'))._id,
        teamId: hackathon.team?._id || null,
        responses: round.customFields?.map(field => {
          const response = {
            fieldId: field.id,
            fieldName: field.name,
            fieldType: field.type,
            required: field.required
          };

          // Handle different field types
          if (field.type === 'file') {
            // For file fields, set a placeholder value that will be updated after file upload
            response.value = 'pending_upload';
          } else if (field.type === 'checkbox') {
            response.value = customFieldResponses[roundId]?.[field.id] || [];
          } else {
            response.value = customFieldResponses[roundId]?.[field.id] || '';
          }

          return response;
        }) || []
      };

      console.log('Submitting data:', submissionData); // Debug log

      const saveResponse = await roundResponseAPI.saveResponse(submissionData);

      if (saveResponse.data) {
        // Upload files if any
        const fileUploadPromises = round.customFields
          ?.filter(field => field.type === 'file' && customFieldResponses[roundId]?.[field.id])
          .map(async field => {
            const file = customFieldResponses[roundId][field.id];
            if (file instanceof File) {
              try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('fieldId', field.id);

                await roundResponseAPI.uploadFile(saveResponse.data._id, formData);
              } catch (error) {
                console.error('Error uploading file:', error);
                throw new Error(`Failed to upload file for ${field.name}`);
              }
            }
          });

        if (fileUploadPromises?.length > 0) {
          await Promise.all(fileUploadPromises);
        }

        // Then submit the response
        const submitResponse = await roundResponseAPI.submitResponse(saveResponse.data._id);

        if (submitResponse.data) {
          setSubmissionStatus(prev => ({
            ...prev,
            [roundId]: true
          }));
          setSubmitMessage(prev => ({
            ...prev,
            [roundId]: 'Your submission is recorded. Please wait for the result.'
          }));

          // Clear the form after successful submission
          setCustomFieldResponses(prev => ({
            ...prev,
            [roundId]: {}
          }));
        }
      }
    } catch (e) {
      console.error('Submission error:', e);
      setSubmitMessage(prev => ({
        ...prev,
        [round._id || round.id]: e?.response?.data?.message || 'Submission failed. Please try again.'
      }));
    }

    setSubmitting(prev => ({ ...prev, [round._id || round.id]: false }));
  };

  // Handle eligibility check result
  const handleEligibilityResult = (result) => {
    if (result.error) {
      setEligibilityError(result.error);
    } else {
      // User is eligible, proceed to registration
      setShowEligibilityCheck(false);
      navigate(`/hackathon/register/${hackathonId}`);
    }
  };

  // Update the registration button click handler
  const handleRegisterClick = () => {
    if (hackathon.eligibility && hackathon.eligibility.includes('Students Only')) {
      setShowEligibilityCheck(true);
    } else {
      navigate(`/hackathon/register/${hackathonId}`);
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Team Management Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-white font-medium">Manage Team</h3>
              <button onClick={closeTeamModal} className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Team Members</h4>
              <div className="space-y-2 mb-4">
                {hackathon.team.members.map(member => (
                  <div key={member.id} className="flex items-center justify-between bg-gray-700/50 rounded p-2">
                    <div className="flex items-center">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full mr-2" />
                      <div>
                        <div className="text-sm text-white">{member.name}</div>
                        <div className="text-xs text-gray-400">{member.role}</div>
                      </div>
                    </div>
                    {hackathon.team.isLeader && member.id !== hackathon.team.members[0]?.id && (
                      <button
                        onClick={() => removeTeamMember(member.id)}
                        className="text-xs px-2 py-1 bg-red-900/50 text-red-300 rounded hover:bg-red-800/50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {hackathon.team.isLeader && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Invite New Member</h4>
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const email = e.target.email.value;
                      if (email) {
                        addTeamMember(email);
                        e.target.email.value = '';
                      }
                    }}
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="flex-grow px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-500"
                    >
                      Invite
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={closeTeamModal}
                className="px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="max-w-4xl mx-auto py-8 px-2">
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl shadow-lg border border-gray-700/40 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 flex items-center">
                {hackathon.title}
                <span className="ml-3">{getStatusBadge(hackathon.status)}</span>
              </h2>
              <p className="text-gray-400">by {hackathon.organizer}</p>
            </div>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-800/60 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-400 mb-1">Prize Money</div>
              <div className="text-lg font-bold text-cyan-300">₹{hackathon.prize}</div>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-400 mb-1">Registration Type</div>
              <div className="text-lg font-bold text-cyan-300">{hackathon.locationType}</div>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-400 mb-1">Registration Fee</div>
              <div className="text-lg font-bold text-cyan-300">₹{hackathon.registrationFees?.['1'] || 0}</div>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-400 mb-1">Time Left</div>
              <div className="text-lg font-bold text-cyan-300">7 days remaining</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-900/70 rounded-xl border border-gray-700/40 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-cyan-300">Team Information</h3>
          </div>

          {teamRole && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Team Status</span>
                <span className={`px-2 py-0.5 rounded-full ${teamRole.status === 'TEAM_LEADER' ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30' :
                  teamRole.status === 'TEAM_MEMBER' ? 'bg-blue-900/50 text-blue-300 border border-blue-500/30' :
                    teamRole.status === 'REGISTERED_NO_TEAM' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30' :
                      'bg-gray-900/50 text-gray-300 border border-gray-500/30'
                  }`}>
                  {teamRole.message}
                </span>
              </div>

              {teamRole.team && (
                <div className="text-sm text-gray-400">
                  <div className="flex justify-between items-center mb-2">
                    <span>Team: {teamRole.team.teamName}</span>
                  </div>
                  <div>
                    <span>Members: {teamRole.team.currentSize}/{teamRole.team.maxSize}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Team Members List */}
          {teamRole?.team?.teammates && teamRole.team.teammates.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {teamRole.team.teammates.map(teammate => (
                <div key={teammate.id} className="bg-gray-800/60 rounded-lg p-4">
                  <div className="flex items-center">
                    <img
                      src={teammate.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teammate.id}`}
                      alt={teammate.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{teammate.name}</div>
                          <div className="text-sm text-gray-400">{teammate.email}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${teammate.role === 'leader'
                          ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-900/50 text-blue-300 border border-blue-500/30'
                          }`}>
                          {teammate.role === 'leader' ? 'Team Leader' : 'Member'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Joined: {new Date(teammate.joinedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">
              No team members found
            </div>
          )}
        </div>

        {/* Problem Statement */}
        <div className="bg-gray-900/70 rounded-xl border border-gray-700/40 p-6 mb-6">
          <h3 className="text-lg font-semibold text-cyan-300 mb-2">Problem Statement</h3>
          <div className="text-gray-200">{hackathon.longDescription || hackathon.description}</div>
        </div>

        {/* Rounds Section */}
        <div className="bg-gray-900/70 rounded-xl border border-gray-700/40 p-6 mb-3">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4">Rounds</h3>

          {/* Progress Tracker */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-300">Progress</h4>
              <span className="text-sm text-cyan-400">{hackathon.rounds.filter(r => r.status === 'completed').length} of {hackathon.rounds.length} rounds completed</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-500"
                style={{
                  width: `${(hackathon.rounds.filter(r => r.status === 'completed').length / hackathon.rounds.length) * 100}%`
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-6">
            {hackathon && hackathon.rounds && hackathon.rounds.length > 0 ? (
              (() => {
                // Find the first unqualified round index
                const firstUnqualifiedIdx = roundStatuses.findIndex(status => status === 'unqualified');
                // If user is unqualified, only show rounds up to and including that round
                const visibleRounds = firstUnqualifiedIdx !== -1
                  ? hackathon.rounds.slice(0, firstUnqualifiedIdx + 1)
                  : hackathon.rounds;
                return visibleRounds.map((round, idx) => {
                  const status = roundStatuses[idx];
                  const accessible = isRoundAccessible(idx, roundStatuses);
                  const locked = !isFormEditable(status);
                  const isUnqualified = status === 'unqualified';
                  const isActive = round.status === 'active';
                  const isCompleted = round.status === 'completed';
                  const hasSubmitted = submissionStatus[round._id || round.id];

                  return (
                    <div key={idx} className={`bg-gray-800/60 rounded-lg p-6 ${!accessible ? 'opacity-50 pointer-events-none' : ''}`}>
                      {/* Round Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-semibold">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white">{round.name}</h4>
                            <div className="text-sm text-gray-400">
                              {isCompleted ? (
                                <span className="text-green-400">Completed</span>
                              ) : isActive ? (
                                <span className="text-cyan-400">In Progress</span>
                              ) : (
                                <span className="text-gray-400">Upcoming</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          Deadline: {round.endDate ? new Date(round.endDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>

                      {/* Round Description */}
                      {round.description && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-300 mb-2">Description</h5>
                          <div className="bg-gray-900/50 rounded-lg p-4 text-gray-200">{round.description}</div>
                        </div>
                      )}

                      {/* Start/End Date & Time */}
                      <div className="mb-4 flex gap-4">
                        <div>
                          <span className="text-xs text-gray-400">Start:</span>
                          <span className="ml-1 text-sm text-white">
                            {round.startDate ? new Date(round.startDate).toLocaleDateString() : 'N/A'}
                            {round.startTime ? `, ${formatTime(round.startTime)}` : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">End:</span>
                          <span className="ml-1 text-sm text-white">
                            {round.endDate ? new Date(round.endDate).toLocaleDateString() : 'N/A'}
                            {round.endTime ? `, ${formatTime(round.endTime)}` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Submission Status */}
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Submission Status</h5>
                        {(() => {
                          if (round.status === 'upcoming') {
                            return (
                              <div>
                                <span className="text-yellow-400">Coming Soon</span>
                                <div className="text-sm text-gray-400 mt-1">
                                  Starts on {new Date(round.startDate).toLocaleDateString()}
                                  {round.startTime ? ` at ${formatTime(round.startTime)}` : ''}
                                </div>
                              </div>
                            );
                          } else if (round.status === 'active') {
                            return hasSubmitted ? (
                              <span className="text-green-400">Submitted</span>
                            ) : (
                              <span className="text-red-400">Not Submitted</span>
                            );
                          } else if (round.status === 'completed') {
                            return hasSubmitted ? (
                              <span className="text-green-400">Submitted</span>
                            ) : (
                              <span className="text-red-400">Not Submitted - Round Ended</span>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      {/* Submission Message */}
                      {submitMessage[round._id || round.id] && (
                        <div className="mt-2 text-sm text-gray-300">
                          {submitMessage[round._id || round.id]}
                        </div>
                      )}

                      {/* Round Status Message */}
                      {!accessible ? (
                        <div className="mt-2 p-2 bg-red-900/30 border border-red-700/30 rounded text-red-300 text-sm">
                          {round.status === 'upcoming'
                            ? 'This round has not started yet.'
                            : !submissionStatus[hackathon.rounds[idx - 1]?._id || hackathon.rounds[idx - 1]?.id]
                              ? 'Complete the previous round to unlock this round.'
                              : 'This round is not yet accessible.'}
                        </div>
                      ) : hasSubmitted ? (
                        <div className="mb-4 font-semibold">
                          {status === 'qualified' && (
                            <span className="text-green-400">Congratulations! You are qualified for the next round.</span>
                          )}
                          {status === 'unqualified' && round.status === 'completed' && (
                            <span className="text-red-400">You are not qualified for the next round. Better luck next time.</span>
                          )}
                          {status === 'evaluated' && (
                            <span className="text-blue-400">Your submission has been evaluated.</span>
                          )}
                          {status === 'reviewed' && (
                            <span className="text-blue-400">Your submission has been reviewed.</span>
                          )}
                          {status === 'awarded' && (
                            <span className="text-yellow-400">Congratulations! You have been awarded for this round!</span>
                          )}
                          {status === 'submitted' && (
                            <span className="text-green-400">Your submission is recorded. Please wait for the result.</span>
                          )}
                          {!status && round.status === 'completed' && (
                            <span className="text-gray-400">This round has been completed.</span>
                          )}
                        </div>
                      ) : round.status === 'active' && isFormEditable(status) ? (
                        <div className="mb-4 flex flex-col gap-2">
                          {round.platformLink && (
                            <a
                              href={round.platformLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                const uuid = round.platformLink.split('/').pop();
                                console.log('Test ID:', uuid);
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                            >
                              Access Platform
                            </a>
                          )}
                          {teamRole?.status === 'TEAM_LEADER' ? (
                            <div className="space-y-4">
                              {round.customFields && round.customFields.length > 0 && (
                                <div className="space-y-4 bg-gray-800/50 rounded-lg p-4">
                                  <h5 className="text-sm font-medium text-gray-300">Submission Details</h5>
                                  {round.customFields.map((field) => (
                                    <div key={field.id} className="space-y-2">
                                      <label className="block text-sm font-medium text-gray-300">
                                        {field.name} {field.required && <span className="text-red-500">*</span>}
                                      </label>
                                      {field.type === 'text' && (
                                        <input
                                          type="text"
                                          value={customFieldResponses[round._id || round.id]?.[field.id] || ''}
                                          onChange={(e) => handleCustomFieldChange(round._id || round.id, field.id, e.target.value)}
                                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                          placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                                        />
                                      )}
                                      {field.type === 'textarea' && (
                                        <textarea
                                          value={customFieldResponses[round._id || round.id]?.[field.id] || ''}
                                          onChange={(e) => handleCustomFieldChange(round._id || round.id, field.id, e.target.value)}
                                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                          rows="4"
                                          placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                                        />
                                      )}
                                      {field.type === 'file' && (
                                        <input
                                          type="file"
                                          onChange={(e) => handleCustomFieldChange(round._id || round.id, field.id, e.target.files[0])}
                                          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                                          accept={field.accept || '*/*'}
                                        />
                                      )}
                                      {field.type === 'url' && (
                                        <input
                                          type="url"
                                          value={customFieldResponses[round._id || round.id]?.[field.id] || ''}
                                          onChange={(e) => handleCustomFieldChange(round._id || round.id, field.id, e.target.value)}
                                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                          placeholder={field.placeholder || "Enter URL"}
                                        />
                                      )}
                                      {field.description && (
                                        <p className="text-sm text-gray-400">{field.description}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <button
                                onClick={() => handleSubmitSolution(round)}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors shadow-lg hover:shadow-green-500/20"
                                disabled={submitting[round._id || round.id]}
                              >
                                {submitting[round._id || round.id] ? 'Submitting...' : 'Submit Solution'}
                              </button>
                            </div>
                          ) : (
                            <div className="text-yellow-400 text-sm bg-yellow-900/30 p-3 rounded-lg border border-yellow-700/30">
                              Only the team leader can submit solutions for this round.
                            </div>
                          )}
                        </div>
                      ) : round.status === 'completed' ? (
                        <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-700/30 rounded text-yellow-300 text-sm">
                          This round has ended. You missed the submission deadline.
                        </div>
                      ) : round.status === 'upcoming' ? (
                        <div className="mt-2 p-2 bg-blue-900/30 border border-blue-700/30 rounded text-blue-300 text-sm">
                          This round will start on {new Date(round.startDate).toLocaleDateString()}
                          {round.startTime ? ` at ${formatTime(round.startTime)}` : ''}
                        </div>
                      ) : null}
                    </div>
                  );
                });
              })()
            ) : (
              <div className="text-center text-gray-400">No rounds available</div>
            )}
          </div>
        </div>
      </div>

      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={400} recycle={false} />
          <div className="bg-white rounded-xl shadow-2xl p-10 flex flex-col items-center max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-green-600 mb-4 text-center">Congratulations!</h2>
            <p className="text-lg text-gray-700 mb-6 text-center">You have successfully completed all rounds of the hackathon!</p>
            <button
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold shadow"
              onClick={() => setShowCongrats(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Register button if not already registered */}
      {!teamRole?.isRegistered && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleRegisterClick}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors"
          >
            Register Now
          </button>
        </div>
      )}

      {/* Show EligibilityCheckStep if needed */}
      {showEligibilityCheck && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg">
            <EligibilityCheckStep
              hackathon={hackathon}
              nextStep={handleEligibilityResult}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HackathonDetail;