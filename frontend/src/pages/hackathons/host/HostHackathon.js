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
    setFormData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  // Move to next step
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo(0, 0);
  };

  // Directly go to a specific step (used by the step indicator)
  const goToStep = (step) => {
    if (step <= currentStep) {
      setIsNavigating(true);
      setCurrentStep(step);
      window.scrollTo(0, 0);
      setIsNavigating(false);
    }
  };

  // Move to previous step
  const prevStep = (step) => {
    setIsNavigating(true);
    if (step) {
      setCurrentStep(step);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
    window.scrollTo(0, 0);
    setIsNavigating(false);
  };

  // Handle final submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Create a copy of formData without removing image fields
      const hackathonData = { ...formData };

      // Clean up judges array
      if (hackathonData.judges && Array.isArray(hackathonData.judges)) {
        hackathonData.judges = hackathonData.judges.map(judge => {
          // Remove image if it's not a valid ObjectId
          if (!judge.image || typeof judge.image !== 'string' || judge.image.startsWith('blob:') || judge.image === '') {
            const { image, ...rest } = judge;
            return rest;
          }
          return judge;
        });
      }

      // Format coOrganizers
      if (hackathonData.coOrganizers) {
        try {
          // If it's a string, parse it
          if (typeof hackathonData.coOrganizers === 'string') {
            hackathonData.coOrganizers = JSON.parse(hackathonData.coOrganizers);
          }
          // Ensure it's an array and format each entry
          if (Array.isArray(hackathonData.coOrganizers)) {
            hackathonData.coOrganizers = hackathonData.coOrganizers
              .filter(org => org && typeof org === 'object')
              .map(org => ({
                name: org.name || '',
                contact: org.contact || '',
                email: org.email || ''
              }))
              .filter(org => org.name && org.email); // Only keep valid entries
          } else {
            hackathonData.coOrganizers = [];
          }
        } catch (e) {
          console.error('Error formatting coOrganizers:', e);
          hackathonData.coOrganizers = [];
        }
      } else {
        hackathonData.coOrganizers = [];
      }

      // Deep clean: Remove any image fields in all nested objects/arrays
      const deepClean = (obj) => {
        if (Array.isArray(obj)) {
          return obj.map(deepClean);
        } else if (obj && typeof obj === 'object') {
          const cleaned = {};
          for (const key in obj) {
            if (key === 'image' && (obj[key] === '' || (typeof obj[key] === 'string' && obj[key].startsWith('blob:')))) {
              continue;
            }
            cleaned[key] = deepClean(obj[key]);
          }
          return cleaned;
        }
        return obj;
      };
      const cleanedPayload = deepClean(hackathonData);

      // Log to verify
      console.log('Payload sent to backend:', {
        ...cleanedPayload,
        imageFile: formData.imageFile,
        image: formData.image
      });

      // Create the hackathon
      const response = await hackathonAPI.createHackathon({
        ...cleanedPayload,
        imageFile: formData.imageFile,
        image: formData.image
      });

      if (response.data.success) {
        // Show success message
        toast.success('Hackathon created successfully!');

        // Navigate to organizer dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard/organizer');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating hackathon:', error);
      toast.error('Failed to create hackathon. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current step
  const renderStep = () => {
    // Add isNavigating flag to allow bypassing validation when navigating directly
    switch (currentStep) {
      case 1:
        return <BasicInfoStep
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          isNavigating={isNavigating}
        />;
      case 2:
        return <DetailsStep
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          isNavigating={isNavigating}
        />;
      case 3:
        return <RoundsStep
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          isNavigating={isNavigating}
        />;
      case 4:
        return <PrizesStep
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          isNavigating={isNavigating}
        />;
      case 5:
        return <ReviewStep
          formData={formData}
          updateFormData={updateFormData}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isNavigating={isNavigating}
        />;
      default:
        return <BasicInfoStep
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          isNavigating={isNavigating}
        />;
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
    <div className="min-h-screen bg-gradient-to-bl from-gray-800/70 via-purple-900/10 to-gray-800/70 py-8 sm:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Progress indicator */}
        <div className="mb-10">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map(step => (
              <button
                key={step}
                onClick={() => step <= currentStep && goToStep(step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step < currentStep
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-pointer'
                  : step === currentStep
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-4 ring-indigo-500/30'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                disabled={step > currentStep}
              >
                {step < currentStep ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-center w-1/5 text-sm font-medium text-blue-400">Basic Info</div>
            <div className="text-center w-1/5 text-sm font-medium text-blue-400">Details</div>
            <div className="text-center w-1/5 text-sm font-medium text-blue-400">Timeline</div>
            <div className="text-center w-1/5 text-sm font-medium text-blue-400">Prizes & Judges</div>
            <div className="text-center w-1/5 text-sm font-medium text-blue-400">Review</div>
          </div>
        </div>

        {/* Main form container */}
        <div className="bg-gray-800/40 backdrop-filter backdrop-blur-md rounded-xl p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden mb-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default HostHackathon; 