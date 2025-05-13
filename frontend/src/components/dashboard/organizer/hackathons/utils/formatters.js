// Utility functions for formatting data in hackathon management

/**
 * Format a date string into a more readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Format a number with commas for thousands
 * @param {number} num - The number to format
 * @returns {string} Formatted number with commas
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  
  // If it's already a string with non-numeric characters, return as is
  if (typeof num === 'string' && /[^0-9.]/.test(num)) {
    return num;
  }
  
  try {
    return Number(num).toLocaleString();
  } catch (error) {
    console.error("Error formatting number:", error);
    return String(num);
  }
};

/**
 * Get the appropriate status badge styling
 * @param {string} status - The status string (e.g., 'live', 'draft', 'completed')
 * @returns {string} CSS classes for the badge
 */
export const getStatusBadge = (status) => {
  const statusClasses = {
    live: "bg-green-900/60 text-green-400 border border-green-700/50",
    active: "bg-green-900/60 text-green-400 border border-green-700/50",
    draft: "bg-yellow-900/60 text-yellow-400 border border-yellow-700/50",
    upcoming: "bg-yellow-900/60 text-yellow-400 border border-yellow-700/50",
    completed: "bg-blue-900/60 text-blue-400 border border-blue-700/50",
    rejected: "bg-red-900/60 text-red-400 border border-red-700/50",
    archived: "bg-gray-900/60 text-gray-400 border border-gray-700/50",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-900/60 text-gray-400 border border-gray-700/50"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}; 