import React from 'react';

function ReviewStep({ formData, updateFormData, prevStep, handleSubmit, isSubmitting, isNavigating }) {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleTermsChange = (e) => {
    updateFormData({ termsAccepted: e.target.checked });
  };

  return (
    <div>
      <div className="space-y-8">
        {/* Hackathon Image Preview */}
        {(typeof formData.image === 'string' && formData.image) || formData.imagePreview || formData.imageFile ? (
          <div className="mb-6">
            <p className="text-sm text-cyan-400 mb-1">Hackathon Image</p>
            <img
              src={
                formData.imagePreview ||
                (formData.imageFile ? URL.createObjectURL(formData.imageFile) : null) ||
                (typeof formData.image === 'string' ? formData.image : null)
              }
              alt="Hackathon Preview"
              className="h-40 w-full object-cover rounded-lg border border-blue-500/30"
              style={{ maxWidth: 400 }}
            />
          </div>
        ) : null}

        {/* Basic Info Review */}
        <div>
          <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-4 flex items-center">
            <span>Basic Information</span>
            <button
              type="button"
              className="ml-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => prevStep(1)}
            >
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </span>
            </button>
          </h3>

          <div className="bg-gray-900/50 backdrop-filter backdrop-blur-md rounded-lg p-4 space-y-3 border border-cyan-500/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-cyan-400">Hackathon Name</p>
                <p className="text-white">{formData.title || 'Not provided'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-cyan-400">Short Description</p>
                <p className="text-white">{formData.description || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-cyan-400">Detailed Description</p>
              <p className="text-white text-sm">{formData.longDescription || 'Not provided'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-cyan-400">Start Date</p>
                <p className="text-white">{formatDate(formData.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-cyan-400">End Date</p>
                <p className="text-white">{formatDate(formData.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-cyan-400">Registration Deadline</p>
                <p className="text-white">{formatDate(formData.registrationDeadline)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-cyan-400">Category</p>
                <p className="text-white">{formData.category || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-cyan-400">Format</p>
                <p className="text-white capitalize">{formData.format || 'Not specified'}</p>
              </div>
            </div>

            {formData.format === 'in-person' || formData.format === 'hybrid' ? (
              <div>
                <p className="text-sm text-cyan-400">Location</p>
                <p className="text-white">{formData.location || 'Not provided'}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Details & Rules Review */}
        <div>
          <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-4 flex items-center">
            <span>Details & Rules</span>
            <button
              type="button"
              className="ml-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => prevStep(2)}
            >
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </span>
            </button>
          </h3>

          <div className="bg-gray-900/50 backdrop-filter backdrop-blur-md rounded-lg p-4 space-y-3 border border-cyan-500/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-cyan-400">Maximum Team Size</p>
                <p className="text-white">
                  {formData.maxTeamSize === 'unlimited' ? 'No Limit' : formData.maxTeamSize || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-cyan-400">Eligibility</p>
                <div className="flex flex-wrap gap-1">
                  {formData.eligibility && formData.eligibility.length > 0 ?
                    formData.eligibility.map((item, index) => (
                      <span key={index} className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded">
                        {item}
                      </span>
                    )) :
                    <p className="text-white">Not specified</p>
                  }
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-cyan-400">Rules</p>
              <p className="text-white text-sm">{formData.rules || 'Not provided'}</p>
            </div>

            <div>
              <p className="text-sm text-cyan-400">Submission Requirements</p>
              <p className="text-white text-sm">{formData.submissionRequirements || 'Not provided'}</p>
            </div>

            <div>
              <p className="text-sm text-cyan-400">Judging Criteria</p>
              <div className="flex flex-wrap gap-1">
                {formData.judgingCriteria && formData.judgingCriteria.length > 0 ?
                  formData.judgingCriteria.map((item, index) => (
                    <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {item}
                    </span>
                  )) :
                  <p className="text-white">Not specified</p>
                }
              </div>
            </div>

            {formData.technologies && formData.technologies.length > 0 && (
              <div>
                <p className="text-sm text-cyan-400">Recommended Technologies</p>
                <div className="flex flex-wrap gap-1">
                  {formData.technologies.map((item, index) => (
                    <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.rounds && formData.rounds.length > 0 && (
              <div>
                <p className="text-sm text-cyan-400 mb-2">Hackathon Rounds</p>
                <div className="space-y-3 mt-2">
                  {formData.rounds && formData.rounds.length > 0 ? (
                    formData.rounds.map((round, index) => (
                      <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium text-lg">{round.name}</p>
                            <p className="text-cyan-400 text-sm mt-1">Type: {round.type || 'hackathon'}</p>
                          </div>
                          <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded">
                            Round {index + 1}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-cyan-400">Start</p>
                            <p className="text-white">
                              {formatDate(round.startDate)} at {round.startTime || '06:00'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-cyan-400">End</p>
                            <p className="text-white">
                              {formatDate(round.endDate)} at {round.endTime || '21:00'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm text-cyan-400">Submission Type</p>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${round.submissionType === 'github' ? 'bg-gray-800 text-cyan-400 border border-cyan-600/30' :
                              round.submissionType === 'file' ? 'bg-gray-800 text-blue-400 border border-blue-600/30' :
                                round.submissionType === 'pdf' ? 'bg-gray-800 text-red-400 border border-red-600/30' :
                                  round.submissionType === 'video' ? 'bg-gray-800 text-purple-400 border border-purple-600/30' :
                                    'bg-gray-800 text-green-400 border border-green-600/30'
                              }`}>
                              {round.submissionType === 'github' ? 'GitHub Repository' :
                                round.submissionType === 'file' ? 'File Upload' :
                                  round.submissionType === 'pdf' ? 'PDF Document' :
                                    round.submissionType === 'video' ? 'Video Submission' :
                                      'Proctored Assessment'}
                            </span>
                          </div>
                        </div>

                        {round.platformLink && (
                          <div className="mt-3">
                            <p className="text-sm text-cyan-400">Platform Link</p>
                            <a
                              href={round.platformLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm break-all"
                            >
                              {round.platformLink}
                            </a>
                          </div>
                        )}

                        {round.description && (
                          <div className="mt-3">
                            <p className="text-sm text-cyan-400">Description</p>
                            <p className="text-gray-300 text-sm mt-1">{round.description}</p>
                          </div>
                        )}

                        {round.evaluationCriteria && round.evaluationCriteria.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-cyan-400">Evaluation Criteria</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {round.evaluationCriteria.map((criteria, idx) => (
                                <span key={idx} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                  {criteria.name} ({criteria.weight}%)
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {round.customFields && round.customFields.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-cyan-400">Custom Fields</p>
                            <div className="flex flex-col gap-1 mt-1">
                              {round.customFields.map((field, idx) => (
                                <span key={field.id || idx} className="text-xs bg-cyan-900/40 text-cyan-200 px-2 py-1 rounded">
                                  {field.name || 'Unnamed Field'} <span className="text-gray-400">({field.type})</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No rounds specified</p>
                  )}
                </div>
                <button
                  type="button"
                  className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  onClick={() => prevStep(3)}
                >
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Timeline
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Prizes & Judges Review */}
        <div>
          <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-4 flex items-center">
            <span>Prizes & Judges</span>
            <button
              type="button"
              className="ml-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => prevStep(3)}
            >
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </span>
            </button>
          </h3>

          {/* Prizes */}
          <div className="bg-gray-900/50 backdrop-filter backdrop-blur-md rounded-lg p-4 space-y-3 border border-cyan-500/20 mb-4">
            <h4 className="text-md font-medium text-cyan-400">Prizes</h4>
            {formData.prizeDetails && formData.prizeDetails.length > 0 ? (
              <div className="space-y-3">
                {formData.prizeDetails.map((prize, index) => (
                  prize.place && (prize.amount || prize.description) ? (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-12 items-center p-2 rounded-lg bg-gray-800/50">
                      <div className="sm:col-span-3">
                        <p className="text-fuchsia-400 font-medium">{prize.place}</p>
                      </div>
                      <div className="sm:col-span-3">
                        <p className="text-white">{prize.amount}</p>
                      </div>
                      <div className="sm:col-span-6">
                        <p className="text-gray-300 text-sm">{prize.description}</p>
                      </div>
                    </div>
                  ) : null
                ))}
              </div>
            ) : (
              <p className="text-white">No prizes specified</p>
            )}
          </div>

          {/* Judges */}
          <div className="bg-gray-900/50 backdrop-filter backdrop-blur-md rounded-lg p-4 space-y-3 border border-cyan-500/20">
            <h4 className="text-md font-medium text-cyan-400">Judges</h4>
            {formData.judges && formData.judges.length > 0 ? (
              <div className="space-y-4 mt-2">
                {formData.judges.map((judge, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-3 rounded-lg bg-gray-800/50">
                    {judge.image && (
                      <div className="sm:col-span-2">
                        <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden">
                          <img
                            src={judge.image}
                            alt={judge.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=Judge';
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className={judge.image ? "sm:col-span-10" : "sm:col-span-12"}>
                      <p className="text-white font-medium">{judge.name}</p>
                      <p className="text-cyan-400 text-sm">
                        {judge.title}
                        {judge.company && ` at ${judge.company}`}
                      </p>
                      {judge.bio && <p className="text-gray-300 text-sm mt-1">{judge.bio}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white">No judges specified</p>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-4 flex items-center">
            <span>Frequently Asked Questions</span>
            <button
              type="button"
              className="ml-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => prevStep(3)}
            >
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </span>
            </button>
          </h3>

          <div className="bg-gray-900/50 backdrop-filter backdrop-blur-md rounded-lg p-4 space-y-3 border border-cyan-500/20">
            {formData.faqs && formData.faqs.length > 0 ? (
              <div className="space-y-4">
                {formData.faqs.map((faq, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-800/50">
                    <p className="text-white font-medium mb-1">{faq.question}</p>
                    <p className="text-gray-300 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white">No FAQs specified</p>
            )}
          </div>
        </div>

        {/* Agreement */}
        <div className="bg-cyan-900/30 p-4 rounded-lg border border-cyan-500/30">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleTermsChange}
              className="mt-1 mr-2 h-4 w-4 text-cyan-600 border-gray-700 rounded focus:ring-cyan-500 bg-gray-800"
            />
            <label htmlFor="termsAccepted" className="text-white text-sm">
              I confirm that all provided information is accurate. I understand that once submitted, the hackathon details will be reviewed by the platform administrators before being published.
            </label>
          </div>
        </div>

        {/* Additional Configuration */}
        <div className="bg-gray-800/70 rounded-xl mb-6 overflow-hidden">
          <div className="p-5 border-b border-cyan-500/20">
            <h2 className="text-lg font-semibold text-cyan-300">Additional Configuration</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brochure Section */}
            <div>
              <p className="text-sm text-cyan-400 mb-2">Hackathon Documentation</p>
              {formData.brochureFile ? (
                <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-500/20">
                  <p className="text-white text-sm font-medium">Uploaded Brochure:</p>
                  <p className="text-gray-400 text-xs">{formData.brochureFile.name}</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No brochure uploaded</p>
              )}
            </div>

            {/* Prerequisites Section */}
            <div>
              <p className="text-sm text-cyan-400 mb-2">Academic Prerequisites</p>
              {formData.prerequisites?.academicRequirements ? (
                <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-500/20">
                  <p className="text-white text-sm font-medium">Academic Requirements Enabled</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-400 text-xs">10th Grade Minimum: <span className="text-white">{formData.prerequisites.tenthMarksMinimum}%</span></p>
                    <p className="text-gray-400 text-xs">12th Grade Minimum: <span className="text-white">{formData.prerequisites.twelfthMarksMinimum}%</span></p>
                    {formData.prerequisites.otherAcademicRequirements && (
                      <p className="text-gray-400 text-xs">Other Requirements: <span className="text-white">{formData.prerequisites.otherAcademicRequirements}</span></p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No academic prerequisites required</p>
              )}
            </div>

            {/* Submission Configuration */}
            <div>
              <p className="text-sm text-cyan-400 mb-2">Submission Configuration</p>
              <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-500/20">
                <p className="text-white text-sm font-medium">Allowed Submission Types:</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.submissionConfig?.allowGithubURLs && (
                    <span className="px-2 py-0.5 text-xs bg-gray-800 text-cyan-400 rounded-full border border-cyan-600/30">GitHub URLs</span>
                  )}
                  {formData.submissionConfig?.allowFileUploads && (
                    <span className="px-2 py-0.5 text-xs bg-gray-800 text-cyan-400 rounded-full border border-cyan-600/30">File Uploads</span>
                  )}
                  {formData.submissionConfig?.allowPDFSubmissions && (
                    <span className="px-2 py-0.5 text-xs bg-gray-800 text-cyan-400 rounded-full border border-cyan-600/30">PDF Documents</span>
                  )}
                  {formData.submissionConfig?.allowVideoSubmissions && (
                    <span className="px-2 py-0.5 text-xs bg-gray-800 text-cyan-400 rounded-full border border-cyan-600/30">Video Submissions</span>
                  )}
                  {formData.submissionConfig?.conductAssessments && (
                    <span className="px-2 py-0.5 text-xs bg-gray-800 text-cyan-400 rounded-full border border-cyan-600/30">Proctored Assessments</span>
                  )}
                </div>

                {formData.submissionConfig?.allowFileUploads && (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded border border-cyan-500/20">
                    <p className="text-white text-sm font-medium">File Upload Settings:</p>
                    <div className="mt-1 text-gray-300 text-xs">
                      <p>Maximum file size: <span className="text-white">{formData.submissionConfig.maxFileSize || 10} MB</span></p>
                      {formData.submissionConfig?.fileTypes && formData.submissionConfig.fileTypes.length > 0 && (
                        <div className="mt-1">
                          <p>Allowed file types:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.submissionConfig.fileTypes.map((type) => (
                              <span key={type} className="px-2 py-0.5 text-xs bg-gray-800 text-cyan-400 rounded-full border border-cyan-600/30">
                                .{type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formData.submissionConfig?.githubInstructions && (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded border border-cyan-500/20">
                    <p className="text-white text-sm font-medium">GitHub Submission Instructions:</p>
                    <p className="text-gray-300 text-xs mt-1 whitespace-pre-line">{formData.submissionConfig.githubInstructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add File Upload Instructions */}
            {formData.submissionConfig?.allowFileUploads && formData.submissionConfig?.fileUploadInstructions && (
              <div className="mt-3 bg-gray-800/50 p-2 rounded border border-cyan-500/20">
                <p className="text-white text-sm font-medium">File Upload Instructions:</p>
                <p className="text-gray-300 text-xs mt-1 whitespace-pre-line">{formData.submissionConfig.fileUploadInstructions}</p>
              </div>
            )}

            {/* Sponsored APIs */}
            <div>
              <p className="text-sm text-cyan-400 mb-2">Sponsored APIs</p>
              {formData.sponsoredAPIs?.hasSponsoredAPIs ? (
                <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-500/20">
                  <p className="text-white text-sm font-medium">
                    API Usage: <span className="text-cyan-400">{formData.sponsoredAPIs.mandatoryAPIUsage ? 'Mandatory' : 'Optional'}</span>
                  </p>

                  {formData.sponsoredAPIs.apisList && formData.sponsoredAPIs.apisList.length > 0 && (
                    <>
                      <p className="text-white text-sm font-medium mt-2">Sponsored APIs:</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {formData.sponsoredAPIs.apisList.map((api, index) => (
                          <span key={index} className="px-2 py-0.5 text-xs bg-gray-800 text-cyan-400 rounded-full border border-cyan-600/30">
                            {api}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No sponsored APIs specified</p>
              )}
            </div>

            {/* Round Management Settings */}
            <div className="md:col-span-2">
              <p className="text-sm text-cyan-400 mb-2">Round Management Settings</p>
              <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-500/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white text-sm font-medium">Auto-Promotion:</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.roundSettings?.autoPromoteEnabled ?
                        'Enabled - Participants will automatically advance to the next round after deadline' :
                        'Disabled - Manual promotion required'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Applicant Filtering:</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.roundSettings?.filterApplicants !== false ?
                        'Enabled - You can manually select which participants advance' :
                        'Disabled - All participants advance together'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add PDF Instructions */}
        {formData.submissionConfig?.allowPDFSubmissions && formData.submissionConfig?.pdfInstructions && (
          <div className="mt-3 bg-gray-800/50 p-2 rounded border border-cyan-500/20">
            <p className="text-white text-sm font-medium">PDF Document Requirements:</p>
            <p className="text-gray-300 text-xs mt-1 whitespace-pre-line">{formData.submissionConfig.pdfInstructions}</p>
          </div>
        )}

        {/* Add Video Instructions */}
        {formData.submissionConfig?.allowVideoSubmissions && formData.submissionConfig?.videoInstructions && (
          <div className="mt-3 bg-gray-800/50 p-2 rounded border border-cyan-500/20">
            <p className="text-white text-sm font-medium">Video Submission Guidelines:</p>
            <p className="text-gray-300 text-xs mt-1 whitespace-pre-line">{formData.submissionConfig.videoInstructions}</p>
          </div>
        )}

        {/* Add Assessment Instructions */}
        {formData.submissionConfig?.conductAssessments && formData.submissionConfig?.assessmentInstructions && (
          <div className="mt-3 bg-gray-800/50 p-2 rounded border border-cyan-500/20">
            <p className="text-white text-sm font-medium">Proctored Assessment Details:</p>
            <p className="text-gray-300 text-xs mt-1 whitespace-pre-line">{formData.submissionConfig.assessmentInstructions}</p>
          </div>
        )}

        {/* Organizer Section */}
        <div>
          <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-4 flex items-center">
            <span>Organizer</span>
            <button
              type="button"
              className="ml-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => prevStep(1)}
            >
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </span>
            </button>
          </h3>

          <div className="bg-gray-900/50 backdrop-filter backdrop-blur-md rounded-lg p-4 space-y-3 border border-cyan-500/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-cyan-400">Organizer Name</p>
                <p className="text-white">{formData.organizer || 'Not provided'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-cyan-400">Short Description</p>
                <p className="text-white">{formData.description || 'Not provided'}</p>
              </div>
            </div>

            {/* Co-Organizers */}
            {formData.coOrganizers && formData.coOrganizers.length > 0 && (
              <div>
                <p className="text-sm text-cyan-400 mb-2">Co-Organizers</p>
                <div className="space-y-3">
                  {formData.coOrganizers.map((org, index) => (
                    <div key={index} className="bg-gray-800/50 p-2 rounded grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <p className="text-white">{org.name || 'No name'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">{org.contact || 'No contact'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">{org.email || 'No email'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registration Fees */}
            {formData.registrationFees && Object.keys(formData.registrationFees).length > 0 && (
              <div>
                <p className="text-sm text-cyan-400 mb-2">Registration Fees</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(formData.registrationFees).map(([teamSize, fee]) => (
                    <div key={teamSize} className="bg-gray-800/50 p-2 rounded">
                      <p className="text-white text-sm">{teamSize} {parseInt(teamSize) === 1 ? 'Member' : 'Members'}: ₹{fee}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media Links */}
            {(formData.whatsappLink || formData.discordLink) && (
              <div>
                <p className="text-sm text-cyan-400 mb-2">Social Media Links</p>
                <div className="space-y-2">
                  {formData.whatsappLink && (
                    <div className="flex items-center">
                      <span className="bg-green-900/30 text-green-400 p-1 rounded mr-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </span>
                      <a href={formData.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm">
                        WhatsApp Group
                      </a>
                    </div>
                  )}
                  {formData.discordLink && (
                    <div className="flex items-center">
                      <span className="bg-indigo-900/30 text-indigo-400 p-1 rounded mr-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                        </svg>
                      </span>
                      <a href={formData.discordLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm">
                        Discord Server
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Participant Benefits */}
            {formData.participantBenefits && (
              <div>
                <p className="text-sm text-cyan-400 mb-1">Participant Benefits</p>
                <p className="text-white text-sm whitespace-pre-line">{formData.participantBenefits}</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <div className="bg-gray-900/50 backdrop-filter backdrop-blur-md rounded-lg p-4 border border-cyan-500/20 mb-6">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleTermsChange}
                className="mt-1 form-checkbox h-4 w-4 text-cyan-500 rounded focus:ring-cyan-500 focus:ring-offset-gray-800 border-gray-600"
              />
              <label htmlFor="termsAccepted" className="text-white text-sm">
                I confirm that all provided information is accurate. I understand that once submitted, the hackathon details will be reviewed by the platform administrators before being published.
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 bg-gray-800 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-gray-700 transition-colors duration-200"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formData.termsAccepted || isSubmitting}
              className={`px-8 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-200 ${formData.termsAccepted && !isSubmitting
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20 hover:shadow-cyan-500/40'
                  : 'bg-gray-600 cursor-not-allowed'
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Hackathon'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewStep; 