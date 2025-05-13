import React, { useState } from 'react';
import {
  UserCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { profileAPI } from '../../../../../services/api';

const PersonalInfoTab = ({ profileData, user, formStyles, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: profileData.bio,
    location: profileData.location,
    email: user?.email,
    phone: profileData.phone,
    website: profileData.website
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Merge updated fields with the rest of the profile data
      const updatedProfile = {
        ...profileData,
        bio: personalInfo.bio,
        location: personalInfo.location,
        phone: personalInfo.phone,
        website: personalInfo.website
      };
      const response = await profileAPI.createOrUpdateProfile(updatedProfile);
      if (setProfileData) setProfileData(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update personal information');
      console.error('Update error:', err);
    }
  };

  const handleCancel = () => {
    setPersonalInfo({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: profileData.bio,
      location: profileData.location,
      email: user?.email,
      phone: profileData.phone,
      website: profileData.website
    });
    setIsEditing(false);
    setError(null);
  };

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-300">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-sm text-blue-400 hover:text-blue-300"
          >
            <PencilIcon className="w-4 h-4 mr-1" />
            Edit Information
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center text-sm text-gray-400 hover:text-gray-300"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center text-sm text-green-400 hover:text-green-300"
            >
              <CheckIcon className="w-4 h-4 mr-1" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 shadow-sm">
              <div className="flex items-start">
                <UserCircleIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-300">First Name</h3>
                  <p className="text-gray-200">{personalInfo.firstName}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 shadow-sm">
              <div className="flex items-start">
                <UserCircleIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Last Name</h3>
                  <p className="text-gray-200">{personalInfo.lastName}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 shadow-sm">
              <div className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Location</h3>
                  <p className="text-gray-200">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 shadow-sm">
              <div className="flex items-start">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Email</h3>
                  <p className="text-gray-200">{personalInfo.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 shadow-sm">
              <div className="flex items-start">
                <PhoneIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Phone</h3>
                  <p className="text-gray-200">{personalInfo.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 shadow-sm">
              <div className="flex items-start">
                <GlobeAltIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Website</h3>
                  <p className="text-gray-200">
                    <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `http://${personalInfo.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800">
                      {personalInfo.website}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 shadow-sm h-full">
              <div className="flex items-start">
                <UserCircleIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Bio</h3>
                  <p className="text-gray-200">{personalInfo.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={personalInfo.firstName}
                  onChange={handleChange}
                  className={formStyles.input}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={personalInfo.lastName}
                  onChange={handleChange}
                  className={formStyles.input}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-300">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={personalInfo.location}
                onChange={handleChange}
                className={formStyles.input}
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={personalInfo.email}
                onChange={handleChange}
                className={formStyles.input}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={personalInfo.phone}
                onChange={handleChange}
                className={formStyles.input}
                placeholder="+1 (123) 456-7890"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-300">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={personalInfo.website}
                onChange={handleChange}
                className={formStyles.input}
                placeholder="yourwebsite.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={personalInfo.bio}
                onChange={handleChange}
                rows={4}
                className={formStyles.textarea}
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PersonalInfoTab; 