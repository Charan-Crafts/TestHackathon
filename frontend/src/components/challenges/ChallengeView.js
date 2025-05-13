import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ClipboardDocumentIcon, 
  BookmarkIcon, 
  CodeBracketIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { TagIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const ChallengeView = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeExample, setActiveExample] = useState(0);
  
  // Mock fetch challenge data
  useEffect(() => {
    // This would be an API call to fetch the challenge details
    setTimeout(() => {
      setChallenge({
        id,
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        difficulty: "Easy",
        category: "Algorithms",
        tags: ["Array", "Hash Table"],
        inputFormat: "The first line contains an array of integers nums.\nThe second line contains an integer target.",
        outputFormat: "Return indices of the two numbers such that they add up to target.",
        constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
        examples: [
          {
            input: "[2, 7, 11, 15]\n9",
            output: "[0, 1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          },
          {
            input: "[3, 2, 4]\n6",
            output: "[1, 2]",
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
          },
          {
            input: "[3, 3]\n6",
            output: "[0, 1]",
            explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
          }
        ],
        startingCode: "function twoSum(nums, target) {\n  // Write your code here\n  \n}",
        solutionStats: {
          submissions: 8549,
          acceptance: "71.4%",
          difficulty: "Easy"
        },
        createdBy: "LeetCode",
        createdAt: "2023-01-15T12:00:00.000Z",
      });
      
      // Set the default code to the starting code
      setCode("function twoSum(nums, target) {\n  // Write your code here\n  \n}");
      setLoading(false);
    }, 1000);
  }, [id]);
  
  // Format time since creation
  const formatTimeSince = (dateString) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diffInSeconds = Math.floor((now - createdAt) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };
  
  // Handle running the code against test cases
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('');
    
    // Mock code execution - would typically send to a backend service
    setTimeout(() => {
      const testCase = challenge.examples[activeExample];
      
      // Very simple mock evaluation - in reality this would be much more complex
      // and would be handled by a backend service
      try {
        // Create a safe execution environment
        const mockConsoleOutput = [];
        
        // Mock test runner
        const mockOutput = `Test Case ${activeExample + 1}:
Input: ${testCase.input}
Expected Output: ${testCase.output}
Your Output: [0, 1]

✓ Test Case Passed

Console Output:
${mockConsoleOutput.join('\n')}`;
        
        setOutput(mockOutput);
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
      
      setIsRunning(false);
    }, 1500);
  };
  
  // Handle submitting the solution
  const handleSubmitSolution = () => {
    setIsSubmitting(true);
    setOutput('');
    
    // Mock submission - would typically send to a backend service
    setTimeout(() => {
      // Very simple mock evaluation - in reality this would be handled by a backend service
      try {
        const mockResults = {
          passed: 67,
          total: 70,
          runtime: '56ms',
          memory: '42.3MB',
          status: 'Accepted',
          testCases: [
            { input: '[2, 7, 11, 15]\n9', expected: '[0, 1]', output: '[0, 1]', passed: true },
            { input: '[3, 2, 4]\n6', expected: '[1, 2]', output: '[1, 2]', passed: true },
            { input: '[3, 3]\n6', expected: '[0, 1]', output: '[0, 1]', passed: true },
            // ... more test cases would be here
          ]
        };
        
        // Format the output
        const resultOutput = `
Status: ${mockResults.status}
Test Cases: ${mockResults.passed}/${mockResults.total} passed
Runtime: ${mockResults.runtime}
Memory: ${mockResults.memory}

Test Results:
${mockResults.testCases.map((tc, i) => 
  `Test Case ${i+1}: ${tc.passed ? '✓ Passed' : '✗ Failed'}
  Input: ${tc.input}
  Expected: ${tc.expected}
  Your Output: ${tc.output}
`).join('\n')}
`;
        
        setOutput(resultOutput);
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
      
      setIsSubmitting(false);
    }, 2500);
  };
  
  // Toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, this would make an API call to save the bookmark state
  };
  
  // Get difficulty class for badges
  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-900/30 text-green-300 border-green-500/30';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'hard':
        return 'bg-red-900/30 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-500/30';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900/70 via-blue-900/40 to-gray-900/70 rounded-xl p-4 backdrop-blur-sm border border-blue-500/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-lg bg-blue-900/50">
                <CodeBracketIcon className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl text-white font-bold">{challenge.title}</h2>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold border ${getDifficultyClass(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 text-sm">
                    <span className="font-medium text-gray-300">{challenge.solutionStats.submissions}</span> submissions
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400 text-sm">
                    <span className="font-medium text-gray-300">{challenge.solutionStats.acceptance}</span> acceptance
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <button
                onClick={toggleBookmark}
                className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-lg shadow-md transition-colors"
              >
                {isBookmarked ? (
                  <BookmarkSolidIcon className="w-5 h-5 text-yellow-400" />
                ) : (
                  <BookmarkIcon className="w-5 h-5" />
                )}
                <span className="ml-1">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
              <Link
                to="/challenges"
                className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-lg shadow-md transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-1" />
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Challenge Details */}
        <div>
          <div className="border border-gray-700 rounded-lg overflow-hidden mb-6">
            {/* Tabs */}
            <div className="flex bg-gray-800">
              <button
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === 'description' 
                  ? 'bg-gray-900 text-white border-b-2 border-blue-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === 'examples' 
                  ? 'bg-gray-900 text-white border-b-2 border-blue-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('examples')}
              >
                Examples
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === 'solution' 
                  ? 'bg-gray-900 text-white border-b-2 border-blue-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('solution')}
              >
                Solution
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="bg-gray-900 p-6">
              {activeTab === 'description' && (
                <div className="space-y-6">
                  <div>
                    <div className="text-gray-300 whitespace-pre-line">{challenge.description}</div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {challenge.tags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          <span className="text-sm">{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-white mb-2">Input Format</h3>
                    <div className="text-gray-300 whitespace-pre-line bg-gray-800 p-3 rounded-md font-mono text-sm">
                      {challenge.inputFormat}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-white mb-2">Output Format</h3>
                    <div className="text-gray-300 whitespace-pre-line bg-gray-800 p-3 rounded-md font-mono text-sm">
                      {challenge.outputFormat}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-white mb-2">Constraints</h3>
                    <div className="text-gray-300 whitespace-pre-line bg-gray-800 p-3 rounded-md font-mono text-sm">
                      {challenge.constraints}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'examples' && (
                <div className="space-y-6">
                  <div className="flex space-x-2 mb-4">
                    {challenge.examples.map((_, index) => (
                      <button
                        key={index}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          activeExample === index 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => setActiveExample(index)}
                      >
                        Example {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="border-b border-gray-700">
                      <div className="flex justify-between items-center px-4 py-2">
                        <h4 className="text-sm font-medium text-white">Input</h4>
                        <button 
                          className="text-gray-400 hover:text-gray-300"
                          title="Copy to clipboard"
                        >
                          <ClipboardDocumentIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="px-4 py-3 bg-gray-900 font-mono text-sm text-gray-300 whitespace-pre">
                        {challenge.examples[activeExample].input}
                      </div>
                    </div>
                    
                    <div className="border-b border-gray-700">
                      <div className="flex justify-between items-center px-4 py-2">
                        <h4 className="text-sm font-medium text-white">Output</h4>
                        <button 
                          className="text-gray-400 hover:text-gray-300"
                          title="Copy to clipboard"
                        >
                          <ClipboardDocumentIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="px-4 py-3 bg-gray-900 font-mono text-sm text-gray-300 whitespace-pre">
                        {challenge.examples[activeExample].output}
                      </div>
                    </div>
                    
                    {challenge.examples[activeExample].explanation && (
                      <div>
                        <div className="px-4 py-2">
                          <h4 className="text-sm font-medium text-white">Explanation</h4>
                        </div>
                        <div className="px-4 py-3 bg-gray-900 text-sm text-gray-300 whitespace-pre-line">
                          {challenge.examples[activeExample].explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'solution' && (
                <div className="space-y-6">
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start">
                      <LightBulbIcon className="h-6 w-6 text-yellow-400 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-yellow-300 font-medium mb-1">Hint: Try a hash map approach</h3>
                        <p className="text-gray-300 text-sm">
                          Consider using a hash map to store the numbers you've seen so far. This will allow you to quickly check if the complement (target - current number) exists.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-white mb-2">Solution Approach</h3>
                    <div className="text-gray-300">
                      <p>This problem can be efficiently solved using a hash map with a single pass through the array:</p>
                      <ol className="list-decimal pl-6 mt-2 space-y-2">
                        <li>Create a hash map to store each number and its index as you iterate through the array.</li>
                        <li>For each number, calculate the complement (target - current number).</li>
                        <li>Check if the complement exists in the hash map. If it does, you've found your solution.</li>
                        <li>If not, add the current number and its index to the hash map and continue.</li>
                      </ol>
                      <p className="mt-3">This approach has a time complexity of O(n) where n is the length of the array, as we only need to traverse the array once.</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-white mb-2">Solution Code</h3>
                    <div className="bg-gray-800 p-4 rounded-md">
                      <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
{`function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-white mb-2">Complexity Analysis</h3>
                    <div className="space-y-2 text-gray-300">
                      <p><span className="text-blue-400 font-medium">Time Complexity:</span> O(n) - We traverse the array once, and hash map operations are O(1).</p>
                      <p><span className="text-blue-400 font-medium">Space Complexity:</span> O(n) - In the worst case, we might need to store almost all elements in the hash map.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Output Console */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
              <h3 className="text-sm font-medium text-white">Output</h3>
              <button 
                className="text-gray-400 hover:text-gray-300"
                title="Clear console"
                onClick={() => setOutput('')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-900 p-4 font-mono text-sm text-gray-300 h-64 overflow-y-auto whitespace-pre-line">
              {output || 'Run your code to see the output here.'}
              {(isRunning || isSubmitting) && (
                <div className="flex items-center mt-2 text-blue-400">
                  <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                  {isRunning ? 'Running code...' : 'Submitting solution...'}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column: Code Editor */}
        <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
          <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
            <div className="flex items-center">
              <CodeBracketIcon className="h-4 w-4 text-blue-400 mr-2" />
              <h3 className="text-sm font-medium text-white">Code Editor</h3>
            </div>
            <div className="flex space-x-2">
              <button
                className="text-gray-400 hover:text-gray-300"
                title="Reset to initial code"
                onClick={() => setCode(challenge.startingCode)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4">
            <textarea
              className="w-full h-80 bg-gray-800 text-gray-300 font-mono text-sm p-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            ></textarea>
          </div>
          <div className="bg-gray-800 px-4 py-3 flex justify-between border-t border-gray-700">
            <div className="flex space-x-2">
              <button
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                Run Code
              </button>
            </div>
            <button
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmitSolution}
              disabled={isRunning || isSubmitting}
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Submit
            </button>
          </div>
        </div>
      </div>
      
      {/* Challenge Info */}
      <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-gray-400">Created by:</span>
            <span className="ml-1 text-blue-400">{challenge.createdBy}</span>
          </div>
          <div>
            <span className="text-gray-400">Created:</span>
            <span className="ml-1 text-gray-300">{formatTimeSince(challenge.createdAt)}</span>
          </div>
          <div>
            <span className="text-gray-400">Category:</span>
            <span className="ml-1 text-gray-300">{challenge.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeView; 