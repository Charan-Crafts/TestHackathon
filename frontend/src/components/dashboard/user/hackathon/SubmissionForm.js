import React, { useState, useEffect } from 'react';

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
        // In a real app, you would fetch the actual files
        // Here we'll just create dummy file objects
        setFiles(initialData.files.map(filename => ({
          name: filename,
          size: 1024 // Mock size
        })));
      }
    }
  }, [initialData, isEditing]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      
      // Call the parent onSubmit handler with the form data
      if (onSubmit) {
        onSubmit({
          taskId: task.id,
          ...formData,
          files: files.map(file => file.name), // In a real app, you'd upload these files
          submittedAt: isEditing ? initialData.submittedAt : new Date().toISOString()
        });
      }
    }, 1500);
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
      
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-xs font-medium text-gray-400 mb-1">
            Submission Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter a title for your submission"
          />
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-xs font-medium text-gray-400 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Provide details about your submission"
          />
        </div>
        
        {/* Code Repository Link - Only for code submissions */}
        {showCodeFields && (
          <div className="mb-4">
            <label htmlFor="repoLink" className="block text-xs font-medium text-gray-400 mb-1">
              Repository Link *
            </label>
            <input
              type="url"
              id="repoLink"
              name="repoLink"
              value={formData.repoLink}
              onChange={handleChange}
              required={showCodeFields}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://github.com/yourusername/repo"
            />
          </div>
        )}
        
        {/* Demo Link - Only for demo submissions */}
        {showDemoFields && (
          <div className="mb-4">
            <label htmlFor="demoLink" className="block text-xs font-medium text-gray-400 mb-1">
              Demo Link {showDemoFields ? '*' : '(Optional)'}
            </label>
            <input
              type="url"
              id="demoLink"
              name="demoLink"
              value={formData.demoLink}
              onChange={handleChange}
              required={showDemoFields}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://yourdemo.com"
            />
          </div>
        )}
        
        {/* File upload */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-1">
            {showPresentationFields ? 'Upload Presentation *' : 'Upload Files'} 
            {!showPresentationFields && <span className="text-gray-500 text-[10px] ml-1">(Optional)</span>}
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-500"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span className="px-2 py-1">Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    multiple
                    required={showPresentationFields && files.length === 0}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, PDF, ZIP up to 10MB
              </p>
            </div>
          </div>
          
          {files.length > 0 && (
            <ul className="mt-2 text-xs text-gray-400 space-y-1">
              {files.map((file, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-4 w-4 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Additional Notes */}
        <div className="mb-4">
          <label htmlFor="additionalNotes" className="block text-xs font-medium text-gray-400 mb-1">
            Additional Notes <span className="text-gray-500 text-[10px]">(Optional)</span>
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Any additional information for the judges"
          />
        </div>
        
        {/* Submit and Cancel buttons */}
        <div className="flex space-x-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-3 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex items-center"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              isEditing ? 'Update Submission' : 'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm; 