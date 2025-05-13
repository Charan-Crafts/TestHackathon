import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function PersonalInfoStep({ formData, updateFormData, nextStep, hackathon }) {
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[0-9\s-()]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
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
        {hackathon && (
          <div className="mb-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full border border-purple-500/30">
              {hackathon.name}
            </span>
          </div>
        )}
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          Personal Information
        </h2>
        <p className="text-gray-400 mt-2">
          Let us know who you are. We'll use this information to keep you updated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name Field */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
            First Name <span className="text-purple-500">*</span>
          </label>
          <div className="relative transition-all duration-300 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border ${errors.firstName ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-gray-100 placeholder-gray-500 transition-colors duration-200`}
              placeholder="Your first name"
              autoComplete="given-name"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name Field */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
            Last Name <span className="text-purple-500">*</span>
          </label>
          <div className="relative transition-all duration-300 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border ${errors.lastName ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-gray-100 placeholder-gray-500 transition-colors duration-200`}
              placeholder="Your last name"
              autoComplete="family-name"
            />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.lastName}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email <span className="text-purple-500">*</span>
          </label>
          <div className="relative transition-all duration-300 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-gray-100 placeholder-gray-500 transition-colors duration-200`}
              placeholder="your.email@example.com"
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number <span className="text-purple-500">*</span>
          </label>
          <div className="relative transition-all duration-300 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-gray-100 placeholder-gray-500 transition-colors duration-200`}
              placeholder="+1 (123) 456-7890"
              autoComplete="tel"
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.phoneNumber}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">We'll only use this for important updates</p>
        </div>
      </div>

      {/* Reminder about hackathon date */}
      {hackathon && hackathon.dates && (
        <div className="mt-4 bg-gradient-to-r from-purple-800/20 to-cyan-800/20 rounded-lg p-3 border border-purple-500/20">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <svg className="h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-sm text-gray-300">
              <span className="font-medium text-cyan-300">Important:</span> This hackathon is scheduled for {hackathon.dates}. Registration deadline is {hackathon.registrationDeadline}.
            </p>
          </div>
        </div>
      )}

      <div className="pt-5">
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-lg shadow-lg hover:from-purple-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105"
          >
            Continue
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="text-xs text-center text-gray-500 mt-8">
        <p>
          By registering, you agree to our <Link to="/terms" className="text-purple-400 hover:text-purple-300 underline">Terms of Service</Link> and <Link to="/privacy" className="text-purple-400 hover:text-purple-300 underline">Privacy Policy</Link>.
        </p>
      </div>
    </form>
  );
}

export default PersonalInfoStep; 