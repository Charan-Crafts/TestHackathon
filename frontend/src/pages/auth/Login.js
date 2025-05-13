import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading, error: authError, clearErrors, user, userVerification } = useAuth();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('candidate'); // 'candidate' or 'organizer'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState('');
  const [pendingVerificationCheck, setPendingVerificationCheck] = useState(false);
  const [pendingVerificationMessage, setPendingVerificationMessage] = useState(false);

  // Clear any previous auth errors when component mounts
  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  // Carousel content based on user type
  const carouselContent = useMemo(() => ({
    candidate: [
      {
        title: "Join Our Hackathon Community",
        description: "Connect with projects and opportunities that match your skills and interests.",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      {
        title: "Learn & Grow",
        description: "Challenge yourself with real-world problems and expand your skillset.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      {
        title: "Showcase Your Work",
        description: "Build a portfolio that demonstrates your abilities to potential employers.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      }
    ],
    organizer: [
      {
        title: "Find Top Technical Talent",
        description: "Discover candidates who have proven their skills through hackathon challenges.",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
      },
      {
        title: "Create Custom Challenges",
        description: "Design hackathons that test for the specific skills your organization needs.",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
      },
      {
        title: "Streamline Your Hiring",
        description: "Evaluate candidates based on practical skills and reduce your time-to-hire.",
        image: "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
      }
    ]
  }), []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Add role to login credentials
      const credentials = {
        ...formData,
        role: userType === 'organizer' ? 'organizer' : userType
      };

      console.log('Login submission with credentials:', credentials);
      const result = await login(credentials);
      console.log('Login result:', result);

      if (result.success) {
        // Verify the user role matches the selected tab
        const userRole = result.data.role.toLowerCase();
        console.log('Logged in user role:', userRole);

        if (userType === 'candidate' && !['candidate', 'admin'].includes(userRole)) {
          setError('This account is registered as an organizer. Please use the organizer login tab.');
          setIsLoading(false);
          return;
        }

        if (userType === 'organizer' && userRole !== 'organizer' && userRole !== 'pending_organizer') {
          setError('This account is not registered as an organizer. Please use the candidate login tab.');
          setIsLoading(false);
          return;
        }

        toast.success('Login successful!');

        // Check user role and verification status
        if (userType === 'organizer') {
          if (userVerification) {
            if (userVerification.status === 'approved') {
              navigate('/dashboard/organizer');
            } else if (userVerification.status === 'pending') {
              navigate('/verification');
            } else {
              // If rejected or no verification
              navigate('/verification');
            }
          } else {
            // No verification record, redirect to verification
            navigate('/verification');
          }
        } else if (userRole === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/candidate');
        }
      } else {
        setError(result.error?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-rotate carousel
  useEffect(() => {
    const slides = carouselContent[userType];
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [userType, carouselContent]);

  // Show error from auth context
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Add useEffect to handle organizer verification redirect
  useEffect(() => {
    if (pendingVerificationCheck) {
      if (userVerification === null) {
        // Still loading, do nothing
        return;
      }
      if (userVerification && userVerification.status === 'approved') {
        navigate('/dashboard/organizer', { replace: true });
      } else if (userVerification && userVerification.status === 'pending') {
        // Do not redirect; just show the pending message
        setPendingVerificationMessage(true);
      } else {
        navigate('/verification', { replace: true });
      }
      setPendingVerificationCheck(false);
    }
  }, [pendingVerificationCheck, userVerification, navigate]);

  useEffect(() => {
    if (user && user.role === 'organizer' && userVerification && userVerification.status === 'pending') {
      setPendingVerificationMessage(true);
    } else {
      setPendingVerificationMessage(false);
    }
  }, [user, userVerification]);

  useEffect(() => {
    // Only show the error if the user is coming from a protected route (not after logout)
    if (location.state?.error && document.referrer && !document.referrer.endsWith('/login')) {
      setError(location.state.error);
      // Optionally clear the error from state so it doesn't persist on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  if (isLoading || authLoading) {
    return <LoadingIndicator type="spinner" />;
  }

  const slides = carouselContent[userType];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      {/* Left Side - Carousel */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-sm"></div>

        {/* Carousel */}
        <div className="h-full relative">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 flex flex-col justify-center items-center p-8 z-20"
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                x: currentSlide === index ? 0 : (currentSlide > index ? -100 : 100)
              }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <div className="max-w-md text-center">
                <h2 className="text-3xl font-bold text-white mb-4">{slide.title}</h2>
                <p className="text-lg text-gray-200 mb-6">{slide.description}</p>
                <motion.div
                  className="mt-8 inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/hackathons"
                    className="px-6 py-3 text-sm font-medium rounded-md bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Background Image - Now with fixed positioning */}
          <div
            className="absolute inset-0 z-0 bg-fixed"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          />

          {/* Improved Carousel Indicators */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
            <div className="flex space-x-3 p-2 rounded-full bg-black/20 backdrop-blur-sm">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${currentSlide === index
                    ? 'h-2 w-8 bg-white'
                    : 'h-2 w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {pendingVerificationMessage && (
            <div className="bg-yellow-200 text-yellow-900 border border-yellow-400 rounded px-4 py-3 mb-4 text-center">
              <strong>Verification Pending:</strong> Your organizer verification request is under review. You will be notified once approved.
            </div>
          )}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-400">
              Sign in to your account
            </p>
          </div>

          {/* User Type Toggle - Improved */}
          <div className="flex flex-col space-y-2 mb-8">
            <div className="flex bg-gray-800/80 backdrop-blur-sm rounded-xl p-1.5 shadow-lg shadow-black/10">
              <motion.button
                className={`w-1/2 py-2.5 rounded-lg transition-all duration-300 font-medium ${userType === 'candidate'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
                  }`}
                onClick={() => setUserType('candidate')}
                whileTap={{ scale: 0.98 }}
              >
                Candidate
              </motion.button>
              <motion.button
                className={`w-1/2 py-2.5 rounded-lg transition-all duration-300 font-medium ${userType === 'organizer'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
                  }`}
                onClick={() => setUserType('organizer')}
                whileTap={{ scale: 0.98 }}
              >
                Organizer
              </motion.button>
            </div>
            <p className="text-xs text-gray-400 text-center">
              {userType === 'candidate'
                ? 'For participants and administrators'
                : 'For hackathon organizers and company representatives'}
            </p>
          </div>

          {/* Error message */}
          <ErrorMessage message={error} />

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Email Field - Changes based on user type */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                {userType === 'organizer' ? 'Organization Email' : 'Email Address'}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder={userType === 'organizer' ? 'company@example.com' : 'you@example.com'}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300">
                    Forgot password?
                  </Link>
                </motion.div>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-5 w-5 text-purple-600 border-gray-700 rounded-md bg-gray-800/80 focus:ring-purple-500 transition-colors duration-300"
              />
              <label htmlFor="rememberMe" className="ml-3 block text-sm text-gray-300">
                Remember me for 30 days
              </label>
            </div>

            {/* Sign in Button */}
            <div>
              <motion.button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all duration-300"
                whileHover={{ translateY: -2, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || authLoading}
              >
                {isLoading || authLoading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </div>
          </form>

          {/* Sign up Link */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Link to="/signup" className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300">
                  Sign up
                </Link>
              </motion.span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
