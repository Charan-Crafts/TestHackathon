import axios from 'axios';

// Create an axios instance with common configuration
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper functions for managing auth data
export const setAuthData = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
};

export const getAuthData = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
        token,
        user: user ? JSON.parse(user) : null,
        isAuthenticated: !!token
    };
};

export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Request interceptor for adding auth token to requests
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        // Handle token expiration or unauthorized access
        if (response && response.status === 401) {
            clearAuthData();
            // Redirect to login if needed
            // window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Auth API services
export const authAPI = {
    register: async (userData) => {
        const response = await API.post('/auth/register', userData);
        if (response.data.success && response.data.token) {
            // If we get a token back, store it
            setAuthData(response.data.token, null);
        }
        return response;
    },
    
    login: async (credentials) => {
        const response = await API.post('/auth/login', credentials);
        if (response.data.success && response.data.token) {
            // If we get a token back, store it and fetch user data
            setAuthData(response.data.token, null);
            // Fetch and store user data
            try {
                const userResponse = await API.get('/auth/me');
                if (userResponse.data.success) {
                    setAuthData(response.data.token, userResponse.data.data);
                }
            } catch (error) {
                console.error('Error fetching user data after login:', error);
            }
        }
        return response;
    },
    logout: () => {
        // Clear auth data from local storage
        clearAuthData();
        // Call the logout endpoint to clear the server-side token
        return API.get('/auth/logout');
    },
    getCurrentUser: () => API.get('/auth/me'),
    updateUserDetails: (userData) => API.put('/auth/updatedetails', userData),
    updatePassword: (passwordData) => API.put('/auth/updatepassword', passwordData),
    forgotPassword: (email) => API.post('/auth/forgotpassword', { email }),
    resetPassword: (token, password) => API.put(`/auth/resetpassword/${token}`, { password }),
};

// User API services (admin only)
export const userAPI = {
    getAllUsers: (page = 1, limit = 10, filters = {}) => {
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...filters
        }).toString();

        return API.get(`/users?${queryParams}`);
    },
    getUserById: (userId) => API.get(`/users/${userId}`),
    createUser: (userData) => API.post('/users', userData),
    updateUser: (userId, userData) => API.put(`/users/${userId}`, userData),
    deleteUser: (userId) => API.delete(`/users/${userId}`),
    changeUserRole: (userId, role) => API.put(`/users/${userId}/role`, { role }),
    changeUserStatus: (userId, isActive) => API.put(`/users/${userId}/status`, { isActive }),
};

// Utility function to handle API errors
export const handleApiError = (error) => {
    if (error.response) {
        // The server responded with a status code outside the 2xx range
        const { data, status } = error.response;

        return {
            message: data.error || data.message || 'An error occurred',
            status,
            data: data
        };
    } else if (error.request) {
        // The request was made but no response was received
        return {
            message: 'No response from server. Please check your internet connection.',
            status: 0
        };
    } else {
        // Something happened in setting up the request
        return {
            message: error.message || 'An unexpected error occurred',
            status: 0
        };
    }
};

// Verification API services
export const verificationAPI = {
    // Submit a verification request
    submitVerification: (verificationData) => API.post('/verifications', verificationData),

    // Upload verification documents (photo ID and organization ID)
    uploadProofs: (formData) => API.post('/verifications/upload-proofs', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // Override the default content type for file uploads
        }
    }),

    // Get verification status of the current user
    getVerificationStatus: () => API.get('/verifications/status'),

    // Get detailed information about the user's verification request
    getMyVerification: () => API.get('/verifications/me'),

    // Admin: Get all verification requests
    getAllVerifications: (page = 1, limit = 10, status = '') => {
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...(status ? { status } : {})
        }).toString();

        return API.get(`/verifications?${queryParams}`);
    },

    // Admin: Get a specific verification request
    getVerificationById: (id) => API.get(`/verifications/${id}`),

    // Admin: Review (approve/reject) a verification request
    reviewVerification: (id, reviewData) => API.put(`/verifications/${id}/review`, reviewData)
};

