import React from 'react';

function CallToAction() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Ready to join the next <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">hackathon revolution</span>?
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="/hackathons" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-lg shadow-purple-500/20"
          >
            Find a Hackathon
          </a>
          <a 
            href="/signup" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 transition-colors shadow-lg"
          >
            Create an Account
          </a>
        </div>
      </div>
    </div>
  );
}

export default CallToAction; 