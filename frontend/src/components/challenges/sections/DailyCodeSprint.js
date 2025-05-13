import React from 'react';
import { Link } from 'react-router-dom';

function DailyCodeSprint() {
  // Mock data for current sprint progress
  // Commented out unused variables
  // const currentDay = 2; // User is currently on day 2
  // const completedDays = 1; // User has completed day 1
  
  // Progress timeline data
  const progressDays = [
    { day: 1, topic: "Array", completed: true },
    { day: 2, topic: "Math", isToday: true, topics: ["Math", "Tree"] },
    { day: 3, topic: "Depth-First Search", upcoming: true }
  ];
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700">
      <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="md:w-1/2 space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-white">100 Days</h2>
            <h2 className="text-3xl font-bold text-white">Coding Sprint</h2>
          </div>
          
          <p className="text-gray-300">
            Level up your skills daily with our 100-Day Coding Sprint
          </p>
          
          <Link 
            to="/challenges/daily-sprint"
            className="inline-flex items-center justify-center px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-colors"
          >
            Start now
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        
        <div className="md:w-1/2 relative">
          {/* Progress timeline with circles and connector line */}
          <div className="bg-gray-700/50 rounded-2xl p-4 relative max-w-md mx-auto">
            <div className="absolute left-12 top-20 bottom-20 w-0.5 bg-blue-900/50 z-0"></div>
            
            {/* Day 1 - Completed */}
            <div className="relative z-10 flex items-center mb-8">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3 shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="bg-gray-800 rounded-lg shadow px-4 py-2 flex items-center justify-between flex-1">
                <div>
                  <div className="text-sm font-medium">Day {progressDays[0].day}</div>
                </div>
                <div className="bg-blue-900/30 px-3 py-1 rounded-full text-sm text-blue-300 font-medium">
                  {progressDays[0].topic}
                </div>
              </div>
            </div>
            
            {/* Day 2 - Current */}
            <div className="relative z-10 flex items-center mb-8">
              <div className="w-8 h-8 rounded-full border-4 border-blue-600 bg-gray-800 flex items-center justify-center mr-3 shadow-md">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              </div>
              <div className="bg-gray-800 rounded-lg shadow-md border border-blue-800 px-4 py-3 flex-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium">Day {progressDays[1].day}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {progressDays[1].topics.map((topic, index) => (
                    <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${
                      topic === "Math" 
                        ? "bg-yellow-500 text-yellow-900" 
                        : "bg-green-500 text-green-900"
                    }`}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Day 3 - Upcoming */}
            <div className="relative z-10 flex items-center">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-500 bg-gray-800 flex items-center justify-center mr-3">
                <div className="text-xs font-medium text-gray-400">3</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center justify-between flex-1 opacity-70">
                <div>
                  <div className="text-sm font-medium">Day {progressDays[2].day}</div>
                </div>
                <div className="text-gray-400 text-sm">
                  {progressDays[2].topic}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyCodeSprint; 