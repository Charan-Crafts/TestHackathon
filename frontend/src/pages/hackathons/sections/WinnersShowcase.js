import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../../components/common/LoadingIndicator';

function WinnersShowcase() {
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    // Simulate loading winners data
    const timer = setTimeout(() => {
      setWinners([
        {
          id: 1,
          hackathon: "Global AI Innovation Challenge 2023",
          project: {
            name: "HealthAI Assistant",
            description: "AI-powered healthcare assistant for personalized patient care and medical diagnosis support.",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            demoUrl: "#",
            githubUrl: "#"
          },
          team: {
            name: "AI Health Innovators",
            members: [
              { name: "Sarah Chen", role: "ML Engineer", avatar: "https://i.pravatar.cc/150?img=1" },
              { name: "Mike Ross", role: "Backend Dev", avatar: "https://i.pravatar.cc/150?img=2" },
              { name: "Emily Wang", role: "Frontend Dev", avatar: "https://i.pravatar.cc/150?img=3" }
            ]
          },
          prize: "$30,000",
          position: "1st Place",
          category: "Healthcare AI"
        },
        {
          id: 2,
          hackathon: "Blockchain Innovation Summit 2023",
          project: {
            name: "EcoChain",
            description: "Blockchain solution for tracking and reducing carbon emissions in supply chains.",
            image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            demoUrl: "#",
            githubUrl: "#"
          },
          team: {
            name: "Green Chain Gang",
            members: [
              { name: "Alex Johnson", role: "Blockchain Dev", avatar: "https://i.pravatar.cc/150?img=4" },
              { name: "Lisa Park", role: "Smart Contracts", avatar: "https://i.pravatar.cc/150?img=5" }
            ]
          },
          prize: "$25,000",
          position: "1st Place",
          category: "Sustainability"
        },
        {
          id: 3,
          hackathon: "EdTech Revolution 2023",
          project: {
            name: "LearnVerse",
            description: "VR-based interactive learning platform for immersive educational experiences.",
            image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            demoUrl: "#",
            githubUrl: "#"
          },
          team: {
            name: "EduTech Pioneers",
            members: [
              { name: "David Kim", role: "VR Developer", avatar: "https://i.pravatar.cc/150?img=6" },
              { name: "Rachel Green", role: "3D Artist", avatar: "https://i.pravatar.cc/150?img=7" },
              { name: "Tom Wilson", role: "Unity Dev", avatar: "https://i.pravatar.cc/150?img=8" }
            ]
          },
          prize: "$20,000",
          position: "1st Place",
          category: "Education"
        }
      ]);
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);

    return () => clearTimeout(timer);
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
            <span className="relative z-10">Winners <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-400">Showcase</span></span>
            <span className="absolute -left-2 bottom-0 w-full h-3 bg-gradient-to-r from-yellow-600 to-amber-600 opacity-70 transform skew-x-12 z-0"></span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Celebrating the innovative projects and talented teams that won our hackathons
          </p>
        </div>

        {/* Winners Grid */}
        <div className="space-y-12">
          {winners.map((winner, index) => (
            <div
              key={winner.id}
              className={`bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-gray-800/80 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg transform hover:scale-[1.01] transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Project Image */}
                <div className="relative h-64 lg:h-full">
                  <img
                    src={winner.project.image}
                    alt={winner.project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-transparent lg:bg-gradient-to-br"></div>
                  
                  {/* Position Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="px-4 py-2 bg-gradient-to-r from-yellow-600/90 to-amber-600/90 rounded-lg border border-yellow-500/50 shadow-lg">
                      <span className="text-yellow-100 font-bold">{winner.position}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{winner.project.name}</h3>
                    <p className="text-gray-400 mb-4">{winner.project.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className="px-3 py-1 bg-yellow-900/30 text-yellow-300 text-sm rounded-full border border-yellow-700/30">
                        {winner.category}
                      </span>
                      <span className="text-yellow-400 font-bold">{winner.prize} Prize</span>
                    </div>
                  </div>

                  {/* Team Section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Winning Team: {winner.team.name}</h4>
                    <div className="flex flex-wrap gap-3">
                      {winner.team.members.map((member, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full border border-gray-700"
                          />
                          <div>
                            <p className="text-sm text-white">{member.name}</p>
                            <p className="text-xs text-gray-400">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Links */}
                  <div className="flex space-x-4">
                    <a
                      href={winner.project.demoUrl}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white rounded-lg transition-colors"
                    >
                      View Demo
                    </a>
                    <a
                      href={winner.project.githubUrl}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors"
                    >
                      GitHub Repo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`mt-16 text-center transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-gradient-to-r from-yellow-900/30 via-amber-900/30 to-yellow-900/30 rounded-xl p-8 border border-yellow-700/30">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to join our next hackathon?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Participate in our upcoming hackathons and showcase your innovation to the world.
            </p>
            <Link
              to="/hackathons"
              className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Browse Hackathons
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WinnersShowcase; 