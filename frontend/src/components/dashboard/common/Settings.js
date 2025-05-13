import React, { useState } from 'react';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  SwatchIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState('account');
  const { updatePassword } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Mock data for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      hackathonUpdates: true,
      teamInvitations: true,
      challengeReminders: false,
      marketingEmails: false
    },
    push: {
      hackathonUpdates: true,
      teamInvitations: true,
      challengeReminders: true
    }
  });

  // Mock data for privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showAchievements: true,
    allowTeamInvites: true
  });

  // Mock data for theme settings
  const [themeSettings, setThemeSettings] = useState({
    theme: 'system',
    fontSize: 'medium',
    reduceAnimations: false,
    highContrast: false
  });

  // Update account settings to use real user data
  const [accountSettings, setAccountSettings] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    timeZone: user?.timeZone || 'America/Los_Angeles',
    language: user?.language || 'en'
  });

  // Handler for notification toggle changes
  const handleNotificationToggle = (category, type) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type]
      }
    }));
  };

  // Handler for privacy settings changes
  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Handler for theme settings changes
  const handleThemeChange = (setting, value) => {
    setThemeSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Handler for account settings changes
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    try {
      const result = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (result.success) {
        setPasswordSuccess('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(result.error?.message || 'Failed to update password');
      }
    } catch (err) {
      setPasswordError(err.message || 'An error occurred while updating password');
    }
  };

  // Handler for password input changes
  const handlePasswordInputChange = (e) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="px-4 py-6">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/95 rounded-lg shadow-md p-6 mb-8 border border-gray-700/50">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-64 bg-gray-800/80 p-4 border-r border-gray-700/50">
            <h2 className="text-lg font-semibold text-white mb-6">Settings</h2>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'account'
                  ? 'bg-indigo-900/70 text-indigo-300 border border-indigo-700/50'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-gray-100'
                  }`}
              >
                <UserCircleIcon className="w-5 h-5 mr-3" />
                Account
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'notifications'
                  ? 'bg-indigo-900/70 text-indigo-300 border border-indigo-700/50'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-gray-100'
                  }`}
              >
                <BellIcon className="w-5 h-5 mr-3" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'privacy'
                  ? 'bg-indigo-900/70 text-indigo-300 border border-indigo-700/50'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-gray-100'
                  }`}
              >
                <ShieldCheckIcon className="w-5 h-5 mr-3" />
                Privacy
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'appearance'
                  ? 'bg-indigo-900/70 text-indigo-300 border border-indigo-700/50'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-gray-100'
                  }`}
              >
                <SwatchIcon className="w-5 h-5 mr-3" />
                Appearance
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'security'
                  ? 'bg-indigo-900/70 text-indigo-300 border border-indigo-700/50'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-gray-100'
                  }`}
              >
                <KeyIcon className="w-5 h-5 mr-3" />
                Security
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="md:flex-1 md:pl-6 mt-6 md:mt-0">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={accountSettings.firstName}
                          onChange={handleAccountChange}
                          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={accountSettings.lastName}
                          onChange={handleAccountChange}
                          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={accountSettings.email}
                          onChange={handleAccountChange}
                          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={accountSettings.phone}
                          onChange={handleAccountChange}
                          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-4">Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="timeZone" className="block text-sm font-medium text-gray-300 mb-1">
                          Time Zone
                        </label>
                        <select
                          name="timeZone"
                          id="timeZone"
                          value={accountSettings.timeZone}
                          onChange={handleAccountChange}
                          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                          <option value="America/Denver">Mountain Time (US & Canada)</option>
                          <option value="America/Chicago">Central Time (US & Canada)</option>
                          <option value="America/New_York">Eastern Time (US & Canada)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">
                          Language
                        </label>
                        <select
                          name="language"
                          id="language"
                          value={accountSettings.language}
                          onChange={handleAccountChange}
                          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="zh">中文</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Notification Settings</h2>

                <div className="space-y-8">
                  {/* Email Notifications */}
                  <div>
                    <div className="flex items-center mb-4">
                      <EnvelopeIcon className="w-5 h-5 text-indigo-400 mr-2" />
                      <h3 className="text-lg font-medium text-gray-200">Email Notifications</h3>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(notificationSettings.email).map(([key, value]) => (
                        <div key={`email-${key}`} className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => handleNotificationToggle('email', key)}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div>
                    <div className="flex items-center mb-4">
                      <DevicePhoneMobileIcon className="w-5 h-5 text-indigo-400 mr-2" />
                      <h3 className="text-lg font-medium text-gray-200">Push Notifications</h3>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(notificationSettings.push).map(([key, value]) => (
                        <div key={`push-${key}`} className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => handleNotificationToggle('push', key)}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Save Notification Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Privacy Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="w-full md:w-64 p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="public">Public - Anyone can view your profile</option>
                      <option value="hackathons">Hackathon Only - Only shown in hackathons you participate in</option>
                      <option value="connections">Connections Only - Only your connections can view</option>
                      <option value="private">Private - Only you can view your profile</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        Show email address on profile
                      </span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.showEmail}
                          onChange={() => handlePrivacyChange('showEmail', !privacySettings.showEmail)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        Display achievements on profile
                      </span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.showAchievements}
                          onChange={() => handlePrivacyChange('showAchievements', !privacySettings.showAchievements)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        Allow team invitations
                      </span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.allowTeamInvites}
                          onChange={() => handlePrivacyChange('allowTeamInvites', !privacySettings.allowTeamInvites)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Save Privacy Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Appearance Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Theme
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Light Mode
                        </span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            checked={themeSettings.theme === 'light'}
                            onChange={() => handleThemeChange('theme', 'light')}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Dark Mode
                        </span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            checked={themeSettings.theme === 'dark'}
                            onChange={() => handleThemeChange('theme', 'dark')}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          System Default
                        </span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            checked={themeSettings.theme === 'system'}
                            onChange={() => handleThemeChange('theme', 'system')}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Font Size
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Small
                        </span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="fontSize"
                            checked={themeSettings.fontSize === 'small'}
                            onChange={() => handleThemeChange('fontSize', 'small')}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Medium
                        </span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="fontSize"
                            checked={themeSettings.fontSize === 'medium'}
                            onChange={() => handleThemeChange('fontSize', 'medium')}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Large
                        </span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="fontSize"
                            checked={themeSettings.fontSize === 'large'}
                            onChange={() => handleThemeChange('fontSize', 'large')}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        Reduce animations
                      </span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={themeSettings.reduceAnimations}
                          onChange={() => handleThemeChange('reduceAnimations', !themeSettings.reduceAnimations)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        High contrast mode
                      </span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={themeSettings.highContrast}
                          onChange={() => handleThemeChange('highContrast', !themeSettings.highContrast)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Save Appearance Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-4">Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      {passwordError && (
                        <p className="text-red-500 text-sm">{passwordError}</p>
                      )}
                      {passwordSuccess && (
                        <p className="text-green-500 text-sm">{passwordSuccess}</p>
                      )}
                      <div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Change Password
                        </button>
                      </div>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-4">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Enable Two-Factor Authentication
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-4">Sessions</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Manage your active sessions and sign out from other devices.
                    </p>
                    <div className="bg-gray-800/60 rounded-md p-4 mb-4 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-white">Current Session</h4>
                          <p className="text-xs text-gray-400">Windows 10 • Chrome • United States</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/60 text-green-400 border border-green-700/50">
                          Active
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Sign Out All Other Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 