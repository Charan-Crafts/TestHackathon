import React, { useState } from 'react';

function TeamInfoStep({ formData, updateFormData, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});
  const [showTeammateForm, setShowTeammateForm] = useState(false);
  const [currentTeammate, setCurrentTeammate] = useState({ name: '', email: '', role: '' });
  const [teammateError, setTeammateError] = useState('');
  
  // Team size options
  const teamSizeOptions = ['1', '2', '3', '4', '5'];
  
  // Teammate role options
  const teammateRoleOptions = [
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Data Scientist',
    'ML Engineer',
    'Full Stack Developer',
    'Mobile Developer',
    'DevOps Engineer',
    'Project Manager',
    'Other'
  ];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData({ [name]: type === 'checkbox' ? checked : value });
  };
  
  // Handle teammate form changes
  const handleTeammateChange = (e) => {
    const { name, value } = e.target;
    setCurrentTeammate(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add teammate to the list
  const addTeammate = () => {
    // Validate teammate form
    if (!currentTeammate.name.trim()) {
      setTeammateError('Name is required');
      return;
    }
    
    if (!currentTeammate.email.trim()) {
      setTeammateError('Email is required');
      return;
    } else if (!/^\S+@\S+\.\S+$/.test(currentTeammate.email)) {
      setTeammateError('Please enter a valid email address');
      return;
    }
    
    if (!currentTeammate.role) {
      setTeammateError('Role is required');
      return;
    }
    
    // Check if email already exists
    if (formData.teammates.some(teammate => teammate.email === currentTeammate.email)) {
      setTeammateError('A teammate with this email already exists');
      return;
    }
    
    // Add the new teammate
    const updatedTeammates = [...formData.teammates, { ...currentTeammate, id: Date.now() }];
    updateFormData({ teammates: updatedTeammates });
    
    // Reset form and hide it
    setCurrentTeammate({ name: '', email: '', role: '' });
    setTeammateError('');
    setShowTeammateForm(false);
  };
  
  // Remove teammate from the list
  const removeTeammate = (id) => {
    const updatedTeammates = formData.teammates.filter(teammate => teammate.id !== id);
    updateFormData({ teammates: updatedTeammates });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    const newErrors = {};
    if (!formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }
    
    // Validate team size consistency
    const selectedTeamSize = parseInt(formData.teamSize);
    const currentTeamSize = formData.teammates.length + 1; // +1 for the user
    
    if (currentTeamSize > selectedTeamSize) {
      newErrors.teamSize = `You've added ${currentTeamSize - 1} teammates, but selected a team size of ${selectedTeamSize}`;
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
          Team Information
        </h2>
        <p className="text-gray-400 mt-2">
          Tell us about your team or join forces with other participants.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Team Name Field */}
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-1">
            Team Name <span className="text-purple-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="teamName"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border ${errors.teamName ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500`}
              placeholder="Enter your team name"
            />
          </div>
          {errors.teamName && (
            <p className="mt-1 text-sm text-red-500">{errors.teamName}</p>
          )}
        </div>
        
        {/* Team Size Field */}
        <div>
          <label htmlFor="teamSize" className="block text-sm font-medium text-gray-300 mb-1">
            Team Size <span className="text-purple-500">*</span>
          </label>
          <select
            id="teamSize"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            className={`block w-full pl-3 pr-10 py-2.5 bg-gray-900/50 border ${errors.teamSize ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100`}
          >
            {teamSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} {parseInt(size) === 1 ? 'member' : 'members'}
              </option>
            ))}
          </select>
          {errors.teamSize && (
            <p className="mt-1 text-sm text-red-500">{errors.teamSize}</p>
          )}
        </div>
        
        {/* Looking for Team Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="lookingForTeam"
            name="lookingForTeam"
            checked={formData.lookingForTeam}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900 bg-gray-900/50"
          />
          <label htmlFor="lookingForTeam" className="ml-2 block text-sm text-gray-300">
            I'm looking for teammates
          </label>
        </div>
        
        {/* Teammates Section */}
        {parseInt(formData.teamSize) > 1 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium text-gray-300">
                Teammates ({formData.teammates.length}/{parseInt(formData.teamSize) - 1})
              </h3>
              {formData.teammates.length < parseInt(formData.teamSize) - 1 && !showTeammateForm && (
                <button
                  type="button"
                  onClick={() => setShowTeammateForm(true)}
                  className="px-3 py-1 bg-purple-600/30 text-purple-300 font-medium rounded-md border border-purple-500 hover:bg-purple-600/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  Add Teammate
                </button>
              )}
            </div>
            
            {/* Teammate List */}
            {formData.teammates.length > 0 ? (
              <div className="space-y-2 mb-4">
                {formData.teammates.map((teammate) => (
                  <div 
                    key={teammate.id} 
                    className="flex items-center justify-between p-3 bg-gray-800/40 border border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-3">
                        {teammate.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-200">{teammate.name}</div>
                        <div className="text-xs text-gray-400 flex space-x-2">
                          <span>{teammate.email}</span>
                          <span>•</span>
                          <span>{teammate.role}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTeammate(teammate.id)}
                      className="text-gray-400 hover:text-red-400 focus:outline-none"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">
                {!showTeammateForm && 'No teammates added yet.'}
              </p>
            )}
            
            {/* Add Teammate Form */}
            {showTeammateForm && (
              <div className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Add New Teammate</h4>
                
                {teammateError && (
                  <div className="p-2 mb-3 bg-red-900/30 border border-red-800 rounded text-sm text-red-300">
                    {teammateError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="teammateName" className="block text-xs font-medium text-gray-400 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="teammateName"
                      name="name"
                      value={currentTeammate.name}
                      onChange={handleTeammateChange}
                      className="block w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500 text-sm"
                      placeholder="Teammate's name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="teammateEmail" className="block text-xs font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="teammateEmail"
                      name="email"
                      value={currentTeammate.email}
                      onChange={handleTeammateChange}
                      className="block w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500 text-sm"
                      placeholder="Teammate's email"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="teammateRole" className="block text-xs font-medium text-gray-400 mb-1">
                      Role
                    </label>
                    <select
                      id="teammateRole"
                      name="role"
                      value={currentTeammate.role}
                      onChange={handleTeammateChange}
                      className="block w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-gray-100 text-sm"
                    >
                      <option value="">Select role</option>
                      {teammateRoleOptions.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTeammateForm(false);
                      setTeammateError('');
                      setCurrentTeammate({ name: '', email: '', role: '' });
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-700 text-gray-300 font-medium rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addTeammate}
                    className="px-3 py-1.5 text-sm bg-purple-600 text-white font-medium rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Team info notice */}
        <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-300">
                {formData.lookingForTeam 
                  ? "Your profile will be visible to other participants looking for teammates." 
                  : "Not looking for teammates? You can still register as an individual or with your existing team."}
              </p>
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

export default TeamInfoStep; 