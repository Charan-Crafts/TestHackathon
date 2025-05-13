import React, { Component } from 'react';
import Signup from './Signup';

class SignupWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, errorMessage: error.toString() };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error('Signup component error:', error);
        console.error('Error info:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                    <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
                        <p className="text-gray-300 mb-6">
                            There was an error while loading the signup page. Please try refreshing the page.
                        </p>
                        <p className="text-red-400 text-sm mb-6 bg-red-900/20 p-3 rounded border border-red-800/30">
                            {this.state.errorMessage}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return <Signup />;
    }
}

export default SignupWrapper; 