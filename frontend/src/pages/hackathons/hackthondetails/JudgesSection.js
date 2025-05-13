import React, { useState } from 'react';

function JudgesSection({ judges }) {
  const [activeJudge, setActiveJudge] = useState(null);
  
  const handleJudgeClick = (index) => {
    setActiveJudge(activeJudge === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-xl overflow-hidden border border-gray-700/50 p-4 sm:p-6">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Meet Our Expert Judges</h3>
      <p className="text-gray-300 text-sm sm:text-base mb-5 max-w-3xl">
        Our distinguished panel of industry experts will evaluate submissions based on innovation, technical implementation, business potential, and presentation quality.
      </p>
      
      {/* Judge Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {judges.map((judge, index) => (
          <div 
            key={index}
            className={`group bg-gradient-to-br from-gray-800/60 to-gray-900/80 rounded-xl overflow-hidden border ${activeJudge === index ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-700/50'} hover:border-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
            onClick={() => handleJudgeClick(index)}
          >
            <div className="relative">
              <div className="aspect-w-3 aspect-h-2 rounded-t-lg overflow-hidden bg-gray-800">
                <img 
                  src={judge.image} 
                  alt={judge.name}
                  className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
              </div>
              
              {/* Judge specialty badge */}
              <div className="absolute top-2 right-2 bg-blue-600/90 text-white text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                {index === 0 ? 'AI Expert' : index === 1 ? 'Tech Lead' : 'Research'}
              </div>
            </div>
            
            <div className="p-3">
              <h4 className="text-white font-semibold text-base">{judge.name}</h4>
              <div className="flex items-center mt-0.5 mb-1.5">
                <span className="text-blue-400 text-xs font-medium">{judge.title}</span>
                <span className="mx-1.5 text-gray-600">•</span>
                <span className="text-gray-400 text-xs">{judge.company}</span>
              </div>
              
              <p className={`text-gray-300 text-xs mt-1.5 transition-all duration-300 ${activeJudge === index ? 'max-h-24 overflow-y-auto' : 'line-clamp-2'}`}>
                {judge.bio}
              </p>
              
              <div className="flex mt-2.5 space-x-2">
                <button className="p-1.5 bg-blue-900/40 text-blue-400 rounded-full hover:bg-blue-600/50 hover:text-white transition-colors">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z"/>
                  </svg>
                </button>
                <button className="p-1.5 bg-blue-900/40 text-blue-400 rounded-full hover:bg-blue-600/50 hover:text-white transition-colors">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button className="p-1.5 bg-blue-900/40 text-blue-400 rounded-full hover:bg-blue-600/50 hover:text-white transition-colors">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
              </div>
              
              {/* Experience bar - visible on active judge */}
              {activeJudge === index && (
                <div className="mt-2.5 pt-2 border-t border-gray-700">
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-gray-400 text-xs">Experience</span>
                    <span className="text-blue-400 text-xs font-medium">{index === 0 ? '15+ years' : index === 1 ? '18+ years' : '12+ years'}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      style={{ width: `${index === 0 ? '85%' : index === 1 ? '90%' : '75%'}` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Judging Criteria Section */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-800/30 rounded-lg">
        <h4 className="text-white font-medium mb-3 text-lg flex items-center">
          <svg className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Judging Criteria
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-blue-900/20 p-2.5 rounded-lg border border-blue-800/30 hover:bg-blue-900/30 transition-colors">
            <div className="flex mb-1.5">
              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs mr-2">25%</div>
              <h5 className="text-white font-medium text-sm">Innovation & Creativity</h5>
            </div>
            <p className="text-gray-300 text-xs">Originality and creative approach to problem solving</p>
          </div>
          
          <div className="bg-blue-900/20 p-2.5 rounded-lg border border-blue-800/30 hover:bg-blue-900/30 transition-colors">
            <div className="flex mb-1.5">
              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs mr-2">25%</div>
              <h5 className="text-white font-medium text-sm">Technical Implementation</h5>
            </div>
            <p className="text-gray-300 text-xs">Code quality, complexity and implementation</p>
          </div>
          
          <div className="bg-blue-900/20 p-2.5 rounded-lg border border-blue-800/30 hover:bg-blue-900/30 transition-colors">
            <div className="flex mb-1.5">
              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs mr-2">20%</div>
              <h5 className="text-white font-medium text-sm">Impact & Practicality</h5>
            </div>
            <p className="text-gray-300 text-xs">Real-world application and value proposition</p>
          </div>
          
          <div className="bg-blue-900/20 p-2.5 rounded-lg border border-blue-800/30 hover:bg-blue-900/30 transition-colors">
            <div className="flex mb-1.5">
              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs mr-2">15%</div>
              <h5 className="text-white font-medium text-sm">Presentation</h5>
            </div>
            <p className="text-gray-300 text-xs">Quality of demo and project documentation</p>
          </div>
          
          <div className="bg-blue-900/20 p-2.5 rounded-lg border border-blue-800/30 hover:bg-blue-900/30 transition-colors">
            <div className="flex mb-1.5">
              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs mr-2">15%</div>
              <h5 className="text-white font-medium text-sm">User Experience</h5>
            </div>
            <p className="text-gray-300 text-xs">Design quality and overall usability</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JudgesSection; 