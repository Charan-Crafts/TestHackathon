import React from 'react';
import { Link } from 'react-router-dom';

function HackathonResourcesPreview() {
  // Sample resources data
  const resources = [
    {
      id: 1,
      title: "Beginner's Guide to Hackathons",
      type: "Guide",
      icon: "📘",
      description: "Everything you need to know to get started with hackathons."
    },
    {
      id: 2,
      title: "Hackathon Team Formation",
      type: "Community",
      icon: "👥",
      description: "Find teammates and form the perfect team for your next hackathon."
    },
    {
      id: 3,
      title: "Tech Stack Recommendations",
      type: "Resources",
      icon: "🛠️",
      description: "Popular tech stacks and tools to consider for your hackathon project."
    },
    {
      id: 4,
      title: "Presentation Skills Workshop",
      type: "Workshop",
      icon: "🎯",
      description: "Learn how to effectively present your hackathon project to judges."
    }
  ];

  return (
    <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700">
      <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Hackathon Resources
            </span>
          </h2>
          
          <p className="text-gray-300">
            Guides and tools to help you succeed in your next hackathon
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/hackathons/resources"
              className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-colors w-full sm:w-auto text-center"
            >
              Browse Resources
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            
            <Link 
              to="/hackathons/community"
              className="inline-flex items-center justify-center px-5 py-3 bg-purple-700/60 hover:bg-purple-700/80 text-white font-medium rounded-lg border border-purple-500/50 transition-colors w-full sm:w-auto text-center"
            >
              Join Community
            </Link>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 relative mt-6 md:mt-0">
          {/* Resources grid */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg blur-xl"></div>
            
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
              {resources.map((resource) => (
                <Link
                  key={resource.id}
                  to={`/hackathons/resources/${resource.id}`}
                  className="group bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-gray-800/80 rounded-lg overflow-hidden border border-gray-700/50 hover:border-purple-500/50 shadow-lg p-4 transform hover:scale-[1.03] transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="p-2 bg-purple-900/30 rounded-lg mr-3 text-xl">{resource.icon}</div>
                    <div>
                      <h3 className="text-white font-medium text-sm sm:text-base group-hover:text-purple-400 transition-colors line-clamp-1">{resource.title}</h3>
                      
                      <span className="inline-block text-xs py-0.5 px-2 bg-purple-900/30 text-purple-400 rounded-full mt-1 mb-2">
                        {resource.type}
                      </span>
                      
                      <p className="text-xs text-gray-300 line-clamp-2">{resource.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Stats overlay */}
            <div className="mt-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex justify-between items-center">
                <div className="text-center px-2">
                  <p className="text-xl font-bold text-white">12</p>
                  <p className="text-xs text-gray-400">Guides</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-xl font-bold text-white">8</p>
                  <p className="text-xs text-gray-400">Workshops</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-xl font-bold text-white">5K+</p>
                  <p className="text-xs text-gray-400">Community</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-xl font-bold text-white">24/7</p>
                  <p className="text-xs text-gray-400">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HackathonResourcesPreview; 