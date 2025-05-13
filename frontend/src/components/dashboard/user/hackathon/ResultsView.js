import React, { useState, useRef } from 'react';
import { generateCertificate } from '../../../../utils/certificateGenerator';
import PrizePaymentModal from './PrizePaymentModal';

// Certificate Preview Modal Component
const CertificatePreviewModal = ({ isOpen, onClose, certificate, onDownload, onSaveToProfile }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl border border-indigo-500/30 overflow-y-auto max-h-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Certificate Preview</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={certificate}
              alt="Certificate Preview"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onSaveToProfile}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Save to Profile
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

// Feedback Modal Component
const FeedbackModal = ({ isOpen, onClose, feedback }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl border border-indigo-500/30">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Detailed Feedback</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap">{feedback}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultsView = ({ hackathon }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState('');
  const certificateCanvasRef = useRef(null);

  // Prize claim states
  const [prizeClaimed, setPrizeClaimed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('not_started'); // 'not_started', 'processing', 'completed'

  // Added state for payment data
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'bank',
    accountNumber: '',
    upiId: '',
    fullName: '',
    email: ''
  });

  // Handle certificate preview
  const handlePreviewCertificate = async () => {
    try {
      const canvas = await generateCertificate({
        teamName: hackathon?.team?.name || 'CodeCrafters',
        hackathonTitle: hackathon?.title || 'AI Innovation Challenge',
        rank: '1st Place',
        achievement: 'Grand Prize Winner',
        logo: hackathon?.logo || null // Add hackathon logo if available
      });

      certificateCanvasRef.current = canvas;
      setCertificateUrl(canvas.toDataURL('image/png'));
      setShowCertificateModal(true);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  // Handle certificate download
  const handleDownloadCertificate = () => {
    if (!certificateCanvasRef.current) return;

    certificateCanvasRef.current.toBlob(function (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${hackathon?.team?.name || 'CodeCrafters'}-Certificate.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  // Handle saving certificate to user profile
  const handleSaveCertificateToProfile = () => {
    if (!certificateCanvasRef.current) return;

    certificateCanvasRef.current.toBlob(function (blob) {
      // Create a File object from the blob
      const file = new File([blob], `${hackathon?.title || 'Hackathon'}-Certificate.png`, { type: 'image/png' });

      // Create a new certificate object
      const newCertificate = {
        id: Date.now().toString(), // Simple unique ID
        title: hackathon?.title || 'Hackathon',
        issuedDate: new Date().toISOString(),
        issuer: hackathon?.organizer?.name || 'Hackathon Organizer',
        achievement: hackathon?.specialAward || `${hackathon?.rank || ''} Place`,
        imageFile: file,
        imageUrl: URL.createObjectURL(blob)
      };

      // Store in localStorage for demo purposes
      // In a real app, you would call an API endpoint to save to a database
      const userCertificates = JSON.parse(localStorage.getItem('userCertificates') || '[]');
      userCertificates.push(newCertificate);
      localStorage.setItem('userCertificates', JSON.stringify(userCertificates));

      // Show success message
      alert('Certificate saved to your profile!');
    });
  };

  // Handle view detailed feedback
  const handleViewDetailedFeedback = () => {
    setShowFeedbackModal(true);
  };

  // Handle prize payment
  const handlePrizePayment = () => {
    setShowPrizeModal(true);
  };

  // Handle prize payment submission
  const handlePrizePaymentSubmit = async (data) => {
    // In a real app, this would call an API endpoint to process the payment information
    console.log('Submitting prize payment information:', data);

    // Set prize as claimed
    setPrizeClaimed(true);

    // Update payment status to processing
    setPaymentStatus('processing');

    // Store payment data including the method
    setPaymentData(data);

    // Simulate status updates
    setTimeout(() => {
      setPaymentStatus('completed');
    }, 10000); // Set to completed after 10 seconds for demo purposes

    // For demo purposes, we just return success
    return true;
  };

  // Payment status badge
  const renderPaymentStatusBadge = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-300 border border-yellow-600/30">
            <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing
          </div>
        );
      case 'completed':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-300 border border-green-600/30">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Completed
          </div>
        );
      default:
        return null;
    }
  };

  // Determine if there is a prize to claim
  // const hasPrize = hackathon?.prizes && (
  //   hackathon.rank === 1 || 
  //   hackathon.rank === 2 || 
  //   hackathon.rank === 3 || 
  //   hackathon.specialAward
  // );

  // Get prize details
  // const prizeDetails = (() => {
  //   if (!hackathon?.prizes) return null;
  //
  //   if (hackathon.specialAward) {
  //     return hackathon.prizes.special;
  //   }
  //
  //   switch(hackathon.rank) {
  //     case 1: return hackathon.prizes.firstPlace;
  //     case 2: return hackathon.prizes.secondPlace;
  //     case 3: return hackathon.prizes.thirdPlace;
  //     default: return null;
  //   }
  // })();

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 mb-6">
      <div className="mb-6 text-center">
        <div className="text-2xl font-bold text-white mb-2">🏆 Results Announced! 🏆</div>
        <p className="text-gray-400 text-sm">Congratulations to all participants for your hard work and innovation!</p>
      </div>

      {/* Top three winners */}
      <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-4 mb-8">
        {/* Second Place */}
        <div className="w-full md:w-1/4">
          <div className="bg-gray-700 rounded-lg p-4 text-center h-full flex flex-col">
            <div className="text-xl font-medium text-white mb-2">🥈 2nd Place</div>
            <div className="text-sm font-medium text-white">DataVision Team</div>
            <div className="text-xs text-gray-400 mb-3">Smart City Traffic Management</div>
            <div className="mt-auto">
              <div className="text-xs text-gray-300 mb-1">Prize</div>
              <div className="text-sm font-medium text-blue-400">₹2,07,500</div>
            </div>
          </div>
        </div>

        {/* First Place */}
        <div className="w-full md:w-1/3">
          <div className="bg-gradient-to-b from-amber-900/50 to-amber-700/30 rounded-lg p-5 text-center border border-amber-500/30 shadow-lg transform md:-translate-y-4 h-full flex flex-col">
            <div className="text-2xl font-bold text-amber-300 mb-2">🥇 1st Place</div>
            <div className="text-base font-medium text-white">{hackathon?.team?.name || 'CodeCrafters'}</div>
            <div className="text-sm text-gray-300 mb-3">AI Innovation Solution</div>
            <div className="mt-auto">
              <div className="text-xs text-gray-300 mb-1">Grand Prize</div>
              <div className="text-lg font-bold text-amber-300">₹4,15,000</div>
            </div>
          </div>
        </div>

        {/* Third Place */}
        <div className="w-full md:w-1/4">
          <div className="bg-gray-700 rounded-lg p-4 text-center h-full flex flex-col">
            <div className="text-xl font-medium text-white mb-2">🥉 3rd Place</div>
            <div className="text-sm font-medium text-white">EcoTech Solutions</div>
            <div className="text-xs text-gray-400 mb-3">Sustainable Energy Monitor</div>
            <div className="mt-auto">
              <div className="text-xs text-gray-300 mb-1">Prize</div>
              <div className="text-sm font-medium text-blue-400">₹83,000</div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Team's Result */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Team's Result</h2>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="text-lg text-gray-300">{hackathon?.team?.name || 'CodeCrafters'}</div>
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-600/30 text-yellow-300 border border-yellow-500/30">
              1st Place
            </div>
          </div>
          <div className="text-sm text-gray-400 italic mb-3 mt-2">
            Judge's feedback: "Outstanding solution with remarkable technical implementation and innovation! Your approach to solving the challenge was creative and your execution was flawless. Congratulations on an exceptional project."
          </div>

          {/* Prize Section */}
          <div className="mt-4 mb-5 bg-indigo-900/20 rounded-lg p-4 border border-indigo-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-indigo-300 mb-1">🏆 1st Place Prize</div>
                <div className="text-2xl font-bold text-white">₹4,15,000 INR</div>

                {/* Prize Claim Status */}
                {prizeClaimed && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-600/30">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Claimed
                    </div>
                    {renderPaymentStatusBadge()}
                  </div>
                )}
              </div>

              {/* Claim Prize Button */}
              {!prizeClaimed ? (
                <button
                  onClick={handlePrizePayment}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Claim Prize
                </button>
              ) : (
                <button
                  onClick={handlePrizePayment}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
              )}
            </div>

            {/* Payment Details (shows only when processing or completed) */}
            {prizeClaimed && paymentStatus !== 'not_started' && (
              <div className="mt-3 border-t border-indigo-500/20 pt-3">
                <div className="text-xs text-gray-400 mb-2">Payment Information</div>
                <div className="bg-indigo-900/10 p-3 rounded-lg border border-indigo-500/10">
                  <div className="flex flex-col text-sm space-y-2">
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-medium ${paymentStatus === 'processing' ? 'text-yellow-300' : 'text-green-300'}`}>
                        {paymentStatus === 'processing' ? (
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Payment Complete
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center">
                      <span className="text-gray-400">Recipient:</span>
                      <span className="text-gray-300 overflow-hidden text-ellipsis">{paymentData.fullName}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center">
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="flex items-center text-gray-300">
                        {paymentData.paymentMethod === 'upi' ? (
                          <>
                            <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">UPI Transfer</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                            <span className="truncate">Bank Transfer</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center">
                      <span className="text-gray-400">Account Details:</span>
                      <span className="text-gray-300 truncate">
                        {paymentData.paymentMethod === 'upi'
                          ? `UPI: ${paymentData.upiId?.substring(0, 3)}...`
                          : `A/C: ****${paymentData.accountNumber?.substring(paymentData.accountNumber.length - 4)}`
                        }
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center">
                      <span className="text-gray-400">Reference ID:</span>
                      <span className="font-mono text-indigo-300 truncate">HCK-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span>
                    </div>

                    {paymentStatus === 'completed' && (
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <span className="text-gray-400">Completed On:</span>
                        <span className="text-gray-300">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={handleViewDetailedFeedback}
              className="text-xs px-3 py-1.5 border border-brand-500/40 text-brand-300 rounded hover:bg-brand-900/30 transition-colors"
            >
              View Detailed Feedback
            </button>
            <button
              onClick={handlePreviewCertificate}
              className="text-xs px-3 py-1.5 bg-brand-700 text-white rounded hover:bg-brand-900 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              View Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Category Awards */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Category Awards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            <div className="text-sm font-medium text-indigo-400 mb-1">Best Technical Implementation</div>
            <div className="text-xs text-white">{hackathon?.team?.name || 'CodeCrafters'}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            <div className="text-sm font-medium text-indigo-400 mb-1">Most Innovative Solution</div>
            <div className="text-xs text-white">{hackathon?.team?.name || 'CodeCrafters'}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            <div className="text-sm font-medium text-indigo-400 mb-1">Best User Experience</div>
            <div className="text-xs text-white">Innovation Hackers</div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Complete Leaderboard</h3>
        <div className="overflow-hidden rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400">Rank</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400">Team</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400">Project</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-400">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800/30">
              <tr className="bg-blue-900/20">
                <td className="px-3 py-2 whitespace-nowrap text-xs text-amber-300">1</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-amber-300">{hackathon?.team?.name || 'CodeCrafters'} (Your Team)</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">AI Innovation Solution</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-right text-amber-300">95</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">2</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-white">DataVision Team</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">Smart City Traffic Management</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-right text-white">93</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">3</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-white">Innovation Hackers</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">AI-Powered Healthcare Assistant</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-right text-white">89</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">4</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-white">EcoTech Solutions</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">Sustainable Energy Monitor</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-right text-white">87</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">5</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-white">Tech Wizards</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">Remote Education Platform</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-right text-white">82</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        Thank you for participating in the {hackathon?.title || 'AI Innovation Challenge'}!<br />
        See you at the next hackathon!
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        feedback={hackathon?.detailedFeedback || "Detailed feedback: Your team's solution demonstrated exceptional innovation in approach and problem-solving methods. The technical implementation was solid with clean code architecture. Areas for improvement include the user interface design which could be more intuitive, and considering scalability factors for larger datasets. Overall, very impressive work!"}
      />

      {/* Certificate Preview Modal */}
      <CertificatePreviewModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        certificate={certificateUrl}
        onDownload={handleDownloadCertificate}
        onSaveToProfile={handleSaveCertificateToProfile}
      />

      {/* Always render the prize modal regardless of hackathon data */}
      <PrizePaymentModal
        isOpen={showPrizeModal}
        onClose={() => setShowPrizeModal(false)}
        prizeDetails={{
          amount: 415000,
          currency: 'INR',
          name: '1st Place',
          hackathonId: hackathon?.id || 'hackathon-123'
        }}
        onSubmit={handlePrizePaymentSubmit}
      />
    </div>
  );
};

export default ResultsView; 