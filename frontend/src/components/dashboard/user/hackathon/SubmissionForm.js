import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { submissionAPI } from '../../../../services/api';

const SubmissionForm = ({ task, onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    repoLink: '',
    demoLink: '',
    additionalNotes: ''
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        repoLink: initialData.repoLink || '',
        demoLink: initialData.demoLink || '',
        additionalNotes: initialData.additionalNotes || ''
      });

      // Handle files if they exist
      if (initialData.files && initialData.files.length > 0) {
        setUploadedFiles(initialData.files);
      }
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Upload files immediately if task exists
    if (task && task._id) {
      setUploading(true);
      try {
        const uploadPromises = selectedFiles.map(file => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('entityType', 'submission');
          formData.append('entityId', task._id);
          formData.append('isPublic', 'false');
          return submissionAPI.uploadFile(formData);
        });

        const responses = await Promise.all(uploadPromises);
        const newFiles = responses.map(response => ({
          id: response.data.data.file._id,
          name: response.data.data.file.originalName,
          url: response.data.data.file.location,
          s3Key: response.data.data.file.s3Key,
          s3Bucket: response.data.data.file.s3Bucket
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
        toast.success('Files uploaded successfully');
      } catch (error) {
        console.error('File upload error:', error);
        toast.error('Failed to upload files');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If files haven't been uploaded yet (no task._id available earlier)
      if (files.length > 0 && (!task || !task._id)) {
        setUploading(true);
        const uploadPromises = files.map(file => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('entityType', 'submission');
          formData.append('entityId', task._id);
          formData.append('isPublic', 'false');
          return submissionAPI.uploadFile(formData);
        });

        const responses = await Promise.all(uploadPromises);
        const newFiles = responses.map(response => ({
          id: response.data.data.file._id,
          name: response.data.data.file.originalName,
          url: response.data.data.file.location,
          s3Key: response.data.data.file.s3Key,
          s3Bucket: response.data.data.file.s3Bucket
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
      }

      // Submit form data with file references
      await onSubmit({
        ...formData,
        files: uploadedFiles
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        repoLink: '',
        demoLink: '',
        additionalNotes: ''
      });
      setFiles([]);
      setUploadedFiles([]);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit form');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (fileIndex) => {
    try {
      if (uploadedFiles[fileIndex]) {
        await submissionAPI.deleteFile(uploadedFiles[fileIndex].id);
        setUploadedFiles(prev => prev.filter((_, i) => i !== fileIndex));
        toast.success('File removed successfully');
      } else {
        setFiles(prev => prev.filter((_, i) => i !== fileIndex));
      }
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Failed to remove file');
    }
  };

  // Determine what fields to show based on task ID/name
  const showCodeFields = task.id.includes('code') || task.name.toLowerCase().includes('code');
  const showDemoFields = task.id.includes('demo') || task.name.toLowerCase().includes('demo');
  const showPresentationFields = task.id.includes('presentation') || task.name.toLowerCase().includes('presentation');

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-800/70 p-4">
      <h3 className="text-sm font-medium text-white mb-3">
        {isEditing ? `Edit Submission: ${task.name}` : `Submit: ${task.name}`}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Repository Link - Only for code submissions */}
          {showCodeFields && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Repository Link</label>
              <input
                type="url"
                name="repoLink"
                value={formData.repoLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          )}

          {/* Demo Link - Only for demo submissions */}
          {showDemoFields && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Demo Link</label>
              <input
                type="url"
                name="demoLink"
                value={formData.demoLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          )}

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            {uploading && <p className="mt-2 text-sm text-gray-500">Uploading files...</p>}
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
              <ul className="mt-2 divide-y divide-gray-200">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      {file.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit and Cancel buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isEditing ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm; 