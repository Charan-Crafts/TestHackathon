import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../../components/common/LoadingIndicator';

// Topic categories with their subtopics
const TOPICS = [
  {
    name: "Data Structures",
    icon: "📊",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-300",
    subtopics: ["Arrays", "Linked Lists", "Stacks", "Queues", "Trees", "Graphs", "Hash Tables"]
  },
  {
    name: "Algorithms",
    icon: "🧮",
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-900/20",
    borderColor: "border-purple-500/50",
    textColor: "text-purple-300",
    subtopics: ["Sorting", "Searching", "Recursion", "Dynamic Programming", "Greedy Algorithms", "Backtracking"]
  },
  {
    name: "System Design",
    icon: "🏗️",
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-900/20",
    borderColor: "border-emerald-500/50",
    textColor: "text-emerald-300",
    subtopics: ["Scalability", "Load Balancing", "Caching", "Database Design", "Microservices", "API Design"]
  },
  {
    name: "Web Development",
    icon: "🌐",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-900/20",
    borderColor: "border-amber-500/50",
    textColor: "text-amber-300",
    subtopics: ["HTML/CSS", "JavaScript", "React", "Node.js", "REST APIs", "Authentication", "State Management"]
  }
];

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { name: "Easy", color: "green", description: "Fundamentals and basic concepts" },
  { name: "Medium", color: "yellow", description: "Intermediate problems requiring deeper understanding" },
  { name: "Hard", color: "red", description: "Complex challenges for advanced problem-solvers" }
];

// Mock challenge data
const MOCK_CHALLENGES = [
  {
    id: 1,
    title: "Implement a Binary Search Tree",
    difficulty: "Medium",
    description: "Create a binary search tree implementation with insert, delete, and search operations.",
    topic: "Data Structures",
    subtopic: "Trees",
    stars: 4.8,
    solvedBy: 1423
  },
  {
    id: 2,
    title: "Merge Sort Algorithm",
    difficulty: "Easy",
    description: "Implement the merge sort algorithm for efficient array sorting.",
    topic: "Algorithms",
    subtopic: "Sorting",
    stars: 4.5,
    solvedBy: 2856
  },
  {
    id: 3,
    title: "Design a URL Shortener",
    difficulty: "Hard",
    description: "Design a system to create shortened URLs similar to bit.ly or tinyurl.",
    topic: "System Design",
    subtopic: "Scalability",
    stars: 4.9,
    solvedBy: 768
  }
];

function CodeConquestPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setChallenges(MOCK_CHALLENGES);
      setActiveChallenge(MOCK_CHALLENGES[0]);
      
      // Trigger animations
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, 1000);
  }, []);

  // Handle topic change
  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(null);
  };

  // Handle subtopic change
  const handleSubtopicChange = (subtopic) => {
    setSelectedSubtopic(subtopic);
  };

  // Handle difficulty change
  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  // Handle challenge selection
  const handleChallengeSelect = (challenge) => {
    setActiveChallenge(challenge);
  };

  // Get difficulty color class
  const getDifficultyClass = (difficulty) => {
    switch(difficulty) {
      case 'Easy':
        return 'bg-green-900/30 text-green-400 border-green-500/50';
      case 'Medium':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/50';
      case 'Hard':
        return 'bg-red-900/30 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-700/50 text-gray-300';
    }
  };

  // Get topic icon and color
  const getTopicStyles = (topicName) => {
    const topic = TOPICS.find(t => t.name === topicName) || TOPICS[0];
    return {
      bgColor: topic.bgColor,
      borderColor: topic.borderColor,
      textColor: topic.textColor,
      icon: topic.icon
    };
  };

  // Loading spinner
  if (isLoading) {
    return (
      <LoadingIndicator 
        type="scanning" 
        message="Please wait..." 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-purple-900/20 to-gray-900 py-12 relative">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero section */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 relative inline-block">
            <span className="relative z-10">Code <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Conquest</span></span>
            <span className="absolute -left-2 bottom-0 w-full h-3 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70 transform skew-x-12 z-0"></span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm">
            Practice targeted challenges to master specific programming concepts
          </p>
        </div>
        
        {/* Info Banner */}
        <div className={`mb-12 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
          <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-purple-900/40 p-8 rounded-xl border border-purple-800/40 backdrop-blur-sm shadow-lg shadow-purple-900/10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="bg-gray-800/50 rounded-lg p-5 border border-purple-700/30 flex items-center space-x-5 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg shadow-lg shadow-purple-900/30">
                  <svg className="h-8 w-8 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Tailored Learning Path</h3>
                  <p className="text-sm text-gray-300">Focus on specific topics to strengthen your skills</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-green-200 mr-3 shadow-md shadow-green-900/20 group-hover:scale-110 transition-transform">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Choose from 10+ topic categories</span>
                </div>
                <div className="flex items-center group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-blue-200 mr-3 shadow-md shadow-blue-900/20 group-hover:scale-110 transition-transform">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Select your preferred difficulty level</span>
                </div>
                <div className="flex items-center group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-indigo-200 mr-3 shadow-md shadow-indigo-900/20 group-hover:scale-110 transition-transform">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Track your progress as you master each topic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar - Topic selection */}
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
            <div className="bg-gradient-to-r from-gray-800/60 via-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-lg shadow-purple-900/5">
              <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 px-6 py-4 border-b border-gray-700/50">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <svg className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Topics
                </h2>
              </div>
              
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {TOPICS.map((topic) => (
                  <div key={topic.name} className="mb-2">
                    <button
                      onClick={() => handleTopicChange(topic)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center ${
                        selectedTopic === topic 
                          ? `bg-gradient-to-r ${topic.bgColor} ${topic.borderColor} border-2 ${topic.textColor} shadow-md shadow-${topic.name.toLowerCase()}-900/20` 
                          : 'bg-gray-800/70 hover:bg-gray-700/70 text-gray-300 border border-gray-700/50 hover:border-indigo-600/50'
                      }`}
                    >
                      <span className="text-2xl mr-3">{topic.icon}</span>
                      <span className="font-medium">{topic.name}</span>
                    </button>
                    
                    {selectedTopic === topic && (
                      <div className="ml-6 mt-3 space-y-1.5 bg-gray-900/60 rounded-lg p-2 border border-gray-800/70">
                        {topic.subtopics.map((subtopic) => (
                          <button
                            key={subtopic}
                            onClick={() => handleSubtopicChange(subtopic)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-300 ${
                              selectedSubtopic === subtopic
                                ? `bg-gradient-to-r ${topic.bgColor} ${topic.textColor} ${topic.borderColor} border shadow-sm shadow-${topic.name.toLowerCase()}-900/20`
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/70'
                            }`}
                          >
                            {subtopic}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 px-6 py-4 border-t border-gray-700/50">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <svg className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Difficulty
                </h2>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDifficultyChange("all")}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-300 ${
                      selectedDifficulty === "all"
                        ? 'bg-gradient-to-r from-indigo-600/70 to-indigo-700/70 text-white border-indigo-500/50 shadow-md shadow-indigo-900/20'
                        : 'bg-gray-800/80 text-gray-400 border-gray-700/50 hover:bg-gray-700/70'
                    }`}
                  >
                    All Levels
                  </button>
                  
                  {DIFFICULTY_LEVELS.map((level) => (
                    <button
                      key={level.name}
                      onClick={() => handleDifficultyChange(level.name)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-300 ${
                        selectedDifficulty === level.name
                          ? `bg-${level.color}-900/40 text-${level.color}-300 border-${level.color}-500/50 shadow-md shadow-${level.color}-900/20`
                          : 'bg-gray-800/80 text-gray-400 border-gray-700/50 hover:bg-gray-700/70'
                      }`}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Center - Challenge list */}
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
            <div className="bg-gradient-to-r from-gray-800/60 via-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden h-full shadow-lg shadow-purple-900/5">
              <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 px-6 py-4 border-b border-gray-700/50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <svg className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Challenges
                </h2>
                
                <div className="text-xs text-gray-400 bg-gray-800/70 px-3 py-1.5 rounded-full border border-gray-700/50">
                  {selectedTopic 
                    ? `${selectedTopic.name}${selectedSubtopic ? ` / ${selectedSubtopic}` : ''}`
                    : 'All Topics'
                  }
                </div>
              </div>
              
              <div className="divide-y divide-gray-700/50">
                {challenges.map((challenge) => (
                  <button
                    key={challenge.id}
                    onClick={() => handleChallengeSelect(challenge)}
                    className={`w-full text-left p-5 hover:bg-gray-800/50 transition-all duration-300 flex items-start group ${
                      activeChallenge?.id === challenge.id ? 'bg-gradient-to-r from-gray-800/70 to-gray-900/70 border-l-4 border-l-indigo-500' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <span 
                          className={`inline-block px-3 py-1.5 text-xs font-medium rounded-full border ${
                            getDifficultyClass(challenge.difficulty)
                          }`}
                        >
                          {challenge.difficulty}
                        </span>
                        
                        <div className="ml-3 flex items-center">
                          <span className="text-xl mr-1">{getTopicStyles(challenge.topic).icon}</span>
                          <span className={`text-xs ${getTopicStyles(challenge.topic).textColor} px-2 py-0.5 rounded-full bg-gray-900/70 border ${getTopicStyles(challenge.topic).borderColor}`}>
                            {challenge.subtopic}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-white group-hover:text-indigo-300 transition-colors">{challenge.title}</h3>
                      
                      <div className="flex items-center mt-3 text-xs text-gray-400">
                        <div className="flex items-center mr-4">
                          <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-white">{challenge.stars}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-indigo-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span className="text-indigo-300">{challenge.solvedBy.toLocaleString()}</span> solved
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right section - Challenge details */}
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '500ms' }}>
            {activeChallenge && (
              <div className="bg-gradient-to-r from-gray-800/60 via-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-lg shadow-purple-900/5">
                <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 px-6 py-4 border-b border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">{activeChallenge.title}</h2>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                      getDifficultyClass(activeChallenge.difficulty)
                    }`}>
                      {activeChallenge.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className={`mb-6 p-4 rounded-lg ${getTopicStyles(activeChallenge.topic).bgColor} border ${getTopicStyles(activeChallenge.topic).borderColor} shadow-md shadow-${activeChallenge.topic.toLowerCase()}-900/20`}>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{getTopicStyles(activeChallenge.topic).icon}</span>
                      <span className={`font-medium ${getTopicStyles(activeChallenge.topic).textColor}`}>
                        {activeChallenge.topic} / {activeChallenge.subtopic}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{activeChallenge.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-white font-medium mb-3">Challenge Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 rounded-lg p-4 border border-gray-700/50 hover:border-yellow-700/30 hover:shadow-md hover:shadow-yellow-900/10 transition-all duration-300 group">
                        <div className="text-xs text-gray-400 mb-1 group-hover:text-yellow-300 transition-colors">Rating</div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-lg font-medium text-white">{activeChallenge.stars}</span>
                          <span className="text-gray-500 text-xs ml-1">/ 5.0</span>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 rounded-lg p-4 border border-gray-700/50 hover:border-indigo-700/30 hover:shadow-md hover:shadow-indigo-900/10 transition-all duration-300 group">
                        <div className="text-xs text-gray-400 mb-1 group-hover:text-indigo-300 transition-colors">Solved By</div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-indigo-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span className="text-lg font-medium text-white">{activeChallenge.solvedBy.toLocaleString()}</span>
                          <span className="text-gray-500 text-xs ml-1">users</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/challenges/${activeChallenge.id}`}
                    className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white text-center font-medium transition-colors shadow-lg shadow-purple-900/30 transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Start Challenge
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeConquestPage; 