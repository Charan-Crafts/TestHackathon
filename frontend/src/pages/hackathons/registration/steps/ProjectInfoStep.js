import React, { useState, useEffect } from 'react';

function ProjectInfoStep({ formData, updateFormData, prevStep, nextStep, hackathon }) {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category options from hackathon or fallback
  const categoryOptions = hackathon?.categories || [
    "AI/ML", "Web3", "FinTech", "HealthTech",
    "EdTech", "Gaming", "Social Impact", "Open Innovation"
  ];

  // Bulletproof sanitization: flatten any nested arrays or stringified arrays to get plain strings
  const flattenToString = (cat) => {
    // If it's a stringified array, parse it
    if (typeof cat === 'string' && cat.startsWith('["') && cat.endsWith('"]')) {
      try {
        const arr = JSON.parse(cat);
        if (Array.isArray(arr)) return flattenToString(arr[0]);
      } catch (e) { /* ignore */ }
    }
    // If it's an array, flatten recursively
    if (Array.isArray(cat)) return flattenToString(cat[0]);
    // Otherwise, return as string
    return String(cat);
  };

  const sanitizedCategoryOptions = categoryOptions.map(flattenToString);

  // Tech stack options
  const techStackOptions = [
    "React", "Angular", "Vue", "Node.js",
    "Python", "Django", "Flask", "TensorFlow",
    "PyTorch", "Java", "Spring", "Go",
    "Ruby", "Rails", "PHP", "Laravel",
    "AWS", "Azure", "GCP", "Docker",
    "Kubernetes", "MongoDB", "PostgreSQL", "MySQL",
    "GraphQL", "REST API", "WebSockets", "Redis"
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Always store category as a string
    if (name === 'category') {
      updateFormData({ category: value });
    } else {
      updateFormData({ [name]: value });
    }
  };

  // Handle tech stack selection
  const handleTechStackClick = (tech) => {
    const updatedTechStack = formData.techStack.includes(tech)
      ? formData.techStack.filter(t => t !== tech)
      : [...formData.techStack, tech];

    updateFormData({ techStack: updatedTechStack });
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Form validation
    const newErrors = {};
    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = 'Project title is required';
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Project description is required';
    } else if (formData.projectDescription.trim().length < 50) {
      newErrors.projectDescription = 'Project description should be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.techStack.length === 0) {
      newErrors.techStack = 'Please select at least one technology';
    }

    setErrors(newErrors);

    // If no errors, proceed to next step
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        nextStep();
      }, 1000);
    }
  };

  useEffect(() => {
    if (Array.isArray(formData.category)) {
      updateFormData({ category: formData.category[0] });
    }
    // If it's a stringified array (e.g., '["JavaScript"]'), parse and flatten
    if (typeof formData.category === 'string' && formData.category.startsWith('["') && formData.category.endsWith('"]')) {
      try {
        const arr = JSON.parse(formData.category);
        if (Array.isArray(arr)) {
          updateFormData({ category: arr[0] });
        }
      } catch (e) {
        // ignore
      }
    }
  }, [formData.category, updateFormData]);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          Project Information
        </h2>
        <p className="text-gray-400 mt-2">
          Tell us about the project you're planning to build for this hackathon.
        </p>
      </div>

      <div className="space-y-6">
        {/* Project Title Field */}
        <div>
          <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-300 mb-1">
            Project Title <span className="text-purple-500">*</span>
          </label>
          <input
            type="text"
            id="projectTitle"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            className={`block w-full px-4 py-2.5 bg-gray-900/50 border ${errors.projectTitle ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500`}
            placeholder="Give your project a concise and descriptive title"
          />
          {errors.projectTitle && (
            <p className="mt-1 text-sm text-red-500">{errors.projectTitle}</p>
          )}
        </div>

        {/* Project Description Field */}
        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-300 mb-1">
            Project Description <span className="text-purple-500">*</span>
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            rows="4"
            className={`block w-full px-4 py-2.5 bg-gray-900/50 border ${errors.projectDescription ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500 resize-none`}
            placeholder="Describe your project idea, the problem it solves, and how you plan to implement it"
          />
          {errors.projectDescription && (
            <p className="mt-1 text-sm text-red-500">{errors.projectDescription}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Min 50 characters, current: {formData.projectDescription.length}
          </p>
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
            Project Category <span className="text-purple-500">*</span>
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={typeof formData.category === 'string' ? flattenToString(formData.category) : (Array.isArray(formData.category) ? flattenToString(formData.category) : '')}
              onChange={handleChange}
              className="block w-full px-4 py-2.5 bg-gray-900/70 border border-purple-500/40 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all duration-200 hover:border-purple-400 cursor-pointer appearance-none"
              style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
            >
              <option value="">Select a category</option>
              {sanitizedCategoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        {/* Tech Stack Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tech Stack <span className="text-purple-500">*</span>
            <span className="text-gray-500 font-normal ml-2">
              (Select all that you plan to use)
            </span>
          </label>

          {errors.techStack && (
            <p className="mt-1 mb-2 text-sm text-red-500">{errors.techStack}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {techStackOptions.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => handleTechStackClick(tech)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium focus:outline-none transition-all duration-200 
                  ${formData.techStack.includes(tech)
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500'
                    : 'bg-gray-800/60 text-gray-400 border border-gray-700 hover:border-gray-500'}`}
              >
                {tech}
                {formData.techStack.includes(tech) && (
                  <span className="ml-1.5 text-cyan-300">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Note box */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-300">Important Note</h3>
              <div className="mt-2 text-sm text-gray-400">
                <p>
                  You can modify your project details after registration. This information helps us prepare resources and connect you with relevant mentors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 bg-gray-800 text-gray-300 font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            disabled={isSubmitting}
          >
            <span className="mr-2">←</span>
            Back
          </button>
          <button
            type="submit"
            className={`px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-lg shadow-lg 
              ${!isSubmitting ? 'hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105' : 'opacity-80 cursor-not-allowed'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all duration-300`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>
                Review Registration
                <span className="ml-2">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ProjectInfoStep; 