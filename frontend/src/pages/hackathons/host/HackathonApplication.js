import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hackathonApplicationAPI, handleApiError } from '../../../services/api';

function HackathonApplication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizerName: '',
    organizerEmail: '',
    organizerWebsite: '',
    hackathonName: '',
    hackathonTheme: '',
    tentativeDates: '',
    purpose: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Clear validation errors when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organizerName.trim()) errors.organizerName = "Organizer name is required";
    if (!formData.organizerEmail.trim()) errors.organizerEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.organizerEmail)) errors.organizerEmail = "Email is invalid";

    if (!formData.hackathonName.trim()) errors.hackathonName = "Hackathon name is required";
    if (!formData.hackathonTheme.trim()) errors.hackathonTheme = "Theme is required";
    if (!formData.tentativeDates.trim()) errors.tentativeDates = "Tentative dates are required";
    if (!formData.purpose.trim()) errors.purpose = "Purpose is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Call the API to submit the application
      const response = await hackathonApplicationAPI.submitApplication(formData);

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Navigate to dashboard after success (optional)
      // setTimeout(() => {
      //   navigate('/dashboard/my-applications');
      // }, 3000);

    } catch (error) {
      console.error('Error submitting hackathon application:', error);
      const errorDetails = handleApiError(error);

      setIsSubmitting(false);

      // If there are validation errors from the API, display them
      if (errorDetails.status === 400 && errorDetails.data && errorDetails.data.message) {
        alert(`Failed to submit application: ${errorDetails.data.message}`);
      } else {
        alert(`Failed to submit application: ${errorDetails.message}`);
      }
    }
  };

  // If application is submitted successfully, show success message
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-gray-800/70 via-purple-900/10 to-gray-800/70 py-8 sm:py-12 relative">
        {/* Background effects */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-blue-500/30 rounded-full filter blur-[120px] pointer-events-none"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-purple-500/30 rounded-full filter blur-[120px] pointer-events-none"></div>

        {/* Main container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gray-800/40 backdrop-filter backdrop-blur-md rounded-xl p-8 shadow-2xl border border-blue-500/30 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-2xl bg-gradient-to-bl from-blue-500/30 to-indigo-500/30 pointer-events-none"></div>
            <div className="absolute left-0 bottom-0 h-16 w-16 rounded-tr-2xl bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 pointer-events-none"></div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full backdrop-blur-sm border border-blue-400/30 mb-8">
                <svg className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-4 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                Application Submitted!
              </h2>

              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Your hackathon application has been received. Our team will review your proposal and respond within 48 hours.
              </p>

              <div className="bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-blue-900/20 backdrop-filter backdrop-blur-md rounded-xl p-8 mb-10 text-left border border-blue-500/30 relative overflow-hidden max-w-3xl mx-auto">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none"></div>

                <h3 className="text-xl font-medium text-white mb-6 border-l-4 border-blue-500 pl-3">
                  What happens next?
                </h3>

                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-semibold mr-4">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-300">Our team will review your proposal within 48 hours</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-semibold mr-4">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-300">If approved, you'll receive an email with access to set up your complete hackathon</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-semibold mr-4">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-300">You can track your application status in your dashboard</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Link
                  to="/dashboard"
                  className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-8 rounded-lg shadow-lg shadow-indigo-900/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden group"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                  <span className="relative">Go to Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-800/70 via-purple-900/10 to-gray-800/70 py-8 sm:py-12 relative">
      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-2">
            <span className="inline-block text-sm font-semibold bg-gradient-to-r from-blue-600/70 to-indigo-600/70 px-4 py-1 rounded-full text-white uppercase tracking-wider mb-3">Organizer Portal</span>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-4 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
            Apply to Host a Hackathon
          </h1>
        </div>

        {/* Application form */}
        <div className="bg-gray-800/40 backdrop-filter backdrop-blur-md rounded-xl p-8 shadow-xl border border-indigo-500/20 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-2xl bg-gradient-to-bl from-purple-500/30 to-pink-500/30 pointer-events-none"></div>
          <div className="absolute left-0 bottom-0 h-16 w-16 rounded-tr-2xl bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Organizer Information */}
            <div>
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white border-l-4 border-blue-500 pl-3">Organizer Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="organizerName" className="block text-sm font-medium text-blue-300 mb-1">
                    Organizer Name *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="organizerName"
                      name="organizerName"
                      value={formData.organizerName}
                      onChange={handleChange}
                      className={`w-full pl-10 px-4 py-2 bg-gray-800/80 border ${validationErrors.organizerName ? 'border-red-500' : 'border-blue-700'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="Your company or organization name"
                    />
                  </div>
                  {validationErrors.organizerName && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.organizerName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="organizerEmail" className="block text-sm font-medium text-blue-300 mb-1">
                    Contact Email *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="organizerEmail"
                      name="organizerEmail"
                      value={formData.organizerEmail}
                      onChange={handleChange}
                      className={`w-full pl-10 px-4 py-2 bg-gray-800/80 border ${validationErrors.organizerEmail ? 'border-red-500' : 'border-blue-700'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {validationErrors.organizerEmail && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.organizerEmail}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="organizerWebsite" className="block text-sm font-medium text-blue-300 mb-1">
                  Organization Website (Optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    id="organizerWebsite"
                    name="organizerWebsite"
                    value={formData.organizerWebsite}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2 bg-gray-800/80 border border-blue-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Hackathon Information */}
            <div className="pt-4">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white border-l-4 border-purple-500 pl-3">Hackathon Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="hackathonName" className="block text-sm font-medium text-purple-300 mb-1">
                    Proposed Hackathon Name *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="hackathonName"
                      name="hackathonName"
                      value={formData.hackathonName}
                      onChange={handleChange}
                      className={`w-full pl-10 px-4 py-2 bg-gray-800/80 border ${validationErrors.hackathonName ? 'border-red-500' : 'border-purple-700'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                      placeholder="e.g. CyberHack 2023"
                    />
                  </div>
                  {validationErrors.hackathonName && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.hackathonName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="hackathonTheme" className="block text-sm font-medium text-purple-300 mb-1">
                    Hackathon Theme/Topic *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="hackathonTheme"
                      name="hackathonTheme"
                      value={formData.hackathonTheme}
                      onChange={handleChange}
                      className={`w-full pl-10 px-4 py-2 bg-gray-800/80 border ${validationErrors.hackathonTheme ? 'border-red-500' : 'border-purple-700'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                      placeholder="e.g. AI for Sustainability, Web3 Innovation"
                    />
                  </div>
                  {validationErrors.hackathonTheme && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.hackathonTheme}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="tentativeDates" className="block text-sm font-medium text-purple-300 mb-1">
                    Tentative Dates *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="tentativeDates"
                      name="tentativeDates"
                      value={formData.tentativeDates}
                      onChange={handleChange}
                      className={`w-full pl-10 px-4 py-2 bg-gray-800/80 border ${validationErrors.tentativeDates ? 'border-red-500' : 'border-purple-700'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                      placeholder="e.g. Mid-August 2023, Oct 15-20, 2023"
                    />
                  </div>
                  {validationErrors.tentativeDates && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.tentativeDates}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-purple-300 mb-1">
                    Purpose & Goals *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <textarea
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      rows="4"
                      className={`w-full pl-10 px-4 py-2 bg-gray-800/80 border ${validationErrors.purpose ? 'border-red-500' : 'border-purple-700'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                      placeholder="Briefly describe the purpose of your hackathon, target audience, and what you hope to achieve"
                    ></textarea>
                  </div>
                  {validationErrors.purpose && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.purpose}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg font-medium transition-colors border border-cyan-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional info */}
        <div className="mt-10 bg-gray-800/40 backdrop-filter backdrop-blur-md rounded-xl p-8 shadow-lg border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-pink-600/10 rounded-full filter blur-3xl pointer-events-none"></div>

          <h3 className="text-lg font-medium text-white border-l-4 border-cyan-500 pl-3 mb-6">
            Application Process
          </h3>

          <div className="space-y-6">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-semibold mr-4">
                1
              </div>
              <div>
                <h4 className="text-white font-medium">Initial Application</h4>
                <p className="text-gray-300">Submit this form with basic details about your proposed hackathon</p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 font-semibold mr-4">
                2
              </div>
              <div>
                <h4 className="text-white font-medium">Review</h4>
                <p className="text-gray-300">Our team reviews your application (typically within 48 hours)</p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 font-semibold mr-4">
                3
              </div>
              <div>
                <h4 className="text-white font-medium">Approval & Setup</h4>
                <p className="text-gray-300">If approved, you'll get access to set up your complete hackathon details</p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold mr-4">
                4
              </div>
              <div>
                <h4 className="text-white font-medium">Final Review</h4>
                <p className="text-gray-300">We'll review your complete hackathon details before publishing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HackathonApplication; 