import React from 'react';
import { formatDate } from './HackathonData';

const Timeline = ({ phases, currentPhaseId, selectedPhaseId, onPhaseClick }) => {
  // Sort phases by order
  const sortedPhases = [...phases].sort((a, b) => a.order - b.order);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Hackathon Timeline</h3>
      <div className="relative">
        {/* Horizontal line */}
        <div className="absolute top-6 inset-x-0 h-0.5 bg-gray-700" />

        {/* Timeline nodes */}
        <div className="relative flex justify-between">
          {sortedPhases.map((phase, index) => {
            // Determine status
            const isCompleted = phase.status === 'completed';
            const isActive = phase.id === currentPhaseId;
            // const isUpcoming = phase.status === 'upcoming';
            const isSelected = phase.id === selectedPhaseId;

            // Determine color
            let statusColor = 'gray';
            if (isCompleted) statusColor = 'green';
            if (isActive) statusColor = 'brand';

            // Determine icon
            let icon = (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            );

            if (isCompleted) {
              icon = (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              );
            }

            // Add clickable functionality to completed and active phases
            const isClickable = isCompleted || isActive;
            const cursorClass = isClickable ? 'cursor-pointer' : 'cursor-default';
            const hoverClass = isClickable ? `hover:bg-${statusColor}-600/50` : '';

            return (
              <div key={phase.id} className="flex flex-col items-center relative">
                <div
                  className={`z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isSelected
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/30 scale-110'
                      : isActive
                        ? 'bg-brand-700 text-white ring-4 ring-brand-700/30'
                        : isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                    } ${cursorClass} ${hoverClass}`}
                  onClick={() => isClickable && onPhaseClick && onPhaseClick(phase)}
                  title={isClickable ? `View ${phase.name} submissions` : phase.name}
                >
                  {icon}
                </div>
                <div className={`mt-2 text-center w-24 ${isSelected
                    ? 'text-indigo-400 font-medium scale-105'
                    : isActive
                      ? 'text-brand-300'
                      : isCompleted
                        ? 'text-green-400'
                        : 'text-gray-500'
                  }`}>
                  <div className="text-[10px] font-medium">{phase.name}</div>
                  <div className="text-[9px] mt-0.5">{formatDate(phase.startDate)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current phase details */}
      <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
        <div className="flex items-start">
          <div className="flex-grow">
            <h4 className="text-sm font-medium text-white">
              {selectedPhaseId ? 'Selected: ' : 'Current: '}
              {sortedPhases.find(p => p.id === (selectedPhaseId || currentPhaseId)).name}
            </h4>
            <p className="mt-1 text-xs text-gray-400">
              {sortedPhases.find(p => p.id === (selectedPhaseId || currentPhaseId)).description}
            </p>
            <div className="mt-2 text-[11px] text-gray-500">
              {formatDate(sortedPhases.find(p => p.id === (selectedPhaseId || currentPhaseId)).startDate)} -
              {formatDate(sortedPhases.find(p => p.id === (selectedPhaseId || currentPhaseId)).endDate)}
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${selectedPhaseId ? 'bg-indigo-900/40 text-indigo-400' : 'bg-brand-900/40 text-brand-300'
              }`}>
              {selectedPhaseId ? 'Selected' : 'Active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline; 