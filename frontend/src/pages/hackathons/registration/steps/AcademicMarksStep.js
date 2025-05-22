import React, { useState, useEffect } from 'react';

function AcademicMarksStep({ onNext, hackathon }) {
    const [tenthMarks, setTenthMarks] = useState('');
    const [twelfthMarks, setTwelfthMarks] = useState('');
    const [error, setError] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    useEffect(() => {
        console.log('Hackathon data:', hackathon);
        console.log('Minimum requirements:', {
            tenthMarks: hackathon?.tenthMarks,
            twelfthMarks: hackathon?.twelfthMarks
        });
    }, [hackathon]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setShowErrorPopup(false);

        console.log('Submitted marks:', {
            tenth: tenthMarks,
            twelfth: twelfthMarks
        });

        // Validate inputs
        if (!tenthMarks || !twelfthMarks) {
            setError('Please enter both 10th and 12th standard marks');
            return;
        }

        const tenth = parseFloat(tenthMarks);
        const twelfth = parseFloat(twelfthMarks);

        console.log('Parsed marks:', {
            tenth,
            twelfth,
            minTenth: hackathon?.tenthMarks,
            minTwelfth: hackathon?.twelfthMarks
        });

        if (isNaN(tenth) || isNaN(twelfth)) {
            setError('Please enter valid numbers');
            return;
        }

        if (tenth < 0 || tenth > 100 || twelfth < 0 || twelfth > 100) {
            setError('Marks should be between 0 and 100');
            return;
        }

        // Check eligibility against hackathon requirements
        const minTenth = parseFloat(hackathon?.tenthMarks) || 0;
        const minTwelfth = parseFloat(hackathon?.twelfthMarks) || 0;

        console.log('Checking eligibility:', {
            tenthEligible: tenth >= minTenth,
            twelfthEligible: twelfth >= minTwelfth,
            minTenth,
            minTwelfth
        });

        if (tenth < minTenth || twelfth < minTwelfth) {
            setShowErrorPopup(true);
            return;
        }

        // If validation passes, proceed to next step
        onNext({
            tenthMarks: tenth,
            twelfthMarks: twelfth
        });
    };

    const minTenth = parseFloat(hackathon?.tenthMarks) || 0;
    const minTwelfth = parseFloat(hackathon?.twelfthMarks) || 0;

    return (
        <>
            <div className="max-w-lg mx-auto bg-gray-900 rounded-lg shadow-lg p-8 mt-8">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Academic Qualifications</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2">
                            10th Standard Percentage
                            <span className="text-sm text-gray-400 ml-2">
                                (Minimum required: {minTenth}%)
                            </span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-full px-4 py-2 rounded border border-cyan-500 bg-gray-800 text-white"
                            value={tenthMarks}
                            onChange={e => {
                                console.log('10th marks changed:', e.target.value);
                                setTenthMarks(e.target.value);
                            }}
                            placeholder="Enter your 10th standard percentage"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">
                            12th Standard Percentage
                            <span className="text-sm text-gray-400 ml-2">
                                (Minimum required: {minTwelfth}%)
                            </span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-full px-4 py-2 rounded border border-cyan-500 bg-gray-800 text-white"
                            value={twelfthMarks}
                            onChange={e => {
                                console.log('12th marks changed:', e.target.value);
                                setTwelfthMarks(e.target.value);
                            }}
                            placeholder="Enter your 12th standard percentage"
                            required
                        />
                    </div>
                    {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                    <button
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all"
                    >
                        Continue
                    </button>
                </form>
            </div>

            {/* Error Popup */}
            {showErrorPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4 border border-red-500">
                        <h3 className="text-xl font-bold text-red-400 mb-4">Not Eligible</h3>
                        <p className="text-gray-300 mb-6">
                            Sorry, you do not meet the minimum academic requirements for this hackathon:
                            <ul className="list-disc list-inside mt-2 text-gray-400">
                                <li>10th Standard: Minimum {minTenth}% required</li>
                                <li>12th Standard: Minimum {minTwelfth}% required</li>
                            </ul>
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowErrorPopup(false)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AcademicMarksStep; 