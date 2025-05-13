import React, { useState } from 'react';
import {
  PlusIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { profileAPI } from '../../../../../services/api';

const ExperienceTab = ({
  profileData,
  isAddingEducation,
  setIsAddingEducation,
  newEducation,
  setNewEducation,
  isAddingExperience,
  setIsAddingExperience,
  newExperience,
  setNewExperience,
  formStyles,
  setProfileData
}) => {
  // State for new education
  const [editingEducation, setEditingEducation] = useState(null);
  const [editEducationData, setEditEducationData] = useState(null);
  const [educationToDelete, setEducationToDelete] = useState(null);
  const [showDeleteEducationConfirm, setShowDeleteEducationConfirm] = useState(false);

  // State for new experience
  const [editingExperience, setEditingExperience] = useState(null);
  const [editExperienceData, setEditExperienceData] = useState(null);
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [showDeleteExperienceConfirm, setShowDeleteExperienceConfirm] = useState(false);

  // Handle form submission for new education
  const handleAddEducation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const educationToAdd = {
        id: Date.now(), // backend expects a number
        institution: newEducation.school, // map 'school' to 'institution'
        degree: newEducation.degree,
        year: `${newEducation.startDate}-${newEducation.endDate || 'Present'}`,
        logo: newEducation.logo || '' // optional
      };

      const updatedEducation = [...profileData.education, educationToAdd];
      const response = await profileAPI.updateEducation(updatedEducation);

      if (response.success && setProfileData) {
        setProfileData(prev => ({ ...prev, education: response.data.education }));
        setIsAddingEducation(false);
        setNewEducation({
          school: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to add education');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes for education
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Start editing education
  const handleEditEducation = (education) => {
    setEditingEducation(education.id);
    setEditEducationData({ ...education });
  };

  // Handle changes in education edit form
  const handleEditEducationChange = (e) => {
    const { name, value } = e.target;
    setEditEducationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save edited education
  const handleSaveEducation = (e) => {
    e.preventDefault();
    // In a real app, you would update the education in the database
    console.log('Education updated:', editEducationData);
    setEditingEducation(null);
    setEditEducationData(null);
  };

  // Cancel editing education
  const handleCancelEditEducation = () => {
    setEditingEducation(null);
    setEditEducationData(null);
  };

  // Delete education
  const handleDeleteEducation = async () => {
    if (!educationToDelete) return;
    setLoading(true);
    setError(null);

    try {
      const updatedEducation = profileData.education.filter(edu => edu.id !== educationToDelete.id);
      const response = await profileAPI.updateEducation(updatedEducation);

      if (response.data) {
        setEducationToDelete(null);
        setShowDeleteEducationConfirm(false);
      }
    } catch (err) {
      setError('Failed to delete education');
      console.error('Delete education error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for new experience
  const handleAddExperience = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const experienceToAdd = {
        id: Date.now(), // backend expects a number
        company: newExperience.company,
        position: newExperience.position,
        year: `${newExperience.startDate}-${newExperience.endDate || 'Present'}`,
        logo: newExperience.logo || ''
      };
      const updatedExperiences = [...profileData.experience, experienceToAdd];
      const response = await profileAPI.updateExperience(updatedExperiences);

      if (response.success && setProfileData) {
        setProfileData(prev => ({ ...prev, experience: response.data.experience }));
        setIsAddingExperience(false);
        setNewExperience({
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          location: '',
          logo: ''
        });
      }
    } catch (err) {
      setError('Failed to add experience');
      console.error('Add experience error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes for experience
  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Start editing experience
  const handleEditExperience = (experience) => {
    setEditingExperience(experience.id);
    setEditExperienceData({ ...experience });
  };

  // Handle changes in experience edit form
  const handleEditExperienceChange = (e) => {
    const { name, value } = e.target;
    setEditExperienceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save edited experience
  const handleSaveExperience = (e) => {
    e.preventDefault();
    // In a real app, you would update the experience in the database
    console.log('Experience updated:', editExperienceData);
    setEditingExperience(null);
    setEditExperienceData(null);
  };

  // Cancel editing experience
  const handleCancelEditExperience = () => {
    setEditingExperience(null);
    setEditExperienceData(null);
  };

  // Delete experience
  const handleDeleteExperience = async () => {
    if (!experienceToDelete) return;
    setLoading(true);
    setError(null);

    try {
      const updatedExperiences = profileData.experience.filter(exp => exp.id !== experienceToDelete.id);
      const response = await profileAPI.updateExperience(updatedExperiences);

      if (response.data) {
        setExperienceToDelete(null);
        setShowDeleteExperienceConfirm(false);
      }
    } catch (err) {
      setError('Failed to delete experience');
      console.error('Delete experience error:', err);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Education Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-cyan-300">Education</h2>
          <button
            onClick={() => setIsAddingEducation(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center text-sm font-medium"
            disabled={loading}
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Add Education
          </button>
        </div>

        {/* Add Education Form */}
        {isAddingEducation && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6 border border-cyan-700/50 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-cyan-300">Add Educational Background</h3>
              <button
                onClick={() => setIsAddingEducation(false)}
                className="p-1 rounded-full hover:bg-gray-700 text-gray-500"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEducation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="school" className="block text-sm font-medium text-gray-300">Institution</label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    value={newEducation.school}
                    onChange={handleEducationChange}
                    required
                    className={formStyles.input}
                    placeholder="e.g. Harvard University"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="degree" className="block text-sm font-medium text-gray-300">Degree/Certification</label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    value={newEducation.degree}
                    onChange={handleEducationChange}
                    required
                    className={formStyles.input}
                    placeholder="e.g. Bachelor of Science in Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-300">Field of Study</label>
                  <input
                    type="text"
                    id="fieldOfStudy"
                    name="fieldOfStudy"
                    value={newEducation.fieldOfStudy}
                    onChange={handleEducationChange}
                    required
                    className={formStyles.input}
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">Start Date</label>
                  <input
                    type="text"
                    id="startDate"
                    name="startDate"
                    value={newEducation.startDate}
                    onChange={handleEducationChange}
                    required
                    className={formStyles.input}
                    placeholder="e.g. 2018-2022"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">End Date</label>
                  <input
                    type="text"
                    id="endDate"
                    name="endDate"
                    value={newEducation.endDate}
                    onChange={handleEducationChange}
                    className={formStyles.input}
                    placeholder="e.g. Present (leave empty if current)"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="current" className="block text-sm font-medium text-gray-300">Currently Studying</label>
                  <input
                    type="checkbox"
                    id="current"
                    name="current"
                    checked={newEducation.current}
                    onChange={handleEducationChange}
                    className={formStyles.input}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newEducation.description}
                    onChange={handleEducationChange}
                    rows="3"
                    className={formStyles.textarea}
                    placeholder="Describe your role and responsibilities"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingEducation(false)}
                  className={formStyles.button.secondary}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className={formStyles.button.primary} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Education'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Education Confirmation Modal */}
        {showDeleteEducationConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-300 mb-3">Confirm Deletion</h3>
              <p className="text-gray-300 mb-5">
                Are you sure you want to delete this education? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteEducationConfirm(false);
                    setEducationToDelete(null);
                  }}
                  className={formStyles.button.secondary}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteEducation}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Education List */}
        {profileData.education.length === 0 ? (
          <div className="p-8 bg-gray-800 rounded-xl text-center">
            <AcademicCapIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-300 mb-1">No education added yet</h3>
            <p className="text-gray-500 mb-4">Add your educational background to showcase your qualifications</p>
            <button
              onClick={() => setIsAddingEducation(true)}
              className={formStyles.button.primary}
            >
              <PlusIcon className="w-4 h-4 mr-1 inline" />
              Add Education
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {profileData.education.map((edu, index) => (
              <div key={index} className="bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-700 hover:border-indigo-100 hover:shadow-md transition-all group">
                {editingEducation === edu.id ? (
                  // Edit Education Form
                  <form onSubmit={handleSaveEducation} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Institution</label>
                        <input
                          type="text"
                          name="school"
                          value={editEducationData.school}
                          onChange={handleEditEducationChange}
                          required
                          className={formStyles.input}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Degree/Certification</label>
                        <input
                          type="text"
                          name="degree"
                          value={editEducationData.degree}
                          onChange={handleEditEducationChange}
                          required
                          className={formStyles.input}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Field of Study</label>
                        <input
                          type="text"
                          name="fieldOfStudy"
                          value={editEducationData.fieldOfStudy}
                          onChange={handleEditEducationChange}
                          required
                          className={formStyles.input}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Start Date</label>
                        <input
                          type="text"
                          name="startDate"
                          value={editEducationData.startDate}
                          onChange={handleEditEducationChange}
                          required
                          className={formStyles.input}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">End Date</label>
                        <input
                          type="text"
                          name="endDate"
                          value={editEducationData.endDate || ''}
                          onChange={handleEditEducationChange}
                          className={formStyles.input}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Currently Studying</label>
                        <input
                          type="checkbox"
                          name="current"
                          checked={editEducationData.current}
                          onChange={handleEditEducationChange}
                          className={formStyles.input}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea
                          name="description"
                          value={editEducationData.description || ''}
                          onChange={handleEditEducationChange}
                          rows="3"
                          className={formStyles.textarea}
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={handleCancelEditEducation}
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
                  // Normal Education View
                  <>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {edu.logoUrl ? (
                          <img src={edu.logoUrl} alt={edu.school} className="w-12 h-12 object-contain mr-4 rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-indigo-100 rounded flex items-center justify-center mr-4">
                            <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-300">{edu.school}</h3>
                          <p className="text-gray-300">{edu.degree}</p>
                          <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate || 'Present'}</p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <button
                          className="p-1.5 rounded-full hover:bg-gray-700 text-gray-500"
                          onClick={() => handleEditEducation(edu)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500"
                          onClick={() => {
                            setEducationToDelete(edu);
                            setShowDeleteEducationConfirm(true);
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work Experience Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-cyan-300">Work Experience</h2>
          <button
            onClick={() => setIsAddingExperience(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center text-sm font-medium"
            disabled={loading}
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Add Experience
          </button>
        </div>

        {/* Add Experience Form */}
        {isAddingExperience && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Add Work Experience</h3>
            <form onSubmit={handleAddExperience} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={newExperience.company}
                    onChange={handleExperienceChange}
                    required
                    className={formStyles.input}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-300">Position</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={newExperience.position}
                    onChange={handleExperienceChange}
                    required
                    className={formStyles.input}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">Start Date</label>
                  <input
                    type="text"
                    id="startDate"
                    name="startDate"
                    value={newExperience.startDate}
                    onChange={handleExperienceChange}
                    required
                    className={formStyles.input}
                    placeholder="e.g. Jan 2020"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">End Date</label>
                  <input
                    type="text"
                    id="endDate"
                    name="endDate"
                    value={newExperience.endDate}
                    onChange={handleExperienceChange}
                    className={formStyles.input}
                    placeholder="e.g. Present (leave empty if current)"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newExperience.description}
                    onChange={handleExperienceChange}
                    rows="3"
                    className={formStyles.textarea}
                    placeholder="Describe your role and responsibilities"
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label htmlFor="expLogoUrl" className="block text-sm font-medium text-gray-300">Company Logo URL (optional)</label>
                  <input
                    type="text"
                    id="expLogoUrl"
                    name="logoUrl"
                    value={newExperience.logoUrl}
                    onChange={handleExperienceChange}
                    className={formStyles.input}
                    placeholder="e.g. https://example.com/logo.png"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingExperience(false)}
                  className={formStyles.button.secondary}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className={formStyles.button.primary} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Experience'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Experience Confirmation Modal */}
        {showDeleteExperienceConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-300 mb-3">Confirm Deletion</h3>
              <p className="text-gray-300 mb-5">
                Are you sure you want to delete this work experience? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteExperienceConfirm(false);
                    setExperienceToDelete(null);
                  }}
                  className={formStyles.button.secondary}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteExperience}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Experience List */}
        <div className="space-y-4">
          {profileData.experience.map((exp, index) => (
            <div
              key={exp.id}
              className="bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-700 flex items-center gap-4 hover:border-indigo-100 hover:shadow-md transition-all group"
            >
              {editingExperience === exp.id ? (
                // Edit Experience Form
                <form onSubmit={handleSaveExperience} className="w-full space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={editExperienceData.company}
                        onChange={handleEditExperienceChange}
                        required
                        className={formStyles.input}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Position</label>
                      <input
                        type="text"
                        name="position"
                        value={editExperienceData.position}
                        onChange={handleEditExperienceChange}
                        required
                        className={formStyles.input}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Start Date</label>
                      <input
                        type="text"
                        name="startDate"
                        value={editExperienceData.startDate}
                        onChange={handleEditExperienceChange}
                        required
                        className={formStyles.input}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">End Date</label>
                      <input
                        type="text"
                        name="endDate"
                        value={editExperienceData.endDate || ''}
                        onChange={handleEditExperienceChange}
                        className={formStyles.input}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300">Description</label>
                      <textarea
                        name="description"
                        value={editExperienceData.description || ''}
                        onChange={handleEditExperienceChange}
                        rows="3"
                        className={formStyles.textarea}
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Company Logo URL</label>
                      <input
                        type="text"
                        name="logoUrl"
                        value={editExperienceData.logoUrl || ''}
                        onChange={handleEditExperienceChange}
                        className={formStyles.input}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={handleCancelEditExperience}
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
                // Normal Experience View
                <>
                  <div className="h-12 w-12 shrink-0">
                    <img
                      src={exp.logoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(exp.company) + '&size=48&background=4f46e5&color=fff'}
                      alt={exp.company}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-300">{exp.company}</h3>
                    <p className="text-sm text-gray-300">{exp.position}</p>
                    <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                    {exp.description && <p className="text-sm text-gray-300 mt-2">{exp.description}</p>}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button
                      className="p-1.5 rounded-full hover:bg-gray-700 text-gray-500"
                      onClick={() => handleEditExperience(exp)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500"
                      onClick={() => {
                        setExperienceToDelete(exp);
                        setShowDeleteExperienceConfirm(true);
                      }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Empty State for Experience */}
        {profileData.experience.length === 0 && (
          <div className="text-center py-8 bg-gray-800 rounded-xl border border-gray-700">
            <BriefcaseIcon className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="text-gray-500 text-lg font-medium mt-2">No work experience added yet</h3>
            <p className="text-gray-400 mt-1">Add your professional experience</p>
            <button
              onClick={() => setIsAddingExperience(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceTab; 