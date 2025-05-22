import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getHackathonById } from '../../../data/hackathons';
import { hackathonAPI } from '../../../services/api';
import { handleApiError } from '../../../services/api';
import { toast } from 'react-hot-toast';

// Step components
import BasicInfoStep from './steps/BasicInfoStep';
import DetailsStep from './steps/DetailsStep';
import RoundsStep from './steps/RoundsStep';
import PrizesStep from './steps/PrizesStep';
import ReviewStep from './steps/ReviewStep';

function HostHackathon() {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info - simplified fields
    id: null, // Will be auto-generated upon submission
    title: '', // Used in listings
    organizer: '', // Organization hosting the hackathon
    description: '', // Short description
    longDescription: '', // Detailed description
    aboutEvent: '', // About section for details page
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: '', // Location name/address
    locationType: 'online', // online, offline, hybrid
    image: '', // Single image field for all purposes

    // Status and Categories
    status: 'pending', // must match backend enum: 'pending', 'approved', 'rejected'
    category: '', // Primary category
    technology: [], // Technology tags

    // Participation Details
    maxTeamSize: '4',
    participants: '0', // Expected number of participants
    prize: '', // Total prize amount as string

    // Details
    eligibility: [],
    rules: '',
    submissionRequirements: '',
    judgingCriteria: [],

    // Academic Prerequisites
    tenthMarks: '',
    twelfthMarks: '',

    // Timeline/Rounds - simplified
    rounds: [],

    // Round Template Presets
    roundTemplates: [
      {
        type: 'pre-hackathon',
        name: "Registration",
        description: "Initial registration phase where teams and participants sign up for the hackathon. Collect essential information like team details, member information, and college details. This is the first step where participants officially enter the hackathon.",
        startTime: "12:00",
        endTime: "23:59",
        defaultFields: [
          { name: "team_name", type: "text", required: true },
          { name: "member_name", type: "text", required: true },
          { name: "member_email", type: "text", required: true },
          { name: "branch", type: "text", required: true },
          { name: "year", type: "text", required: true },
          { name: "college", type: "text", required: true }
        ]
      },
      {
        type: 'pre-hackathon',
        name: "Idea Submission",
        description: "Participants submit their project ideas or proposals. This round helps organizers understand the scope and direction of projects. Teams should clearly explain their problem statement, proposed solution, and the technology stack they plan to use.",
        startTime: "12:00",
        endTime: "23:59",
        defaultFields: [
          { name: "idea_title", type: "text", required: true },
          { name: "problem_statement", type: "text", required: true },
          { name: "solution_summary", type: "text", required: true },
          { name: "tech_stack", type: "text", required: true }
        ]
      },
      {
        type: 'pre-hackathon',
        name: "Idea Evaluation",
        description: "Judges review and evaluate submitted ideas based on innovation, feasibility, and impact. Teams receive feedback and scores to help them refine their concepts. This round ensures quality and helps teams prepare for the development phase.",
        startTime: "09:00",
        endTime: "17:00",
        defaultFields: [
          { name: "idea_score", type: "text", required: true },
          { name: "judge_name", type: "text", required: true },
          { name: "judge_feedback", type: "text", required: true },
          { name: "evaluation_status", type: "dropdown", required: true, options: ["Approved", "Rejected", "Needs Revision"] }
        ]
      },
      {
        type: 'hackathon',
        name: "Prototype Submission",
        description: "Teams submit their initial working prototype or proof of concept. This round helps validate the technical feasibility of ideas and provides an opportunity for early feedback. Teams should include their prototype link, GitHub repository, and a description of their build.",
        startTime: "12:00",
        endTime: "23:59",
        defaultFields: [
          { name: "prototype_link", type: "text", required: true },
          { name: "github_link", type: "text", required: true },
          { name: "build_description", type: "text", required: true }
        ]
      },
      {
        type: 'hackathon',
        name: "Technical Review",
        description: "Technical experts review the submitted prototypes for code quality, architecture, and implementation. Teams receive detailed technical feedback and scores to help them improve their projects before the final submission.",
        startTime: "09:00",
        endTime: "17:00",
        defaultFields: [
          { name: "reviewer_name", type: "text", required: true },
          { name: "technical_score", type: "text", required: true },
          { name: "technical_feedback", type: "text", required: true }
        ]
      },
      {
        type: 'hackathon',
        name: "Final Project Submission",
        description: "Teams submit their complete project with all deliverables. This includes the final codebase, demo video, and documentation. This is the last chance for teams to showcase their work before the pitching round.",
        startTime: "12:00",
        endTime: "23:59",
        defaultFields: [
          { name: "project_title", type: "text", required: true },
          { name: "final_github_link", type: "text", required: true },
          { name: "demo_video_link", type: "text", required: true },
          { name: "documentation_link", type: "text", required: true }
        ]
      },
      {
        type: 'hackathon',
        name: "Pitching Round",
        description: "Teams present their projects to judges and other participants. This round tests teams' ability to communicate their ideas effectively. Teams should prepare a compelling presentation and be ready to answer questions about their project.",
        startTime: "09:00",
        endTime: "17:00",
        defaultFields: [
          { name: "pitch_time", type: "time", required: true },
          { name: "presentation_link", type: "text", required: true },
          { name: "presenter_name", type: "text", required: true }
        ]
      },
      {
        type: 'post-hackathon',
        name: "Final Judging",
        description: "Judges evaluate the final projects based on various criteria including innovation, technical implementation, and presentation. This round determines the winners of the hackathon. Teams receive final scores and rankings.",
        startTime: "09:00",
        endTime: "17:00",
        defaultFields: [
          { name: "final_score", type: "text", required: true },
          { name: "judge_name", type: "text", required: true },
          { name: "judging_comments", type: "text", required: true },
          { name: "final_rank", type: "text", required: true }
        ]
      },
      {
        type: 'pre-hackathon',
        name: "Coding Round",
        description: "Technical assessment round where participants solve coding challenges. This round tests participants' programming skills and problem-solving abilities. Participants need to complete the assessment on the specified coding platform within the given time.",
        startTime: "09:00",
        endTime: "17:00",
        platformLink: '', // Required for coding round
        defaultFields: [
          { name: "participant_name", type: "text", required: true },
          { name: "participant_email", type: "text", required: true }
        ]
      },
      {
        type: 'pre-hackathon',
        name: "Aptitude Round",
        description: "Assessment round testing participants' logical reasoning, analytical skills, and general aptitude. This round helps evaluate participants' problem-solving abilities and critical thinking skills. Participants need to complete the assessment on the specified platform.",
        startTime: "09:00",
        endTime: "17:00",
        platformLink: '', // Required for aptitude round
        defaultFields: [
          { name: "participant_name", type: "text", required: true },
          { name: "participant_email", type: "text", required: true }
        ]
      }
    ],

    // Submission methods - now moved to be configured per round
    submissionTypeOptions: [
      { id: 'github', label: 'GitHub Repository' },
      { id: 'fileUpload', label: 'File Upload' },
      { id: 'url', label: 'Website URL' },
      { id: 'video', label: 'Video Submission' },
      { id: 'document', label: 'Document/PDF' }
    ],

    // Prizes Details - simplified
    prizeDetails: [
      { place: '1st Place', amount: '', description: '' },
      { place: '2nd Place', amount: '', description: '' },
      { place: '3rd Place', amount: '', description: '' }
    ],

    // Judges
    judges: [
      { name: '', title: '', company: '', image: '', bio: '' }
    ],

    // FAQ
    faqs: [
      { question: '', answer: '' }
    ],

    // Terms & Conditions
    termsAccepted: false,

    // Approval Status
    approvalStatus: 'pending'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  // Load hackathon data if in edit mode
  useEffect(() => {
    if (id) {
      const hackathon = getHackathonById(parseInt(id));
      if (hackathon) {
        // Format the data for the form
        setFormData(prevData => ({
          ...prevData,
          id: hackathon.id,
          title: hackathon.name || hackathon.title,
          organizer: hackathon.organizer,
          description: hackathon.description,
          startDate: hackathon.dates ? hackathon.dates.split(' - ')[0] : '',
          endDate: hackathon.dates ? hackathon.dates.split(' - ')[1] : '',
          registrationDeadline: hackathon.registrationDeadline,
          location: hackathon.location,
          locationType: hackathon.locationType,
          image: hackathon.image || hackathon.logo || hackathon.bannerImage,
          category: hackathon.category,
          technology: hackathon.technology || hackathon.tags,
          prize: hackathon.prize || hackathon.prizes
        }));
      }
    }
  }, [id]);

  // Update form data
  const updateFormData = (data) => {
    setFormData(prevData => ({ ...prevData, ...data }));
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Go to specific step
  const goToStep = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  // Handle final submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Construct the payload explicitly for the API call
      // Include File objects directly as expected by hackathonAPI.create
      const payload = {
        // Basic Info
        title: formData.title,
        organizer: formData.organizer,
        description: formData.description,
        longDescription: formData.longDescription,
        aboutEvent: formData.aboutEvent,
        startDate: formData.startDate,
        endDate: formData.endDate,
        registrationDeadline: formData.registrationDeadline,
        location: formData.location,
        locationType: formData.locationType,
        // Pass File objects directly
        imageFile: formData.imageFile,
        brochureFile: formData.brochureFile,

        // Status and Categories
        status: formData.status,
        category: formData.category,
        technology: formData.technology,

        // Participation Details
        maxTeamSize: formData.maxTeamSize,
        participants: formData.participants,
        prize: formData.prize,

        // Details
        eligibility: formData.eligibility,
        rules: formData.rules,
        submissionRequirements: formData.submissionRequirements,
        judgingCriteria: formData.judgingCriteria,

        // Academic Prerequisites
        tenthMarks: formData.tenthMarks,
        twelfthMarks: formData.twelfthMarks,

        // Timeline/Rounds
        rounds: formData.rounds,
        submissionTypeOptions: formData.submissionTypeOptions,

        // Prizes Details
        prizeDetails: formData.prizeDetails,

        // Judges
        judges: formData.judges,

        // FAQ
        faqs: formData.faqs,

        // Terms & Conditions
        termsAccepted: formData.termsAccepted,

        // Other potential fields
        whatsappLink: formData.whatsappLink,
        discordLink: formData.discordLink,
        participantBenefits: formData.participantBenefits,
        registrationFees: formData.registrationFees
      };

      // Clean up judges array
      if (payload.judges && Array.isArray(payload.judges)) {
        payload.judges = payload.judges
          .filter(judge => judge.name)
          .map(judge => {
            if (!judge.image || (typeof judge.image === 'string' && judge.image.startsWith('blob:'))) {
              const { image, ...rest } = judge;
              return rest;
            }
            return judge;
          });
      }

      // Call the API to create the hackathon
      const response = await hackathonAPI.create(payload);

      if (response.data.success) {
        // Show success message
        toast.success('Hackathon created successfully!');
        setIsSubmitted(true);

        // Navigate to organizer dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard/organizer');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating hackathon:', error);
      const apiError = handleApiError(error);
      toast.error(apiError.message || 'Failed to create hackathon. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-indigo-500/20 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <BasicInfoStep
              formData={formData}
              updateFormData={updateFormData}
              nextStep={handleNextStep}
              isNavigating={isNavigating}
              hackathonId={id}
            />
          </div>
        );
      case 2:
        return (
          <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-indigo-500/20 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
            <DetailsStep formData={formData} updateFormData={updateFormData} nextStep={handleNextStep} />
          </div>
        );
      case 3:
        return (
          <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-indigo-500/20 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
            <RoundsStep formData={formData} updateFormData={updateFormData} nextStep={handleNextStep} />
          </div>
        );
      case 4:
        return (
          <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-indigo-500/20 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
            <PrizesStep formData={formData} updateFormData={updateFormData} nextStep={handleNextStep} />
          </div>
        );
      case 5:
        return (
          <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-indigo-500/20 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl"></div>
            <ReviewStep
              formData={formData}
              updateFormData={updateFormData}
              prevStep={handlePrevStep}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isNavigating={isNavigating}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // If form is submitted successfully, show success message
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-gray-800/70 via-purple-900/10 to-gray-800/70 py-8 sm:py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-4">
              Hackathon Created Successfully!
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your hackathon has been submitted for approval. You'll be notified once it's live on the platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <div className="bg-gray-800/40 backdrop-filter backdrop-blur-md rounded-xl p-8 shadow-xl border border-indigo-500/20">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Next Steps</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">Our team will review your hackathon details</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">Once approved, your hackathon will be live on the platform</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">You'll receive tools to manage registrations and submissions</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/40 backdrop-filter backdrop-blur-md rounded-xl p-8 shadow-xl border border-indigo-500/20">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Hackathon Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Title</p>
                  <p className="text-white">{formData.title}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Dates</p>
                  <p className="text-white">{formData.startDate} - {formData.endDate}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-white">Pending Approval</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Link to="/" className="px-8 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 font-medium">
              Go to Dashboard
            </Link>
            <Link to="/hackathons/host" className="px-8 py-3 rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 font-medium">
              Host Another Hackathon
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4 relative">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[100px]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px]"></div>

      <div className="max-w-5xl mx-auto">
        {/* Header - More compact */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-3">
            {id ? 'Edit Hackathon' : 'Create New Hackathon'}
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            {id ? 'Update your hackathon details below' : 'Fill in the details below to create your new hackathon'}
          </p>
        </div>

        {/* Progress Steps - More compact */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Progress bar background */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-gray-700"></div>

            {/* Active progress bar */}
            <div
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            ></div>

            {/* Step indicators */}
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 ${currentStep >= step
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-700 text-gray-400'
                    }`}
                >
                  {step}
                </div>
                <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium ${currentStep >= step ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Details'}
                  {step === 3 && 'Rounds'}
                  {step === 4 && 'Prizes'}
                  {step === 5 && 'Review'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="max-w-4xl mx-auto mb-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons - More compact */}
        <div className="max-w-4xl mx-auto flex justify-between items-center mt-8">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>
          )}

          {currentStep < 5 ? (
            <button
              onClick={handleNextStep}
              className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 group"
            >
              <span>Next</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ml-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Hackathon</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HostHackathon; 