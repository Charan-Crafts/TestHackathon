import React, { useState, useEffect } from 'react';
import { hackathonAPI } from '../../../../services/api';
import { toast } from 'react-hot-toast';
import { TrashIcon } from '@heroicons/react/24/outline';

function BasicInfoStep({ formData, updateFormData, nextStep, isNavigating, hackathonId }) {
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [coOrganizers, setCoOrganizers] = useState(formData.coOrganizers || []);
  const [registrationFees, setRegistrationFees] = useState(formData.registrationFees || {
    1: 200,
    2: 400,
    3: 500

  });
  const [animateCoOrganizer, setAnimateCoOrganizer] = useState(-1);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(formData.imagePath || '');
  const [brochurePreview, setBrochurePreview] = useState(formData.brochurePreview || '');
  const [brochureFile, setBrochureFile] = useState(formData.brochureFile || null);

  const categories = [
    'Web Development', 'Mobile Development', 'Machine Learning',
    'Blockchain', 'Data Science', 'AR/VR', 'IoT',
    'Cybersecurity', 'Game Development', 'Open Innovation'
  ];

  // Initialize image preview on component mount
  useEffect(() => {
    if (formData.imagePath) {
      setImagePreview(`${process.env.REACT_APP_API_URL}${formData.imagePath}`);
    } else if (formData.imagePreview) {
      setImagePreview(formData.imagePreview);
    }
  }, [formData.imagePath, formData.imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If maximum team size changes, adjust the registration fees
    if (name === 'maxTeamSize') {
      const maxSize = parseInt(value);
      const updatedFees = {};

      // Create fee entries for all team sizes up to the maximum
      for (let i = 1; i <= maxSize; i++) {
        updatedFees[i] = registrationFees[i] || 0;
      }

      setRegistrationFees(updatedFees);
      updateFormData({ registrationFees: updatedFees, [name]: value });
    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        if (file.size > 2 * 1024 * 1024) {
          setErrors(prev => ({
            ...prev,
            image: 'Image size should be less than 2MB'
          }));
          return;
        }

        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({
            ...prev,
            image: 'Please upload a valid image file'
          }));
          return;
        }

        setIsUploading(true);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        if (hackathonId) {
          const uploadFormData = new FormData();
          uploadFormData.append('image', file);
          uploadFormData.append('entityType', 'hackathon');
          uploadFormData.append('entityId', hackathonId);
          uploadFormData.append('isPublic', 'true');

          const response = await hackathonAPI.uploadHackathonImage(uploadFormData);

          if (response.data.success) {
            const fileData = response.data.data;
            setImagePreview(fileData.location); // Use S3 location
            updateFormData({
              imagePath: fileData.location,
              imagePreview: fileData.location,
              imageFile: null,
              s3Key: fileData.s3Key,
              s3Bucket: fileData.s3Bucket
            });
            toast.success('Image uploaded successfully');
          }
        } else {
          updateFormData({
            imageFile: file,
            imagePreview: previewUrl,
            imagePath: null
          });
        }

        setErrors(prev => ({ ...prev, image: null }));
      } catch (error) {
        console.error('Error handling image:', error);
        setErrors(prev => ({
          ...prev,
          image: 'Failed to process image. Please try again.'
        }));
        toast.error('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview && !imagePreview.startsWith(process.env.REACT_APP_API_URL)) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    updateFormData({
      imagePath: null,
      imagePreview: null,
      imageFile: null
    });
  };

  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith(process.env.REACT_APP_API_URL)) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleCoOrganizerAdd = () => {
    const newCoOrganizers = [...coOrganizers, { name: '', contact: '', email: '' }];
    setCoOrganizers(newCoOrganizers);
    updateFormData({ coOrganizers: newCoOrganizers });
    setAnimateCoOrganizer(newCoOrganizers.length - 1);
    setTimeout(() => setAnimateCoOrganizer(-1), 1000);
  };

  const handleCoOrganizerRemove = (index) => {
    const updatedCoOrganizers = coOrganizers.filter((_, i) => i !== index);
    setCoOrganizers(updatedCoOrganizers);
    updateFormData({ coOrganizers: updatedCoOrganizers });
  };

  const handleCoOrganizerChange = (index, field, value) => {
    const updatedCoOrganizers = coOrganizers.map((org, i) => {
      if (i === index) {
        return { ...org, [field]: value };
      }
      return org;
    });
    setCoOrganizers(updatedCoOrganizers);
    updateFormData({ coOrganizers: updatedCoOrganizers });
  };

  const handleRegistrationFeeChange = (teamSize, value) => {
    const updatedFees = { ...registrationFees, [teamSize]: value };
    setRegistrationFees(updatedFees);
    updateFormData({ registrationFees: updatedFees });
  };

  const handleBrochureInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          brochure: 'Brochure size should be less than 5MB'
        }));
        return;
      }
      if (!file.type.startsWith('application/pdf') && !file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          brochure: 'Please upload a PDF or image file'
        }));
        return;
      }

      if (hackathonId) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);
          uploadFormData.append('entityType', 'hackathon');
          uploadFormData.append('entityId', hackathonId);
          uploadFormData.append('isPublic', 'true');
          uploadFormData.append('tags', JSON.stringify(['brochure']));

          const response = await hackathonAPI.uploadHackathonBrochure(uploadFormData);

          if (response.data.success) {
            const fileData = response.data.data;
            setBrochurePreview(file.type.startsWith('image/') ? fileData.location : file.name);
            setBrochureFile(null);
            updateFormData({
              brochureFile: null,
              brochurePath: fileData.location,
              brochurePreview: file.type.startsWith('image/') ? fileData.location : file.name,
              brochureS3Key: fileData.s3Key,
              brochureS3Bucket: fileData.s3Bucket
            });
            toast.success('Brochure uploaded successfully');
          }
        } catch (error) {
          console.error('Error uploading brochure:', error);
          setErrors(prev => ({
            ...prev,
            brochure: 'Failed to upload brochure. Please try again.'
          }));
          toast.error('Failed to upload brochure');
        }
      } else {
        setBrochureFile(file);
        setBrochurePreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : file.name);
        updateFormData({
          brochureFile: file,
          brochurePreview: file.type.startsWith('image/') ? URL.createObjectURL(file) : file.name
        });
      }
      setErrors(prev => ({ ...prev, brochure: null }));
    }
  };

  const handleRemoveBrochure = () => {
    if (brochurePreview && brochureFile && brochureFile.type.startsWith('image/')) {
      URL.revokeObjectURL(brochurePreview);
    }
    setBrochurePreview('');
    setBrochureFile(null);
    updateFormData({ brochureFile: null, brochurePreview: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug log for imageFile
    console.log('DEBUG: handleSubmit formData.imageFile', formData.imageFile);
    // Debug log for brochureFile state
    console.log('DEBUG: handleSubmit brochureFile state', brochureFile);

    // Skip validation if navigating (coming from a previous step)
    if (isNavigating) {
      nextStep();
      return;
    }

    // Validate form
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Hackathon title is required';
    if (!formData.organizer) newErrors.organizer = 'Organizer name is required';
    if (!formData.description) newErrors.description = 'Short description is required';
    if (!formData.longDescription) newErrors.longDescription = 'Detailed description is required';
    if (!formData.aboutEvent) newErrors.aboutEvent = 'About event information is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if ((formData.locationType === 'offline' || formData.locationType === 'hybrid') && !formData.location) {
      newErrors.location = 'Location is required for in-person events';
    }
    if (!formData.participants) newErrors.participants = 'Expected participants count is required';
    if (!formData.prize) newErrors.prize = 'Total prize amount is required';
    // Require imageFile for hackathon image
    if (!formData.imageFile) newErrors.image = 'Hackathon image is required';

    // Check if end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Check if registration deadline is before start date
    if (formData.registrationDeadline && formData.startDate) {
      const deadline = new Date(formData.registrationDeadline);
      const start = new Date(formData.startDate);
      if (deadline >= start) {
        newErrors.registrationDeadline = 'Registration deadline must be before the hackathon start date';
      }
    }

    setErrors(newErrors);

    // If no errors, proceed to next step
    if (Object.keys(newErrors).length === 0) {
      // Ensure brochureFile state is included in formData before proceeding
      updateFormData({ ...formData, brochureFile: brochureFile });
      nextStep();
    }
  };

  const renderImagePreview = () => {
    return (
      <div className="w-full">
        {imagePreview ? (
          <div className="relative group">
            <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-900/40 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20">
              <img
                src={imagePreview}
                alt="Hackathon preview"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 shadow-lg"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="w-full h-64 flex items-center justify-center px-6 py-6 border-2 border-dashed border-cyan-500/30 rounded-xl bg-gray-900/40 hover:bg-gray-900/60 transition-all duration-300 group cursor-pointer"
            onClick={() => document.getElementById('image-upload').click()}>
            <div className="space-y-4 text-center">
              <div className="mx-auto h-16 w-16 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-2">
                <label htmlFor="image-upload" className="relative cursor-pointer rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500">
                  <span className="inline-flex items-center px-4 py-2 bg-cyan-900/30 rounded-lg hover:bg-cyan-900/50 transition-all duration-300">
                    {isUploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      'Upload an image'
                    )}
                  </span>
                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileInputChange}
                    disabled={isUploading}
                  />
                </label>
                <p className="text-sm text-gray-400">or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
              </div>
            </div>
          </div>
        )}
        {errors.image && (
          <p className="mt-2 text-sm text-red-500 animate-pulse">{errors.image}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hackathon Title */}
        <div className="md:col-span-2 transition-all duration-300 hover:shadow-md hover:shadow-cyan-500/10 rounded-lg p-1">
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Hackathon Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-900/80 border ${errors.title ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all duration-300`}
            placeholder="e.g. CyberHack 2023"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.title}</p>}
        </div>

        {/* Organizer Name */}
        <div className="md:col-span-2 transition-all duration-300 hover:shadow-md hover:shadow-cyan-500/10 rounded-lg p-1">
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Organizer Name *
          </label>
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-900/80 border ${errors.organizer ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all duration-300`}
            placeholder="e.g. TechGlobal Foundation"
          />
          {errors.organizer && <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.organizer}</p>}
        </div>

        {/* Co-Organizers */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Co-Organizers
          </label>
          <div className="space-y-4">
            {coOrganizers.map((org, index) => (
              <div key={index}
                className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-900/40 rounded-lg border border-cyan-500/20 transition-all duration-500 
                ${animateCoOrganizer === index ? 'animate-slideIn transform scale-100 border-cyan-400' : ''}`}>
                <div>
                  <input
                    type="text"
                    value={org.name}
                    onChange={(e) => handleCoOrganizerChange(index, 'name', e.target.value)}
                    placeholder="Name"
                    className="w-full px-4 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    value={org.contact}
                    onChange={(e) => handleCoOrganizerChange(index, 'contact', e.target.value)}
                    placeholder="Contact Number"
                    className="w-full px-4 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all duration-300"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={org.email}
                    onChange={(e) => handleCoOrganizerChange(index, 'email', e.target.value)}
                    placeholder="Email Address"
                    className="flex-1 px-4 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleCoOrganizerRemove(index)}
                    className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleCoOrganizerAdd}
              className="w-full px-4 py-2 bg-gray-900/40 border border-cyan-500/50 rounded-lg text-cyan-400 hover:bg-gray-800 hover:shadow-md hover:shadow-cyan-500/20 transform hover:translate-y-[-2px] transition-all duration-300"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Add Co-Organizer
              </span>
            </button>
          </div>
        </div>

        {/* Hackathon Image */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cyan-300 mb-2">
            Hackathon Image *
          </label>
          <div className="w-full">
            {renderImagePreview()}
          </div>
        </div>

        {/* Brochure Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cyan-300 mb-2">
            Hackathon Brochure (PDF or Image, max 5MB)
          </label>
          <div className="w-full">
            {brochurePreview ? (
              <div className="relative group">
                {brochureFile && brochureFile.type.startsWith('image/') ? (
                  <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-900/40 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20">
                    <img
                      src={brochurePreview}
                      alt="Brochure preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-gray-900/40 rounded-lg p-4">
                    <span className="text-cyan-400">{brochurePreview}</span>
                    <a
                      href={URL.createObjectURL(brochureFile)}
                      download={brochureFile.name}
                      className="text-blue-400 underline text-xs"
                    >
                      Download
                    </a>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleRemoveBrochure}
                  className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 shadow-lg"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="w-full h-24 flex items-center justify-center px-6 py-6 border-2 border-dashed border-cyan-500/30 rounded-xl bg-gray-900/40 hover:bg-gray-900/60 transition-all duration-300 group cursor-pointer"
                onClick={() => document.getElementById('brochure-upload').click()}>
                <div className="space-y-2 text-center">
                  <label htmlFor="brochure-upload" className="relative cursor-pointer rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500">
                    <span className="inline-flex items-center px-4 py-2 bg-cyan-900/30 rounded-lg hover:bg-cyan-900/50 transition-all duration-300">
                      Upload Brochure
                    </span>
                    <input
                      id="brochure-upload"
                      name="brochure"
                      type="file"
                      accept="application/pdf,image/*"
                      className="sr-only"
                      onChange={handleBrochureInputChange}
                    />
                  </label>
                  <p className="text-xs text-gray-500">PDF or image, up to 5MB</p>
                </div>
              </div>
            )}
            {errors.brochure && (
              <p className="mt-2 text-sm text-red-500 animate-pulse">{errors.brochure}</p>
            )}
          </div>
        </div>

        {/* Short Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Short Description * <span className="text-gray-400 text-xs">(50-150 characters)</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            className={`w-full px-4 py-2 bg-gray-900/80 border ${errors.description ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500`}
            placeholder="Brief summary of your hackathon"
            maxLength={150}
          ></textarea>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formData.description ? formData.description.length : 0}/150 characters</span>
            {errors.description && <span className="text-red-500">{errors.description}</span>}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Detailed Description * <span className="text-gray-400 text-xs">(100-500 characters)</span>
          </label>
          <textarea
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            rows="4"
            className={`w-full px-4 py-2 bg-gray-900/80 border ${errors.longDescription ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500`}
            placeholder="Detailed description of your hackathon"
            maxLength={500}
          ></textarea>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formData.longDescription ? formData.longDescription.length : 0}/500 characters</span>
            {errors.longDescription && <span className="text-red-500">{errors.longDescription}</span>}
          </div>
        </div>

        {/* About Event */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            About Event *
          </label>
          <textarea
            name="aboutEvent"
            value={formData.aboutEvent}
            onChange={handleChange}
            rows="5"
            className={`w-full px-4 py-2 bg-gray-900/80 border ${errors.aboutEvent ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500`}
            placeholder="Tell participants what your hackathon is about, what makes it special, and why they should participate"
          ></textarea>
          {errors.aboutEvent && <p className="mt-1 text-sm text-red-500">{errors.aboutEvent}</p>}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            onClick={(e) => e.target.showPicker()}
            className={`w-full px-4 py-2 bg-gray-900/80 border ${errors.startDate ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            End Date *
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            onClick={(e) => e.target.showPicker()}
            min={formData.startDate}
            className={`w-full px-4 py-2 bg-gray-900/80 border ${errors.endDate ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
        </div>

        {/* Registration Deadline */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Registration Deadline *
          </label>
          <input
            type="date"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            onClick={(e) => e.target.showPicker()}
            max={formData.startDate}
            className={`w-full px-4 py-2 bg-gray-900/80 border ${errors.registrationDeadline ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
          />
          {errors.registrationDeadline && <p className="mt-1 text-sm text-red-500">{errors.registrationDeadline}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Primary Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-900/80 border ${errors.category ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
        </div>

        {/* Location Type */}
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Location Type *
          </label>
          <select
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
          >
            <option value="online">Online</option>
            <option value="offline">In-person</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Physical Location */}
        {(formData.locationType === 'offline' || formData.locationType === 'hybrid') && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-cyan-300 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-900/80 border ${errors.location ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500`}
              placeholder="e.g. San Francisco Convention Center"
            />
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>
        )}

        {/* Max Team Size */}
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Maximum Team Size *
          </label>
          <select
            name="maxTeamSize"
            value={formData.maxTeamSize}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
          >
            <option value="1">1 (Individual)</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>

        {/* Expected Participants */}
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Expected Participants *
          </label>
          <input
            type="number"
            name="participants"
            value={formData.participants}
            onChange={handleChange}
            min="0"
            className={`w-full px-4 py-2 bg-gray-900/80 border ${errors.participants ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
          />
          {errors.participants && <p className="mt-1 text-sm text-red-500">{errors.participants}</p>}
        </div>

        {/* Prize Pool */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Total Prize Amount *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">$</span>
            </div>
            <input
              type="text"
              name="prize"
              value={formData.prize}
              onChange={handleChange}
              className={`w-full pl-8 px-4 py-2 bg-gray-900/80 border ${errors.prize ? 'border-red-500' : 'border-cyan-500/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500`}
              placeholder="e.g. 10,000"
            />
          </div>
          {errors.prize && <p className="mt-1 text-sm text-red-500">{errors.prize}</p>}
        </div>

        {/* Registration Fees */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Registration Fees (₹)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formData.maxTeamSize && [...Array(parseInt(formData.maxTeamSize || 1))].map((_, index) => {
              const teamSize = index + 1;
              return (
                <div key={teamSize} className="transition-all duration-300 transform hover:scale-105 hover:bg-gray-900/40 p-3 rounded-lg">
                  <label className="block text-xs text-gray-400 mb-1">
                    {teamSize} {teamSize === 1 ? 'Member' : 'Members'}
                  </label>
                  <input
                    type="number"
                    value={registrationFees[teamSize] === 0 ? 0 : registrationFees[teamSize] || ''}
                    onChange={(e) => handleRegistrationFeeChange(teamSize, parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-colors duration-300"
                    min="0"
                    placeholder="0 for Free"
                  />
                  {registrationFees[teamSize] === 0 && (
                    <span className="text-green-400 text-xs font-semibold ml-2">Free</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Social Media Links
          </label>
          <div className="space-y-4">
            <div>
              <input
                type="url"
                name="whatsappLink"
                value={formData.whatsappLink || ''}
                onChange={handleChange}
                placeholder="Linked In Group Link"
                className="w-full px-4 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
              />
            </div>
            <div>
              <input
                type="url"
                name="discordLink"
                value={formData.discordLink || ''}
                onChange={handleChange}
                placeholder="Discord Server Link"
                className="w-full px-4 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Participant Benefits */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cyan-300 mb-1">
            Participant Benefits
          </label>
          <textarea
            name="participantBenefits"
            value={formData.participantBenefits || ''}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
            placeholder="List the benefits participants will receive (e.g., swag, certificates, mentorship, etc.)"
          ></textarea>
        </div>
      </div>

      {/* Next button */}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 transform hover:translate-y-[-2px]"
        >
          Next Step
        </button>
      </div>
    </form>
  );
}

export default BasicInfoStep; 