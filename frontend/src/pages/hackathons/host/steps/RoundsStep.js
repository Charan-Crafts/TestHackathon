import React, { useState, useEffect, useRef } from 'react';

function RoundsStep({ formData, updateFormData, nextStep, prevStep, isNavigating }) {
  const [errors, setErrors] = useState({});
  const [rounds, setRounds] = useState(formData.rounds || []);
  const [evaluationCriteria, setEvaluationCriteria] = useState(formData.evaluationCriteria || []);
  const roundsContainerRef = useRef(null);
  const [lastAddedRoundIndex, setLastAddedRoundIndex] = useState(-1);

  // Scroll to the newly added round
  useEffect(() => {
    if (lastAddedRoundIndex >= 0 && roundsContainerRef.current) {
      const roundElements = roundsContainerRef.current.querySelectorAll('.round-item');
      if (roundElements[lastAddedRoundIndex]) {
        roundElements[lastAddedRoundIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Reset the index after scrolling
      setTimeout(() => setLastAddedRoundIndex(-1), 1000);
    }
  }, [lastAddedRoundIndex]);

  // Add a new custom round
  const handleAddRound = () => {
    const newRound = {
      id: `round-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '06:00',
      endTime: '21:00',
      evaluationCriteria: [],
      type: 'hackathon',
      platformLink: '',
      submissionType: 'github', // Default submission type
      status: 'pending' // Always pending by default
    };
    const updatedRounds = [...rounds, newRound];
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });

    // Animate the newly added round
    setLastAddedRoundIndex(updatedRounds.length - 1);

    // Auto-scroll to new round with animation
    setTimeout(() => {
      if (roundsContainerRef.current) {
        const roundElements = roundsContainerRef.current.querySelectorAll('.round-item');
        if (roundElements[updatedRounds.length - 1]) {
          roundElements[updatedRounds.length - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }, 100);
  };

  // Remove a round
  const handleRemoveRound = (index) => {
    const updatedRounds = rounds.filter((_, i) => i !== index);
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });

    // Clear maxRounds error if we're below the limit again
    if (errors.maxRounds && updatedRounds.length < 8) {
      setErrors({ ...errors, maxRounds: null });
    }
  };

  // Update a round's field
  const handleRoundChange = (index, field, value) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === index) {
        return { ...round, [field]: value };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  // Handle round type change
  const handleRoundTypeChange = (index, type) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === index) {
        return { ...round, type };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  // Add evaluation criteria to a round
  const handleAddEvaluationCriteria = (roundIndex) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        return {
          ...round,
          evaluationCriteria: [...(round.evaluationCriteria || []), { name: '', weight: 0 }]
        };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  // Remove evaluation criteria from a round
  const handleRemoveEvaluationCriteria = (roundIndex, criteriaIndex) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        return {
          ...round,
          evaluationCriteria: round.evaluationCriteria.filter((_, j) => j !== criteriaIndex)
        };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  // Update evaluation criteria
  const handleEvaluationCriteriaChange = (roundIndex, criteriaIndex, field, value) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        const updatedCriteria = round.evaluationCriteria.map((criteria, j) => {
          if (j === criteriaIndex) {
            return { ...criteria, [field]: value };
          }
          return criteria;
        });
        return { ...round, evaluationCriteria: updatedCriteria };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  // Sort rounds by start date
  const sortRounds = () => {
    if (!rounds || rounds.length <= 1) return;

    const sortedRounds = [...rounds].sort((a, b) => {
      return new Date(a.startDate) - new Date(b.startDate);
    });

    setRounds(sortedRounds);
    updateFormData({ rounds: sortedRounds });
  };

  // Apply a template from predefined round templates
  const applyTemplate = (templateIndex) => {
    const template = formData.roundTemplates[templateIndex];

    // Set default dates if available in the form data
    let startDate = '';
    let endDate = '';

    if (formData.startDate) {
      // For pre-hackathon, use a date before the main event
      // For post-hackathon, use a date after the main event
      // For hackathon, use the main event dates
      if (template.type === 'pre-hackathon' && formData.startDate) {
        const mainStart = new Date(formData.startDate);
        mainStart.setDate(mainStart.getDate() - 7); // Default to 1 week before
        startDate = mainStart.toISOString().split('T')[0];

        const mainEnd = new Date(formData.startDate);
        mainEnd.setDate(mainEnd.getDate() - 1); // End the day before hackathon
        endDate = mainEnd.toISOString().split('T')[0];
      }
      else if (template.type === 'post-hackathon' && formData.endDate) {
        const mainEnd = new Date(formData.endDate);
        mainEnd.setDate(mainEnd.getDate() + 1); // Start the day after hackathon
        startDate = mainEnd.toISOString().split('T')[0];

        const postEnd = new Date(formData.endDate);
        postEnd.setDate(postEnd.getDate() + 7); // Default to 1 week after
        endDate = postEnd.toISOString().split('T')[0];
      }
      else if (template.type === 'hackathon') {
        startDate = formData.startDate;
        endDate = formData.endDate;
      }
    }

    const newRound = {
      id: `round-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: template.name,
      description: template.description,
      type: template.type || 'hackathon',
      startDate: startDate,
      endDate: endDate,
      startTime: template.startTime || '09:00',
      endTime: template.endTime || '18:00',
      evaluationCriteria: [],
      status: 'pending', // Always pending by default
      customFields: template.defaultFields ? template.defaultFields.map(field => ({
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: field.name,
        type: field.type,
        required: field.required,
        options: field.options || [],
        order: template.defaultFields.indexOf(field)
      })) : []
    };

    const updatedRounds = [...rounds, newRound];
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });

    // Set last added round index for scrolling
    setLastAddedRoundIndex(updatedRounds.length - 1);
  };

  // Safely parse a date string
  const safeParseDate = (dateStr, timeStr = '') => {
    if (!dateStr) return null;

    try {
      // If time is provided, combine date and time
      const dateTimeStr = timeStr ? `${dateStr}T${timeStr}` : dateStr;
      const date = new Date(dateTimeStr);

      // Check if date is valid
      return !isNaN(date.getTime()) ? date : null;
    } catch (error) {
      console.error("Invalid date format:", error);
      return null;
    }
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Skip validation if navigating (coming from another step)
    if (isNavigating) {
      nextStep();
      return;
    }

    // Check if we have at least one round defined
    if (rounds.length === 0) {
      setErrors({ rounds: "Please define at least one round for your hackathon" });
      return;
    }

    // Validate dates if needed
    const newErrors = {};
    let hasDateError = false;

    rounds.forEach((round, index) => {
      // Required fields check
      if (!round.name) {
        newErrors[`round_${index}_name`] = "Round name is required";
        hasDateError = true;
      }

      if (!round.startDate) {
        newErrors[`round_${index}_startDate`] = "Start date is required";
        hasDateError = true;
      }

      if (!round.endDate) {
        newErrors[`round_${index}_endDate`] = "End date is required";
        hasDateError = true;
      }

      // Validate platform link for Coding and Aptitude rounds
      if ((round.name === "Coding Round" || round.name === "Aptitude Round") && !round.platformLink) {
        newErrors[`round_${index}_platformLink`] = "Platform link is required for this round";
        hasDateError = true;
      }

      if (round.startDate && round.endDate) {
        // Create proper date objects with times
        const startDateTime = safeParseDate(round.startDate, round.startTime || '00:00');
        const endDateTime = safeParseDate(round.endDate, round.endTime || '23:59');

        // If either date is invalid, show error
        if (!startDateTime || !endDateTime) {
          newErrors[`round_${index}_dates`] = "Invalid date format";
          hasDateError = true;
        } else if (startDateTime > endDateTime) {
          // Check if start date is before end date
          newErrors[`round_${index}_dates`] = "Start date/time must be before end date/time";
          hasDateError = true;
        }

        // Get hackathon start/end as date objects
        if (formData.startDate && formData.endDate) {
          const hackathonStart = safeParseDate(formData.startDate);
          const hackathonEnd = safeParseDate(formData.endDate, '23:59:59');

          if (hackathonStart && hackathonEnd) {
            // Only validate dates for 'hackathon' type rounds
            if (round.type === 'hackathon') {
              if (startDateTime < hackathonStart || endDateTime > hackathonEnd) {
                newErrors[`round_${index}_range`] = "Main event round dates must be within hackathon start and end dates";
                hasDateError = true;
              }
            }
          }
        }
      }
    });

    if (hasDateError) {
      setErrors(newErrors);
      return;
    }

    // Proceed to next step
    nextStep();
  };

  // Add a new custom field to a round
  const handleAddCustomField = (roundIndex) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        const existingFields = round.customFields || [];
        return {
          ...round,
          customFields: [...existingFields, {
            id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: '',
            type: 'text',
            required: false,
            options: [],
            order: existingFields.length
          }]
        };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  // Update a custom field
  const handleCustomFieldChange = (roundIndex, fieldIndex, field, value) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        const updatedFields = round.customFields.map((customField, j) => {
          if (j === fieldIndex) {
            // If changing type to non-option type, clear options
            if (field === 'type' && !['multiple_choice', 'checkbox', 'dropdown'].includes(value)) {
              return { ...customField, [field]: value, options: [] };
            }
            return { ...customField, [field]: value };
          }
          return customField;
        });
        return { ...round, customFields: updatedFields };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  // Add an option to a field
  const handleAddFieldOption = (roundIndex, fieldIndex) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        const updatedFields = round.customFields.map((field, j) => {
          if (j === fieldIndex) {
            return {
              ...field,
              options: [...(field.options || []), '']
            };
          }
          return field;
        });
        return { ...round, customFields: updatedFields };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  // Remove a custom field
  const handleRemoveCustomField = (roundIndex, fieldIndex) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        const updatedFields = round.customFields.filter((_, j) => j !== fieldIndex)
          .map((field, newIndex) => ({
            ...field,
            order: newIndex
          }));
        return { ...round, customFields: updatedFields };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  // Update field order
  const handleFieldOrderChange = (roundIndex, fieldIndex, direction) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        const fields = [...round.customFields];
        const newIndex = fieldIndex + direction;

        if (newIndex >= 0 && newIndex < fields.length) {
          // Swap orders
          const temp = fields[fieldIndex].order;
          fields[fieldIndex].order = fields[newIndex].order;
          fields[newIndex].order = temp;

          // Swap positions
          [fields[fieldIndex], fields[newIndex]] = [fields[newIndex], fields[fieldIndex]];
        }

        return { ...round, customFields: fields };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  // Remove an option from a field
  const handleRemoveFieldOption = (roundIndex, fieldIndex, optionIndex) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        const updatedFields = round.customFields.map((field, j) => {
          if (j === fieldIndex) {
            return {
              ...field,
              options: field.options.filter((_, k) => k !== optionIndex)
            };
          }
          return field;
        });
        return { ...round, customFields: updatedFields };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  // Update a field option
  const handleFieldOptionChange = (roundIndex, fieldIndex, optionIndex, value) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        const updatedFields = round.customFields.map((field, j) => {
          if (j === fieldIndex) {
            const updatedOptions = field.options.map((option, k) => {
              if (k === optionIndex) {
                return value;
              }
              return option;
            });
            return { ...field, options: updatedOptions };
          }
          return field;
        });
        return { ...round, customFields: updatedFields };
      }
      return round;
    });
    setRounds(updatedRounds);
    updateFormData({ rounds: updatedRounds });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Title Section */}
      <div className="mb-6 transform transition-all duration-500 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
          Timeline Configuration
        </h2>
        <p className="text-gray-300">
          Define the timeline rounds for your hackathon to give participants a clear schedule of events.
        </p>
      </div>

      <div className="p-5 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-xl border border-cyan-500/30 mb-6 transform transition-all duration-500 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
        <h3 className="text-lg font-medium text-cyan-300 mb-3">How It Works</h3>
        <p className="text-white text-sm">
          Break your hackathon into rounds to give participants a clear schedule.
          Each round represents a distinct phase of your hackathon (e.g., Registration, Ideation, Development, Judging).
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-500/20 transition-all duration-300 hover:border-cyan-500/40 hover:bg-gray-900/70">
            <div className="flex items-start">
              <div className="bg-cyan-900/50 p-1 rounded-full mr-3 mt-0.5">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-cyan-100">
                <span className="font-medium">Define up to 8 rounds</span> - Create pre-hackathon, main, and post-hackathon phases
              </p>
            </div>
          </div>
          <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-500/20 transition-all duration-300 hover:border-cyan-500/40 hover:bg-gray-900/70">
            <div className="flex items-start">
              <div className="bg-cyan-900/50 p-1 rounded-full mr-3 mt-0.5">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-cyan-100">
                <span className="font-medium">Configure evaluation criteria</span> - Define how projects will be judged in each round
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Round Templates - organized by type */}
      <div className="mb-6 transition-all duration-300 hover:shadow-md hover:shadow-cyan-500/10 rounded-lg p-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-cyan-300">Common Round Templates</h3>
          {rounds.length > 0 && (
            <button
              type="button"
              onClick={sortRounds}
              className="px-3 py-1.5 text-sm bg-gray-800/70 text-cyan-400 hover:bg-gray-700/70 rounded-lg font-medium transition-all duration-300 border border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/20 transform hover:translate-y-[-2px]"
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort by Date
              </span>
            </button>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-3">
          Click on a template to add it to your rounds (dates will still need to be set):
        </p>

        {/* Pre-Hackathon Templates */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-blue-400 mb-2">Pre-Hackathon Phases</h4>
          <div className="flex flex-wrap gap-2">
            {formData.roundTemplates
              .filter(template => template.type === 'pre-hackathon')
              .map((template, index) => (
                <button
                  key={`pre-${index}`}
                  type="button"
                  onClick={() => applyTemplate(formData.roundTemplates.indexOf(template))}
                  className="px-3 py-1.5 text-sm bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 rounded-lg border border-blue-500/30 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transform hover:translate-y-[-2px]"
                >
                  {template.name}
                </button>
              ))}
          </div>
        </div>

        {/* Main Hackathon Templates */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-cyan-400 mb-2">Main Hackathon Phases</h4>
          <div className="flex flex-wrap gap-2">
            {formData.roundTemplates
              .filter(template => template.type === 'hackathon')
              .map((template, index) => (
                <button
                  key={`main-${index}`}
                  type="button"
                  onClick={() => applyTemplate(formData.roundTemplates.indexOf(template))}
                  className="px-3 py-1.5 text-sm bg-gray-800/70 hover:bg-gray-700/70 text-cyan-300 rounded-lg border border-cyan-500/30 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transform hover:translate-y-[-2px]"
                >
                  {template.name}
                </button>
              ))}
          </div>
        </div>

        {/* Post-Hackathon Templates */}
        <div>
          <h4 className="text-md font-medium text-purple-400 mb-2">Post-Hackathon Phases</h4>
          <div className="flex flex-wrap gap-2">
            {formData.roundTemplates
              .filter(template => template.type === 'post-hackathon')
              .map((template, index) => (
                <button
                  key={`post-${index}`}
                  type="button"
                  onClick={() => applyTemplate(formData.roundTemplates.indexOf(template))}
                  className="px-3 py-1.5 text-sm bg-purple-900/30 hover:bg-purple-800/50 text-purple-300 rounded-lg border border-purple-500/30 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transform hover:translate-y-[-2px]"
                >
                  {template.name}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Custom Rounds */}
      <div ref={roundsContainerRef} className="space-y-6">
        {rounds.map((round, index) => (
          <div key={index}
            className={`bg-gray-900/40 rounded-lg border ${errors[`round_${index}_dates`] || errors[`round_${index}_range`] || errors[`round_${index}_name`] || errors[`round_${index}_startDate`] || errors[`round_${index}_endDate`] ? 'border-red-500/50' : 'border-cyan-500/20'} p-6 round-item transition-all duration-500 
            ${lastAddedRoundIndex === index ? 'animate-pulse bg-cyan-900/10 border-cyan-400/50' : 'hover:border-cyan-500/50 hover:bg-gray-900/60 hover:shadow-lg hover:shadow-cyan-500/10'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <h3 className="text-xl font-medium text-white">Round {index + 1}</h3>
                {(errors[`round_${index}_dates`] || errors[`round_${index}_range`] || errors[`round_${index}_name`] || errors[`round_${index}_startDate`] || errors[`round_${index}_endDate`]) && (
                  <div className="ml-2 text-red-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveRound(index)}
                className="ml-4 p-1.5 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition-all duration-300 hover:text-red-300 transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                <h4 className="text-lg font-medium text-cyan-300 mb-4">Basic Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Round Name *</label>
                    <input
                      type="text"
                      value={round.name || ''}
                      onChange={(e) => handleRoundChange(index, 'name', e.target.value)}
                      className={`w-full px-4 py-2 bg-gray-900/80 border ${errors[`round_${index}_name`] ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all duration-300`}
                      placeholder="e.g., Registration, Development, Judging"
                    />
                    {errors[`round_${index}_name`] && <p className="mt-1 text-sm text-red-500">{errors[`round_${index}_name`]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Round Description *</label>
                    <textarea
                      value={round.description || ''}
                      onChange={(e) => handleRoundChange(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all duration-300 min-h-[100px]"
                      placeholder={
                        round.name === "Registration" ? "Describe what information participants need to provide during registration. What are the eligibility criteria? What documents are required?"
                          : round.name === "Idea Submission" ? "Explain what kind of ideas you're looking for. What should participants include in their submissions? What are the evaluation criteria?"
                            : round.name === "Idea Evaluation" ? "Describe how ideas will be evaluated. What aspects will judges look at? What is the scoring criteria?"
                              : round.name === "Prototype Submission" ? "Specify what constitutes a valid prototype. What should participants include? What are the technical requirements?"
                                : round.name === "Technical Review" ? "Explain what technical aspects will be reviewed. What are the code quality standards? What documentation is required?"
                                  : round.name === "Final Project Submission" ? "Detail what final deliverables are expected. What should the submission include? What are the format requirements?"
                                    : round.name === "Pitching Round" ? "Describe the pitching format. How long should presentations be? What should teams cover in their pitch?"
                                      : round.name === "Final Judging" ? "Explain the judging criteria. How will projects be evaluated? What aspects are most important?"
                                        : round.name === "Coding Round" ? "Specify the coding assessment format. What types of problems will be included? What programming languages are allowed?"
                                          : round.name === "Aptitude Round" ? "Describe the aptitude test format. What topics will be covered? How long will the test be?"
                                            : "Describe what this round is about, what participants need to do, and what they should expect."
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Submission Type *</label>
                    <select
                      value={round.submissionType || 'github'}
                      onChange={(e) => handleRoundChange(index, 'submissionType', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all duration-300"
                    >
                      <option value="github">GitHub Repository</option>
                      <option value="file">File Upload</option>
                      <option value="pdf">PDF Document</option>
                      <option value="video">Video Submission</option>
                      <option value="assessment">Proctored Assessment</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Platform Section */}
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                <h4 className="text-lg font-medium text-cyan-300 mb-4">Platform Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Platform Link {round.name === "Coding Round" || round.name === "Aptitude Round" ? "*" : "(Optional)"}
                    </label>
                    <input
                      type="url"
                      value={round.platformLink || ''}
                      onChange={(e) => handleRoundChange(index, 'platformLink', e.target.value)}
                      className={`w-full px-4 py-2 bg-gray-900/80 border ${errors[`round_${index}_platformLink`] ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all duration-300`}
                      placeholder="e.g., https://eval8.ai for coding and aptitude"
                    />
                    {errors[`round_${index}_platformLink`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`round_${index}_platformLink`]}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                <h4 className="text-lg font-medium text-cyan-300 mb-4">Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={round.startDate || ''}
                      onChange={(e) => handleRoundChange(index, 'startDate', e.target.value)}
                      className={`w-full px-4 py-2 bg-gray-900/80 border ${errors[`round_${index}_startDate`] || errors[`round_${index}_dates`] || errors[`round_${index}_range`] ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
                    />
                    {errors[`round_${index}_startDate`] && <p className="mt-1 text-sm text-red-500">{errors[`round_${index}_startDate`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">End Date *</label>
                    <input
                      type="date"
                      value={round.endDate || ''}
                      onChange={(e) => handleRoundChange(index, 'endDate', e.target.value)}
                      className={`w-full px-4 py-2 bg-gray-900/80 border ${errors[`round_${index}_endDate`] || errors[`round_${index}_dates`] || errors[`round_${index}_range`] ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
                    />
                    {errors[`round_${index}_endDate`] && <p className="mt-1 text-sm text-red-500">{errors[`round_${index}_endDate`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={round.startTime || '06:00'}
                      onChange={(e) => handleRoundChange(index, 'startTime', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                    <input
                      type="time"
                      value={round.endTime || '21:00'}
                      onChange={(e) => handleRoundChange(index, 'endTime', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    />
                  </div>
                </div>
                {(errors[`round_${index}_dates`] || errors[`round_${index}_range`]) && (
                  <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {errors[`round_${index}_dates`] || errors[`round_${index}_range`]}
                    </p>
                  </div>
                )}
              </div>

              {/* Custom Fields Section */}
              <div className="bg-cyan-950/40 p-4 rounded-lg border-2 border-cyan-400 shadow-lg shadow-cyan-500/10 animate-text-glow">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold text-cyan-300 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Custom Fields
                  </h4>
                  <p className="text-cyan-200 text-sm mt-1 mb-2 font-medium">
                    Create your own fields to collect specific information from participants in this round. Add custom questions, requirements, or data fields tailored to your hackathon process.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAddCustomField(index)}
                    className="px-3 py-1.5 text-sm bg-cyan-900/30 text-cyan-400 rounded-lg hover:bg-cyan-800/50 transition-all duration-300 border border-cyan-500/30 hover:border-cyan-500/50"
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Field
                    </span>
                  </button>
                </div>
                <div className="space-y-4">
                  {round.customFields?.map((field, fieldIndex) => (
                    <div key={field.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 mr-4">
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => handleCustomFieldChange(index, fieldIndex, 'name', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                            placeholder="Field Name"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={field.type}
                            onChange={(e) => handleCustomFieldChange(index, fieldIndex, 'type', e.target.value)}
                            className="px-3 py-2 bg-gray-800/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                          >
                            <option value="text">Text</option>
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="dropdown">Dropdown</option>
                            <option value="file">File Upload</option>
                            <option value="date">Date</option>
                            <option value="time">Time</option>
                          </select>
                          <label className="flex items-center space-x-2 text-gray-300">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => handleCustomFieldChange(index, fieldIndex, 'required', e.target.checked)}
                              className="form-checkbox h-4 w-4 text-cyan-500 rounded border-gray-700 focus:ring-cyan-500"
                            />
                            <span className="text-sm">Required</span>
                          </label>
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleFieldOrderChange(index, fieldIndex, -1)}
                              disabled={fieldIndex === 0}
                              className={`p-1.5 ${fieldIndex === 0 ? 'text-gray-500' : 'text-gray-400 hover:text-gray-300'} transition-colors duration-200`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFieldOrderChange(index, fieldIndex, 1)}
                              disabled={fieldIndex === round.customFields.length - 1}
                              className={`p-1.5 ${fieldIndex === round.customFields.length - 1 ? 'text-gray-500' : 'text-gray-400 hover:text-gray-300'} transition-colors duration-200`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomField(index, fieldIndex)}
                            className="p-1.5 text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Options for multiple choice, checkbox, and dropdown */}
                      {(field.type === 'multiple_choice' || field.type === 'checkbox' || field.type === 'dropdown') && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium text-gray-300">Options</h5>
                            <button
                              type="button"
                              onClick={() => handleAddFieldOption(index, fieldIndex)}
                              className="px-2 py-1 text-sm bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors duration-200"
                            >
                              Add Option
                            </button>
                          </div>
                          <div className="space-y-2">
                            {field.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => handleFieldOptionChange(index, fieldIndex, optionIndex, e.target.value)}
                                  className="flex-1 px-3 py-1.5 bg-gray-800/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFieldOption(index, fieldIndex, optionIndex)}
                                  className="p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* No rounds error */}
        {errors.rounds && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
            <p className="text-red-400">{errors.rounds}</p>
          </div>
        )}

        {/* Add Round Button */}
        <button
          type="button"
          onClick={handleAddRound}
          className="w-full px-6 py-3 bg-gray-900/40 border border-cyan-500/50 rounded-lg text-cyan-400 hover:bg-gray-800 hover:shadow-md hover:shadow-cyan-500/20 transform hover:translate-y-[-2px] transition-all duration-300"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Add New Round
          </span>
        </button>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => prevStep()}
          className="px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-md hover:shadow-gray-900/20 focus:outline-none"
        >
          Previous Step
        </button>
        <button
          type="submit"
          className={`px-8 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:translate-y-[-2px] ${Object.keys(errors).length > 0
            ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-red-500/20 hover:shadow-red-500/40 focus:ring-red-500'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20 hover:shadow-cyan-500/40 focus:ring-cyan-500'
            }`}
        >
          {Object.keys(errors).length > 0 ? (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Fix Errors
            </span>
          ) : (
            'Next Step'
          )}
        </button>
      </div>
    </form>
  );
}

export default RoundsStep; 