import React, { useState, useEffect } from 'react';

const TransactionFilter = ({ transactions, onFilterChange, isOpen, onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate month and year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Control modal visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Delay setting isAnimating to true to ensure DOM is ready
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      // Wait for animation to finish before hiding the modal
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [isOpen]);

  // Handle month and year selection
  const handleMonthYearSelect = () => {
    if (monthFilter && yearFilter) {
      // Calculate start and end date for selected month/year
      const start = new Date(`${yearFilter}-${monthFilter}-01`);
      const lastDay = new Date(yearFilter, parseInt(monthFilter), 0).getDate();
      const end = new Date(`${yearFilter}-${monthFilter}-${lastDay}`);
      
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
      
      // Reset month and year filters after applying
      setMonthFilter('');
      setYearFilter('');
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setType('all');
    setMonthFilter('');
    setYearFilter('');
  };

  // Apply all active filters and close modal
  const applyFilters = () => {
    onFilterChange({
      type,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    });
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden z-50" onClick={onClose}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity" 
             onClick={onClose}
             style={{ opacity: isAnimating ? 1 : 0 }}></div>
        
        <div className="fixed inset-y-0 right-0 max-w-full flex" onClick={e => e.stopPropagation()}>
          <div className={`w-screen max-w-md transform transition-transform duration-300 ease-in-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col bg-gray-900 shadow-xl overflow-y-auto">
              {/* Header */}
              <div className="px-4 py-6 sm:px-6 border-b border-gray-700">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-white">
                    Filter Transactions
                  </h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      onClick={onClose}
                      className="bg-gray-900 rounded-md text-gray-400 hover:text-white focus:outline-none"
                    >
                      <span className="sr-only">Close panel</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative flex-1 px-4 sm:px-6 py-6 space-y-6">
                {/* Transaction Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                    Transaction Type
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500/30"
                  >
                    <option value="all">All Transactions</option>
                    <option value="deposit">Deposits</option>
                    <option value="withdrawal">Withdrawals</option>
                    <option value="fee">Fees</option>
                  </select>
                </div>
                
                {/* Date Range */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-300">Date Range</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500/30"
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500/30"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Month/Year Selection */}
                <div className="border-t border-gray-700 pt-6 space-y-4">
                  <h4 className="text-sm font-medium text-gray-300">Filter by Month/Year</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="monthFilter" className="block text-sm font-medium text-gray-300 mb-1">
                        Month
                      </label>
                      <select
                        id="monthFilter"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500/30"
                      >
                        <option value="">Select Month</option>
                        {months.map(month => (
                          <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="yearFilter" className="block text-sm font-medium text-gray-300 mb-1">
                        Year
                      </label>
                      <select
                        id="yearFilter"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500/30"
                      >
                        <option value="">Select Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleMonthYearSelect}
                    disabled={!monthFilter || !yearFilter}
                    className="mt-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed w-full"
                  >
                    Apply Month/Year
                  </button>
                </div>
                
                <div className="flex justify-end mt-4">
                  <div className="text-xs text-gray-400 italic mr-2 self-center">
                    {transactions.length} transactions total
                    {(startDate || endDate || type !== 'all') && ' (filtered)'}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 px-4 py-4 flex justify-between border-t border-gray-700">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-md transition-colors focus:outline-none"
                >
                  Reset Filters
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors focus:outline-none"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilter; 