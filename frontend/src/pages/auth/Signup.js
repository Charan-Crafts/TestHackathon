import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { debug, errorLogger, logRenderCycle } from '../../utils/debugHelper';

const Signup = () => {
  logRenderCycle('Signup');
  const navigate = useNavigate();
  const { register, loading: authLoading, error: authError, clearErrors } = useAuth();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('candidate'); // 'candidate' or 'organizer'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  // Clear any previous auth errors when component mounts
  useEffect(() => {
    debug('Signup component mounted');
    clearErrors();
    return () => {
      debug('Signup component unmounted');
    };
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

    // Clear password error when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }

    // Clear general error when user makes changes
    if (error) setError('');
  };

  // Validate passwords
  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (!validatePasswords()) {
      return;
    }

    // Check terms agreement
    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Create user object with role from userType
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        role: userType,
        agreedToTerms: formData.agreeToTerms
      };

      console.log('Attempting to register with data:', signupData);

      // Call the register function from AuthContext
      const result = await register(signupData);
      console.log('Registration result:', result);

      if (result && result.success) {
        toast.success('Registration successful!');

        // Handle different redirects based on user role
        if (result.role === 'organizer') {
          // For organizers, redirect to verification page
          navigate('/verification');
        } else if (result.role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/candidate');
        }
      } else {
        setError((result && result.error && result.error.message)
          ? result.error.message
          : 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error details:', err);
      setError('An unexpected error occurred. Please try again.');
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

  if (isLoading || authLoading) {
    return <LoadingIndicator type="spinner" />;
  }

  const slides = carouselContent[userType];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      {/* Left Side - Fixed Carousel */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
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

          {/* Fixed Background Image - CSS fixed attachment */}
          <div
            className="fixed top-0 left-0 w-1/2 h-full z-0"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
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

      {/* Mobile Header - Only visible on mobile */}
      <div className="md:hidden w-full h-32 bg-gradient-to-br from-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${slides[currentSlide].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-white">
          <h1 className="text-2xl font-bold">Join Hackathon</h1>
          <p className="text-sm opacity-80">Create your account today</p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">
              Create an account
            </h2>
            <p className="mt-2 text-gray-400">
              Join our hackathon platform today
            </p>
          </div>

          {/* User Type Toggle - Improved */}
          <div className="flex bg-gray-800/80 backdrop-blur-sm rounded-xl p-1.5 mb-8 shadow-lg shadow-black/10">
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

          {/* Error message */}
          <ErrorMessage message={error} />

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white inline-flex items-center justify-center mr-2 text-sm">1</span>
                Personal Information
              </h3>

              {/* Name Fields - Two columns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Phone & Gender - Two columns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

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
                {userType === 'organizer' && (
                  <p className="mt-1 text-xs text-gray-400">
                    Please use your company email address.
                  </p>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white inline-flex items-center justify-center mr-2 text-sm">2</span>
                Security
              </h3>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Must be at least 8 characters long.
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                />
                {passwordError ? (
                  <p className="mt-1 text-xs text-red-500">
                    {passwordError}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600 border-gray-700 rounded-md bg-gray-800/80 focus:ring-purple-500 transition-colors duration-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-300">
                  I agree to the{' '}
                  <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                    <Link to="/terms" className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300 underline">
                      Terms of Service
                    </Link>
                  </motion.span>{' '}
                  and{' '}
                  <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                    <Link to="/privacy" className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300 underline">
                      Privacy Policy
                    </Link>
                  </motion.span>
                </label>
              </div>
            </div>

            {/* Create Account Button */}
            <div>
              <motion.button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all duration-300"
                whileHover={{ translateY: -2, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || authLoading}
              >
                {isLoading || authLoading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300">
                  Sign in
                </Link>
              </motion.span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
