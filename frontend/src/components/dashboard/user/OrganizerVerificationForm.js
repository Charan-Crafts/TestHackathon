import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ClockIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import API, { verificationAPI } from '../../../services/api';
import axios from 'axios';
import VerificationPending from './VerificationPending';

const OrganizerVerificationForm = () => {
    const navigate = useNavigate();
    const { user, updateUserRole } = useAuth();

    const [formData, setFormData] = useState({
        // Personal Details
        fullName: '',
        email: '',
        phoneNumber: '',
        linkedinProfile: '',
        photoIdProof: null,
        photoIdProofName: '',

        // Organization Details
        organizationName: '',
        organizationType: '',
        website: '',
        role: '',
        organizationEmail: '',
        organizationIdProof: null,
        organizationIdProofName: '',
    });

    const [step, setStep] = useState(1); // 1: Personal Details, 2: Organization Details, 3: Review
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState({
        photoIdProof: null,
        organizationIdProof: null
    });
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already verified or has a pending verification
    const checkVerificationStatus = async () => {
        try {
            setIsLoading(true);
            const response = await verificationAPI.getVerificationStatus();
            if (response.data.success) {
                setVerificationStatus(response.data.data);

                if (response.data.data.isApproved) {
                    // Verification is approved
                    toast.success('You are verified as an organizer! Please refresh the page to see updated features.');

                    // Update user role to organizer to enable dashboard features
                    if (updateUserRole) {
                        updateUserRole('organizer');
                    }

                    // Remove the redirection and just update the verification status
                    setVerificationStatus(response.data.data);
                } else if (response.data.data.status === 'rejected') {
                    // Verification was rejected
                    toast.error('Your verification request was rejected. Please see the feedback and submit a new application.');

                    // Ensure organizer UI elements are not shown
                    if (updateUserRole) {
                        updateUserRole('user');
                    }
                } else {
                    // Verification is pending
                    toast.success('Your verification request is currently under review. We will notify you once it is processed.');

                    // Ensure organizer UI elements are not shown
                    if (updateUserRole) {
                        updateUserRole('pending_organizer');
                    }
                }
            }
        } catch (error) {
            console.error('Error checking verification status:', error);
            // If there's an error (like 404 Not Found), it means the user doesn't have a verification request
            setVerificationStatus(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Check verification status when component mounts
        checkVerificationStatus();
    }, []);

    // Prefill with user data if available
    useEffect(() => {
        if (user) {
            setFormData(prevData => ({
                ...prevData,
                fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : prevData.fullName,
                email: user.email || prevData.email,
                phoneNumber: user.phoneNumber || prevData.phoneNumber
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            const file = files[0];
            const fileName = file.name;

            // Log file details for debugging
            console.log(`File selected for ${name}:`, file.name, file.type, file.size);

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`File ${fileName} is too large. Maximum size is 5MB.`);
                return;
            }

            // Check file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                toast.error(`File ${fileName} has an invalid format. Please use PDF, JPG, or PNG.`);
                return;
            }

            setFormData({
                ...formData,
                [name]: file,
                [`${name}Name`]: fileName
            });
        }
    };

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.photoIdProof) newErrors.photoIdProof = 'Photo ID proof is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};

        if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
        if (!formData.organizationType) newErrors.organizationType = 'Organization type is required';
        if (!formData.role) newErrors.role = 'Role/designation is required';
        if (!formData.organizationEmail) newErrors.organizationEmail = 'Organization email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.organizationEmail)) newErrors.organizationEmail = 'Organization email is invalid';
        if (!formData.organizationIdProof) newErrors.organizationIdProof = 'Organization ID proof is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const uploadFiles = async () => {
        try {
            // Make sure files exist before appending
            if (!formData.photoIdProof || !formData.organizationIdProof) {
                throw new Error('Both photo ID and organization ID proofs are required');
            }

            // Create FormData object for file uploads
            const uploadFormData = new FormData();

            // Append files with correct field names
            uploadFormData.append('photoIdProof', formData.photoIdProof);
            uploadFormData.append('organizationIdProof', formData.organizationIdProof);

            // Use verificationAPI service
            const response = await verificationAPI.uploadProofs(uploadFormData);

            console.log('Upload response:', response.data);

            if (response.data && response.data.success) {
                return {
                    photoIdProof: response.data.data.photoIdProof,
                    organizationIdProof: response.data.data.organizationIdProof,
                    photoIdProofUrl: response.data.data.photoIdProofUrl,
                    organizationIdProofUrl: response.data.data.organizationIdProofUrl
                };
            } else {
                throw new Error('Failed to upload files');
            }
        } catch (error) {
            console.error('File upload error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation check before submission
        const personalValid = validateStep1();
        const organizationValid = validateStep2();

        if (!personalValid || !organizationValid) {
            toast.error('Please correct the errors before submitting');
            setStep(personalValid ? 2 : 1); // Go back to the problematic step
            return;
        }

        setIsSubmitting(true);

        try {
            // Upload files first
            console.log('Starting file upload...');
            const fileIds = await uploadFiles();
            console.log('Files uploaded successfully:', fileIds);

            // Prepare verification request data
            const verificationData = {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                linkedinProfile: formData.linkedinProfile || '',
                photoIdProof: fileIds.photoIdProof,
                organizationName: formData.organizationName,
                organizationType: formData.organizationType,
                website: formData.website || '',
                role: formData.role,
                organizationEmail: formData.organizationEmail,
                organizationIdProof: fileIds.organizationIdProof
            };

            console.log('Submitting verification data:', verificationData);

            // Use verificationAPI service instead of direct API call
            const response = await verificationAPI.submitVerification(verificationData);
            console.log('Verification submission response:', response.data);

            if (response.data && response.data.success) {
                toast.success('Your verification request has been submitted successfully!');

                // Set user role to pending_organizer to restrict access to organizer features
                if (updateUserRole) {
                    updateUserRole('pending_organizer');
                }

                // Show success message
                toast.success('Our team will review your application and respond within 2-3 business days.');

                // Mark verification as pending in the component state and show the pending message
                setVerificationStatus({
                    status: 'pending',
                    isApproved: false,
                    submittedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    feedback: null
                });

                // Reset the submission state
                setIsSubmitting(false);

                // No redirection - stay on the same page showing pending status
            } else {
                throw new Error(response.data.message || 'Failed to submit verification request');
            }
        } catch (error) {
            console.error('Verification submission error:', error);
            let errorMessage = 'Failed to submit verification request. Please try again.';

            if (error.response && error.response.data) {
                console.error('Error response data:', error.response.data);
                errorMessage = error.response.data.message || errorMessage;
            }

            toast.error(errorMessage);
            setIsSubmitting(false);
        }
    };

    // Update test function too
    const testFileUpload = async () => {
        try {
            toast.info('Testing file upload...');

            if (!formData.photoIdProof || !formData.organizationIdProof) {
                toast.error('Both files must be selected first');
                return;
            }

            // Log what we're sending
            console.log('Photo ID:', formData.photoIdProof.name, formData.photoIdProof.type);
            console.log('Org ID:', formData.organizationIdProof.name, formData.organizationIdProof.type);

            // Create a FormData with EXACT field names
            const testFormData = new FormData();
            testFormData.append('photoIdProof', formData.photoIdProof);
            testFormData.append('organizationIdProof', formData.organizationIdProof);

            // Add the entityType field with a valid enum value
            testFormData.append('entityType', 'user');

            // Use verificationAPI service instead of direct axios call
            const response = await verificationAPI.uploadProofs(testFormData);

            console.log('Test upload response:', response.data);
            toast.success('Test upload successful!');
        } catch (error) {
            console.error('Test upload error:', error);
            console.error('Error response:', error.response?.data);
            toast.error('Test upload failed: ' + (error.response?.data?.message || error.message));
        }
    };

    // Add debug log before render logic
    console.log('Current verificationStatus:', verificationStatus);

    if (isLoading) {
        // ...loading spinner...
        return (
            <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
            </div>
        );
    } else if (verificationStatus && verificationStatus.status === 'pending') {
        // Show only the pending message (no form, no dashboard button)
        return <VerificationPending />;
    } else if (verificationStatus && verificationStatus.status === 'rejected') {
        // ...existing rejection message and resubmission logic...
        return (
            <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-700 max-w-2xl mx-auto mt-12">
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-16 w-16 text-red-500 mx-auto mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Verification Rejected</h2>
                    <p className="text-gray-300 mb-4">
                        Unfortunately, your organizer verification request has been rejected.
                        Please review the feedback below and submit a new application with the requested changes.
                    </p>

                    <div className="bg-red-900/30 rounded-lg border border-red-500/30 p-4 mb-6 text-left">
                        <h3 className="text-lg font-semibold text-red-300 mb-2">Feedback from Admin:</h3>
                        <p className="text-gray-300">
                            {verificationStatus.feedback || "No specific feedback was provided. Please ensure all your information is accurate and your ID proofs are clear and valid."}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => {
                                setVerificationStatus(null);
                                setStep(1);
                            }}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Submit New Application
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        // Show the verification form
        return (
            <div className="min-h-[90vh] bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center py-10 px-2 overflow-x-hidden">
                <div className="mb-8 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-white mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                        Become a Hackathon Organizer
                    </h1>
                    <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                        As an organizer, you'll be able to host your own hackathons, manage participants, review submissions, and more.
                        Please complete this verification form with accurate information. Our team will review your submission and respond within 2-3 business days.
                    </p>
                    <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/20 rounded-md text-sm text-yellow-300 shadow">
                        <strong>Important Note:</strong> Once you submit this form, your account will be pending admin verification.<br />
                        You will not have immediate access to organizer features until your profile is approved.<br />
                        <span className="block mt-2">The organizer dashboard section will not be visible in your navigation until you are verified.</span>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-8 w-full max-w-2xl">
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center ${step >= 1 ? 'text-indigo-500' : 'text-gray-500'}`}>
                            <div className={`flex items-center justify-center h-10 w-10 rounded-full border-4 ${step >= 1 ? 'bg-indigo-100 border-indigo-500' : 'bg-gray-100 border-gray-500'} shadow-md`}>
                                <span className="text-lg font-bold">1</span>
                            </div>
                            <span className="ml-3 text-base font-semibold">Personal Details</span>
                        </div>
                        <div className={`w-full mx-4 border-t-4 ${step >= 2 ? 'border-indigo-500' : 'border-gray-300'}`}></div>
                        <div className={`flex items-center ${step >= 2 ? 'text-indigo-500' : 'text-gray-500'}`}>
                            <div className={`flex items-center justify-center h-10 w-10 rounded-full border-4 ${step >= 2 ? 'bg-indigo-100 border-indigo-500' : 'bg-gray-100 border-gray-500'} shadow-md`}>
                                <span className="text-lg font-bold">2</span>
                            </div>
                            <span className="ml-3 text-base font-semibold">Organization Details</span>
                        </div>
                        <div className={`w-full mx-4 border-t-4 ${step >= 3 ? 'border-indigo-500' : 'border-gray-300'}`}></div>
                        <div className={`flex items-center ${step >= 3 ? 'text-indigo-500' : 'text-gray-500'}`}>
                            <div className={`flex items-center justify-center h-10 w-10 rounded-full border-4 ${step >= 3 ? 'bg-indigo-100 border-indigo-500' : 'bg-gray-100 border-gray-500'} shadow-md`}>
                                <span className="text-lg font-bold">3</span>
                            </div>
                            <span className="ml-3 text-base font-semibold">Review</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 shadow-2xl rounded-2xl p-10 border border-gray-700 w-full max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        {step === 1 ? 'Personal Details' : step === 2 ? 'Organization Details' : 'Review Your Information'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Step 1: Personal Details */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-base font-medium text-gray-300 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Enter your legal name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 bg-gray-900 border ${errors.fullName ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white text-base`}
                                    />
                                    {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-base font-medium text-gray-300 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 bg-gray-900 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white text-base`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phoneNumber" className="block text-base font-medium text-gray-300 mb-1">
                                        Phone Number (with country code) *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="e.g. +91 9876543210"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 bg-gray-900 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white text-base`}
                                    />
                                    {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
                                </div>

                                <div>
                                    <label htmlFor="linkedinProfile" className="block text-base font-medium text-gray-300 mb-1">
                                        LinkedIn Profile (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        id="linkedinProfile"
                                        name="linkedinProfile"
                                        placeholder="e.g. https://linkedin.com/in/username"
                                        value={formData.linkedinProfile}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white text-base"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="photoIdProof" className="block text-base font-medium text-gray-300 mb-1">
                                        Photo ID Proof *
                                    </label>
                                    <div className="mt-1 flex items-center">
                                        <label className="relative flex-1 group">
                                            <div className="w-full px-4 py-3 bg-gray-900 border border-dashed border-indigo-500 rounded-lg text-gray-300 cursor-pointer hover:bg-gray-800 transition text-base">
                                                <span className="text-indigo-400 group-hover:text-indigo-300">Upload government-issued ID</span> (.pdf, .jpg, .png)
                                            </div>
                                            <input
                                                type="file"
                                                id="photoIdProof"
                                                name="photoIdProof"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </label>
                                    </div>
                                    {formData.photoIdProofName && (
                                        <div className="mt-2 flex items-center p-2 bg-gray-900 rounded-lg border border-gray-700">
                                            <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="ml-2 text-base text-gray-300">{formData.photoIdProofName}</span>
                                        </div>
                                    )}
                                    {errors.photoIdProof && <p className="mt-1 text-sm text-red-500">{errors.photoIdProof}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Organization Details */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="organizationName" className="block text-base font-medium text-gray-300 mb-1">
                                        Organization Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="organizationName"
                                        name="organizationName"
                                        placeholder="College, company, or group name"
                                        value={formData.organizationName}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 bg-gray-900 border ${errors.organizationName ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white text-base`}
                                    />
                                    {errors.organizationName && <p className="mt-1 text-sm text-red-500">{errors.organizationName}</p>}
                                </div>

                                <div>
                                    <label htmlFor="organizationType" className="block text-base font-medium text-gray-300 mb-1">
                                        Organization Type *
                                    </label>
                                    <select
                                        id="organizationType"
                                        name="organizationType"
                                        value={formData.organizationType}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 bg-gray-900 border ${errors.organizationType ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white text-base`}
                                    >
                                        <option value="">Select type</option>
                                        <option value="College">College</option>
                                        <option value="Company">Company</option>
                                        <option value="NGO">NGO</option>
                                        <option value="Individual">Individual</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.organizationType && <p className="mt-1 text-sm text-red-500">{errors.organizationType}</p>}
                                </div>

                                <div>
                                    <label htmlFor="website" className="block text-base font-medium text-gray-300 mb-1">
                                        Official Website / Page
                                    </label>
                                    <input
                                        type="url"
                                        id="website"
                                        name="website"
                                        placeholder="e.g. https://example.com"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white text-base"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-base font-medium text-gray-300 mb-1">
                                        Role / Designation *
                                    </label>
                                    <input
                                        type="text"
                                        id="role"
                                        name="role"
                                        placeholder="e.g. Student Lead, Event Manager, HR"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 bg-gray-900 border ${errors.role ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white text-base`}
                                    />
                                    {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                                </div>

                                <div>
                                    <label htmlFor="organizationEmail" className="block text-base font-medium text-gray-300 mb-1">
                                        Organization Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="organizationEmail"
                                        name="organizationEmail"
                                        placeholder="Use institutional domain if possible"
                                        value={formData.organizationEmail}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 bg-gray-900 border ${errors.organizationEmail ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white text-base`}
                                    />
                                    {errors.organizationEmail && <p className="mt-1 text-sm text-red-500">{errors.organizationEmail}</p>}
                                </div>

                                <div>
                                    <label htmlFor="organizationIdProof" className="block text-base font-medium text-gray-300 mb-1">
                                        Organization ID Proof *
                                    </label>
                                    <div className="mt-1 flex items-center">
                                        <label className="relative flex-1 group">
                                            <div className="w-full px-4 py-3 bg-gray-900 border border-dashed border-indigo-500 rounded-lg text-gray-300 cursor-pointer hover:bg-gray-800 transition text-base">
                                                <span className="text-indigo-400 group-hover:text-indigo-300">Upload organization ID proof</span> (.pdf, .jpg, .png)
                                            </div>
                                            <input
                                                type="file"
                                                id="organizationIdProof"
                                                name="organizationIdProof"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </label>
                                    </div>
                                    {formData.organizationIdProofName && (
                                        <div className="mt-2 flex items-center p-2 bg-gray-900 rounded-lg border border-gray-700">
                                            <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="ml-2 text-base text-gray-300">{formData.organizationIdProofName}</span>
                                        </div>
                                    )}
                                    {errors.organizationIdProof && <p className="mt-1 text-sm text-red-500">{errors.organizationIdProof}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <p className="text-gray-300 mb-4 text-base">Please review your information carefully before submitting. You will not be able to make changes after submission until verification is complete.</p>

                                <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold text-indigo-400 mb-3">Personal Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Full Name</p>
                                            <p className="text-white text-base">{formData.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email Address</p>
                                            <p className="text-white text-base">{formData.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="text-white text-base">{formData.phoneNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">LinkedIn Profile</p>
                                            <p className="text-white text-base">{formData.linkedinProfile || 'Not provided'}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-gray-500">Photo ID Proof</p>
                                            <div className="flex items-center mt-1">
                                                <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="ml-2 text-white text-base">{formData.photoIdProofName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold text-indigo-400 mb-3">Organization Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Organization Name</p>
                                            <p className="text-white text-base">{formData.organizationName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Organization Type</p>
                                            <p className="text-white text-base">{formData.organizationType}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Role / Designation</p>
                                            <p className="text-white text-base">{formData.role}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Official Website</p>
                                            <p className="text-white text-base">{formData.website || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Organization Email</p>
                                            <p className="text-white text-base">{formData.organizationEmail}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Organization ID Proof</p>
                                            <div className="flex items-center mt-1">
                                                <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="ml-2 text-white text-base">{formData.organizationIdProofName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-900/30 rounded-xl border border-indigo-500/30 p-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <CheckCircleIcon className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-base text-indigo-300">
                                                By submitting this form, I confirm that all information provided is accurate and authentic. I understand that providing false information may result in rejection of my verification request and potential suspension from the platform.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Add this debug button */}
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        onClick={testFileUpload}
                                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-600"
                                    >
                                        Test File Upload
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-between items-center">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md shadow-sm text-base font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={isSubmitting}
                                >
                                    Back
                                </button>
                            )}
                            <div className="flex-1"></div>
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-base font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="px-8 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-base font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit for Verification'
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
};

export default OrganizerVerificationForm;