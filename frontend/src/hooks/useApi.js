import { useState, useCallback } from 'react';
import { handleApiError } from '../services/api';

/**
 * Custom hook for handling API calls with loading and error states
 * @returns {Object} API handling utilities and states
 */
export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    /**
     * Execute an API call with loading and error handling
     * @param {Function} apiCall - The API function to call
     * @param {Object} options - Additional options
     * @param {boolean} options.resetData - Whether to reset data state before call
     * @param {Function} options.onSuccess - Callback for successful calls
     * @param {Function} options.onError - Callback for failed calls
     * @returns {Object} Result of the API call
     */
    const executeApiCall = useCallback(
        async (apiCall, { resetData = true, onSuccess, onError } = {}) => {
            setLoading(true);
            setError(null);

            if (resetData) {
                setData(null);
            }

            try {
                const response = await apiCall();
                const responseData = response.data;

                setData(responseData);
                setLoading(false);

                if (onSuccess) {
                    onSuccess(responseData);
                }

                return { success: true, data: responseData };
            } catch (err) {
                const errorData = handleApiError(err);
                setError(errorData);
                setLoading(false);

                if (onError) {
                    onError(errorData);
                }

                return { success: false, error: errorData };
            }
        },
        []
    );

    /**
     * Wrapper for GET requests
     * @param {Function} apiCall - The API function to call
     * @param {Object} options - Additional options
     */
    const get = useCallback(
        (apiCall, options) => executeApiCall(apiCall, options),
        [executeApiCall]
    );

    /**
     * Wrapper for POST requests
     * @param {Function} apiCall - The API function to call
     * @param {Object} options - Additional options
     */
    const post = useCallback(
        (apiCall, options) => executeApiCall(apiCall, options),
        [executeApiCall]
    );

    /**
     * Wrapper for PUT requests
     * @param {Function} apiCall - The API function to call
     * @param {Object} options - Additional options
     */
    const put = useCallback(
        (apiCall, options) => executeApiCall(apiCall, options),
        [executeApiCall]
    );

    /**
     * Wrapper for DELETE requests
     * @param {Function} apiCall - The API function to call
     * @param {Object} options - Additional options
     */
    const del = useCallback(
        (apiCall, options) => executeApiCall(apiCall, options),
        [executeApiCall]
    );

    /**
     * Reset error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Reset data state
     */
    const clearData = useCallback(() => {
        setData(null);
    }, []);

    /**
     * Reset all states
     */
    const resetState = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return {
        loading,
        error,
        data,
        executeApiCall,
        get,
        post,
        put,
        del,
        clearError,
        clearData,
        resetState
    };
};

export default useApi; 