import React from 'react';
import { Link } from 'react-router-dom';

function SuccessStep({ hackathon }) {
  return (
    <div className="text-center py-6">
      {/* Success animation */}
      <div className="success-animation mb-6">
        <svg 
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 52 52"
          style={{ 
            display: 'block',
            margin: '0 auto',
            boxShadow: '0px 0px 30px rgba(147, 51, 234, 0.5)' // Purple glow
          }}
        >
          <circle 
            className="checkmark__circle" 
            cx="26" cy="26" r="25" 
            fill="none" 
            style={{ 
              stroke: 'rgba(79, 70, 229, 0.3)', // Indigo colored
              strokeWidth: '2',
              strokeMiterlimit: '10',
              animation: 'fillCheckmark 0.4s ease-in-out 0.4s forwards'
            }}
          />
          <path 
            className="checkmark__check" 
            fill="none" 
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            style={{ 
              stroke: '#8B5CF6', // Purple
              strokeWidth: '3',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeDasharray: '48',
              strokeDashoffset: '48',
              animation: 'drawCheckmark 0.3s linear 0.8s forwards'
            }}
          />
        </svg>
      </div>

      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
        Registration Successful!
      </h2>
      
      <div className="max-w-lg mx-auto">
        <p className="text-gray-300 mb-6">
          Congratulations! You've successfully registered for {hackathon?.name || 'the hackathon'}. 
          We're excited to see what you'll build!
        </p>
        
        <div className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-lg p-5 mb-8 border border-purple-500/20">
          <h3 className="text-lg font-medium text-purple-300 mb-3">Next Steps</h3>
          <ul className="space-y-4 text-left">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-0.5">
                <svg className="h-4 w-4 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-300 font-medium">Check Your Email</p>
                <p className="text-gray-400 text-sm">We've sent confirmation details to your registered email address.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-0.5">
                <svg className="h-4 w-4 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-300 font-medium">Join Discord Channel</p>
                <p className="text-gray-400 text-sm">Connect with other participants and mentors on our Discord server.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-0.5">
                <svg className="h-4 w-4 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-300 font-medium">Attend Kickoff Event</p>
                <p className="text-gray-400 text-sm">
                  Don't miss our virtual kickoff event on {hackathon?.dates?.split('-')[0]?.trim() || 'the start date'}.
                </p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
          <Link 
            to="/dashboard" 
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all duration-300"
          >
            Go to Dashboard
          </Link>
          <Link 
            to={`/hackathon/${hackathon?.id || '1'}`}
            className="px-5 py-2.5 bg-gray-800 text-gray-300 font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors border border-gray-700"
          >
            View Hackathon Details
          </Link>
        </div>
      </div>
      
      {/* Add custom styling for animations */}
      <style jsx="true">{`
        @keyframes fillCheckmark {
          100% {
            box-shadow: inset 0px 0px 0px 30px rgba(79, 70, 229, 0.1);
          }
        }
        
        @keyframes drawCheckmark {
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          animation: scaleCheckmark 0.3s ease-out;
        }
        
        @keyframes scaleCheckmark {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default SuccessStep; 