import React, { useState } from 'react';

const Judging = ({ hackathon, setHackathon }) => {
  const [judges, setJudges] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@example.com',
      organization: 'Tech Innovations Inc.',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      assignedProjects: 12,
      completedEvaluations: 8,
      role: 'Lead Judge'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      email: 'michael.r@example.com',
      organization: 'Startup Accelerator',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      assignedProjects: 10,
      completedEvaluations: 10,
      role: 'Technical Judge'
    },
    {
      id: 3,
      name: 'Emma Johnson',
      email: 'emma.j@example.com',
      organization: 'Design Studio Co.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      assignedProjects: 15,
      completedEvaluations: 7,
      role: 'UX Judge'
    }
  ]);

  const [criteria, setCriteria] = useState([
    { id: 1, name: 'Innovation', description: 'Uniqueness and creativity of the solution', weight: 25 },
    { id: 2, name: 'Technical Difficulty', description: 'Complexity and technical challenges overcome', weight: 25 },
    { id: 3, name: 'Completeness', description: 'How finished and polished the project is', weight: 25 },
    { id: 4, name: 'Presentation', description: 'Quality of demo and documentation', weight: 25 }
  ]);

  const [newJudgeEmail, setNewJudgeEmail] = useState('');
  const [showAddJudgeModal, setShowAddJudgeModal] = useState(false);
  const [showEditCriteriaModal, setShowEditCriteriaModal] = useState(false);
  const [selectedCriterion, setSelectedCriterion] = useState(null);
  const [criterionName, setCriterionName] = useState('');
  const [criterionDescription, setCriterionDescription] = useState('');
  const [criterionWeight, setCriterionWeight] = useState(25);

  // Handle inviting a new judge
  const handleInviteJudge = () => {
    // In a real app, this would send an email invitation
    setShowAddJudgeModal(false);
    setNewJudgeEmail('');
    
    // For demo purposes, add a mock judge
    setJudges([
      ...judges,
      {
        id: judges.length + 1,
        name: `Judge ${judges.length + 1}`,
        email: newJudgeEmail,
        organization: 'Pending',
        avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`,
        assignedProjects: 0,
        completedEvaluations: 0,
        role: 'Guest Judge'
      }
    ]);
  };

  // Open edit criterion modal
  const openEditCriterionModal = (criterion) => {
    setSelectedCriterion(criterion);
    setCriterionName(criterion.name);
    setCriterionDescription(criterion.description);
    setCriterionWeight(criterion.weight);
    setShowEditCriteriaModal(true);
  };

  // Handle saving criterion changes
  const saveCriterionChanges = () => {
    const updatedCriteria = criteria.map(c => 
      c.id === selectedCriterion.id ? {
        ...c,
        name: criterionName,
        description: criterionDescription,
        weight: criterionWeight
      } : c
    );
    
    setCriteria(updatedCriteria);
    setShowEditCriteriaModal(false);
  };

  // Add a new criterion
  const addNewCriterion = () => {
    const newCriterion = {
      id: criteria.length + 1,
      name: 'New Criterion',
      description: 'Description of the new criterion',
      weight: 0
    };
    
    setCriteria([...criteria, newCriterion]);
    setSelectedCriterion(newCriterion);
    setCriterionName(newCriterion.name);
    setCriterionDescription(newCriterion.description);
    setCriterionWeight(newCriterion.weight);
    setShowEditCriteriaModal(true);
  };

  // Delete a criterion
  const deleteCriterion = (id) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  // Calculate total weight
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  // Progress of judging
  const totalAssigned = judges.reduce((sum, judge) => sum + judge.assignedProjects, 0);
  const totalCompleted = judges.reduce((sum, judge) => sum + judge.completedEvaluations, 0);
  const completionPercentage = totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0;

  return (
    <div>
      {/* Judging Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Judging Management</h2>
          <p className="text-gray-400">Manage judges and evaluation criteria</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddJudgeModal(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600/70 hover:bg-indigo-600 text-white rounded-md transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Judge
          </button>
        </div>
      </div>
      
      {/* Judging Progress */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Judging Progress</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="text-gray-400 text-sm mb-1">Total Judges</div>
            <div className="text-2xl font-bold text-white">{judges.length}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Assigned Evaluations</div>
            <div className="text-2xl font-bold text-white">{totalAssigned}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Completed Evaluations</div>
            <div className="text-2xl font-bold text-white">{totalCompleted}</div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-400 text-sm">Overall Progress</div>
            <div className="text-gray-300 text-sm">{completionPercentage.toFixed(0)}%</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Judges Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Judges</h3>
          <p className="text-gray-400 text-sm mt-1">Manage judges assigned to evaluate submissions</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Judge</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Organization</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assigned</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Completion</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {judges.map(judge => (
                <tr key={judge.id} className="hover:bg-gray-800/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={judge.avatar} alt={judge.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{judge.name}</div>
                        <div className="text-sm text-gray-500">{judge.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {judge.organization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {judge.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {judge.assignedProjects} projects
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-400">
                          {judge.completedEvaluations}/{judge.assignedProjects}
                        </div>
                        <div className="text-xs text-gray-400">
                          {judge.assignedProjects > 0 
                            ? ((judge.completedEvaluations / judge.assignedProjects) * 100).toFixed(0) 
                            : 0}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            judge.completedEvaluations === judge.assignedProjects && judge.assignedProjects > 0
                              ? 'bg-green-500' 
                              : 'bg-cyan-500'
                          }`}
                          style={{ 
                            width: `${judge.assignedProjects > 0 
                              ? (judge.completedEvaluations / judge.assignedProjects) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-500 hover:text-indigo-400 mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="text-cyan-500 hover:text-cyan-400 mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="text-red-500 hover:text-red-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Evaluation Criteria Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 mb-8">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-white">Evaluation Criteria</h3>
            <p className="text-gray-400 text-sm mt-1">Define how projects will be judged</p>
          </div>
          <button
            onClick={addNewCriterion}
            className="px-3 py-1.5 bg-cyan-600/70 hover:bg-cyan-600 text-white text-sm rounded-md transition-colors"
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Criterion
            </div>
          </button>
        </div>
        
        <div className="p-6">
          {totalWeight !== 100 && (
            <div className="bg-yellow-900/30 border border-yellow-700/40 text-yellow-300 px-4 py-3 rounded-md mb-4 flex items-start">
              <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium">Total weight must equal 100%</p>
                <p className="text-sm">Current total: {totalWeight}%</p>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {criteria.map(criterion => (
              <div 
                key={criterion.id} 
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-medium">{criterion.name}</h4>
                    <p className="text-gray-400 text-sm mt-1">{criterion.description}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded border border-indigo-700/40 text-sm font-medium">
                      Weight: {criterion.weight}%
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button 
                        onClick={() => openEditCriterionModal(criterion)}
                        className="text-cyan-500 hover:text-cyan-400"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => deleteCriterion(criterion.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add Judge Modal */}
      {showAddJudgeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Add Judge
            </h3>
            <p className="text-gray-300 mb-4">
              Enter the email address of the person you'd like to invite as a judge. They'll receive an invitation via email.
            </p>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2" htmlFor="judgeEmail">
                Email Address
              </label>
              <input
                type="email"
                id="judgeEmail"
                value={newJudgeEmail}
                onChange={(e) => setNewJudgeEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="judge@example.com"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddJudgeModal(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteJudge}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                disabled={!newJudgeEmail.includes('@')}
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Criterion Modal */}
      {showEditCriteriaModal && selectedCriterion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              {selectedCriterion.id > criteria.length - 1 ? 'Add Criterion' : 'Edit Criterion'}
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2" htmlFor="criterionName">
                  Name
                </label>
                <input
                  type="text"
                  id="criterionName"
                  value={criterionName}
                  onChange={(e) => setCriterionName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2" htmlFor="criterionDescription">
                  Description
                </label>
                <textarea
                  id="criterionDescription"
                  value={criterionDescription}
                  onChange={(e) => setCriterionDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  rows={3}
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2" htmlFor="criterionWeight">
                  Weight (%)
                </label>
                <input
                  type="number"
                  id="criterionWeight"
                  value={criterionWeight}
                  onChange={(e) => setCriterionWeight(parseInt(e.target.value))}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Total weight across all criteria should sum to 100%
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditCriteriaModal(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCriterionChanges}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                disabled={!criterionName.trim()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Judging; 