import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

function TimelineSection({ timeline }) {
  const [activePhaseIndex, setActivePhaseIndex] = useState(-1);
  const [timeRemaining, setTimeRemaining] = useState({});

  // Calculate overall progress and find active phase
  useEffect(() => {
    const calculateTimeAndProgress = () => {
      // For demonstration purposes, manually set active phase
      const hackathonIndex = timeline.findIndex(phase => phase.phase === "Hackathon");
      if (hackathonIndex !== -1) {
        setActivePhaseIndex(hackathonIndex);
        setTimeRemaining({ days: 2, hours: 18, minutes: 45 });
      }

      // Also setup the upcoming phase info
      const judgingIndex = timeline.findIndex(phase => phase.phase === "Judging");
      if (judgingIndex !== -1 && hackathonIndex === -1) {
        setActivePhaseIndex(-1);
        setTimeRemaining({
          days: 3,
          hours: 6,
          minutes: 22,
          isUpcoming: true,
          nextPhaseIndex: judgingIndex
        });
      }

      // Original logic (commented out for demo)
      /*
      const now = new Date();
      const sortedEvents = [...timeline].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      
      if (!sortedEvents.length) return;
      
      // Find active phase
      let foundActive = false;
      sortedEvents.forEach((phase, index) => {
        const startDate = new Date(phase.startDate);
        const endDate = new Date(phase.endDate);
        
        if (now >= startDate && now <= endDate) {
          setActivePhaseIndex(index);
          foundActive = true;
          
          // Calculate remaining time for active phase
          const diff = endDate - now;
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          setTimeRemaining({ days, hours, minutes });
        }
      });
      
      if (!foundActive && sortedEvents.length > 0) {
        // If no active phase but future phases exist
        const firstFuturePhase = sortedEvents.find(phase => new Date(phase.startDate) > now);
        if (firstFuturePhase) {
          const index = sortedEvents.indexOf(firstFuturePhase);
          // Set to -1 but store the next upcoming phase index
          setActivePhaseIndex(-1);
          
          // Calculate time until next phase
          const diff = new Date(firstFuturePhase.startDate) - now;
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          setTimeRemaining({ days, hours, minutes, isUpcoming: true, nextPhaseIndex: index });
        }
      }
      */
    };

    calculateTimeAndProgress();

    // Update countdown every minute
    const interval = setInterval(calculateTimeAndProgress, 60000);
    return () => clearInterval(interval);
  }, [timeline]);

  // Calculate overall hackathon progress
  const calculateOverallProgress = () => {
    if (!timeline.length) return 0;

    const now = new Date();
    const sortedEvents = [...timeline].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    const startDate = new Date(sortedEvents[0].startDate);
    const endDate = new Date(sortedEvents[sortedEvents.length - 1].endDate);
    const totalDuration = endDate - startDate;

    if (now < startDate) return 0;
    if (now > endDate) return 100;

    const elapsed = now - startDate;
    return Math.min(Math.round((elapsed / totalDuration) * 100), 100);
  };

  const progress = calculateOverallProgress();

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format date for short display (MM/DD)
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status of a phase
  const getPhaseStatus = (phase) => {
    // For demo/testing purposes, override the real status calculation
    // This ensures we can see active and upcoming phases in the UI
    if (phase.phase === "Registration" || phase.phase === "Kickoff Webinar") {
      return 'completed';
    } else if (phase.phase === "Hackathon") {
      return 'active';
    } else if (phase.phase === "Judging") {
      return 'upcoming';
    }

    // Original logic (comment out for demo)
    // const now = new Date();
    // const startDate = new Date(phase.startDate);
    // const endDate = new Date(phase.endDate);

    // if (now > endDate) return 'completed';
    // if (now >= startDate && now <= endDate) return 'active';
    // return 'upcoming';
  };

  // Calculate phase progress percentage
  const calculatePhaseProgress = (phase) => {
    // For demo purposes, show 60% progress for active phases
    if (getPhaseStatus(phase) === 'active') {
      return 60;
    }

    // Original logic (commented out for demo)
    // const now = new Date();
    // const startDate = new Date(phase.startDate);
    // const endDate = new Date(phase.endDate);

    // if (now < startDate) return 0;
    // if (now > endDate) return 100;

    // const totalDuration = endDate - startDate;
    // const elapsed = now - startDate;
    // return Math.min(Math.round((elapsed / totalDuration) * 100), 100);

    return getPhaseStatus(phase) === 'completed' ? 100 : 0;
  };

  if (!timeline || !timeline.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No timeline information available for this hackathon.</p>
      </div>
    );
  }

  // Sort timeline by date
  const sortedTimeline = [...timeline].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Event Timeline</h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 sm:left-8 top-2 bottom-2 w-0.5 bg-indigo-900/70"></div>

        {/* Timeline items */}
        <div className="space-y-8">
          {sortedTimeline.map((phase, index) => (
            <div key={index} className="relative pl-14 sm:pl-20">
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 bg-indigo-800 border-4 border-indigo-900 rounded-full h-10 w-10 flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-indigo-300" />
              </div>

              {/* Content */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-indigo-900/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-bold text-indigo-400">{phase.phase}</h3>
                  <div className="text-sm text-gray-400 mt-1 sm:mt-0">
                    {new Date(phase.startDate).toLocaleDateString()}
                    {phase.endDate && phase.endDate !== phase.startDate &&
                      ` - ${new Date(phase.endDate).toLocaleDateString()}`
                    }
                  </div>
                </div>
                {phase.description && (
                  <p className="text-gray-300 text-sm">{phase.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimelineSection; 