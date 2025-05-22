import React, { useState, useEffect } from 'react';
import {
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { profileAPI } from '../../../../../services/api';
import { toast } from 'react-hot-toast';

const ResumeTab = ({ profileData, formStyles }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);

  // This would normally come from the backend
  const [resumeData, setResumeData] = useState({
    hasResume: false,
    lastUpdated: null,
    filename: null,
    url: null
  });

  // On mount, set resumeData from profileData
  useEffect(() => {
    if (profileData && profileData.resume) {
      setResumeData({
        hasResume: true,
        lastUpdated: profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString() : null,
        filename: profileData.resume.split('/').pop(),
        url: profileData.resume
      });
    }
  }, [profileData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);

      // Create a preview URL for the file (if it's a PDF)
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        setResumePreview(fileUrl);
      } else {
        setResumePreview(null);
      }

      // Update the file data
      setResumeData(prev => ({
        ...prev,
        hasResume: true,
        lastUpdated: new Date().toLocaleDateString(),
        filename: file.name,
        url: null // will be set after upload
      }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (resumeFile) {
      try {
        // Create form data with required fields
        const formData = new FormData();
        formData.append('file', resumeFile);
        formData.append('type', 'resume');

        // Log the form data for debugging
        console.log('Uploading file:', {
          name: resumeFile.name,
          type: resumeFile.type,
          size: resumeFile.size
        });

        // Log formData entries
        for (const pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        // Upload to backend
        const response = await profileAPI.uploadProfileFile(formData);

        // Update resume data with S3 response
        setResumeData(prev => ({
          ...prev,
          lastUpdated: new Date().toLocaleDateString(),
          url: response.data.data.file.filePath, // Use filePath from response
          filename: resumeFile.name
        }));

        toast.success('Resume uploaded successfully!');
      } catch (err) {
        console.error('Resume upload error:', err);
        toast.error(err.response?.data?.error || 'Failed to upload resume');
      }
    }
  };

  const handleDelete = () => {
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete your resume?')) {
      // This would normally be an API call to delete the file
      setResumeFile(null);
      setResumePreview(null);
      setResumeData({
        hasResume: false,
        lastUpdated: null,
        filename: null,
        url: null
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-emerald-300">Resume Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-gray-800/70 rounded-lg border border-emerald-700/50 shadow-sm p-6">
          <h3 className="text-md font-medium text-emerald-300 mb-4">Upload Resume</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-800 border-gray-600 hover:border-emerald-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <DocumentArrowUpIcon className="w-10 h-10 mb-3 text-emerald-400" />
                  <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, DOCX or RTF (Max. 5MB)</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.rtf"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {resumeFile && (
              <div className="bg-gray-700/60 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-5 h-5 text-emerald-400 mr-2" />
                    <span className="text-sm font-medium text-gray-200 truncate max-w-[200px]">
                      {resumeFile.name}
                    </span>
                  </div>
                  <button
                    onClick={handleDelete}
                    className="text-red-400 hover:text-red-300"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <button
                    onClick={handleUpload}
                    className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    Upload Now
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>Last Updated:</span>
              </div>
              <span className="font-medium text-gray-200">
                {resumeData.lastUpdated || "Not uploaded yet"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <CheckBadgeIcon className="w-4 h-4 mr-1" />
                <span>Status:</span>
              </div>
              <span className={`font-medium ${resumeData.hasResume ? 'text-green-600' : 'text-red-600'}`}>
                {resumeData.hasResume ? 'Active' : 'No Resume Uploaded'}
              </span>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-gray-800/70 rounded-lg border border-emerald-700/50 shadow-sm p-6">
          <h3 className="text-md font-medium text-emerald-300 mb-4">Resume Preview</h3>

          {resumePreview ? (
            <div className="h-80 border border-gray-700 rounded-lg overflow-hidden">
              <iframe
                src={resumePreview}
                className="w-full h-full"
                title="Resume Preview"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 bg-gray-50 border border-gray-700 rounded-lg">
              <DocumentTextIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">
                {resumeData.hasResume
                  ? "Preview not available for this file type"
                  : "No resume uploaded yet"
                }
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            {resumeData.hasResume && (
              <a
                href={resumeData.url || "#"}
                download={resumeData.filename}
                className="flex items-center text-emerald-600 hover:text-emerald-800 text-sm font-medium"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                Download Resume
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Additional Resume Tips Section */}
      <div className="bg-gray-800/70 p-6 rounded-lg border border-emerald-700/50 mt-6">
        <h3 className="font-medium text-emerald-300 mb-3">Resume Tips for Developers</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-900/60 text-emerald-400 mr-2">1</span>
            <span>Highlight your technical skills and programming languages at the top</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-900/60 text-emerald-400 mr-2">2</span>
            <span>Include links to your GitHub, portfolio website, and relevant projects</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-900/60 text-emerald-400 mr-2">3</span>
            <span>Quantify your achievements with metrics where possible</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-900/60 text-emerald-400 mr-2">4</span>
            <span>Tailor your resume for each job application to highlight relevant skills</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeTab; 