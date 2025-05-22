import React, { useState, useEffect } from 'react';

const branchOptions = [
    'CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIML', 'DS', 'Other'
];

function EligibilityCheckStep({ hackathon, onNext, onEligibilityChecked, onEligibilityError }) {
    const [branch, setBranch] = useState('');
    const [percentage, setPercentage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('EligibilityCheckStep mounted with hackathon data:', hackathon);
        if (!hackathon) {
            console.error('No hackathon data provided');
            return;
        }
        console.log('Eligibility requirements:', {
            branches: hackathon.studentBranches,
            minPercentage: hackathon.studentMinPercentage,
            eligibility: hackathon.eligibility
        });
    }, [hackathon]);

    if (!hackathon) {
        console.error('EligibilityCheckStep: No hackathon data provided');
        return <div className="text-red-500">Error: No hackathon data available</div>;
    }

    const handleCheck = (e) => {
        e.preventDefault();
        console.log('Eligibility check started');
        console.log('Current values:', { branch, percentage });
        console.log('Hackathon data:', hackathon);

        setError('');

        // Check if branch and percentage are provided
        if (!branch || !percentage) {
            console.log('Error: Missing branch or percentage');
            setError('Please select your branch and enter your percentage.');
            onEligibilityError('Please select your branch and enter your percentage.');
            return;
        }

        // Check if this is a student-only hackathon
        if (hackathon.eligibility && hackathon.eligibility.includes('Students Only')) {
            // Check branch eligibility
            if (hackathon.studentBranches && Array.isArray(hackathon.studentBranches) && hackathon.studentBranches.length > 0) {
                console.log('Checking branch eligibility:', {
                    selectedBranch: branch,
                    allowedBranches: hackathon.studentBranches,
                    isEligible: hackathon.studentBranches.includes(branch)
                });

                if (!hackathon.studentBranches.includes(branch)) {
                    console.log('Error: Branch not eligible');
                    setError('Your branch is not eligible for this hackathon.');
                    onEligibilityError('Your branch is not eligible for this hackathon.');
                    return;
                }
            }

            // Check percentage eligibility
            if (hackathon.studentMinPercentage !== undefined && hackathon.studentMinPercentage !== null) {
                const studentPercentage = Number(percentage);
                const minRequired = Number(hackathon.studentMinPercentage);

                console.log('Checking percentage eligibility:', {
                    studentPercentage,
                    minRequired,
                    isEligible: studentPercentage >= minRequired
                });

                if (studentPercentage < minRequired) {
                    console.log('Error: Percentage too low');
                    setError(`Minimum percentage required is ${hackathon.studentMinPercentage}.`);
                    onEligibilityError(`Minimum percentage required is ${hackathon.studentMinPercentage}.`);
                    return;
                }
            }
        }

        // If we reach here, student is eligible
        console.log('Student is eligible!');
        setError('');
        onEligibilityChecked({ branch, percentage });
        onNext(); // Call onNext to proceed to the next step
    };

    return (
        <div className="max-w-lg mx-auto bg-gray-900 rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Eligibility Check</h2>
            <form onSubmit={handleCheck} className="space-y-6">
                <div>
                    <label className="block text-gray-300 mb-2">Select Your Branch</label>
                    <select
                        className="w-full px-4 py-2 rounded border border-cyan-500 bg-gray-800 text-white"
                        value={branch}
                        onChange={e => setBranch(e.target.value)}
                    >
                        <option value="">Select branch</option>
                        {branchOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Enter Your Percentage/CGPA</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-4 py-2 rounded border border-cyan-500 bg-gray-800 text-white"
                        value={percentage}
                        onChange={e => setPercentage(e.target.value)}
                        placeholder="e.g. 70"
                    />
                </div>
                {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                    Check Eligibility
                </button>
            </form>
        </div>
    );
}

export default EligibilityCheckStep; 