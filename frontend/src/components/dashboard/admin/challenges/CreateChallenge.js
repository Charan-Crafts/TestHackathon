import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CodeBracketIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { TagIcon } from '@heroicons/react/24/solid';

const CreateChallenge = () => {
  const navigate = useNavigate();
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [category, setCategory] = useState('Algorithms');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [constraints, setConstraints] = useState('');
  const [examples, setExamples] = useState([{ input: '', output: '', explanation: '' }]);
  const [timeLimit, setTimeLimit] = useState(2);
  const [memoryLimit, setMemoryLimit] = useState(256);
  const [startingCode, setStartingCode] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '', isHidden: false }]);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Validation states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Available options
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];
  const categoryOptions = [
    'Algorithms', 
    'Data Structures', 
    'System Design', 
    'Database', 
    'Web Development',
    'Machine Learning'
  ];
  
  // Tag management
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Examples management
  const addExample = () => {
    setExamples([...examples, { input: '', output: '', explanation: '' }]);
  };
  
  const removeExample = (index) => {
    const newExamples = [...examples];
    newExamples.splice(index, 1);
    setExamples(newExamples);
  };
  
  const updateExample = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };
  
  // Test cases management
  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: false }]);
  };
  
  const removeTestCase = (index) => {
    const newTestCases = [...testCases];
    newTestCases.splice(index, 1);
    setTestCases(newTestCases);
  };
  
  const updateTestCase = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = typeof value === 'boolean' 
      ? value 
      : value;
    setTestCases(newTestCases);
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!inputFormat.trim()) newErrors.inputFormat = 'Input format is required';
    if (!outputFormat.trim()) newErrors.outputFormat = 'Output format is required';
    if (!constraints.trim()) newErrors.constraints = 'Constraints are required';
    if (!startingCode.trim()) newErrors.startingCode = 'Starting code is required';
    
    // Validate examples
    const exampleErrors = [];
    examples.forEach((example, index) => {
      const exampleError = {};
      if (!example.input.trim()) exampleError.input = 'Input is required';
      if (!example.output.trim()) exampleError.output = 'Output is required';
      if (Object.keys(exampleError).length > 0) exampleErrors[index] = exampleError;
    });
    if (exampleErrors.length > 0) newErrors.examples = exampleErrors;
    
    // Validate test cases
    const testCaseErrors = [];
    testCases.forEach((testCase, index) => {
      const testCaseError = {};
      if (!testCase.input.trim()) testCaseError.input = 'Input is required';
      if (!testCase.expectedOutput.trim()) testCaseError.expectedOutput = 'Expected output is required';
      if (Object.keys(testCaseError).length > 0) testCaseErrors[index] = testCaseError;
    });
    if (testCaseErrors.length > 0) newErrors.testCases = testCaseErrors;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Create challenge object
      const challenge = {
        title,
        description,
        difficulty,
        category,
        tags,
        inputFormat,
        outputFormat,
        constraints,
        examples,
        timeLimit,
        memoryLimit,
        startingCode,
        testCases,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      // Mock API call
      setTimeout(() => {
        console.log('Challenge data to be sent to API:', challenge);
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Auto redirect after success
        setTimeout(() => {
          navigate('/dashboard/admin/challenges');
        }, 2000);
      }, 1000);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900/70 via-purple-900/40 to-gray-900/70 rounded-xl p-4 backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-lg bg-green-900/50">
                <CodeBracketIcon className="w-8 h-8 text-green-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl text-white font-bold">Create New Challenge</h2>
                <p className="text-gray-300 text-sm sm:text-base">Create a new coding challenge for users to solve</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link 
                to="/dashboard/admin/challenges" 
                className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Challenges
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-6 flex items-center">
          <CheckIcon className="h-6 w-6 text-green-400 mr-3" />
          <div>
            <p className="text-green-300 font-medium">Challenge created successfully!</p>
            <p className="text-green-400 text-sm">Redirecting to challenges list...</p>
          </div>
        </div>
      )}
      
      {/* Form Tabs */}
      <div className="border border-gray-700 rounded-t-lg overflow-hidden mb-6">
        <div className="flex bg-gray-800">
          <button
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === 'basic' 
              ? 'bg-gray-900 text-white border-b-2 border-green-500' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Information
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === 'details' 
              ? 'bg-gray-900 text-white border-b-2 border-green-500' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Challenge Details
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === 'examples' 
              ? 'bg-gray-900 text-white border-b-2 border-green-500' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('examples')}
          >
            Examples
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === 'code' 
              ? 'bg-gray-900 text-white border-b-2 border-green-500' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('code')}
          >
            Code & Tests
          </button>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Challenge Title *
              </label>
              <input
                type="text"
                id="title"
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 border ${
                  errors.title ? 'border-red-500' : 'border-gray-700'
                } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="e.g., Two Sum"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Problem Description *
              </label>
              <textarea
                id="description"
                rows="5"
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 border ${
                  errors.description ? 'border-red-500' : 'border-gray-700'
                } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Describe the problem statement in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">
                  Difficulty Level
                </label>
                <div className="flex space-x-4">
                  {difficultyLevels.map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        className="sr-only"
                        checked={difficulty === level}
                        onChange={() => setDifficulty(level)}
                      />
                      <div
                        className={`px-3 py-2 rounded-lg border cursor-pointer ${
                          difficulty === level
                            ? level === 'Easy'
                              ? 'bg-green-900/50 border-green-500 text-green-300'
                              : level === 'Medium'
                                ? 'bg-yellow-900/50 border-yellow-500 text-yellow-300'
                                : 'bg-red-900/50 border-red-500 text-red-300'
                            : 'bg-gray-800 border-gray-700 text-gray-300'
                        }`}
                      >
                        {level}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    <span className="text-sm">{tag}</span>
                    <button
                      type="button"
                      className="ml-1 text-purple-300 hover:text-purple-200"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  id="newTag"
                  className="flex-grow px-3 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Add a tag (e.g., Array, Hash Table)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  className="px-3 py-2 rounded-r-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none"
                  onClick={handleAddTag}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Challenge Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="inputFormat" className="block text-sm font-medium text-gray-300 mb-1">
                Input Format *
              </label>
              <textarea
                id="inputFormat"
                rows="3"
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 border ${
                  errors.inputFormat ? 'border-red-500' : 'border-gray-700'
                } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Describe the expected input format..."
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
              ></textarea>
              {errors.inputFormat && <p className="mt-1 text-sm text-red-500">{errors.inputFormat}</p>}
            </div>
            
            <div>
              <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-300 mb-1">
                Output Format *
              </label>
              <textarea
                id="outputFormat"
                rows="3"
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 border ${
                  errors.outputFormat ? 'border-red-500' : 'border-gray-700'
                } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Describe the expected output format..."
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
              ></textarea>
              {errors.outputFormat && <p className="mt-1 text-sm text-red-500">{errors.outputFormat}</p>}
            </div>
            
            <div>
              <label htmlFor="constraints" className="block text-sm font-medium text-gray-300 mb-1">
                Constraints *
              </label>
              <textarea
                id="constraints"
                rows="3"
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 border ${
                  errors.constraints ? 'border-red-500' : 'border-gray-700'
                } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="List constraints for the problem..."
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
              ></textarea>
              <p className="mt-1 text-xs text-gray-400">
                Specify the constraints such as range of input values, time complexity requirements, etc.
              </p>
              {errors.constraints && <p className="mt-1 text-sm text-red-500">{errors.constraints}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-300 mb-1">
                  Time Limit (seconds)
                </label>
                <input
                  type="number"
                  id="timeLimit"
                  min="0.1"
                  step="0.1"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <label htmlFor="memoryLimit" className="block text-sm font-medium text-gray-300 mb-1">
                  Memory Limit (MB)
                </label>
                <input
                  type="number"
                  id="memoryLimit"
                  min="16"
                  step="16"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={memoryLimit}
                  onChange={(e) => setMemoryLimit(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Test Examples</h3>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-700 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700"
                onClick={addExample}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Example
              </button>
            </div>
            
            <div className="space-y-6">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-700 rounded-lg bg-gray-800/50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-white">Example {index + 1}</h4>
                    {examples.length > 1 && (
                      <button
                        type="button"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => removeExample(index)}
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`example-${index}-input`}
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Input *
                      </label>
                      <textarea
                        id={`example-${index}-input`}
                        rows="3"
                        className={`w-full px-3 py-2 rounded-lg bg-gray-900 border ${
                          errors.examples && errors.examples[index]?.input
                            ? 'border-red-500'
                            : 'border-gray-700'
                        } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="Enter example input..."
                        value={example.input}
                        onChange={(e) => updateExample(index, 'input', e.target.value)}
                      ></textarea>
                      {errors.examples && errors.examples[index]?.input && (
                        <p className="mt-1 text-sm text-red-500">{errors.examples[index].input}</p>
                      )}
                    </div>
                    
                    <div>
                      <label
                        htmlFor={`example-${index}-output`}
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Output *
                      </label>
                      <textarea
                        id={`example-${index}-output`}
                        rows="3"
                        className={`w-full px-3 py-2 rounded-lg bg-gray-900 border ${
                          errors.examples && errors.examples[index]?.output
                            ? 'border-red-500'
                            : 'border-gray-700'
                        } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="Enter expected output..."
                        value={example.output}
                        onChange={(e) => updateExample(index, 'output', e.target.value)}
                      ></textarea>
                      {errors.examples && errors.examples[index]?.output && (
                        <p className="mt-1 text-sm text-red-500">{errors.examples[index].output}</p>
                      )}
                    </div>
                    
                    <div>
                      <label
                        htmlFor={`example-${index}-explanation`}
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Explanation
                      </label>
                      <textarea
                        id={`example-${index}-explanation`}
                        rows="3"
                        className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Explain the example (optional)..."
                        value={example.explanation}
                        onChange={(e) => updateExample(index, 'explanation', e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Code & Tests Tab */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="startingCode" className="block text-sm font-medium text-gray-300 mb-1">
                Starting Code Template *
              </label>
              <textarea
                id="startingCode"
                rows="8"
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 border font-mono ${
                  errors.startingCode ? 'border-red-500' : 'border-gray-700'
                } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="function twoSum(nums, target) {
  // Write your code here
}"
                value={startingCode}
                onChange={(e) => setStartingCode(e.target.value)}
              ></textarea>
              <p className="mt-1 text-xs text-gray-400">
                Provide the starter code that will be shown to users.
              </p>
              {errors.startingCode && (
                <p className="mt-1 text-sm text-red-500">{errors.startingCode}</p>
              )}
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Test Cases</h3>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-700 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700"
                  onClick={addTestCase}
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Test Case
                </button>
              </div>
              
              <div className="space-y-4">
                {testCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-700 rounded-lg bg-gray-800/50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <h4 className="text-md font-medium text-white mr-3">Test Case {index + 1}</h4>
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            className="rounded bg-gray-900 text-green-500 border-gray-700 mr-2"
                            checked={testCase.isHidden}
                            onChange={(e) => updateTestCase(index, 'isHidden', e.target.checked)}
                          />
                          <span className="text-gray-300">Hidden Test</span>
                        </label>
                      </div>
                      {testCases.length > 1 && (
                        <button
                          type="button"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => removeTestCase(index)}
                        >
                          <MinusIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor={`testCase-${index}-input`}
                          className="block text-sm font-medium text-gray-300 mb-1"
                        >
                          Input *
                        </label>
                        <textarea
                          id={`testCase-${index}-input`}
                          rows="3"
                          className={`w-full px-3 py-2 rounded-lg bg-gray-900 border ${
                            errors.testCases && errors.testCases[index]?.input
                              ? 'border-red-500'
                              : 'border-gray-700'
                          } text-white focus:outline-none focus:ring-2 focus:ring-green-500 font-mono`}
                          placeholder="Enter test input..."
                          value={testCase.input}
                          onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                        ></textarea>
                        {errors.testCases && errors.testCases[index]?.input && (
                          <p className="mt-1 text-sm text-red-500">{errors.testCases[index].input}</p>
                        )}
                      </div>
                      
                      <div>
                        <label
                          htmlFor={`testCase-${index}-expectedOutput`}
                          className="block text-sm font-medium text-gray-300 mb-1"
                        >
                          Expected Output *
                        </label>
                        <textarea
                          id={`testCase-${index}-expectedOutput`}
                          rows="3"
                          className={`w-full px-3 py-2 rounded-lg bg-gray-900 border ${
                            errors.testCases && errors.testCases[index]?.expectedOutput
                              ? 'border-red-500'
                              : 'border-gray-700'
                          } text-white focus:outline-none focus:ring-2 focus:ring-green-500 font-mono`}
                          placeholder="Enter expected output..."
                          value={testCase.expectedOutput}
                          onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                        ></textarea>
                        {errors.testCases && errors.testCases[index]?.expectedOutput && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.testCases[index].expectedOutput}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
            onClick={() => navigate('/dashboard/admin/challenges')}
          >
            Cancel
          </button>
          
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors"
            onClick={() => {
              // Save as draft logic would go here
              console.log('Save as draft');
            }}
          >
            Save as Draft
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-700 transition-colors flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Challenge'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateChallenge; 