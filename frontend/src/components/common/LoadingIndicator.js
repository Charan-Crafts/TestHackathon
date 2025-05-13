import React from 'react';

/**
 * LoadingIndicator component with three variants:
 * 1. skeleton - Shows placeholder content that resembles the page layout (default)
 * 2. spinner - Shows a simple loading spinner centered on the page
 * 3. scanning - Shows a "scanning database" style indicator with customizable message and skeleton type
 */
const LoadingIndicator = ({ 
  type = 'skeleton', 
  customSkeleton = null,
  message = 'Please wait...',
  title = '',
  skeletonType = 'grid' // 'grid', 'list', 'table', or 'none'
}) => {
  // Simple spinner loading
  if (type === 'spinner') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  // Scanning database style indicator (for listings)
  if (type === 'scanning') {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Loading header - Only show if title is not empty */}
          {title && title.trim() !== '' && (
            <div className="text-center mb-12 animate-pulse">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 relative inline-block">
                <span className="relative z-10">{title}</span>
                <span className="absolute -left-2 bottom-0 w-full h-3 bg-pink-600 opacity-50 transform skew-x-12 z-0"></span>
              </h1>
            </div>
          )}
          
          {/* Central loading spinner */}
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <div className="absolute inset-0 border-4 border-cyan-500 border-opacity-20"></div>
              <div className="absolute inset-2 border-4 border-t-transparent border-cyan-500 animate-spin"></div>
            </div>
            <p className="mt-6 text-cyan-500 font-mono text-sm sm:text-base">{message}</p>
          </div>
          
          {/* Conditionally render skeleton based on skeletonType */}
          {skeletonType === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden h-80">
                  <div className="h-40 bg-gray-700/50"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-700/70 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-700/70 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-700/70 rounded mb-4 w-5/6"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-700/70 rounded w-24"></div>
                      <div className="h-8 bg-gray-700/70 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {skeletonType === 'list' && (
            <div className="space-y-4 animate-pulse">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-700/70 mr-4"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-700/70 rounded mb-2 w-48"></div>
                      <div className="h-4 bg-gray-700/70 rounded w-32"></div>
                    </div>
                    <div className="h-8 w-24 bg-gray-700/70 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {skeletonType === 'table' && (
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden animate-pulse">
              {/* Table header */}
              <div className="bg-gray-700/70 p-4 grid grid-cols-6 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-5 bg-gray-600/70 rounded"></div>
                ))}
              </div>
              
              {/* Table rows */}
              <div className="divide-y divide-gray-700/50">
                {[...Array(10)].map((_, rowIndex) => (
                  <div key={rowIndex} className="p-4 grid grid-cols-6 gap-4">
                    {[...Array(6)].map((_, colIndex) => (
                      <div key={colIndex} className="h-4 bg-gray-700/70 rounded"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If custom skeleton is provided, use it
  if (customSkeleton) {
    return (
      <div className="bg-gray-900 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {customSkeleton}
          </div>
        </div>
      </div>
    );
  }

  // Default skeleton loading (based on ProjectDetails.js)
  return (
    <div className="bg-gray-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          {/* Header placeholder */}
          <div className="h-8 bg-gray-700 rounded w-3/12 mb-4"></div>
          
          {/* Banner placeholder */}
          <div className="h-60 bg-gray-700 rounded-xl mb-8"></div>
          
          {/* Tab buttons placeholder */}
          <div className="flex space-x-4 mb-6">
            <div className="h-10 bg-gray-700 rounded-lg w-24"></div>
            <div className="h-10 bg-gray-700 rounded-lg w-24"></div>
            <div className="h-10 bg-gray-700 rounded-lg w-24"></div>
          </div>
          
          {/* Content placeholders */}
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
          
          {/* Two column layout placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="h-64 bg-gray-700 rounded-lg"></div>
            </div>
            <div>
              <div className="h-12 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
              <div className="h-10 bg-gray-700 rounded-lg w-full mb-4"></div>
              <div className="h-10 bg-gray-700 rounded-lg w-full mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator; 