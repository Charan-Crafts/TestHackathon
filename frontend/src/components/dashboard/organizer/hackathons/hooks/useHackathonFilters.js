import { useState, useMemo } from 'react';

/**
 * Custom hook for managing hackathon filtering and searching
 * @param {Array} hackathons - Array of hackathon objects
 * @returns {Object} Filter state and filtered hackathons
 */
const useHackathonFilters = (hackathons) => {
  const [filter, setFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Calculate stats from hackathons data
  const stats = useMemo(() => {
    // Calculate proper numerical values for participants
    const liveHackathons = hackathons.filter(h => h.status === 'live');
    const draftHackathons = hackathons.filter(h => h.status === 'draft');
    const rejectedHackathons = hackathons.filter(h => h.status === 'rejected');
    
    // Function to extract numeric value from participant string or number
    const extractParticipantCount = (value) => {
      if (!value) return 0;
      
      if (typeof value === 'string') {
        // Handle strings like "2,500+" by removing commas and plus signs
        return parseInt(value.replace(/,|\+/g, ''), 10) || 0;
      }
      
      return value || 0;
    };

    // Calculate total participants - ONLY from LIVE hackathons
    const participantsTotal = liveHackathons.reduce((sum, h) => {
      let participantValue = 0;
      
      // Try to extract from stats.participants first, then fall back to h.participants
      if (h.stats && h.stats.participants) {
        participantValue = extractParticipantCount(h.stats.participants);
      } else if (h.participants) {
        participantValue = extractParticipantCount(h.participants);
      }
      
      return sum + participantValue;
    }, 0);

    // Calculate team and submission totals - ONLY from LIVE hackathons
    const teamsTotal = liveHackathons.reduce((sum, h) => {
      return sum + (h.stats?.teams || 0);
    }, 0);
    
    const submissionsTotal = liveHackathons.reduce((sum, h) => {
      return sum + (h.stats?.submissions || 0);
    }, 0);

    return {
      total: hackathons.length,
      live: liveHackathons.length,
      draft: draftHackathons.length,
      rejected: rejectedHackathons.length,
      totalParticipants: participantsTotal,
      totalTeams: teamsTotal,
      totalSubmissions: submissionsTotal,
    };
  }, [hackathons]);

  // Filter hackathons based on selected filter and search text
  const filteredHackathons = useMemo(() => 
    hackathons.filter(hackathon => {
      const matchesFilter = filter === 'all' || hackathon.status === filter;
      const matchesSearch = !searchText || 
        hackathon.name.toLowerCase().includes(searchText.toLowerCase()) ||
        hackathon.description.toLowerCase().includes(searchText.toLowerCase());
      return matchesFilter && matchesSearch;
    }), 
    [hackathons, filter, searchText]
  );

  return {
    // Filter state
    filter,
    setFilter,
    searchText,
    setSearchText,
    
    // Data
    stats,
    filteredHackathons
  };
};

export default useHackathonFilters; 