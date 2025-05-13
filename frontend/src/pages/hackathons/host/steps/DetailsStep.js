import React, { useState } from 'react';

function DetailsStep({ formData, updateFormData, nextStep, prevStep, isNavigating }) {
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('formatting'); // 'formatting' or 'preview'

  const eligibilityOptions = [
    'Open to All', 'Students Only', 'Professionals Only', 'First-time Hackers',
    'Age 18+', 'Regional (Specify in Rules)', 'Invite Only'
  ];

  const technologyOptions = [
    'JavaScript', 'Python', 'Java', 'C/C++', 'C#/.NET', 'Go', 'Ruby', 'PHP',
    'Swift', 'Kotlin', 'Flutter', 'React', 'Angular', 'Vue.js', 'Node.js',
    'Django', 'Spring Boot', 'TensorFlow', 'PyTorch', 'AWS', 'Azure', 'Google Cloud',
    'Docker', 'Kubernetes', 'Blockchain', 'Ethereum', 'Solidity', 'AR/VR', 'Unity'
  ];

  const judgingCriteriaOptions = [
    'Technical Complexity', 'Innovation/Creativity', 'Design/UX', 'Practicality',
    'Impact', 'Presentation', 'Code Quality', 'Adherence to Theme'
  ];

  const defaultRulesTemplate = `1. Eligibility
   - All participants must be registered before the deadline
   - Teams must consist of 1-3 members
   - Each participant can only be part of one team

2. Project Requirements
   - All code must be written during the hackathon
   - Use of open-source libraries is allowed
   - Projects must be original work

3. Submission Guidelines
   - Submit all required materials before the deadline
   - Include a clear README with setup instructions
   - Provide a demo video (if applicable)

4. Code of Conduct
   - Be respectful to all participants
   - No harassment or discrimination
   - Follow the hackathon's theme and guidelines

5. Judging Criteria
   - Innovation and creativity
   - Technical implementation
   - User experience and design
   - Potential impact

6. Prizes and Awards
   - Winners will be announced at the closing ceremony
   - Prizes are non-transferable
   - Judges' decisions are final`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleCheckboxChange = (e, array, itemName) => {
    const { value, checked } = e.target;
    let updatedArray = [...formData[array] || []];

    // Special handling for "Open to All" - select all eligibility options
    if (array === 'eligibility' && value === 'Open to All') {
      if (checked) {
        // Select all eligibility options
        updatedArray = [...eligibilityOptions];
      } else {
        // Deselect all
        updatedArray = [];
      }
    } else {
      if (checked) {
        updatedArray.push(value);
      } else {
        updatedArray = updatedArray.filter(item => item !== value);

        // If this is eligibility and we're unchecking something while "Open to All" is selected,
        // then remove "Open to All" too
        if (array === 'eligibility' && updatedArray.includes('Open to All')) {
          updatedArray = updatedArray.filter(item => item !== 'Open to All');
        }
      }
    }

    updateFormData({ [array]: updatedArray });
  };

  const handleRulesChange = (e) => {
    updateFormData({ rules: e.target.value });
  };

  const handleSubmissionReqChange = (e) => {
    updateFormData({ submissionRequirements: e.target.value });
  };

  const handleTemplateClick = () => {
    updateFormData({ rules: defaultRulesTemplate });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Skip validation if navigating (coming from another step)
    if (isNavigating) {
      nextStep();
      return;
    }

    // Validate form
    const newErrors = {};

    if (!formData.rules) newErrors.rules = 'Rules are required';
    if (formData.judgingCriteria.length === 0) newErrors.judgingCriteria = 'At least one judging criterion is required';

    setErrors(newErrors);

    // If no errors, proceed to next step
    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Title Section */}
      <div className="mb-6 transform transition-all duration-500 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-2">
          Hackathon Details
        </h2>
        <p className="text-gray-300">
          Add important details to help participants understand your hackathon requirements and expectations.
        </p>
      </div>

      {/* Technologies */}
      <div className="mb-8 transition-all duration-300 hover:shadow-md hover:shadow-cyan-500/10 rounded-lg p-3">
        <label className="block text-lg font-medium text-cyan-300 mb-3">
          Technologies <span className="text-gray-400 text-sm">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {technologyOptions.map(tech => (
            <div key={tech} className="transition-transform duration-200 hover:scale-105">
              <label className="inline-flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-800/50">
                <input
                  type="checkbox"
                  value={tech}
                  checked={formData.technology.includes(tech)}
                  onChange={(e) => handleCheckboxChange(e, 'technology')}
                  className="form-checkbox h-4 w-4 text-cyan-500 rounded focus:ring-cyan-500 focus:ring-offset-gray-800 border-gray-600 transition-colors duration-200"
                />
                <span className="text-gray-300">{tech}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility */}
      <div className="mb-8 transition-all duration-300 hover:shadow-md hover:shadow-cyan-500/10 rounded-lg p-3">
        <label className="block text-lg font-medium text-cyan-300 mb-3">
          Eligibility <span className="text-gray-400 text-sm">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {eligibilityOptions.map(option => (
            <div key={option} className="transition-transform duration-200 hover:scale-105">
              <label className="inline-flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-800/50">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.eligibility.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, 'eligibility')}
                  className="form-checkbox h-4 w-4 text-cyan-500 rounded focus:ring-cyan-500 focus:ring-offset-gray-800 border-gray-600 transition-colors duration-200"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rules and Requirements */}
      <div className="mb-8 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 rounded-lg p-3">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-lg font-medium text-cyan-300">
            Rules and Guidelines *
          </label>
          <button
            type="button"
            onClick={handleTemplateClick}
            className="px-4 py-2 bg-gray-900/40 border border-cyan-500/50 rounded-lg text-cyan-400 hover:bg-gray-800 transition-all duration-300 hover:shadow-md hover:shadow-cyan-500/20 transform hover:translate-y-[-2px]"
          >
            <span className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="15" y2="17" />
              </svg>
              Use Template
            </span>
          </button>
        </div>
        <div className="bg-gray-900/40 rounded-lg border border-cyan-500/20 overflow-hidden transition-all duration-300 hover:border-cyan-500/40">
          <textarea
            value={formData.rules}
            onChange={handleRulesChange}
            rows="8"
            className="w-full px-4 py-3 bg-gray-900/40 border-0 focus:ring-0 text-white placeholder-gray-500 transition-all duration-300"
            placeholder="Enter the rules and guidelines for your hackathon..."
            id="rulesRequirements"
          ></textarea>
        </div>
        {errors.rules && <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.rules}</p>}
      </div>

      {/* Judging Criteria */}
      <div className="mb-8 transition-all duration-300 hover:shadow-md hover:shadow-cyan-500/10 rounded-lg p-3">
        <label className="block text-lg font-medium text-cyan-300 mb-3">
          Judging Criteria * <span className="text-gray-400 text-sm">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {judgingCriteriaOptions.map(criteria => (
            <div key={criteria} className="transition-transform duration-200 hover:scale-105">
              <label className="inline-flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-800/50">
                <input
                  type="checkbox"
                  value={criteria}
                  checked={formData.judgingCriteria.includes(criteria)}
                  onChange={(e) => handleCheckboxChange(e, 'judgingCriteria')}
                  className="form-checkbox h-4 w-4 text-cyan-500 rounded focus:ring-cyan-500 focus:ring-offset-gray-800 border-gray-600 transition-colors duration-200"
                />
                <span className="text-gray-300">{criteria}</span>
              </label>
            </div>
          ))}
        </div>
        {errors.judgingCriteria && (
          <p className="mt-2 text-sm text-red-500 bg-red-900/20 p-2 rounded-md animate-pulse">
            {errors.judgingCriteria}
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => prevStep()}
          className="px-6 py-3 bg-gray-800 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-gray-700 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/10"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:translate-y-[-2px]"
        >
          Next Step
        </button>
      </div>
    </form>
  );
}

export default DetailsStep; 