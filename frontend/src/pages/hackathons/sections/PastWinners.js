import React from 'react';
import { Link } from 'react-router-dom';

function PastWinners() {
  // Sample past winners data
  const pastWinners = [
    {
      id: 1,
      projectName: "MediSync",
      teamName: "HealthTech Heroes",
      hackathonName: "HealthHack 2023",
      image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Health Tech",
      prize: "$15,000",
      description: "AI-powered medication management system that synchronizes with patient health records."
    },
    {
      id: 2,
      projectName: "EcoTrack",
      teamName: "Green Innovators",
      hackathonName: "Sustainability Summit",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Environmental Tech",
      prize: "$12,000",
      description: "Carbon footprint tracking platform with personalized sustainability recommendations."
    },
    {
      id: 3,
      projectName: "FinFlow",
      teamName: "The Money Makers",
      hackathonName: "FinTech Future",
      image: "https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Finance Tech",
      prize: "$20,000",
      description: "Decentralized banking platform for underserved communities with AI-powered financial advice."
    }
  ];

  return (
    <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700">
      <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-400">
              Winners Showcase
            </span>
          </h2>
          
          <p className="text-gray-300">
            Check out our past hackathon winners and their amazing projects
          </p>
          
          <Link 
            to="/hackathons/hall-of-fame"
            className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-white font-medium rounded-lg transition-colors w-full sm:w-auto text-center"
          >
            View Hall of Fame
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        
        <div className="w-full md:w-1/2 relative mt-6 md:mt-0">
          {/* Past Winners showcase */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-lg blur-xl"></div>
            
            <div className="relative grid grid-cols-1 gap-4 max-w-md mx-auto">
              {pastWinners.map((winner, index) => (
                <Link
                  key={winner.id}
                  to={`/project/${winner.id}`}
                  className="group flex bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-gray-800/80 rounded-lg overflow-hidden border border-gray-700/50 hover:border-yellow-500/50 shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="w-1/4 relative">
                    <div 
                      className="h-full bg-cover bg-center" 
                      style={{backgroundImage: `url("${winner.image}")`}}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/80"></div>
                    
                    {/* Trophy icon for position */}
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white p-1 rounded-full">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="w-3/4 p-3">
                    <h3 className="text-white font-medium text-sm sm:text-base group-hover:text-yellow-400 transition-colors">{winner.projectName}</h3>
                    <p className="text-gray-400 text-xs mb-1">by {winner.teamName}</p>
                    
                    <div className="flex items-center mb-2">
                      <span className="text-xs py-0.5 px-2 bg-yellow-900/30 text-yellow-400 rounded-full">
                        {winner.category}
                      </span>
                      <span className="text-xs text-yellow-400 ml-2 flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        {winner.prize} Prize
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-300 line-clamp-2">{winner.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Won at: {winner.hackathonName}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PastWinners; 