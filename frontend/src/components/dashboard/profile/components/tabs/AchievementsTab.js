import React, { useState, useRef } from 'react';
import {
  PlusIcon,
  TrophyIcon,
  DocumentCheckIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ArrowUpTrayIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { profileAPI } from '../../../../../services/api';

// Reusable components
const LoadingSpinner = ({ inline = false, small = false }) => (
  <svg
    className={`animate-spin ${inline ? 'inline' : ''} ${small ? 'h-4 w-4' : 'h-5 w-5'} ${inline ? 'mr-2 -ml-1' : ''}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// File Upload Component
const FileUploadArea = ({ filePreview, onChange, accept = "image/*", label = "Upload File" }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        onClick={() => fileInputRef.current.click()}
        className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${filePreview ? 'border-gray-300' : 'border-gray-200'
          }`}
      >
        {filePreview ? (
          <div className="relative w-full">
            <img
              src={filePreview}
              alt="Preview"
              className="w-full h-80 object-contain rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 rounded-lg transition-opacity">
              <p className="text-white text-sm">Click to change</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <ArrowUpTrayIcon className="w-8 h-8 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onCancel, onConfirm, title, message, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="my-4 text-gray-600">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
          >
            {isDeleting ? (
              <>
                <LoadingSpinner inline small />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const AchievementsTab = ({ profileData, updateProfileData, formStyles, onCertificationAdd }) => {
  // Get certificate styles if provided by parent
  const certStyles = profileData?.certificateStyles || {};

  // Unified state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', isSuccess: true, show: false });

  // Certificates state
  const [certifications, setCertifications] = useState(profileData?.certifications || []);
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    date: '',
    credentialId: '',
    fileUrl: ''
  });
  const [editingCert, setEditingCert] = useState(null);
  const [showDeleteCertModal, setShowDeleteCertModal] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);

  // Achievements state
  const [achievements, setAchievements] = useState(profileData?.achievements || []);
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: '',
    imageUrl: ''
  });
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [showDeleteAchievementModal, setShowDeleteAchievementModal] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState(null);

  // Feedback handling
  const showFeedback = (message, isSuccess = true) => {
    setFeedback({ message, isSuccess, show: true });

    // Clear feedback after 3 seconds
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Update parent component with new data
  const updateParentData = (certData, achieveData) => {
    console.log('Updating parent data with new certifications:', certData);
    console.log('Updating parent data with new achievements:', achieveData);

    const updatedProfileData = {
      ...profileData,
      certifications: certData !== null ? certData : certifications,
      achievements: achieveData !== null ? achieveData : achievements
    };

    console.log('Sending updated profile data to parent:', updatedProfileData);

    // Update the parent component with optional chaining
    if (typeof updateProfileData === 'function') {
      updateProfileData(updatedProfileData);
    }

    // Also update the parent's certification state if available
    if (typeof onCertificationAdd === 'function') {
      onCertificationAdd(false);
    }
  };

  // ===== Certificate Handlers =====

  const handleCertChange = (e) => {
    const { name, value } = e.target;
    setNewCertification(prev => ({ ...prev, [name]: value }));
  };

  const handleEditCertChange = (e) => {
    const { name, value } = e.target;
    setEditingCert(prev => ({ ...prev, [name]: value }));
  };

  const handleCertFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        const fileUrl = event.target.result;

        if (editingCert) {
          setEditingCert(prev => ({ ...prev, fileUrl }));
        } else {
          setNewCertification(prev => ({ ...prev, fileUrl }));
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleAddCertification = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedCertifications = [...certifications, newCertification];
      const response = await profileAPI.updateCertifications(updatedCertifications);

      if (response.data) {
        setCertifications(updatedCertifications);
        setIsAddingCertification(false);
        setNewCertification({
          name: '',
          issuer: '',
          date: '',
          credentialId: '',
          fileUrl: ''
        });
        showFeedback('Certificate added successfully!', true);
      }
    } catch (error) {
      console.error('Error adding certification:', error);
      showFeedback('Failed to add certificate. Please try again.', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCert = (cert) => {
    setEditingCert(cert);
    setIsAddingCertification(false);
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    if (!editingCert || !editingCert.id) {
      console.error("No certification selected for editing or invalid ID");
      showFeedback('Failed to update certification. No valid ID found.', false);
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedCertifications = certifications.map(cert =>
        cert.id === editingCert.id ? editingCert : cert
      );
      const response = await profileAPI.updateCertifications(updatedCertifications);

      if (response.data) {
        setCertifications(updatedCertifications);
        setEditingCert(null);
        showFeedback('Certificate updated successfully!', true);
      }
    } catch (error) {
      console.error('Error updating certification:', error);
      showFeedback('Failed to update certificate. Please try again.', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeleteCert = async () => {
    if (!certToDelete || !certToDelete.id) {
      console.error("No certification selected for deletion or invalid ID");
      showFeedback('Failed to delete certification. No valid ID found.', false);
      return;
    }

    setIsDeleting(true);

    try {
      const updatedCertifications = certifications.filter(cert => cert.id !== certToDelete.id);
      const response = await profileAPI.updateCertifications(updatedCertifications);

      if (response.data) {
        setCertifications(updatedCertifications);
        showFeedback('Certificate deleted successfully!', true);
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
      showFeedback('Failed to delete certificate. Please try again.', false);
    } finally {
      setIsDeleting(false);
      setShowDeleteCertModal(false);
      setCertToDelete(null);
    }
  };

  // ===== Achievement Handlers =====

  const handleAchievementChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement(prev => ({ ...prev, [name]: value }));
  };

  const handleEditAchievementChange = (e) => {
    const { name, value } = e.target;
    setEditingAchievement(prev => ({ ...prev, [name]: value }));
  };

  const handleAchievementFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        const imageUrl = event.target.result;

        if (editingAchievement) {
          setEditingAchievement(prev => ({ ...prev, imageUrl }));
        } else {
          setNewAchievement(prev => ({ ...prev, imageUrl }));
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Only require title and date
      if (!newAchievement.title || !newAchievement.date) {
        showFeedback('Please fill in all required fields (title, date).', false);
        setIsSubmitting(false);
        return;
      }
      const achievementToAdd = {
        name: newAchievement.title,
        description: newAchievement.description || '',
        date: newAchievement.date,
        imageUrl: newAchievement.imageUrl || ''
      };
      const updatedAchievements = [...achievements, achievementToAdd];
      const response = await profileAPI.updateAchievements(updatedAchievements);
      if (response.data) {
        setAchievements(updatedAchievements);
        setIsAddingAchievement(false);
        setNewAchievement({ title: '', description: '', date: '', imageUrl: '' });
        showFeedback('Achievement added successfully!', true);
      }
    } catch (err) {
      console.error('Error adding achievement:', err);
      showFeedback(err.message || 'Failed to add achievement', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setIsAddingAchievement(false);
  };

  const handleSaveAchievement = async (e) => {
    e.preventDefault();
    if (!editingAchievement) return;

    setIsSubmitting(true);

    try {
      // Map 'title' to 'name' for backend
      const updatedAchievements = achievements.map(achievement =>
        achievement.id === editingAchievement.id
          ? { ...editingAchievement, name: editingAchievement.title }
          : achievement
      );
      const response = await profileAPI.updateAchievements(updatedAchievements);

      if (response.data) {
        setAchievements(updatedAchievements);
        setEditingAchievement(null);
        showFeedback('Achievement updated successfully!', true);
      }
    } catch (error) {
      console.error('Error updating achievement:', error);
      showFeedback('Failed to update achievement. Please try again.', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeleteAchievement = async () => {
    if (!achievementToDelete || !achievementToDelete.id) {
      console.error("No achievement selected for deletion or invalid ID");
      showFeedback('Failed to delete achievement. No valid ID found.', false);
      return;
    }

    setIsDeleting(true);

    try {
      const updatedAchievements = achievements.filter(
        achievement => achievement.id !== achievementToDelete.id
      );
      const response = await profileAPI.updateAchievements(updatedAchievements);

      if (response.data) {
        setAchievements(updatedAchievements);
        setAchievementToDelete(null);
        showFeedback('Achievement deleted successfully!', true);
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
      showFeedback('Failed to delete achievement. Please try again.', false);
    } finally {
      setIsDeleting(false);
      setShowDeleteAchievementModal(false);
      setAchievementToDelete(null);
    }
  };

  return (
    <div className="py-6 relative">
      {/* Feedback toast notification */}
      {feedback.show && (
        <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out ${feedback.isSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          } animate-fade-in-up`}>
          <div className="flex items-center">
            {feedback.isSuccess ? (
              <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
            ) : (
              <XMarkIcon className="w-5 h-5 mr-2 text-red-500" />
            )}
            <p>{feedback.message}</p>
          </div>
        </div>
      )}

      {/* =============== CERTIFICATIONS SECTION =============== */}
      <div className="pb-6">
        {/* Certifications Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-amber-300 flex items-center gap-2">
              <DocumentIcon className="w-5 h-5" />
              Certifications
            </h2>
            <button
              onClick={() => setIsAddingCertification(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center font-medium text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-1.5" />
              Add Certification
            </button>
          </div>

          {(isAddingCertification || editingCert) && (
            <form
              onSubmit={editingCert ? handleSaveCert : handleAddCertification}
              className="bg-gray-800/70 p-6 rounded-lg shadow-md mb-6 border border-amber-700/50"
            >
              <h3 className="text-lg font-medium mb-4 text-amber-300">
                {editingCert ? 'Edit Certification' : 'Add New Certification'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Certificate Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editingCert ? editingCert.name : newCertification.name}
                    onChange={editingCert ? handleEditCertChange : handleCertChange}
                    className={formStyles.input}
                    required
                    placeholder="Enter certificate name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    name="issuer"
                    value={editingCert ? editingCert.issuer : newCertification.issuer}
                    onChange={editingCert ? handleEditCertChange : handleCertChange}
                    className={formStyles.input}
                    required
                    placeholder="Enter issuing organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={editingCert ? editingCert.date : newCertification.date}
                    onChange={editingCert ? handleEditCertChange : handleCertChange}
                    className={formStyles.input}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    name="credentialId"
                    value={editingCert ? editingCert.credentialId : newCertification.credentialId}
                    onChange={editingCert ? handleEditCertChange : handleCertChange}
                    className={formStyles.input}
                    placeholder="Enter credential ID (optional)"
                  />
                </div>
              </div>

              {/* Certificate File/Image */}
              <div className="mt-4">
                <FileUploadArea
                  filePreview={editingCert ? editingCert.fileUrl : newCertification.fileUrl}
                  onChange={handleCertFileChange}
                  label="Certificate Image"
                  accept="image/*"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCertification(false);
                    setEditingCert(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:bg-amber-400"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner inline small />
                      {editingCert ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    <>{editingCert ? 'Save Changes' : 'Add Certification'}</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Certifications List */}
          {certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map(cert => (
                <div
                  key={cert.id}
                  className="bg-gray-800/70 border border-gray-700 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className={`relative ${certStyles.containerHeight || 'h-64'} bg-gray-700`}>
                    <img
                      src={cert.fileUrl}
                      alt={cert.name}
                      className="w-full h-full object-contain p-2"
                      style={certStyles}
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleEditCert(cert)}
                        className="p-1.5 bg-gray-700 rounded-full shadow-md hover:bg-gray-600 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4 text-gray-300" />
                      </button>
                      <button
                        onClick={() => {
                          setCertToDelete(cert);
                          setShowDeleteCertModal(true);
                        }}
                        className="p-1.5 bg-gray-700 rounded-full shadow-md hover:bg-gray-600 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-300 mb-1">{cert.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{cert.issuer}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(cert.date).toLocaleDateString()}
                      </span>
                      {cert.credentialId && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          ID: {cert.credentialId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/70 rounded-lg p-8 text-center">
              <DocumentCheckIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No certifications added</h3>
              <p className="text-gray-500 mb-4">Add your professional certifications to demonstrate your expertise</p>
              <button
                onClick={() => setIsAddingCertification(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Certification
              </button>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={showDeleteCertModal}
            onCancel={() => {
              setShowDeleteCertModal(false);
              setCertToDelete(null);
            }}
            onConfirm={handleConfirmDeleteCert}
            title="Delete Certification"
            message="Are you sure you want to delete this certification? This action cannot be undone."
            isDeleting={isDeleting}
          />
        </div>

        {/* Achievements Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-amber-300 flex items-center gap-2">
              <TrophyIcon className="w-5 h-5" />
              Achievements
            </h2>
            <button
              onClick={() => setIsAddingAchievement(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center font-medium text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-1.5" />
              Add Achievement
            </button>
          </div>

          {/* Add or Edit Achievement Form */}
          {(isAddingAchievement || editingAchievement) && (
            <form
              onSubmit={editingAchievement ? handleSaveAchievement : handleAddAchievement}
              className="bg-gray-800/70 p-6 rounded-lg shadow-md mb-6 border border-amber-700/50"
            >
              <h3 className="text-lg font-medium mb-4 text-amber-300">
                {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Achievement Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editingAchievement ? editingAchievement.title : newAchievement.title}
                    onChange={editingAchievement ? handleEditAchievementChange : handleAchievementChange}
                    className={formStyles.input}
                    required
                    placeholder="Enter achievement title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={editingAchievement ? editingAchievement.date : newAchievement.date}
                    onChange={editingAchievement ? handleEditAchievementChange : handleAchievementChange}
                    className={formStyles.input}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editingAchievement ? editingAchievement.description : newAchievement.description}
                    onChange={editingAchievement ? handleEditAchievementChange : handleAchievementChange}
                    className={formStyles.textarea}
                    rows="3"
                    placeholder="Describe your achievement"
                  ></textarea>
                </div>
              </div>

              {/* Achievement Image */}
              <div className="mt-4">
                <FileUploadArea
                  filePreview={editingAchievement ? editingAchievement.imageUrl : newAchievement.imageUrl}
                  onChange={handleAchievementFileChange}
                  label="Achievement Image"
                  accept="image/*"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingAchievement(false);
                    setEditingAchievement(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:bg-amber-400"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner inline small />
                      {editingAchievement ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    <>{editingAchievement ? 'Save Changes' : 'Add Achievement'}</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Achievements List */}
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="bg-gray-800/70 border border-gray-700 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={achievement.imageUrl}
                      alt={achievement.title}
                      className="w-full h-full object-contain bg-gray-700"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleEditAchievement(achievement)}
                        className="p-1.5 bg-gray-700 rounded-full shadow-md hover:bg-gray-600 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4 text-gray-300" />
                      </button>
                      <button
                        onClick={() => {
                          setAchievementToDelete(achievement);
                          setShowDeleteAchievementModal(true);
                        }}
                        className="p-1.5 bg-gray-700 rounded-full shadow-md hover:bg-gray-600 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-300 mb-1">{achievement.title}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{achievement.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(achievement.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/70 rounded-lg p-8 text-center">
              <TrophyIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No achievements added</h3>
              <p className="text-gray-500 mb-4">Add achievements to highlight your professional accomplishments</p>
              <button
                onClick={() => setIsAddingAchievement(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Achievement
              </button>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={showDeleteAchievementModal}
            onCancel={() => {
              setShowDeleteAchievementModal(false);
              setAchievementToDelete(null);
            }}
            onConfirm={handleConfirmDeleteAchievement}
            title="Delete Achievement"
            message="Are you sure you want to delete this achievement? This action cannot be undone."
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </div>
  );
};

export default AchievementsTab; 