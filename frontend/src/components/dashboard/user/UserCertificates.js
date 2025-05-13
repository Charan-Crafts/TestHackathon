import React, { useState, useEffect } from 'react';
import SocialShare from '../../common/SocialShare';
import { PiCertificateDuotone } from "react-icons/pi";

// Social Share Modal Component
const SocialShareModal = ({ isOpen, onClose, certificate }) => {
  if (!isOpen) return null;

  const shareUrl = certificate.imageUrl;
  const shareTitle = `Check out my ${certificate.title} certificate!`;
  const shareDescription = `I earned this certificate for ${certificate.achievement} from ${certificate.issuer}`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md border border-indigo-500/30 overflow-y-auto max-h-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Share Certificate</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <SocialShare
            title={shareTitle}
            description={shareDescription}
            url={shareUrl}
          />
        </div>
      </div>
    </div>
  );
};

const UserCertificates = ({ user }) => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    // Load certificates from localStorage (in a real app, this would be an API call)
    const loadCertificates = () => {
      setIsLoading(true);
      try {
        const savedCertificates = JSON.parse(localStorage.getItem('userCertificates') || '[]');
        setCertificates(savedCertificates);
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificates();
  }, []);

  const handleDeleteCertificate = (id) => {
    // Remove the certificate with the given ID
    const updatedCertificates = certificates.filter(cert => cert.id !== id);
    setCertificates(updatedCertificates);

    // Update localStorage
    localStorage.setItem('userCertificates', JSON.stringify(updatedCertificates));
  };

  const handleShareCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShareModalOpen(true);
  };

  return (
    <>
      <div className="px-4 py-6">
        {/* Certificates Section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center relative pl-2">
            <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></span>
            Your Certificates
          </h3>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-400">Manage and share your earned certificates</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : certificates.length === 0 ? (
            <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
              <div className="mb-4 text-gray-400">
                <PiCertificateDuotone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No Certificates Yet</h4>
                <p className="mb-6">Participate in hackathons to earn certificates!</p>

                <a
                  href="/hackathons"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Explore Hackathons
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 transition-all hover:border-indigo-500/50 group">
                  <div className="relative aspect-[4/3] bg-gray-900">
                    <img
                      src={certificate.imageUrl}
                      alt={certificate.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <a
                        href={certificate.imageUrl}
                        download={`${certificate.title}.png`}
                        className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors"
                        title="Download Certificate"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                      <button
                        onClick={() => handleShareCertificate(certificate)}
                        className="p-2 bg-brand-700 rounded-full hover:bg-brand-900 transition-colors"
                        title="Share Certificate"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCertificate(certificate.id)}
                        className="p-2 bg-red-600 rounded-full hover:bg-red-500 transition-colors"
                        title="Delete Certificate"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-medium mb-1 truncate">{certificate.title}</h4>
                    <p className="text-gray-400 text-sm mb-2 truncate">{certificate.achievement}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(certificate.issuedDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-indigo-400 truncate max-w-[150px]">
                        {certificate.issuer}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Social Share Modal */}
      {selectedCertificate && (
        <SocialShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          certificate={selectedCertificate}
        />
      )}
    </>
  );
};

export default UserCertificates;
