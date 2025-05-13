import React from 'react';
import { Link } from 'react-router-dom';

function HackathonCategoriesPreview() {
  // Sample categories data
  const categories = [
    {
      id: 1,
      name: "Web3 & Blockchain",
      icon: "🔗",
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.15)",
      borderColor: "rgba(139, 92, 246, 0.3)",
      textColor: "#A78BFA",
      count: 24
    },
    {
      id: 2,
      name: "AI & Machine Learning",
      icon: "🤖",
      color: "#EC4899",
      bgColor: "rgba(236, 72, 153, 0.15)",
      borderColor: "rgba(236, 72, 153, 0.3)",
      textColor: "#F472B6",
      count: 31
    },
    {
      id: 3,
      name: "Game Development",
      icon: "🎮",
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.15)",
      borderColor: "rgba(16, 185, 129, 0.3)",
      textColor: "#34D399",
      count: 18
    },
    {
      id: 4,
      name: "Climate Tech",
      icon: "🌿",
      color: "#3B82F6",
      bgColor: "rgba(59, 130, 246, 0.15)",
      borderColor: "rgba(59, 130, 246, 0.3)",
      textColor: "#60A5FA",
      count: 15
    },
    {
      id: 5,
      name: "Social Impact",
      icon: "⚡",
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.15)",
      borderColor: "rgba(245, 158, 11, 0.3)",
      textColor: "#FBBF24",
      count: 22
    },
    {
      id: 6,
      name: "AR/VR",
      icon: "👓",
      color: "#6366F1",
      bgColor: "rgba(99, 102, 241, 0.15)",
      borderColor: "rgba(99, 102, 241, 0.3)",
      textColor: "#818CF8",
      count: 12
    },
    {
      id: 7,
      name: "DevOps & Cloud",
      icon: "☁️",
      color: "#0EA5E9",
      bgColor: "rgba(14, 165, 233, 0.15)",
      borderColor: "rgba(14, 165, 233, 0.3)",
      textColor: "#38BDF8",
      count: 17
    },
    {
      id: 8,
      name: "Mobile Apps",
      icon: "📱",
      color: "#EF4444",
      bgColor: "rgba(239, 68, 68, 0.15)",
      borderColor: "rgba(239, 68, 68, 0.3)",
      textColor: "#F87171",
      count: 19
    }
  ];

  return (
    <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700">
      <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-400">
              Browse by Category
            </span>
          </h2>
          
          <p className="text-gray-300">
            Find hackathons based on the technologies or themes that interest you most. 
            Each category offers unique challenges and opportunities.
          </p>
          
          <Link 
            to="/hackathons/categories"
            className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-500 hover:to-green-500 text-white font-medium rounded-lg transition-colors"
          >
            Explore All Categories
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        
        <div className="md:w-1/2 relative">
          {/* Categories grid */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-green-600/20 rounded-lg blur-xl"></div>
            
            <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/hackathons/category/${category.id}`}
                  className="group flex flex-col items-center text-center p-3 rounded-lg"
                  style={{ 
                    backgroundColor: category.bgColor,
                    border: `1px solid ${category.borderColor}`
                  }}
                >
                  <div 
                    className="w-12 h-12 flex items-center justify-center rounded-full mb-2 text-2xl transform group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: category.bgColor, border: `1px solid ${category.borderColor}` }}
                  >
                    {category.icon}
                  </div>
                  
                  <h3 
                    className="text-sm font-medium mb-1 group-hover:underline"
                    style={{ color: category.textColor }}
                  >
                    {category.name}
                  </h3>
                  
                  <span 
                    className="text-xs"
                    style={{ color: category.textColor }}
                  >
                    {category.count} events
                  </span>
                </Link>
              ))}
              
              {/* "More" badge */}
              <Link
                to="/hackathons/categories"
                className="group flex flex-col items-center justify-center text-center p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full mb-2 text-2xl bg-gray-800/80 text-gray-300 border border-gray-700/50 group-hover:text-white transition-colors">
                  +
                </div>
                
                <h3 className="text-sm font-medium mb-1 text-gray-300 group-hover:text-white transition-colors">
                  More Categories
                </h3>
                
                <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                  12+ more
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HackathonCategoriesPreview; 