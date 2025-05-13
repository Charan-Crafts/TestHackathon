import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CodeEditor from '../../components/challenges/CodeEditor';
import LoadingIndicator from '../../components/common/LoadingIndicator';

// Mock challenge data - in a real app this would come from an API
const MOCK_CHALLENGE = {
  id: "two-sum",
  title: "Two Sum",
  description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
  difficulty: "Easy",
  category: "Arrays",
  completedBy: 12453,
  successRate: 78,
  tags: ["Array", "Hash Table"],
  inputFormat: "nums = [2,7,11,15], target = 9",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
    }
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists."
  ],
  followUp: "Can you come up with an algorithm that is less than O(n²) time complexity?",
  solutionTemplate: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your solution here
}

// Example usage (uncomment to test):
// console.log(twoSum([2, 7, 11, 15], 9));`,
    python: `class Solution:
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        # Your solution here
        
# Example usage (uncomment to test):
# solution = Solution()
# print(solution.twoSum([2, 7, 11, 15], 9))`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
    }
    
    // Example usage:
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] result = solution.twoSum(new int[]{2, 7, 11, 15}, 9);
        // Print result
    }
}`
  },
  testCases: [
    {
      input: "nums = [2,7,11,15], target = 9",
      expected: "[0,1]"
    },
    {
      input: "nums = [3,2,4], target = 6", 
      expected: "[1,2]"
    },
    {
      input: "nums = [3,3], target = 6",
      expected: "[0,1]"
    },
    {
      input: "nums = [1,2,3,4,5], target = 9",
      expected: "[3,4]"
    },
    {
      input: "nums = [-1,-2,-3,-4,-5], target = -8",
      expected: "[2,4]"
    }
  ]
};

function ChallengeSolver() {
  const { challengeId } = useParams();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  // eslint-disable-next-line no-unused-vars
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [runAnimation, setRunAnimation] = useState(false);
  
  // Ref for scrolling to bottom of results
  const resultsRef = useRef(null);
  
  // Add this state for mobile view control
  const [mobileView, setMobileView] = useState('description'); // 'description' or 'editor'
  
  // Add useEffect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // On desktop show both
        setMobileView('both');
      } else if (mobileView === 'both') {
        // When resizing down from desktop to mobile, default to description
        setMobileView('description');
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileView]);
  
  // Fetch challenge data
  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, we would fetch the specific challenge by ID
      setChallenge(MOCK_CHALLENGE);
      if (MOCK_CHALLENGE.solutionTemplate && MOCK_CHALLENGE.solutionTemplate[selectedLanguage]) {
        setCode(MOCK_CHALLENGE.solutionTemplate[selectedLanguage]);
      }
      setIsLoading(false);
    }, 800);
  }, [challengeId, selectedLanguage]);
  
  // Handle code change from editor
  const handleCodeChange = (newCode, language) => {
    setCode(newCode);
    setSelectedLanguage(language);
  };
  
  // Handle running code animation
  const triggerRunAnimation = () => {
    setRunAnimation(true);
    setTimeout(() => setRunAnimation(false), 500);
  };
  
  // Handle running code against test cases
  const handleRunCode = () => {
    triggerRunAnimation();
    setIsProcessing(true);
    setTestResults(null);
    
    // Switch to editor view on mobile after running code
    if (window.innerWidth < 1024 && mobileView === 'description') {
      setMobileView('editor');
    }
    
    // Simulate code execution and testing
    setTimeout(() => {
      // In a real app, this would send the code to a backend service
      // that would execute it against test cases and return results
      
      // Mock test results
      const results = challenge.testCases.map((testCase, index) => {
        // For demo purposes, we'll randomly generate some passes and failures
        const passed = Math.random() > 0.3; // 70% pass rate for demo
        
        return {
          input: testCase.input,
          expected: testCase.expected,
          output: passed ? testCase.expected : `[${Math.floor(Math.random() * 5)},${Math.floor(Math.random() * 5)}]`,
          passed: passed,
          message: passed 
            ? "Your solution passed this test case!" 
            : "Your solution produced incorrect output for this test case."
        };
      });
      
      setTestResults(results);
      setIsProcessing(false);
      
      // Scroll to results
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1500);
  };

  // Handle running custom input
  const handleRunCustomInput = () => {
    triggerRunAnimation();
    setIsProcessing(true);
    setCustomOutput("");
    
    // Simulate code execution with custom input
    setTimeout(() => {
      // In a real app, this would execute the code with the custom input
      // For demo, just returning a placeholder output
      setCustomOutput(Math.random() > 0.5 ? "[0,1]" : "[1,3]");
      setIsProcessing(false);
    }, 1000);
  };
  
  // Handle submitting code for final evaluation
  const handleSubmitCode = () => {
    setIsSubmitting(true);
    setSubmissionStatus(null);
    
    // Switch to editor view on mobile after submitting code
    if (window.innerWidth < 1024 && mobileView === 'description') {
      setMobileView('editor');
    }
    
    // Simulate submission processing
    setTimeout(() => {
      // In a real app, this would send the code to a backend service
      // that would evaluate it, run it against all test cases, and 
      // measure performance, efficiency, etc.
      
      // For demo purposes, decide randomly if submission passed
      const allTestsPassed = Math.random() > 0.2; // 80% success rate for demo
      
      setSubmissionStatus({
        status: allTestsPassed ? "success" : "failed",
        message: allTestsPassed 
          ? "Congratulations! Your solution passed all test cases." 
          : "Your solution failed some test cases. Please try again.",
        details: allTestsPassed ? {
          runtime: `${Math.floor(Math.random() * 50 + 50)} ms`,
          memory: `${Math.floor(Math.random() * 10 + 40)} MB`,
          runtimePercentile: `Faster than ${Math.floor(Math.random() * 60 + 40)}% of submissions`,
          memoryPercentile: `Less memory than ${Math.floor(Math.random() * 60 + 40)}% of submissions`
        } : null
      });
      
      setIsSubmitting(false);
    }, 2000);
  };

  // Handle reset code
  const handleResetCode = () => {
    if (window.confirm("Are you sure you want to reset your code to the template?")) {
      setCode(challenge.solutionTemplate[selectedLanguage]);
    }
  };
  
  if (isLoading) {
    return (
      <LoadingIndicator 
        type="skeleton" 
        title="Coding Challenge"
      />
    );
  }
  
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#1a202c]">
      {/* Simplified header - fixed height */}
      <header className="h-14 min-h-[56px] bg-[#1a202c] border-b border-gray-700 flex items-center px-4 shrink-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Link to="/challenges" className="text-gray-300 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-white text-lg font-medium truncate">{challenge?.title || 'Loading...'}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">00:00:00</span>
            </div>
            <Link 
              to="/challenges"
              className="px-3 sm:px-4 py-1.5 bg-[#e65c2c] text-white rounded text-sm font-medium hover:bg-[#d04b1e] transition-colors"
            >
              Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile view switcher - Only show on mobile */}
      <div className="lg:hidden flex border-b border-gray-700">
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${
            mobileView === 'description' ? 'text-white bg-blue-900/30 border-b-2 border-blue-500' : 'text-gray-400'
          }`}
          onClick={() => setMobileView('description')}
        >
          Problem
        </button>
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${
            mobileView === 'editor' ? 'text-white bg-blue-900/30 border-b-2 border-blue-500' : 'text-gray-400'
          }`}
          onClick={() => setMobileView('editor')}
        >
          Code
        </button>
      </div>

      {/* Main content with conditional display for mobile */}
      <div className="flex flex-col lg:flex-row flex-1 h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)] overflow-hidden">
        {/* Left pane - Problem description */}
        <div className={`w-full lg:w-[40%] border-b lg:border-b-0 lg:border-r border-gray-700 flex flex-col 
            overflow-hidden bg-[#1a202c] ${
              mobileView === 'description' || mobileView === 'both' ? 'flex' : 'hidden'
            } lg:flex h-full`}
        >
          {/* Problem navigation - fixed height */}
          <div className="h-12 min-h-[48px] border-b border-gray-700 flex shrink-0 overflow-x-auto">
            <button 
              className={`px-4 sm:px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'description' 
                  ? 'text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Problem
            </button>
            <button 
              className={`px-4 sm:px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'solution' 
                  ? 'text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('solution')}
            >
              Solution
            </button>
            <button 
              className={`px-4 sm:px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'submissions' 
                  ? 'text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('submissions')}
            >
              Submissions
            </button>
          </div>

          {/* Problem content - scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  challenge?.difficulty === 'Easy' 
                    ? 'bg-green-900/60 text-green-400' 
                    : challenge?.difficulty === 'Medium'
                    ? 'bg-yellow-900/60 text-yellow-400'
                    : 'bg-red-900/60 text-red-400'
                }`}>
                  {challenge?.difficulty}
                </span>
                <span className="text-gray-400 text-sm">Score - 0/100</span>
              </div>

              <h2 className="text-xl font-semibold text-white mb-6">Problem Statement</h2>
              <div className="bg-[#262f3d] rounded-lg p-4 mb-8 border border-gray-700">
                <p className="text-gray-300 whitespace-pre-line">
                  {challenge?.description}
                </p>
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-gray-300">You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
                <p className="text-gray-300">You can return the answer in any order.</p>
              </div>

              <h3 className="text-lg font-medium text-white mb-3">Input Format</h3>
              <div className="bg-[#262f3d] rounded-lg p-4 mb-6 border border-gray-700">
                <pre className="text-gray-300 text-sm font-mono">
                  {challenge?.inputFormat}
                </pre>
              </div>

              <h3 className="text-lg font-medium text-white mb-3">Examples</h3>
              <div className="space-y-4 mb-6">
                {challenge?.examples.map((example, index) => (
                  <div key={index} className="bg-[#262f3d] rounded-lg p-4 border border-gray-700">
                    <h4 className="text-white font-medium mb-2">Example {index + 1}:</h4>
                    <div className="text-gray-300 mb-2 font-mono">
                      <span className="text-green-400 font-medium">Input:</span> {example.input}
                    </div>
                    <div className="text-gray-300 mb-2 font-mono">
                      <span className="text-blue-400 font-medium">Output:</span> {example.output}
                    </div>
                    {example.explanation && (
                      <div className="text-gray-300 mt-2">
                        <span className="text-yellow-400 font-medium">Explanation:</span> {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-medium text-white mb-3">Constraints</h3>
              <div className="bg-[#262f3d] rounded-lg p-4 mb-6 border border-gray-700">
                <ul className="list-disc list-inside space-y-1">
                  {challenge?.constraints.map((constraint, index) => (
                    <li key={index} className="text-gray-300 font-mono">{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right pane - Code editor */}
        <div className={`flex-1 flex flex-col overflow-hidden bg-[#1a202c] ${
          mobileView === 'editor' || mobileView === 'both' ? 'flex' : 'hidden'
        } lg:flex h-full`}>
          {/* Show a "Back to Problem" button at the top on mobile */}
          <div className="lg:hidden flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
            <button 
              onClick={() => setMobileView('description')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Problem
            </button>
            <div className="text-gray-400 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                Ready
              </div>
            </div>
          </div>
        
          {/* Code editor with proper integration */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor 
              initialCode={challenge?.solutionTemplate?.[selectedLanguage] || ''}
              language={selectedLanguage}
              onCodeChange={handleCodeChange}
              onRunCode={handleRunCode}
              onSubmitCode={handleSubmitCode}
              isProcessing={isProcessing || isSubmitting}
              onCustomTest={() => setShowCustomInput(!showCustomInput)}
              onResetCode={handleResetCode}
            />
          </div>

          {/* Test results */}
          {(testResults || showCustomInput) && (
            <div className="bg-gray-800 border-t border-gray-700 h-1/3 overflow-hidden flex flex-col" ref={resultsRef}>
              <div className="bg-gray-800 p-2 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-white font-medium">
                  {showCustomInput ? "Custom Input" : "Test Results"}
                </h3>
                <button
                  onClick={() => showCustomInput ? setShowCustomInput(false) : setTestResults(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {showCustomInput ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Input:</label>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded p-3 text-sm font-mono border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows={4}
                        placeholder="Enter your custom input..."
                      />
                    </div>
                    
                    <button
                      onClick={handleRunCustomInput}
                      disabled={isProcessing}
                      className={`px-4 py-2 text-sm font-medium rounded ${isProcessing ? 'bg-blue-800 text-blue-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
                    >
                      {isProcessing ? 'Processing...' : 'Run'}
                    </button>
                    
                    {customOutput && (
                      <div className="mt-4">
                        <div className="text-gray-400 text-sm mb-1">Output:</div>
                        <div className="bg-gray-700 text-white rounded p-3 text-sm font-mono border border-gray-600">
                          {customOutput}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testResults && testResults.map((result, index) => (
                      <div key={index} className={`border rounded-md p-4 ${result.passed ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
                        <div className="flex items-start mb-2">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 ${result.passed ? 'bg-green-500' : 'bg-red-500'}`}>
                            {result.passed ? (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className={`font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                              {result.passed ? 'Passed' : 'Failed'}: Test Case {index + 1}
                            </h4>
                            <p className="text-gray-400 text-sm">{result.message}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400 mb-1">Input:</div>
                            <div className="bg-gray-700 text-white rounded p-2 font-mono text-xs break-all">
                              {result.input}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Expected:</div>
                            <div className="bg-gray-700 text-white rounded p-2 font-mono text-xs break-all">
                              {result.expected}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Output:</div>
                            <div className={`bg-gray-700 text-white rounded p-2 font-mono text-xs break-all ${!result.passed && 'text-red-400'}`}>
                              {result.output}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Success/error modal for submission */}
      {submissionStatus && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-700">
            <div className="flex items-center mb-4">
              {submissionStatus.status === 'success' ? (
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center text-green-500 mr-4">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center text-red-500 mr-4">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <h3 className="text-xl font-bold text-white">{
                submissionStatus.status === 'success' ? 'Solution Accepted!' : 'Solution Failed'
              }</h3>
            </div>
            
            <p className="text-gray-300 mb-6">{submissionStatus.message}</p>
            
            {submissionStatus.details && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/60 rounded-lg p-3">
                  <div className="text-gray-400 text-sm mb-1">Runtime</div>
                  <div className="text-white font-medium">{submissionStatus.details.runtime}</div>
                  <div className="text-green-400 text-sm">{submissionStatus.details.runtimePercentile}</div>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-3">
                  <div className="text-gray-400 text-sm mb-1">Memory</div>
                  <div className="text-white font-medium">{submissionStatus.details.memory}</div>
                  <div className="text-green-400 text-sm">{submissionStatus.details.memoryPercentile}</div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button 
                onClick={() => setSubmissionStatus(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChallengeSolver; 