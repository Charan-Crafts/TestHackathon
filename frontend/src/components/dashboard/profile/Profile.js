import React, { useState, useEffect } from 'react';
import {
  TrophyIcon,
  FireIcon,
  DocumentTextIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

// Import components
import ProfileHeader from './components/ProfileHeader';
import TabNavigation from './components/TabNavigation';

import SkillsTab from './components/tabs/SkillsTab';
import ExperienceTab from './components/tabs/ExperienceTab';
import AchievementsTab from './components/tabs/AchievementsTab';
import PersonalInfoTab from './components/tabs/PersonalInfoTab';
import ResumeTab from './components/tabs/ResumeTab';

import { profileAPI } from '../../../services/api';

// Global CSS variables for the dashboard
const formStyles = {
  input: "w-full p-2 border border-gray-700 rounded-md text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
  textarea: "w-full p-2 border border-gray-700 rounded-md text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
  select: "w-full p-2 border border-gray-700 rounded-md text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
  button: {
    primary: "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors",
    secondary: "px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors",
    icon: "p-2 bg-indigo-900/50 text-indigo-400 hover:bg-indigo-800/70 rounded-lg transition-colors"
  }
};

const Profile = ({ user }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);

  // Real profile data state
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form data states
  const [profileFormData, setProfileFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    bio: '',
    location: '',
    email: '',
    phone: '',
    website: '',
    socials: []
  });

  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    date: '',
    file: null
  });

  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    year: '',
    logo: ''
  });

  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    year: '',
    logo: ''
  });

  const [newAchievement, setNewAchievement] = useState({
    name: '',
    description: '',
    date: '',
    file: null
  });

  // Fetch real profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await profileAPI.getMyProfile();
        setProfileData(res.data);
        setError(null);
      } catch (err) {
        setError('Could not load profile');
        setProfileData(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Initialize form data from real profileData
  useEffect(() => {
    if (profileData && profileData.user && !profileFormData.email) {
      setProfileFormData({
        firstName: profileData.user.firstName || '',
        lastName: profileData.user.lastName || '',
        title: profileData.title || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        email: profileData.user.email || '',
        phone: profileData.phone || '',
        website: profileData.website || '',
        socials: profileData.socials || [],
      });
    }
  }, [profileData]);

  // Handle form input changes for profile
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for profile edit
  const handleProfileSubmit = async (formData) => {
    try {
      const response = await profileAPI.createOrUpdateProfile(formData);
      setProfileData(response.data);
      setProfileFormData(formData);
      setIsEditingProfile(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file, type, metadata) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('entityType', 'user');

      // Add any additional metadata
      if (metadata) {
        Object.keys(metadata).forEach(key => {
          formData.append(key, metadata[key]);
        });
      }

      const response = await profileAPI.uploadProfileFile(formData);

      // Update the relevant section based on file type and S3 response
      if (type === 'resume') {
        setProfileData(prev => ({
          ...prev,
          resume: response.data.data.file.location // Use S3 location
        }));
      } else if (type === 'certification') {
        setProfileData(prev => ({
          ...prev,
          certifications: [...prev.certifications, {
            ...response.data.data,
            fileUrl: response.data.data.file.location // Use S3 location
          }]
        }));
      } else if (type === 'achievement') {
        setProfileData(prev => ({
          ...prev,
          achievements: [...prev.achievements, {
            ...response.data.data,
            fileUrl: response.data.data.file.location // Use S3 location
          }]
        }));
      }
    } catch (err) {
      setError('Failed to upload file');
      console.error('File upload error:', err);
    }
  };

  // Handle file deletion
  const handleFileDelete = async (fileId) => {
    try {
      await profileAPI.deleteProfileFile(fileId);
      // Update the profile data to remove the deleted file
      setProfileData(prev => ({
        ...prev,
        resume: prev.resume === fileId ? null : prev.resume,
        certifications: prev.certifications.filter(cert => cert.file !== fileId),
        achievements: prev.achievements.filter(achievement => achievement.file !== fileId)
      }));
    } catch (err) {
      setError('Failed to delete file');
      console.error('File deletion error:', err);
    }
  };

  // Render the active tab content
  const renderTabContent = () => {
    if (!profileData) return null;
    switch (activeTab) {
      case 'skills':
        return <SkillsTab profileData={profileData} formStyles={formStyles} />;
      case 'experience':
        return (
          <ExperienceTab
            profileData={profileData}
            isAddingEducation={isAddingEducation}
            setIsAddingEducation={setIsAddingEducation}
            newEducation={newEducation}
            setNewEducation={setNewEducation}
            isAddingExperience={isAddingExperience}
            setIsAddingExperience={setIsAddingExperience}
            newExperience={newExperience}
            setNewExperience={setNewExperience}
            formStyles={formStyles}
          />
        );
      case 'achievements':
        return (
          <AchievementsTab
            profileData={profileData}
            updateProfileData={(updatedData) => {
              setProfileData(updatedData);
              setIsAddingCertification(false);
              setTimeout(() => setIsAddingCertification(false), 200);
            }}
            isAddingCertification={isAddingCertification}
            onCertificationAdd={setIsAddingCertification}
            newCertification={newCertification}
            setNewCertification={setNewCertification}
            isAddingAchievement={isAddingAchievement}
            setIsAddingAchievement={setIsAddingAchievement}
            newAchievement={newAchievement}
            setNewAchievement={setNewAchievement}
            formStyles={formStyles}
          />
        );
      case 'personal':
        return <PersonalInfoTab profileData={profileData} user={user} formStyles={formStyles} setProfileData={setProfileData} />;
      case 'resume':
        return (
          <ResumeTab
            profileData={profileData}
            formStyles={formStyles}
          />
        );
      default:
        return <PersonalInfoTab profileData={profileData} user={profileData.user} formStyles={formStyles} />;
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>No profile data found.</div>;

  return (
    <div className="px-4 py-6">
      <div className="space-y-6 w-full max-w-full">
        {/* Profile Header */}
        <ProfileHeader
          profileData={profileData}
          user={profileData.user}
          isEditingProfile={isEditingProfile}
          setIsEditingProfile={setIsEditingProfile}
          profileFormData={profileFormData}
          handleProfileChange={handleProfileChange}
          handleProfileSubmit={handleProfileSubmit}
          handleFileUpload={handleFileUpload}
          formStyles={formStyles}
        />

        {/* Main Content - Full Width Tabs */}
        <div className="bg-gray-800/70 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;