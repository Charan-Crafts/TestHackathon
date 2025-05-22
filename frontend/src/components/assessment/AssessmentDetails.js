import React from 'react';
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';

const AssessmentDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get the submission ID from the URL
    const submissionId = location.pathname.split('/').pop();

    const handleBack = () => {
        // Navigate back to the submissions list
        navigate('/dashboard/organizer/submissions');
    };

    // Dummy data
    const assessmentData = {
        id: "67c6cceabc69cd8ff91fdf43",
        title: "Python Basic Assessment",
        type: "coding_challenge",
        category: "Programming",
        difficulty: "intermediate",
        totalMarks: 75,
        passingMarks: 30,
        timeLimit: 60,
        submissions: [
            {
                submissionId: "6819b718645a8e51f5cfc7e7",
                version: 2,
                status: "completed",
                startTime: "2025-05-06T07:15:36.121Z",
                endTime: "2025-05-06T07:16:28.304Z",
                duration: 52,
                scores: {
                    total: 10,
                    mcq: 10,
                    coding: 0,
                    maxTotal: 75,
                    percentage: 13,
                    passed: false
                },
                mcq: {
                    completed: true,
                    submittedAt: "2025-05-06T07:16:28.305Z",
                    answers: [
                        {
                            question: "What is the output of print(2 * 3 ** 2)?",
                            selectedOptions: [0],
                            isCorrect: false,
                            marks: 0,
                            correctOptions: [1],
                            explanation: "Exponentiation (**) has higher precedence than multiplication (*), so 3**2 is 9 and 2 * 9 = 18."
                        },
                        {
                            question: "Which of the following is used to define a function in Python?",
                            selectedOptions: [2],
                            isCorrect: false,
                            marks: 0,
                            correctOptions: [1],
                            explanation: "Python uses 'def' keyword to define a function."
                        },
                        {
                            question: "What will be the output of print(type([]))?",
                            selectedOptions: [0],
                            isCorrect: true,
                            marks: 5,
                            correctOptions: [0],
                            explanation: "Empty square brackets [] represent a list, so the type will be <class 'list'>."
                        },
                        {
                            question: "Which of the following is an immutable data type in Python?",
                            selectedOptions: [2],
                            isCorrect: false,
                            marks: 0,
                            correctOptions: [3],
                            explanation: "Tuple is immutable, meaning its elements cannot be changed after creation."
                        },
                        {
                            question: "How do you comment a single line in Python?",
                            selectedOptions: [2],
                            isCorrect: true,
                            marks: 5,
                            correctOptions: [2],
                            explanation: "Python uses # for single-line comments."
                        }
                    ]
                },
                coding: {
                    completed: true,
                    submittedAt: "2025-05-06T07:16:28.305Z",
                    challenges: [
                        {
                            title: "Sum of Two Numbers",
                            maxMarks: 10,
                            bestScore: 0,
                            attempts: 1,
                            successRate: "0%",
                            code: "def sum_numbers(a, b):\n    # Your code here\n    pass\n    sdfghn",
                            status: "failed"
                        },
                        {
                            title: "Check Even or Odd",
                            maxMarks: 10,
                            bestScore: 0,
                            attempts: 1,
                            successRate: "0%",
                            code: "def check_even_odd(n):\n    # Your code here\n    pass",
                            status: "failed"
                        },
                        {
                            title: "Reverse a String",
                            maxMarks: 10,
                            bestScore: 0,
                            attempts: 1,
                            successRate: "0%",
                            code: "def reverse_string(s):\n    # Your code here\n    pass",
                            status: "failed"
                        },
                        {
                            title: "Find Maximum in List",
                            maxMarks: 10,
                            bestScore: 0,
                            attempts: 1,
                            successRate: "0%",
                            code: "def find_max(lst):\n    # Your code here\n    pass",
                            status: "failed"
                        },
                        {
                            title: "Count Vowels in a String",
                            maxMarks: 10,
                            bestScore: 0,
                            attempts: 1,
                            successRate: "0%",
                            code: "def count_vowels(s):\n    # Your code here\n    pass",
                            status: "failed"
                        }
                    ]
                }
            }
        ]
    };

    const submission = assessmentData.submissions[0];

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-black hover:text-black transition-colors duration-200"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Submissions
                    </button>
                </div>

                {/* Assessment Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-black mb-4">{assessmentData.title}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-black">Category</p>
                            <p className="font-semibold text-black">{assessmentData.category}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-black">Difficulty</p>
                            <p className="font-semibold capitalize text-black">{assessmentData.difficulty}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-black">Time Limit</p>
                            <p className="font-semibold text-black">{assessmentData.timeLimit} minutes</p>
                        </div>
                    </div>
                </div>

                {/* Submission Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-black mb-4">Submission Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-black">Submission ID</p>
                            <p className="font-mono text-sm text-black">{submission.submissionId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-black">Status</p>
                            <p className={`font-semibold ${submission.status === 'completed' ? 'text-green-600' : 'text-yellow-600'} text-black`}>
                                {submission.status}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-black">Start Time</p>
                            <p className="text-black">{format(new Date(submission.startTime), 'PPpp')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-black">Duration</p>
                            <p className="text-black">{submission.duration} minutes</p>
                        </div>
                    </div>
                </div>

                {/* Scores Summary */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-black mb-4">Scores</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-black">Total Score</p>
                            <p className="text-2xl font-bold text-black">{submission.scores.total}/{submission.scores.maxTotal}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-black">MCQ Score</p>
                            <p className="text-2xl font-bold text-black">{submission.scores.mcq}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-black">Coding Score</p>
                            <p className="text-2xl font-bold text-black">{submission.scores.coding}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-black">Percentage</p>
                            <p className="text-2xl font-bold text-black">{submission.scores.percentage}%</p>
                        </div>
                    </div>
                </div>

                {/* MCQ Results */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-black mb-4">MCQ Results</h2>
                    <div className="space-y-4">
                        {submission.mcq.answers.map((answer, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-semibold text-black">{answer.question}</p>
                                    <span className={`px-2 py-1 rounded text-sm ${answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                </div>
                                <p className="text-sm text-black mb-2">Marks: {answer.marks}</p>
                                <p className="text-sm text-black">{answer.explanation}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Coding Challenges */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-black mb-4">Coding Challenges</h2>
                    <div className="space-y-6">
                        {submission.coding.challenges.map((challenge, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-black">{challenge.title}</h3>
                                    <span className={`px-2 py-1 rounded text-sm ${challenge.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {challenge.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-black">Max Marks</p>
                                        <p className="font-semibold text-black">{challenge.maxMarks}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-black">Best Score</p>
                                        <p className="font-semibold text-black">{challenge.bestScore}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-black">Attempts</p>
                                        <p className="font-semibold text-black">{challenge.attempts}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-black">Success Rate</p>
                                        <p className="font-semibold text-black">{challenge.successRate}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-white mb-2" style={{ color: 'white' }}>Code</p>
                                    <pre className="text-sm font-mono whitespace-pre-wrap" style={{ backgroundColor: 'black', color: 'white', borderRadius: '0.5rem', padding: '1rem' }}>{challenge.code}</pre>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessmentDetails; 