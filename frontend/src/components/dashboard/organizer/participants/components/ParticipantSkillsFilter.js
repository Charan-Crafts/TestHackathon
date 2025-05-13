import React, { useState } from 'react';

const ParticipantSkillsFilter = ({ availableSkills, selectedSkills, onSkillsChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSkills, setShowAllSkills] = useState(false);

  // Filter skills based on search query
  const filteredSkills = availableSkills.filter(skill => 
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle a skill selection
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter(s => s !== skill));
    } else {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  // Clear all selected skills
  const clearSkills = () => {
    onSkillsChange([]);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-300">Filter by Skills</h3>
        {selectedSkills.length > 0 && (
          <button 
            onClick={clearSkills}
            className="text-xs text-gray-400 hover:text-indigo-400"
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Search input */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-transparent text-sm"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Selected skills */}
      {selectedSkills.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs text-gray-400 mb-1">Selected Skills:</h4>
          <div className="flex flex-wrap gap-1">
            {selectedSkills.map(skill => (
              <span 
                key={skill} 
                className="px-2 py-1 text-xs rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 flex items-center"
              >
                {skill}
                <button 
                  onClick={() => toggleSkill(skill)}
                  className="ml-1 text-indigo-400 hover:text-indigo-300"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Available skills */}
      <div>
        <div className="flex flex-wrap gap-1">
          {(showAllSkills ? filteredSkills : filteredSkills.slice(0, 15)).map(skill => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                selectedSkills.includes(skill) 
                  ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
              }`}
            >
              {skill}
            </button>
          ))}
          
          {!showAllSkills && filteredSkills.length > 15 && (
            <button
              onClick={() => setShowAllSkills(true)}
              className="px-2 py-1 text-xs rounded-full bg-gray-800/50 text-indigo-400 border border-gray-700 hover:border-indigo-700/50"
            >
              +{filteredSkills.length - 15} more
            </button>
          )}
          
          {showAllSkills && (
            <button
              onClick={() => setShowAllSkills(false)}
              className="px-2 py-1 text-xs rounded-full bg-gray-800/50 text-indigo-400 border border-gray-700 hover:border-indigo-700/50"
            >
              Show Less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantSkillsFilter; 