// Hackathon API services
export const hackathonAPI = {
    // Get all hackathons with filtering and pagination
    getAllHackathons: (page = 1, limit = 10, filters = {}) => {
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...filters
        }).toString();

        return API.get(`/hackathons?${queryParams}`);
    },

    // Get a single hackathon by ID
    getHackathonById: (id) => API.get(`/hackathons/${id}`),

    // Create a new hackathon
    createHackathon: async (hackathonData) => {
        const formData = new FormData();

        // Debug: check imageFile and image URL before appending
        console.log('DEBUG: hackathonData.imageFile', hackathonData.imageFile);
        console.log('DEBUG: hackathonData.image', hackathonData.image);

        const hasFile = hackathonData.imageFile instanceof File;
        const hasUrl = typeof hackathonData.image === 'string' && hackathonData.image.trim() !== '';

        if (!hasFile && !hasUrl) {
            alert('Please provide a hackathon image (upload or URL).');
            throw new Error('No hackathon image provided!');
        }

        // Append the image (file or URL)
        if (hasFile) {
            formData.append('image', hackathonData.imageFile);
        } else if (hasUrl) {
            formData.append('image', hackathonData.image);
        }

        // Format coOrganizers data
        let coOrganizers = [];
        if (hackathonData.coOrganizers) {
            try {
                // If it's a string, parse it
                if (typeof hackathonData.coOrganizers === 'string') {
                    coOrganizers = JSON.parse(hackathonData.coOrganizers);
                } else if (Array.isArray(hackathonData.coOrganizers)) {
                    coOrganizers = hackathonData.coOrganizers;
                }

                // Ensure each co-organizer has the required fields
                coOrganizers = coOrganizers
                    .filter(org => org && typeof org === 'object')
                    .map(org => ({
                        name: org.name || '',
                        contact: org.contact || '',
                        email: org.email || ''
                    }))
                    .filter(org => org.name && org.email); // Only keep valid entries
            } catch (e) {
                console.error('Error parsing coOrganizers:', e);
                coOrganizers = [];
            }
        }
        formData.append('coOrganizers', JSON.stringify(coOrganizers));

        // Append the rest (skip imageFile, imagePreview, image, coOrganizers)
        Object.keys(hackathonData).forEach(key => {
            if (key === 'imageFile' || key === 'imagePreview' || key === 'image' || key === 'coOrganizers') return;

            if (typeof hackathonData[key] === 'object') {
                formData.append(key, JSON.stringify(hackathonData[key]));
            } else {
                formData.append(key, hackathonData[key]);
            }
        });

        // Debug: log all FormData entries
        for (let pair of formData.entries()) {
            console.log('FormData:', pair[0], pair[1]);
        }

        return API.post('/hackathons', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Update an existing hackathon
    updateHackathon: (id, hackathonData) => API.put(`/hackathons/${id}`, hackathonData),

    // Delete a hackathon
    deleteHackathon: (id) => API.delete(`/hackathons/${id}`),

    // Upload hackathon image
    uploadHackathonImage: async (formData, hackathonId) => {
        try {
            const response = await API.post(`/hackathons/${hackathonId}/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading hackathon image:', error);
            throw error;
        }
    },

    // Get hackathons created by the current user
    getMyHackathons: (page = 1, limit = 10) => {
        const queryParams = new URLSearchParams({
            page,
            limit
        }).toString();

        return API.get(`/hackathons/organizer/my-hackathons?${queryParams}`);
    },

    // Admin: Review (approve/reject) a hackathon
    reviewHackathon: (id, reviewData) => API.put(`/hackathons/${id}/review`, reviewData),

    activateRound: async (hackathonId, roundId) => {
        console.log('API: Activating round', { hackathonId, roundId });
        try {
            const response = await API.put(`/hackathons/${hackathonId}/rounds/${roundId}/activate`);
            console.log('API: Round activation response:', response);
            return response;
        } catch (error) {
            console.error('API: Error activating round:', error);
            throw error;
        }
    },

    completeRound: async (hackathonId, roundId) => {
        return API.put(`/hackathons/${hackathonId}/rounds/${roundId}/complete`);
    },

    updateRoundDetails: async (hackathonId, roundId, roundData) => {
        return API.put(`/hackathons/${hackathonId}/rounds/${roundId}`, roundData);
    },

    // User submits a solution for a round
    submitRoundSolution: (hackathonId, roundId, submissionData) =>
        API.post(`/hackathons/${hackathonId}/rounds/${roundId}/submit`, submissionData),

    // User checks if they have submitted for a round
    getRoundSubmissionStatus: (hackathonId, roundId) =>
        API.get(`/hackathons/${hackathonId}/rounds/${roundId}/submission-status`),

    // Set the status of a round (pending, active, completed)
    setRoundStatus: (hackathonId, roundId, status) =>
        API.put(`/hackathons/${hackathonId}/rounds/${roundId}/status`, { status }),
};

// Hackathon Application API services
export const hackathonApplicationAPI = {
    // Submit a new hackathon application
    submitApplication: (applicationData) => API.post('/hackathon-applications', applicationData),

    // Admin: Get all hackathon applications
    getAllApplications: (page = 1, limit = 10, filters = {}) => {
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...filters
        }).toString();

        return API.get(`/hackathon-applications?${queryParams}`);
    },

    // Get a specific application by ID
    getApplicationById: (id) => API.get(`/hackathon-applications/${id}`),

    // Update an existing application
    updateApplication: (id, applicationData) => API.put(`/hackathon-applications/${id}`, applicationData),

    // Delete an application
    deleteApplication: (id) => API.delete(`/hackathon-applications/${id}`),

    // Admin: Review (approve/reject) an application
    reviewApplication: (id, reviewData) => API.put(`/hackathon-applications/${id}/review`, reviewData),

    // Get applications submitted by the current user
    getMyApplications: (page = 1, limit = 10) => {
        const queryParams = new URLSearchParams({
            page,
            limit
        }).toString();

        return API.get(`/hackathon-applications/my-applications?${queryParams}`);
    }
};

export const getApprovedHackathons = (limit = 5) =>
    API.get(`/hackathons?status=approved&limit=${limit}`);

// Registration API services
export const registrationAPI = {
    // Get all registrations with optional filtering
    getRegistrations: (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return API.get(`/registrations?${queryParams}`);
    },

    // Get a single registration by ID
    getRegistrationById: (id) => API.get(`/registrations/${id}`),

    // Create a new registration
    createRegistration: async (registrationData) => {
        try {
            // Ensure phone number is properly formatted
            if (registrationData.personalInfo) {
                // If phoneNumber exists, use it as phone
                if (registrationData.personalInfo.phoneNumber) {
                    registrationData.personalInfo.phone = registrationData.personalInfo.phoneNumber;
                    delete registrationData.personalInfo.phoneNumber;
                }
                // Ensure phone is a string and not empty
                if (!registrationData.personalInfo.phone) {
                    throw new Error('Phone number is required');
                }
            }

            console.log('Sending registration data:', registrationData);
            const response = await API.post('/registrations', registrationData);
            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // Review (approve/reject) a registration
    reviewRegistration: (id, reviewData) => API.put(`/registrations/${id}/review`, reviewData)
};

// Round Response API services
export const roundResponseAPI = {
    // Save or update a round response
    saveResponse: (data) => API.post('/round-responses', data),

    // Submit a round response
    submitResponse: (responseId) => API.put(`/round-responses/${responseId}/submit`),

    // Get a user's response for a specific round
    getResponse: (hackathonId, roundId) =>
        API.get(`/round-responses/hackathon/${hackathonId}/round/${roundId}`),

    // Get all responses for a round (organizer only)
    getAllResponses: (hackathonId, roundId) =>
        API.get(`/round-responses/hackathon/${hackathonId}/round/${roundId}/all`),

    // Review a round response (organizer only)
    reviewResponse: (responseId, reviewData) => API.put(`/round-responses/${responseId}/review`, reviewData),

    // Check if user is qualified for next round
    checkRoundQualification: (hackathonId, roundId) =>
        API.get(`/round-responses/hackathon/${hackathonId}/round/${roundId}/qualification`),

    // Upload a file for a round response
    uploadFile: async (responseId, formData) => {
        return API.post(`/round-responses/${responseId}/upload-file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
};

// Profile API services
export const profileAPI = {
    // Get current user's profile
    getMyProfile: async () => {
        try {
            const response = await API.get('/profiles/me');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Create or update profile
    createOrUpdateProfile: async (profileData) => {
        try {
            const response = await API.post('/profiles', profileData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Upload profile file (resume, certificate, achievement)
    uploadProfileFile: async (file, type, metadata = {}) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

            // Add metadata if provided
            Object.keys(metadata).forEach(key => {
                formData.append(key, metadata[key]);
            });

            const response = await API.post('/profiles/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete profile file
    deleteProfileFile: async (fileId) => {
        try {
            const response = await API.delete(`/profiles/files/${fileId}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update skills
    updateSkills: async (skills) => {
        try {
            const response = await API.patch('/profiles/skills', { skills });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update education
    updateEducation: async (education) => {
        try {
            const response = await API.patch('/profiles/education', { education });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update experience
    updateExperience: async (experience) => {
        try {
            const response = await API.patch('/profiles/experience', { experience });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update certifications
    updateCertifications: async (certifications) => {
        try {
            const response = await API.patch('/profiles/certifications', { certifications });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update achievements
    updateAchievements: async (achievements) => {
        try {
            const response = await API.patch('/profiles/achievements', { achievements });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update social links
    updateSocials: async (socials) => {
        try {
            const response = await API.patch('/profiles/socials', { socials });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

// Submission API services
export const submissionAPI = {
    // Get a submission by ID
    getSubmissionById: (submissionId) => API.get(`/submissions/${submissionId}`),

    // Get test link UUID for a submission
    getTestLinkUUID: (submissionId) => API.get(`/submissions/test-link/${submissionId}`),

    // ... existing submission API methods ...
};

export default API; 