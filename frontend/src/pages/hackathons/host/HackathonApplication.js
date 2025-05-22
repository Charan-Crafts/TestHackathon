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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 relative">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[100px]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px]"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header - More compact */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <span className="inline-block text-sm font-semibold bg-gradient-to-r from-blue-600/70 to-purple-600/70 px-3 py-0.5 rounded-full text-white uppercase tracking-wider">
              Organizer Portal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-3">
            Apply to Host a Hackathon
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            Join our platform as a hackathon organizer and create amazing opportunities for developers to innovate and grow.
          </p>
        </div>

        {/* Application form - More compact with better spacing */}
        <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-indigo-500/20 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Organizer Information */}
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white border-l-4 border-blue-500 pl-3">
                  Organizer Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="organizerName" className="block text-sm font-medium text-blue-300 mb-1">
                    Organizer Name *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="organizerName"
                      name="organizerName"
                      value={formData.organizerName}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 text-sm bg-gray-900/50 border ${validationErrors.organizerName ? 'border-red-500' : 'border-blue-700'} rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="Your company or organization name"
                    />
                  </div>
                  {validationErrors.organizerName && (
                    <p className="mt-1 text-xs text-red-400">{validationErrors.organizerName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="organizerEmail" className="block text-sm font-medium text-blue-300 mb-1">
                    Contact Email *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="organizerEmail"
                      name="organizerEmail"
                      value={formData.organizerEmail}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 text-sm bg-gray-900/50 border ${validationErrors.organizerEmail ? 'border-red-500' : 'border-blue-700'} rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {validationErrors.organizerEmail && (
                    <p className="mt-1 text-xs text-red-400">{validationErrors.organizerEmail}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="organizerWebsite" className="block text-sm font-medium text-blue-300 mb-1">
                    Organization Website (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      id="organizerWebsite"
                      name="organizerWebsite"
                      value={formData.organizerWebsite}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-gray-900/50 border border-blue-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hackathon Information */}
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white border-l-4 border-purple-500 pl-3">
                  Hackathon Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hackathonName" className="block text-sm font-medium text-blue-300 mb-1">
                    Hackathon Name *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="hackathonName"
                      name="hackathonName"
                      value={formData.hackathonName}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 text-sm bg-gray-900/50 border ${validationErrors.hackathonName ? 'border-red-500' : 'border-blue-700'} rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="Enter hackathon name"
                    />
                  </div>
                  {validationErrors.hackathonName && (
                    <p className="mt-1 text-xs text-red-400">{validationErrors.hackathonName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="hackathonTheme" className="block text-sm font-medium text-blue-300 mb-1">
                    Theme/Focus Area *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="hackathonTheme"
                      name="hackathonTheme"
                      value={formData.hackathonTheme}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 text-sm bg-gray-900/50 border ${validationErrors.hackathonTheme ? 'border-red-500' : 'border-blue-700'} rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="e.g. AI/ML, Web3, Climate Tech"
                    />
                  </div>
                  {validationErrors.hackathonTheme && (
                    <p className="mt-1 text-xs text-red-400">{validationErrors.hackathonTheme}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="tentativeDates" className="block text-sm font-medium text-blue-300 mb-1">
                    Tentative Dates *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="tentativeDates"
                      name="tentativeDates"
                      value={formData.tentativeDates}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 text-sm bg-gray-900/50 border ${validationErrors.tentativeDates ? 'border-red-500' : 'border-blue-700'} rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="e.g. March 15-20, 2024"
                    />
                  </div>
                  {validationErrors.tentativeDates && (
                    <p className="mt-1 text-xs text-red-400">{validationErrors.tentativeDates}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="purpose" className="block text-sm font-medium text-blue-300 mb-1">
                    Purpose/Goals *
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="purpose"
                      name="purpose"
                      rows={3}
                      value={formData.purpose}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm bg-gray-900/50 border ${validationErrors.purpose ? 'border-red-500' : 'border-blue-700'} rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="Describe the main objectives and expected outcomes of your hackathon"
                    />
                  </div>
                  {validationErrors.purpose && (
                    <p className="mt-1 text-xs text-red-400">{validationErrors.purpose}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
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
                      <span>Submit Application</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HackathonApplication; 