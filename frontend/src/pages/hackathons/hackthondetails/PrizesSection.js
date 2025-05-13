import React from 'react';

function PrizesSection({ prizes }) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-xl overflow-hidden border border-gray-700/50 p-3 sm:p-4">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Prizes & Rewards</h3>
        <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
          Compete for a chance to win these exciting prizes and recognition for your innovative solutions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {prizes.map((prize, index) => (
            <div 
              key={index}
              className={`rounded-xl overflow-hidden relative ${
                index === 0 
                  ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border border-yellow-700/30'
                  : index === 1
                  ? 'bg-gradient-to-br from-gray-800/80 to-gray-700/30 border border-gray-600/30'
                  : index === 2
                  ? 'bg-gradient-to-br from-amber-900/30 to-yellow-800/20 border border-amber-700/30'
                  : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50'
              }`}
            >
              {/* Trophy/medal icon */}
              {index < 3 && (
                <div 
                  className={`absolute top-2 right-2 p-1.5 rounded-full ${
                    index === 0 
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : index === 1
                      ? 'bg-gray-500/20 text-gray-300'
                      : 'bg-amber-600/20 text-amber-400'
                  }`}
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              <div className="p-3 sm:p-4">
                <div 
                  className={`text-base sm:text-lg font-bold mb-1 sm:mb-2 ${
                    index === 0 
                      ? 'text-yellow-300'
                      : index === 1
                      ? 'text-gray-300'
                      : index === 2
                      ? 'text-amber-400'
                      : 'text-white'
                  }`}
                >
                  {prize.place}
                </div>
                
                <div 
                  className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${
                    index === 0 
                      ? 'text-yellow-300'
                      : index === 1
                      ? 'text-gray-300'
                      : index === 2
                      ? 'text-amber-400'
                      : 'text-white'
                  }`}
                >
                  {prize.amount}
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  {prize.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start">
                      <svg 
                        className={`h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0 ${
                          index === 0 
                            ? 'text-yellow-400'
                            : index === 1
                            ? 'text-gray-400'
                            : index === 2
                            ? 'text-amber-500'
                            : 'text-blue-400'
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-sm sm:text-base">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl overflow-hidden border border-blue-800/30 p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Additional Awards</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/20 rounded-lg p-2.5 sm:p-3">
            <h4 className="text-blue-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Category Winners</h4>
            <p className="text-gray-300 text-xs sm:text-sm">Special prizes for the best projects in each challenge category.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-800/20 rounded-lg p-2.5 sm:p-3">
            <h4 className="text-green-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Innovation Award</h4>
            <p className="text-gray-300 text-xs sm:text-sm">Recognition for the most creative and unique approach.</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/20 rounded-lg p-2.5 sm:p-3">
            <h4 className="text-purple-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Technical Excellence</h4>
            <p className="text-gray-300 text-xs sm:text-sm">Award for the project with the best technical implementation.</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-800/20 rounded-lg p-2.5 sm:p-3">
            <h4 className="text-amber-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">People's Choice</h4>
            <p className="text-gray-300 text-xs sm:text-sm">Award for the project that receives the most votes from the community.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrizesSection; 