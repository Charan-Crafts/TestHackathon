import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckBadgeIcon,
  MapPinIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CalendarIcon,
  BriefcaseIcon,
  CameraIcon,
  PencilIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

// Social platform SVG icons as components
const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
  </svg>
);

const ProfileHeader = ({
  profileData,
  user,
  isEditingProfile,
  setIsEditingProfile,
  profileFormData,
  handleProfileChange,
  handleProfileSubmit,
  formStyles
}) => {
  const avatarInputRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  // Social media icons mapping
  const socialIcons = {
    GitHub: <GitHubIcon />,
    LinkedIn: <LinkedInIcon />,
    X: <XIcon />,
    Twitter: <XIcon />,
    Facebook: <FacebookIcon />,
    Instagram: <InstagramIcon />
  };

  // Handle closing the modal with animation
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsEditingProfile(false);
      setIsClosing(false);
    }, 300);
  };

  // Reset closing state when modal is opened
  useEffect(() => {
    if (isEditingProfile) {
      setIsClosing(false);
    }
  }, [isEditingProfile]);

  // Handle social media operations
  const handleAddSocial = () => {
    const updatedFormData = {
      ...profileFormData,
      socials: Array.isArray(profileFormData.socials)
        ? [...profileFormData.socials, { name: 'GitHub', username: '', url: '' }]
        : [{ name: 'GitHub', username: '', url: '' }]
    };
    handleProfileChange({ target: { name: 'socials', value: updatedFormData.socials } });
  };

  const handleUpdateSocial = (index, field, value) => {
    const updatedSocials = [...(profileFormData.socials || [])];
    updatedSocials[index] = {
      ...updatedSocials[index],
      [field]: value
    };

    handleProfileChange({ target: { name: 'socials', value: updatedSocials } });
  };

  const handleRemoveSocial = (index) => {
    const updatedSocials = (profileFormData.socials || []).filter((_, i) => i !== index);
    handleProfileChange({ target: { name: 'socials', value: updatedSocials } });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleProfileSubmit(profileFormData);
    handleCloseModal();
  };

  // Get social platform background color
  const getSocialBgColor = (platform) => {
    switch (platform) {
      case 'GitHub': return 'bg-gray-800 hover:bg-gray-900';
      case 'LinkedIn': return 'bg-blue-600 hover:bg-blue-700';
      case 'X':
      case 'Twitter': return 'bg-black hover:bg-gray-800';
      case 'Facebook': return 'bg-blue-700 hover:bg-blue-800';
      case 'Instagram': return 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600';
      default: return 'bg-indigo-600 hover:bg-indigo-700';
    }
  };

  // Handle navigation to become organizer page
  const handleBecomeOrganizer = () => {
    navigate('/dashboard/user/verification');
  };

  return (
    <div className="bg-gray-800/70 rounded-xl shadow-md overflow-hidden border border-gray-700 relative">
      <div className="p-4">
        {/* Edit Profile and Become Organizer Buttons */}
        <div className="absolute top-3 right-3 z-10 flex space-x-2">
          <button
            onClick={handleBecomeOrganizer}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center transition-colors shadow-md"
            aria-label="Become Organizer"
            type="button"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium">Become Organizer</span>
          </button>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center transition-colors shadow-md"
            aria-label="Edit Profile"
            type="button"
          >
            <PencilIcon className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-medium">Edit Profile</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Avatar */}
          <div className="relative mx-auto lg:mx-0">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-1 rounded-full shadow-md">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profileFormData?.name || 'User') + '&size=128&background=4f46e5&color=fff'}
                alt={profileFormData?.name || 'User Profile'}
                className="w-24 h-24 rounded-full object-cover border-2 border-white"
              />
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-indigo-600 text-white p-1.5 rounded-full border-2 border-white shadow hover:bg-indigo-700 transition-colors"
              aria-label="Change Profile Picture"
              type="button"
            >
              <CameraIcon className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={avatarInputRef}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* User Info */}
          <div className="space-y-3 flex-1 text-center lg:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center lg:justify-start">
                <h1 className="text-2xl font-bold text-gray-200">
                  {profileFormData?.name || 'User Name'}
                </h1>
                <CheckBadgeIcon className="w-5 h-5 text-blue-500 ml-2" />
              </div>
              <p className="text-indigo-600 font-medium">{profileFormData?.title || 'Professional Title'}</p>
            </div>

            <p className="text-gray-300 max-w-2xl text-sm">{profileFormData?.bio || 'User biography'}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="flex items-center text-gray-400 group">
                <MapPinIcon className="w-5 h-5 mr-2 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <span>{profileFormData?.location || 'Location'}</span>
              </div>
              <div className="flex items-center text-gray-400 group">
                <EnvelopeIcon className="w-5 h-5 mr-2 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <a href={`mailto:${profileFormData?.email || '#'}`} className="hover:text-indigo-600 transition-colors">
                  {profileFormData?.email || 'Email'}
                </a>
              </div>
              <div className="flex items-center text-gray-400 group">
                <GlobeAltIcon className="w-5 h-5 mr-2 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <a href={`https://${profileFormData?.website || '#'}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                  {profileFormData?.website || 'Website'}
                </a>
              </div>
              <div className="flex items-center text-gray-400 group">
                <CalendarIcon className="w-5 h-5 mr-2 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <span>Joined {profileFormData?.joinDate || 'Date'}</span>
              </div>
              <div className="flex items-center text-gray-400 group">
                <BriefcaseIcon className="w-5 h-5 mr-2 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <span>{profileFormData?.title || 'Title'}</span>
              </div>
            </div>

            {/* Social media badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {(profileFormData?.socials || []).map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:shadow-md transition-all ${getSocialBgColor(social.name)}`}
                >
                  <span className="flex items-center justify-center w-6 h-6 bg-white bg-opacity-20 rounded-full mr-2">
                    {socialIcons[social.name] || social.name[0]}
                  </span>
                  <span>{social.username}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Sliding Modal */}
      {isEditingProfile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          onClick={handleCloseModal}
        >
          <div
            className={`bg-gray-800 w-full max-w-2xl h-full overflow-y-auto shadow-xl ${isClosing ? 'translate-x-full' : 'translate-x-0'} transition-transform duration-300 ease-in-out`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-200">Edit Profile</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-purple-100 rounded-full transition-all duration-300 group"
                  type="button"
                >
                  <XMarkIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>

              {/* Profile Edit Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileFormData?.name ?? ''}
                      onChange={handleProfileChange}
                      className={formStyles.input}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">Professional Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={profileFormData?.title ?? ''}
                      onChange={handleProfileChange}
                      className={formStyles.input}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={profileFormData?.bio ?? ''}
                      onChange={handleProfileChange}
                      className={formStyles.textarea}
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={profileFormData?.location ?? ''}
                      onChange={handleProfileChange}
                      className={formStyles.input}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileFormData?.email ?? ''}
                      onChange={handleProfileChange}
                      className={formStyles.input}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-300">Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={profileFormData?.website ?? ''}
                      onChange={handleProfileChange}
                      className={formStyles.input}
                      placeholder="example.com"
                    />
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-300">Social Media</label>
                    <button
                      type="button"
                      className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                      onClick={handleAddSocial}
                    >
                      <PlusIcon className="w-3 h-3 mr-1" />
                      Add Social
                    </button>
                  </div>

                  {(profileFormData?.socials || []).map((social, index) => (
                    <div key={index} className="flex gap-2 items-center bg-gray-700 p-3 rounded-lg">
                      <div className="w-28">
                        <select
                          className={formStyles.select}
                          value={social.name || 'GitHub'}
                          onChange={(e) => handleUpdateSocial(index, 'name', e.target.value)}
                        >
                          <option value="GitHub">GitHub</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="X">X (Twitter)</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                        </select>
                      </div>
                      <div className="w-1/5">
                        <input
                          type="text"
                          placeholder="Username"
                          value={social.username ?? ''}
                          className={formStyles.input}
                          onChange={(e) => handleUpdateSocial(index, 'username', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="url"
                          placeholder="URL"
                          value={social.url ?? ''}
                          className={formStyles.input}
                          onChange={(e) => handleUpdateSocial(index, 'url', e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 group"
                        onClick={() => handleRemoveSocial(index)}
                      >
                        <XMarkIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className={formStyles.button.secondary}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={formStyles.button.primary}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;