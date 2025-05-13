import React, { useState } from 'react';

function ProfessionalInfoStep({ formData, updateFormData, nextStep, prevStep, hackathon }) {
  const [errors, setErrors] = useState({});
  
  // Skill options from hackathon or fallback
  const skillOptions = hackathon?.skillOptions || [
    "JavaScript", "Python", "React", "Node.js", "Java", 
    "AWS", "Docker", "Blockchain", "AI/ML", "UI/UX"
  ];

  // Experience options
  const experienceOptions = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5+ years"
  ];

  // Role options
  const roleOptions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "UI/UX Designer",
    "Data Scientist",
    "ML Engineer",
    "DevOps Engineer",
    "Product Manager",
    "Other"
  ];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };
  
  // Handle skill selection
  const handleSkillClick = (skill) => {
    const updatedSkills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    
    updateFormData({ skills: updatedSkills });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    const newErrors = {};
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    if (!formData.experience) {
      newErrors.experience = 'Experience level is required';
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }
    
    if (formData.github && !/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/.test(formData.github)) {
      newErrors.github = 'Please enter a valid GitHub URL';
    }
    
    if (formData.portfolio && !/^(https?:\/\/)/.test(formData.portfolio)) {
      newErrors.portfolio = 'Please enter a valid URL starting with http:// or https://';
    }
    
    setErrors(newErrors);
    
    // If no errors, proceed to next step
    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          Professional Information
        </h2>
        <p className="text-gray-400 mt-2">
          Tell us about your skills and experience to help form the perfect team.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Role Field */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
            Your Role <span className="text-purple-500">*</span>
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`block w-full pl-3 pr-10 py-2.5 bg-gray-900/50 border ${errors.role ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100`}
          >
            <option value="">Select your role</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-500">{errors.role}</p>
          )}
        </div>
        
        {/* Experience Field */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-1">
            Experience Level <span className="text-purple-500">*</span>
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={`block w-full pl-3 pr-10 py-2.5 bg-gray-900/50 border ${errors.experience ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100`}
          >
            <option value="">Select your experience level</option>
            {experienceOptions.map((exp) => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
          {errors.experience && (
            <p className="mt-1 text-sm text-red-500">{errors.experience}</p>
          )}
        </div>
        
        {/* Skills Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Skills <span className="text-purple-500">*</span>
            <span className="text-gray-500 font-normal ml-2">
              (Select all that apply)
            </span>
          </label>
          
          {errors.skills && (
            <p className="mt-1 mb-2 text-sm text-red-500">{errors.skills}</p>
          )}
          
          <div className="flex flex-wrap gap-2">
            {skillOptions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillClick(skill)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium focus:outline-none transition-all duration-200 
                  ${formData.skills.includes(skill) 
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500' 
                    : 'bg-gray-800/60 text-gray-400 border border-gray-700 hover:border-gray-500'}`}
              >
                {skill}
                {formData.skills.includes(skill) && (
                  <span className="ml-1.5 text-purple-300">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* GitHub Field */}
        <div>
          <label htmlFor="github" className="block text-sm font-medium text-gray-300 mb-1">
            GitHub Profile
            <span className="text-gray-500 font-normal ml-2">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border ${errors.github ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500`}
              placeholder="github.com/yourusername"
            />
          </div>
          {errors.github && (
            <p className="mt-1 text-sm text-red-500">{errors.github}</p>
          )}
        </div>
        
        {/* Portfolio Field */}
        <div>
          <label htmlFor="portfolio" className="block text-sm font-medium text-gray-300 mb-1">
            Portfolio or Website
            <span className="text-gray-500 font-normal ml-2">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <input
              type="text"
              id="portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border ${errors.portfolio ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500`}
              placeholder="https://yourwebsite.com"
            />
          </div>
          {errors.portfolio && (
            <p className="mt-1 text-sm text-red-500">{errors.portfolio}</p>
          )}
        </div>
      </div>
      
      <div className="pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 bg-gray-800 text-gray-300 font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            <span className="mr-2">←</span>
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-lg shadow-lg hover:from-purple-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105"
          >
            Continue
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default ProfessionalInfoStep; 