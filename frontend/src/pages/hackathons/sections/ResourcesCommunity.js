import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../../components/common/LoadingIndicator';

function ResourcesCommunity() {
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Mock resources data
  const resources = [
    {
      category: "Getting Started",
      items: [
        {
          title: "Hackathon Guide",
          description: "Complete guide to participating in hackathons",
          icon: "📚",
          link: "#"
        },
        {
          title: "Project Planning",
          description: "Tips for planning and executing your hackathon project",
          icon: "📋",
          link: "#"
        },
        {
          title: "Team Formation",
          description: "How to build and work effectively in a team",
          icon: "👥",
          link: "#"
        }
      ]
    },
    {
      category: "Technical Resources",
      items: [
        {
          title: "API Documentation",
          description: "Access our APIs and integration guides",
          icon: "🔧",
          link: "#"
        },
        {
          title: "Starter Templates",
          description: "Quick-start templates for various tech stacks",
          icon: "💻",
          link: "#"
        },
        {
          title: "Code Examples",
          description: "Sample code and implementation guides",
          icon: "📝",
          link: "#"
        }
      ]
    },
    {
      category: "Community",
      items: [
        {
          title: "Discord Server",
          description: "Join our active developer community",
          icon: "💬",
          link: "#"
        },
        {
          title: "Mentorship",
          description: "Connect with experienced mentors",
          icon: "🎓",
          link: "#"
        },
        {
          title: "Events Calendar",
          description: "Upcoming workshops and meetups",
          icon: "📅",
          link: "#"
        }
      ]
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);
  }, []);

  if (loading) {
    return <LoadingIndicator type="scanning" message="Please wait..." title="" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-purple-900/20 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 relative inline-block">
            <span className="relative z-10">Resources & <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Community</span></span>
            <span className="absolute -left-2 bottom-0 w-full h-3 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-70 transform skew-x-12 z-0"></span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Everything you need to succeed in your hackathon journey
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((category, index) => (
            <div
              key={category.category}
              className={`transition-all duration-700 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-gray-800/80 rounded-xl overflow-hidden border border-gray-700/50 h-full">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">{category.category}</h2>
                  <div className="space-y-6">
                    {category.items.map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href={item.link}
                        className="block p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <div className="flex items-start">
                          <span className="text-2xl mr-4">{item.icon}</span>
                          <div>
                            <h3 className="text-lg font-medium text-white mb-1">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.description}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Stats */}
        <div className={`mt-16 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-gradient-to-r from-cyan-900/30 via-blue-900/30 to-cyan-900/30 rounded-xl p-8 border border-cyan-700/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-cyan-300">15K+</div>
                <div className="text-gray-400 mt-1">Community Members</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-blue-300">50+</div>
                <div className="text-gray-400 mt-1">Active Mentors</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-cyan-300">100+</div>
                <div className="text-gray-400 mt-1">Weekly Events</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-blue-300">5K+</div>
                <div className="text-gray-400 mt-1">Discord Members</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`mt-16 text-center transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-gradient-to-r from-cyan-900/30 via-blue-900/30 to-cyan-900/30 rounded-xl p-8 border border-cyan-700/30">
            <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Connect with fellow developers, share your experiences, and get help from our community of experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#discord"
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Join Discord
              </a>
              <Link
                to="/mentorship"
                className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg border border-gray-600 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                Find a Mentor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourcesCommunity; 