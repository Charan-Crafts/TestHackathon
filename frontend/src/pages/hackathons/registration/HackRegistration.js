import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hackathonAPI, registrationAPI, profileAPI } from '../../../services/api';
import { getImageUrl } from '../../../utils/imageHelper';
import { useAuth } from '../../../contexts/AuthContext';

// Import step components
import PersonalInfoStep from './steps/PersonalInfoStep';
import ProfessionalInfoStep from './steps/ProfessionalInfoStep';
import TeamInfoStep from './steps/TeamInfoStep';
import ProjectInfoStep from './steps/ProjectInfoStep';
import ReviewStep from './steps/ReviewStep';
import SuccessStep from './steps/SuccessStep';
import EligibilityCheckStep from './steps/EligibilityCheckStep';
import AcademicMarksStep from './steps/AcademicMarksStep';

function HackRegistration() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [eligibilityData, setEligibilityData] = useState({});
  const [eligibilityError, setEligibilityError] = useState("");
  const [academicMarks, setAcademicMarks] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    // Professional Info
    role: '',
    experience: '',
    skills: [],
    github: '',
    portfolio: '',
    // Team Info
    teamName: '',
    teamSize: '1',
    lookingForTeam: false,
    teammates: [],
    // Project Info
    projectTitle: '',
    projectDescription: '',
    techStack: [],
    category: ''
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await profileAPI.getMyProfile();
        if (response.data) {
          const userData = response.data;
          console.log('User Profile Data:', userData); // Add this for debugging
          setFormData(prev => ({
            ...prev,
            firstName: userData.user?.firstName || '',
            lastName: userData.user?.lastName || '',
            email: userData.user?.email || '',
            phoneNumber: userData.phoneNumber || ''
          }));
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUserProfile();
  }, []);

  // Loading hackathon details from backend
  useEffect(() => {
    const fetchHackathon = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching hackathon with ID:', hackathonId);
        const response = await hackathonAPI.getHackathonById(hackathonId);
        console.log('API Response:', response);

        if (response.data && response.data.success) {
          const h = response.data.data;
          console.log('Hackathon data:', h);
          // Parse stringified arrays if needed
          if (h.eligibility && typeof h.eligibility[0] === 'string' && h.eligibility[0].startsWith('[')) {
            try { h.eligibility = JSON.parse(h.eligibility[0]); } catch { }
          }
          if (h.studentBranches && typeof h.studentBranches[0] === 'string' && h.studentBranches[0].startsWith('[')) {
            try { h.studentBranches = JSON.parse(h.studentBranches[0]); } catch { }
          }
          if (h.judgingCriteria && typeof h.judgingCriteria[0] === 'string' && h.judgingCriteria[0].startsWith('[')) {
            try { h.judgingCriteria = JSON.parse(h.judgingCriteria[0]); } catch { }
          }
          setHackathon({
            id: h._id,
            name: h.title,
            description: h.description,
            dates: h.startDate && h.endDate ? `${new Date(h.startDate).toLocaleDateString()} - ${new Date(h.endDate).toLocaleDateString()}` : '',
            registrationDeadline: h.registrationDeadline ? new Date(h.registrationDeadline).toLocaleDateString() : '',
            logo: getImageUrl(h.imagePath) || `https://picsum.photos/seed/${h._id}/100/100`,
            bannerImage: getImageUrl(h.imagePath) || `https://picsum.photos/seed/${h._id}/400/200`,
            categories: (h.technology && h.technology.length > 0
              ? h.technology
              : (h.category ? [h.category] : [])
            ).map(cat => Array.isArray(cat) ? cat[0] : cat),
            skillOptions: [
              'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'AWS', 'Docker', 'Blockchain', 'AI/ML', 'UI/UX'
            ],
            prizeDetails: h.prizeDetails || [],
            maxTeamSize: h.maxTeamSize,
            rules: h.rules,
            eligibility: h.eligibility,
            studentBranches: h.studentBranches || [],
            studentMinPercentage: h.studentMinPercentage,
            tenthMarks: h.tenthMarks || 0,
            twelfthMarks: h.twelfthMarks || 0,
            rounds: h.rounds,
            judges: h.judges,
            faqs: h.faqs,
            aboutEvent: h.aboutEvent || h.longDescription || h.description
          });
        } else {
          console.error('API response indicates failure:', response);
          setError('Hackathon not found');
        }
      } catch (err) {
        console.error('Error fetching hackathon:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError('Failed to fetch hackathon details');
      } finally {
        setLoading(false);
      }
    };
    fetchHackathon();
  }, [hackathonId]);

  // Update form data
  const updateFormData = (newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };

  // Move to next step
  const nextStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => {
      if (prev === 5) {
        setShowSuccess(true);
        return prev;
      }
      return prev + 1;
    });
  };

  // Move to previous step
  const prevStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
        setError('Please fill in all required personal information fields');
        setLoading(false);
        return;
      }

      if (!formData.role || !formData.experience) {
        setError('Please fill in all required professional information fields');
        setLoading(false);
        return;
      }

      if (!formData.projectTitle || !formData.projectDescription) {
        setError('Please fill in all required project information fields');
        setLoading(false);
        return;
      }

      if (!user?._id) {
        setError('User authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      // Reset form data to prevent error messages from being included
      const cleanFormData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        role: formData.role.trim(),
        experience: formData.experience.trim(),
        skills: Array.isArray(formData.skills) ? formData.skills : [],
        github: formData.github?.trim() || '',
        portfolio: formData.portfolio?.trim() || '',
        teamName: formData.teamName?.trim() || '',
        teamSize: parseInt(formData.teamSize) || 1,
        lookingForTeam: Boolean(formData.lookingForTeam),
        teammates: Array.isArray(formData.teammates) ? formData.teammates : [],
        projectTitle: formData.projectTitle.trim(),
        projectDescription: formData.projectDescription.trim(),
        techStack: Array.isArray(formData.techStack) ? formData.techStack : [],
        category: formData.category?.trim() || ''
      };

      // Format the registration data according to the backend model
      const registrationData = {
        hackathonId,
        userId: user._id,
        personalInfo: {
          firstName: cleanFormData.firstName,
          lastName: cleanFormData.lastName,
          email: cleanFormData.email,
          phone: cleanFormData.phoneNumber
        },
        professionalInfo: {
          role: cleanFormData.role,
          experience: cleanFormData.experience,
          skills: cleanFormData.skills,
          github: cleanFormData.github,
          portfolio: cleanFormData.portfolio
        },
        teamInfo: {
          teamName: cleanFormData.teamName,
          teamSize: cleanFormData.teamSize,
          lookingForTeam: cleanFormData.lookingForTeam,
          teammates: cleanFormData.teammates
        },
        projectInfo: {
          projectTitle: cleanFormData.projectTitle,
          projectDescription: cleanFormData.projectDescription,
          techStack: cleanFormData.techStack,
          category: cleanFormData.category
        }
      };

      // Include academic marks if available
      if (academicMarks && typeof academicMarks === 'object') {
        registrationData.academicMarks = {
          tenthMarks: Number(academicMarks.tenthMarks) || 0,
          twelfthMarks: Number(academicMarks.twelfthMarks) || 0
        };
      }

      // If it's a student-only hackathon, include eligibility data
      if (hackathon?.eligibility?.includes('Students Only') && eligibilityData) {
        registrationData.eligibilityData = eligibilityData;
      }

      console.log('Submitting registration data:', registrationData);

      const response = await registrationAPI.createRegistration(registrationData);

      if (response.data && response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/user');
        }, 3000);
      } else {
        setError(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render current step
  const renderStep = () => {
    if (showSuccess) {
      return <SuccessStep hackathon={hackathon} />;
    }
    // First, show academic marks step for all hackathons
    if (!academicMarks) {
      console.log('Rendering AcademicMarksStep with hackathon data:', hackathon);
      return (
        <AcademicMarksStep
          hackathon={hackathon}
          onNext={(data) => {
            console.log('Academic marks submitted:', data);
            setAcademicMarks(data);
            setCurrentStep(1); // Explicitly set to PersonalInfoStep instead of using nextStep()
          }}
        />
      );
    }
    // Then, if it's a student-only hackathon, show eligibility check
    if (
      hackathon &&
      hackathon.eligibility &&
      hackathon.eligibility.includes('Students Only') &&
      !eligibilityChecked
    ) {
      return (
        <EligibilityCheckStep
          hackathon={hackathon}
          onNext={() => setCurrentStep(1)}
          onEligibilityChecked={(data) => {
            setEligibilityData(data);
            setEligibilityChecked(true);
            setCurrentStep(1); // Explicitly set to PersonalInfoStep
          }}
          onEligibilityError={(error) => {
            setEligibilityError(error);
          }}
        />
      );
    }
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            hackathon={hackathon}
          />
        );
      case 2:
        return (
          <ProfessionalInfoStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            hackathon={hackathon}
          />
        );
      case 3:
        return (
          <TeamInfoStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            hackathon={hackathon}
          />
        );
      case 4:
        return (
          <ProjectInfoStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            hackathon={hackathon}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            hackathon={hackathon}
          />
        );
      default:
        return (
          <PersonalInfoStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            hackathon={hackathon}
          />
        );
    }
  };

  // Step labels
  const steps = [
    { number: 1, label: 'Personal Info' },
    { number: 2, label: 'Professional Info' },
    { number: 3, label: 'Team Info' },
    { number: 4, label: 'Project Info' },
    { number: 5, label: 'Review' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-white text-xl font-medium">Loading registration form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => navigate('/hackathons')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Back to Hackathons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900 py-10 px-4 sm:px-6 relative">
      {/* Glowing orbs for visual effect */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Hackathon Header */}
        {hackathon && (
          <div className="mb-8 text-center">
            <div className="inline-block p-2 rounded-full bg-gray-800/50 backdrop-blur-sm mb-4">
              <img
                src={hackathon.logo}
                alt={hackathon.name}
                className="h-16 w-16 object-contain rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://picsum.photos/seed/${hackathon.id}/100/100`;
                }}
              />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
              Registration: {hackathon.name}
            </h1>
            <p className="text-gray-300 mb-2">{hackathon.description}</p>
            <p className="text-sm text-gray-400">
              Registration Deadline: <span className="text-purple-400 font-medium">{hackathon.registrationDeadline}</span>
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-center"
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${currentStep === step.number
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-transparent'
                    : currentStep > step.number
                      ? 'bg-green-500/20 text-green-400 border-green-500'
                      : 'bg-gray-800 text-gray-400 border-gray-700'
                    }`}
                >
                  {currentStep > step.number ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`mt-1 text-xs font-medium hidden sm:block ${currentStep === step.number
                    ? 'text-white'
                    : currentStep > step.number
                      ? 'text-green-400'
                      : 'text-gray-500'
                    }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Bar BG */}
          <div className="h-1 bg-gray-800 rounded-full">
            <div
              className="h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 shadow-xl rounded-xl p-6 md:p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default HackRegistration; 