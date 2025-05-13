import React, { useState, useEffect } from 'react';
import { CalendarIcon, MapPinIcon, UsersIcon, BuildingLibraryIcon, UserGroupIcon } from '@heroicons/react/24/outline';

function EssentialsSection({ hackathon }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check if mobile view on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768); // md breakpoint
    };

    // Set initial value
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Create default data if hackathon prop doesn't have all needed data
  const businessHackathon = {
    title: "The Business Hackathon",
    organizer: "EdAthena",
    description: "The Business Hack in Collaboration with EdAthena brings together teams of four to take on real-world challenges, brainstorming and developing innovative solutions in a fast-paced, high-energy hackathon. Over the course of the event, participants will collaborate, think on their feet, and put their problem-solving skills to the test.",
    aboutEvent: "About EdAthena - AI Learning & AI Training Hub. Our mission is to bridge the gap between theoretical knowledge and real-world applications through innovative, AI-driven courses and resources.",
    dates: "7th & 8th April 2025",
    registrationFee: "This first round has no registration fee, if you are qualified for the 2nd Round, A Fee of Rs. 600 INR is applicable per team.",
    teamSize: 4,
    lastUpdated: "1 week ago",
    edAthenaDetails: [
      "Personalized Learning: Discover our unique teaching methodologies, interactive platforms, and how our programs can help you achieve your career goals.",
      "Program Completion and Certification: At EdAthena, successful learners receive industry-recognized certifications upon completing their programs.",
      "Empowered Community: Join a growing community of EdAthena alumni who are shaping the future with their expertise in AI and emerging technologies."
    ],
    evaluationCriteria: [
      { name: "Innovation", value: "25%" },
      { name: "Implementation", value: "25%" },
      { name: "Impact", value: "25%" },
      { name: "Presentation", value: "25%" }
    ],
    tracks: [
      "Urban Problems",
      "Financial Inclusion",
      "Economic Empowerment",
      "Agriculture",
      "Healthcare"
    ],
    guidelines: [
      "A team must have 4 members.",
      "There should be at least one female member in the team.",
      "Participants should bring chargers and necessary electronics to the venue including power strips.",
      "Internet connectivity will be provided.",
      "Students participating in The Business Hack cannot participate in other events during Becrez'25.",
      "Only refreshments will be provided, additional food is the participant's responsibility.",
      "The hackathon will be conducted within college hours.",
      "Participants are responsible for their own accommodation."
    ]
  };

  // Merge with provided data or use defaults
  const hackathonData = { ...businessHackathon, ...hackathon };

  // Truncate description for mobile view
  const shortDescription = hackathonData.description?.substring(0, 120) + "...";

  return (
    <div className="space-y-8">
      {/* About the Event */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">About This Hackathon</h2>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700">
          <p className="text-gray-300 text-sm md:text-base whitespace-pre-line">
            {hackathonData.aboutEvent || hackathonData.description}
          </p>

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Duration</h3>
                <p className="mt-1 text-sm text-gray-300">
                  {new Date(hackathonData.startDate).toLocaleDateString()} - {new Date(hackathonData.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <MapPinIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Location</h3>
                <p className="mt-1 text-sm text-gray-300">
                  {hackathonData.location && hackathonData.location.type === 'hybrid'
                    ? 'Hybrid (Online & In-person)'
                    : hackathonData.location && hackathonData.location.type === 'online'
                      ? 'Online'
                      : (hackathonData.location && hackathonData.location.venue) || 'Location not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Participants</h3>
                <p className="mt-1 text-sm text-gray-300">
                  {hackathonData.participants} Registered
                </p>
              </div>
            </div>
          </div>

          {/* Registration Fee */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg border border-blue-800/30">
            <h3 className="text-sm font-medium text-white flex items-center">
              <svg className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Registration Fee
            </h3>
            <p className="mt-2 text-sm text-gray-300 ml-7">
              {hackathonData.registrationFee || "Free for all participants"}
            </p>
          </div>
        </div>
      </div>

      {/* Host/Organizer Information Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Organizer Information</h2>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Organizer Logo/Avatar */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                {hackathonData.organizerLogo ? (
                  <img src={hackathonData.organizerLogo} alt={hackathonData.organizer} className="w-full h-full object-cover" />
                ) : (
                  <BuildingLibraryIcon className="w-12 h-12 text-gray-500" />
                )}
              </div>
            </div>

            {/* Organizer Details */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{hackathonData.organizer}</h3>

              <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-white">Host Type</h4>
                    <p className="mt-1 text-sm text-gray-300">
                      {hackathonData.organizerType || 'Educational Institution'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-white">Contact Email</h4>
                    <p className="mt-1 text-sm text-gray-300">
                      {hackathonData.organizerEmail || 'support@' + hackathonData.organizer.toLowerCase().replace(/\s/g, '') + '.com'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-white">Website</h4>
                    <p className="mt-1 text-sm text-gray-300">
                      <a href={hackathonData.organizerWebsite || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                        {hackathonData.organizerWebsite || 'www.' + hackathonData.organizer.toLowerCase().replace(/\s/g, '') + '.com'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-white">Previous Hackathons</h4>
                    <p className="mt-1 text-sm text-gray-300">
                      {hackathonData.previousHackathons || Math.floor(Math.random() * 10) + 1} hosted events
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-medium text-white mb-2">About the Organizer</h4>
                <p className="text-sm text-gray-300">
                  {hackathonData.organizerDescription || `${hackathonData.organizer} is a leading organization committed to fostering innovation and technological advancement through collaborative events like hackathons. With a focus on providing opportunities for talent development and creative problem-solving, they have established themselves as key contributors to the tech community.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories/Technologies */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Categories & Requirements</h2>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700">
          <div className="mb-5">
            <h3 className="text-sm font-medium text-white mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {hackathonData.categories && hackathonData.categories.length > 0 ? (
                hackathonData.categories.map((category, index) => (
                  <span key={index} className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-xs">
                    {category}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No specific categories defined</span>
              )}
            </div>
          </div>

          <div className="mb-5">
            <h3 className="text-sm font-medium text-white mb-3">Team Size</h3>
            <p className="text-gray-300 text-sm">
              Up to {hackathonData.maxTeamSize} members per team
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white mb-3">Eligibility</h3>
            <ul className="text-gray-300 text-sm list-disc list-inside">
              <li>Open to participants aged 18 and above</li>
              <li>Both students and professionals are welcome to participate</li>
              <li>No specific technical prerequisites required</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Resources</h2>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Documentation</h3>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <a href="#" className="ml-2 text-blue-400 hover:text-blue-300 text-sm">
                  Download Hackathon Guidelines (PDF)
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-2">Starter Templates</h3>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <a href="#" className="ml-2 text-blue-400 hover:text-blue-300 text-sm">
                  Starter Code Repositories
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-2">Additional Resources</h3>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <a href="#" className="ml-2 text-blue-400 hover:text-blue-300 text-sm">
                  API Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EssentialsSection; 