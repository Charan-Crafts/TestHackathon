import React, { useState } from 'react';
import SocialShare from '../../../components/common/SocialShare';

function HackathonHeader({ hackathon, onRegister, onWatchlist, isWatchlisted }) {
  const [showShareModal, setShowShareModal] = useState(false);

  // Toggle share modal
  const toggleShareModal = () => setShowShareModal(!showShareModal);

  // Fallback for missing hackathon
  if (!hackathon) {
    return (
      <div className="relative bg-gradient-to-br from-blue-900 to-gray-900 border-b border-gray-800 p-8 text-center text-white">
        <h1 className="text-2xl font-bold">Hackathon Not Found</h1>
        <p className="mt-2">The requested hackathon could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-blue-900 to-gray-900 border-b border-gray-800">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={hackathon?.bannerImage || hackathon?.logoUrl || '/default-banner.png'}
          alt={hackathon?.title || 'Hackathon Banner'}
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-gray-900/90"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Desktop buttons - positioned in top right corner */}
        <div className="hidden md:flex absolute top-4 right-4 sm:right-6 lg:right-8 gap-3 z-10">
          <button
            onClick={onWatchlist}
            className={`flex items-center gap-2 px-4 py-2 ${isWatchlisted ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded-lg border ${isWatchlisted ? 'border-yellow-500' : 'border-gray-700'}`}
          >
            <svg className="h-5 w-5" fill={isWatchlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>{isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}</span>
          </button>
          <button
            onClick={toggleShareModal}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share</span>
          </button>
          <button
            onClick={onRegister}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Register
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
          {/* Logo */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-blue-500/30 shadow-lg shadow-blue-500/20">
            <img
              src={hackathon.logoUrl || '/default-logo.png'}
              alt={`${hackathon.title || 'Hackathon'} logo`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title and Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              {hackathon.title || 'Untitled Hackathon'}
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mb-3 sm:mb-4">
              {hackathon.subtitle || ''}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 gap-y-2 text-xs sm:text-sm">
              <div className="flex items-center text-gray-400">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="whitespace-nowrap">Organized by {hackathon.organizer}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="whitespace-nowrap">{hackathon.participants}+ Participants</span>
              </div>
              <div className="flex items-center text-gray-400">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="whitespace-nowrap">{hackathon.prizeTotalAmount} Prize Pool</span>
              </div>

              {/* Location badge */}
              <div className="flex items-center text-gray-400 ml-0 md:ml-auto">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={`px-2 py-0.5 rounded-full text-xs ${hackathon.location.type === "hybrid"
                  ? "bg-purple-900/30 text-purple-300 border border-purple-500/30"
                  : hackathon.location.type === "online"
                    ? "bg-green-900/30 text-green-300 border border-green-500/30"
                    : "bg-blue-900/30 text-blue-300 border border-blue-500/30"
                  }`}>
                  {hackathon.location.type === "hybrid"
                    ? "Hybrid"
                    : hackathon.location.type === "online"
                      ? "Virtual"
                      : "In-Person"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed buttons - only visible on sm and down */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex bg-gradient-to-t from-gray-900 to-gray-900/90 p-3 border-t border-gray-800">
        <button
          onClick={onWatchlist}
          className={`flex-1 flex items-center justify-center gap-2 py-3 ${isWatchlisted ? 'bg-yellow-600' : 'bg-gray-800'} text-white rounded-l-lg border ${isWatchlisted ? 'border-yellow-500' : 'border-gray-700'}`}
        >
          <svg className="h-5 w-5" fill={isWatchlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span>{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
        </button>
        <button
          onClick={toggleShareModal}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 text-white border border-gray-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share</span>
        </button>
        <button
          onClick={onRegister}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-r-lg font-medium"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Register</span>
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          aria-labelledby="share-modal"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            // Close the modal when clicking on the background overlay
            setShowShareModal(false);
          }}
        >
          {/* Overlay */}
          <div className="fixed inset-0 bg-gray-900/80 transition-opacity"></div>

          {/* Mobile slide-up, desktop/tablet centered modal */}
          <div className="flex sm:items-center justify-center h-full">
            <div className="sm:flex-none relative w-full sm:max-w-md" onClick={(e) => e.stopPropagation()}>
              {/* Modal for mobile - slides up from bottom */}
              <div className="sm:hidden w-full absolute bottom-0 rounded-t-xl bg-gray-800 shadow-xl animate-slide-up">
                {/* Mobile header with drag handle */}
                <div className="w-full flex flex-col">
                  <div className="w-full flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
                    <h3 className="text-lg font-medium text-white">Share</h3>
                    <button
                      onClick={() => setShowShareModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Mobile content */}
                <div className="p-5">
                  <SocialShare
                    title={hackathon.title}
                    description={hackathon.subtitle}
                    url={window.location.href}
                  />
                </div>
              </div>

              {/* Modal for tablet/desktop - centered, no animation */}
              <div className="hidden sm:block w-full rounded-2xl bg-gray-800 shadow-xl">
                {/* Desktop/tablet header */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-gray-700">
                  <h3 className="text-xl font-medium text-white">Share Hackathon</h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Desktop/tablet content */}
                <div className="p-6">
                  <SocialShare
                    title={hackathon.title}
                    description={hackathon.subtitle}
                    url={window.location.href}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HackathonHeader; 