import React, { useState } from 'react';

function ReviewStep({ formData, prevStep, handleSubmit, hackathon }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [termsError, setTermsError] = useState(false);

    // Process form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!agreeToTerms) {
            setTermsError(true);
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            handleSubmit();
        }, 1000);
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                    Review Your Information
                </h2>
                <p className="text-gray-400 mt-2">
                    Please review your registration details before finalizing your submission.
                </p>
            </div>

            <div className="space-y-8">
                {/* Personal Info Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <div className="py-3 px-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                    </div>
                    <div className="p-4 sm:p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm text-gray-400">Name</h4>
                                <p className="text-white">{formData.firstName} {formData.lastName}</p>
                            </div>
                            <div>
                                <h4 className="text-sm text-gray-400">Email</h4>
                                <p className="text-white">{formData.email}</p>
                            </div>
                            <div>
                                <h4 className="text-sm text-gray-400">Phone</h4>
                                <p className="text-white">{formData.phoneNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Info Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <div className="py-3 px-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-white">Professional Information</h3>
                    </div>
                    <div className="p-4 sm:p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm text-gray-400">Role</h4>
                                <p className="text-white">{formData.role}</p>
                            </div>
                            <div>
                                <h4 className="text-sm text-gray-400">Experience</h4>
                                <p className="text-white">{formData.experience}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <h4 className="text-sm text-gray-400">Skills</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {formData.skills.map((skill) => (
                                        <span key={skill} className="px-2.5 py-1 bg-cyan-900/30 text-cyan-300 text-xs rounded-full border border-cyan-800">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm text-gray-400">GitHub</h4>
                                <p className="text-white">{formData.github || "Not provided"}</p>
                            </div>
                            <div>
                                <h4 className="text-sm text-gray-400">Portfolio</h4>
                                <p className="text-white">{formData.portfolio || "Not provided"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Info Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <div className="py-3 px-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-white">Team Information</h3>
                    </div>
                    <div className="p-4 sm:p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm text-gray-400">Team Name</h4>
                                <p className="text-white">{formData.teamName || "Not specified"}</p>
                            </div>
                            <div>
                                <h4 className="text-sm text-gray-400">Team Size</h4>
                                <p className="text-white">{formData.teamSize}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <h4 className="text-sm text-gray-400">Looking for Team Members</h4>
                                <p className="text-white">{formData.lookingForTeam ? "Yes" : "No"}</p>
                            </div>
                            {formData.teammates && formData.teammates.length > 0 && (
                                <div className="sm:col-span-2">
                                    <h4 className="text-sm text-gray-400 mb-2">Team Members</h4>
                                    <ul className="space-y-2">
                                        {formData.teammates.map((teammate, index) => (
                                            <li key={index} className="flex items-center p-2 bg-gray-800 rounded-lg">
                                                <div className="ml-2">
                                                    <p className="text-sm text-white">{teammate.name}</p>
                                                    <p className="text-xs text-gray-400">{teammate.email}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Project Info Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <div className="py-3 px-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-white">Project Information</h3>
                    </div>
                    <div className="p-4 sm:p-5 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <h4 className="text-sm text-gray-400">Project Title</h4>
                                <p className="text-white">{formData.projectTitle}</p>
                            </div>
                            <div>
                                <h4 className="text-sm text-gray-400">Project Description</h4>
                                <p className="text-white">{formData.projectDescription}</p>
                            </div>
                            <div>
                                <h4 className="text-sm text-gray-400">Category</h4>
                                <p className="text-white">{formData.category}</p>
                            </div>
                            <div>
                                <h4 className="text-sm text-gray-400">Tech Stack</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {formData.techStack.map((tech) => (
                                        <span key={tech} className="px-2.5 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-800">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={() => {
                                    setAgreeToTerms(!agreeToTerms);
                                    setTermsError(false);
                                }}
                                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                            />
                        </div>
                        <label htmlFor="terms" className="ml-3 text-sm text-gray-300">
                            I agree to the <a href="#" className="text-purple-400 hover:text-purple-300">Terms and Conditions</a> and confirm that all information provided is accurate.
                        </label>
                    </div>
                    {termsError && (
                        <p className="mt-2 text-sm text-red-500">You must agree to the terms and conditions to proceed.</p>
                    )}
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
                                Submitting...
                            </div>
                        ) : (
                            <>
                                Submit Registration
                                <span className="ml-2">➔</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default ReviewStep; 