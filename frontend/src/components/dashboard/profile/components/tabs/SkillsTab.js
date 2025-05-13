import React, { useState } from 'react';
import {
  PlusIcon,
  ChartBarIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { profileAPI } from '../../../../../services/api';

const SkillsTab = ({ profileData, formStyles }) => {
  const [newSkill, setNewSkill] = useState({ name: '', category: 'frontend', proficiency: 75 });
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingSkill, setEditingSkill] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(
    (profileData.skills || []).map((skill, index) => ({
      ...skill,
      id: skill.id || `${skill.category}-${skill.name}-${index}`
    }))
  );

  const categories = [
    { id: 'frontend', label: 'Frontend', icon: <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" /> },
    { id: 'backend', label: 'Backend', icon: <div className="w-2 h-2 rounded-full bg-green-500 mr-2" /> },
    { id: 'database', label: 'Database', icon: <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" /> },
    { id: 'devops', label: 'DevOps', icon: <div className="w-2 h-2 rounded-full bg-orange-500 mr-2" /> },
    { id: 'other', label: 'Other', icon: <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" /> }
  ];

  // Handle form submission for new skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const skillToAdd = {
        id: Date.now().toString(),
        name: newSkill.name,
        proficiency: parseInt(newSkill.proficiency),
        category: newSkill.category
      };

      const updatedSkills = [...skills, skillToAdd];
      const response = await profileAPI.updateSkills(updatedSkills);

      if (response.success) {
        setSkills(updatedSkills);
        setNewSkill({
          name: '',
          proficiency: '50',
          category: 'other'
        });
        setIsAddingSkill(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: name === 'proficiency' ? parseInt(value) : value
    }));
  };

  // Start editing a skill
  const handleEditSkill = (skill) => {
    setEditingSkill(skill.id || `${skill.category}-${skill.name}`);
    setEditFormData({ ...skill });
  };

  // Handle changes in edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'proficiency' ? parseInt(value) : value
    }));
  };

  // Save edited skill
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!editFormData) return;

    setLoading(true);
    setError(null);

    try {
      // Create a new array with the updated skill
      const updatedSkills = skills.map(skill =>
        (skill.id === editingSkill || `${skill.category}-${skill.name}` === editingSkill)
          ? { ...editFormData, id: editingSkill }
          : skill
      );

      // Call the API to update skills
      const response = await profileAPI.updateSkills(updatedSkills);

      if (response.data) {
        // Update local state
        setSkills(updatedSkills);
        setEditingSkill(null);
        setEditFormData(null);
      }
    } catch (err) {
      setError('Failed to update skill');
      console.error('Update skill error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingSkill(null);
    setEditFormData(null);
  };

  // Handle skill deletion
  const handleDeleteSkill = async () => {
    if (!skillToDelete) return;

    setLoading(true);
    setError(null);

    try {
      // Create a new array without the deleted skill
      const updatedSkills = skills.filter(skill =>
        skill.id !== skillToDelete.id && `${skill.category}-${skill.name}` !== skillToDelete.id
      );

      // Call the API to update skills
      const response = await profileAPI.updateSkills(updatedSkills);

      if (response.data) {
        // Update local state
        setSkills(updatedSkills);
        setSkillToDelete(null);
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      setError('Failed to delete skill');
      console.error('Delete skill error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter skills by category
  const filteredSkills = selectedCategory === 'all'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory);

  // Get the proficiency level label
  const getProficiencyLabel = (proficiency) => {
    if (proficiency >= 90) return 'Expert';
    if (proficiency >= 70) return 'Advanced';
    if (proficiency >= 40) return 'Intermediate';
    return 'Beginner';
  };

  // Get the bar color based on proficiency
  const getBarColor = (proficiency) => {
    if (proficiency >= 90) return 'from-indigo-600 to-blue-600';
    if (proficiency >= 70) return 'from-blue-500 to-indigo-500';
    if (proficiency >= 40) return 'from-blue-400 to-indigo-400';
    return 'from-blue-300 to-indigo-300';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await profileAPI.updateSkills(skills);
      console.log('Skills updated:', response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update skills');
      console.error('Update error:', err);
    }
  };

  const handleCancel = () => {
    setSkills(profileData.skills || []);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="py-6">
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Header with Category Filters and Add Skill Button */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all'
              ? 'bg-purple-900/60 text-purple-300 shadow-sm border border-purple-700/50'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
          >
            All Skills
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center transition-all ${selectedCategory === category.id
                ? 'bg-purple-900/60 text-purple-300 shadow-sm border border-purple-700/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                }`}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddingSkill(!isAddingSkill)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all transform hover:scale-105 flex items-center font-medium"
        >
          <PlusIcon className="w-4 h-4 mr-1 inline" />
          Add Skill
        </button>
      </div>

      {/* Add Skill Form */}
      {isAddingSkill && (
        <div className="bg-gray-800/70 p-6 rounded-xl shadow-md mb-6 border border-purple-700/50 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-purple-300">Add New Skill</h3>
            <button
              onClick={() => setIsAddingSkill(false)}
              className="p-1 rounded-full hover:bg-purple-100 text-gray-500 hover:text-gray-700 transition-all duration-300 group"
              disabled={loading}
            >
              <XMarkIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          <form onSubmit={handleAddSkill} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Skill Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newSkill.name}
                  onChange={handleSkillChange}
                  required
                  className={formStyles.input}
                  placeholder="e.g. JavaScript, Python, React"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newSkill.category}
                  onChange={handleSkillChange}
                  className={formStyles.select}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between">
                  <label htmlFor="proficiency" className="block text-sm font-medium text-gray-300">
                    Proficiency
                  </label>
                  <span className="text-sm font-medium text-indigo-600">
                    {newSkill.proficiency}% - {getProficiencyLabel(newSkill.proficiency)}
                  </span>
                </div>
                <input
                  type="range"
                  id="proficiency"
                  name="proficiency"
                  min="0"
                  max="100"
                  value={newSkill.proficiency}
                  onChange={handleSkillChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Expert</span>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="years" className="block text-sm font-medium text-gray-300">Years of Experience (optional)</label>
                <input
                  type="number"
                  id="years"
                  name="years"
                  value={newSkill.years || ''}
                  onChange={handleSkillChange}
                  min="0"
                  max="50"
                  className={formStyles.input}
                  placeholder="e.g. 3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setIsAddingSkill(false)}
                className={formStyles.button.secondary}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={formStyles.button.primary}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Skill'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-200 mb-3">Confirm Deletion</h3>
            <p className="text-gray-400 mb-5">
              Are you sure you want to delete this skill? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSkillToDelete(null);
                }}
                className={formStyles.button.secondary}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSkill}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.length === 0 ? (
          <div className="col-span-2 p-8 bg-gray-800 rounded-xl text-center">
            <ChartBarIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-200 mb-1">No skills in this category</h3>
            <p className="text-gray-500 mb-4">Add your first skill to showcase your expertise</p>
            <button
              onClick={() => setIsAddingSkill(true)}
              className={formStyles.button.primary}
              disabled={loading}
            >
              <PlusIcon className="w-4 h-4 mr-1 inline" />
              Add Skill
            </button>
          </div>
        ) : (
          filteredSkills.map((skill, index) => {
            const skillId = skill.id || `${skill.category}-${skill.name}`;

            return (
              <div
                key={skillId}
                className="bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-700 hover:border-indigo-100 hover:shadow-md transition-all group"
              >
                {editingSkill === skillId ? (
                  // Edit Form
                  <form onSubmit={handleSaveSkill} className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="space-y-2 w-full">
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditFormChange}
                          required
                          className={formStyles.input}
                        />
                        <select
                          name="category"
                          value={editFormData.category}
                          onChange={handleEditFormChange}
                          className={formStyles.select}
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-300">
                          Proficiency
                        </label>
                        <span className="text-sm text-indigo-600">
                          {editFormData.proficiency}% - {getProficiencyLabel(editFormData.proficiency)}
                        </span>
                      </div>
                      <input
                        type="range"
                        name="proficiency"
                        min="0"
                        max="100"
                        value={editFormData.proficiency}
                        onChange={handleEditFormChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Years of Experience</label>
                      <input
                        type="number"
                        name="years"
                        value={editFormData.years || ''}
                        onChange={handleEditFormChange}
                        min="0"
                        max="50"
                        className={formStyles.input}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="p-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="submit"
                        className="p-2 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  // Normal View
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-200">{skill.name}</h3>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full flex items-center ${skill.category === 'frontend' ? 'bg-blue-100 text-blue-700' :
                          skill.category === 'backend' ? 'bg-green-100 text-green-700' :
                            skill.category === 'database' ? 'bg-purple-100 text-purple-700' :
                              skill.category === 'devops' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                          }`}>
                          {categories.find(c => c.id === skill.category)?.icon}
                          {categories.find(c => c.id === skill.category)?.label || 'Other'}
                        </span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <button
                          className="p-1.5 rounded-full hover:bg-gray-700 text-gray-500"
                          onClick={() => handleEditSkill(skill)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500"
                          onClick={() => {
                            setSkillToDelete(skill);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 mb-1.5">
                      <span>{getProficiencyLabel(skill.proficiency)}</span>
                      <span className="font-medium text-indigo-600">{skill.proficiency}%</span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full bg-gradient-to-r ${getBarColor(skill.proficiency)} animate-pulse-slow`}
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>

                    {skill.years && (
                      <div className="mt-3 text-xs text-gray-500">
                        {skill.years} {skill.years === 1 ? 'year' : 'years'} of experience
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SkillsTab; 