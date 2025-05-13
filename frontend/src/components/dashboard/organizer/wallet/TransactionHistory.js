import React, { useState, useEffect } from 'react';
import TransactionFilter from './TransactionFilter';

const TransactionHistory = ({ 
  transactions, 
  formatCurrency,
  formatDate,
  getStatusColor,
  getTransactionTypeIcon,
  onViewTransactionDetails
}) => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ 
    type: 'all', 
    startDate: null, 
    endDate: null 
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Update filtered transactions when transactions or filter options change
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by type
    if (filterOptions.type !== 'all') {
      filtered = filtered.filter(t => t.type === filterOptions.type);
    }
    
    // Filter by date range
    if (filterOptions.startDate) {
      const startDate = new Date(filterOptions.startDate);
      filtered = filtered.filter(t => new Date(t.date) >= startDate);
    }
    
    if (filterOptions.endDate) {
      const endDate = new Date(filterOptions.endDate);
      // Add one day to include the end date fully
      endDate.setDate(endDate.getDate() + 1);
      filtered = filtered.filter(t => new Date(t.date) < endDate);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredTransactions(filtered);
  }, [transactions, filterOptions]);

  // Handle filter changes from the TransactionFilter component
  const handleFilterChange = (newFilterOptions) => {
    setFilterOptions(newFilterOptions);
  };

  // Get filter badge text to display active filters
  const getFilterBadgeText = () => {
    const parts = [];
    
    if (filterOptions.type !== 'all') {
      parts.push(filterOptions.type.charAt(0).toUpperCase() + filterOptions.type.slice(1) + 's');
    }
    
    if (filterOptions.startDate && filterOptions.endDate) {
      const start = new Date(filterOptions.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const end = new Date(filterOptions.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      parts.push(`${start} - ${end}`);
    } else if (filterOptions.startDate) {
      const start = new Date(filterOptions.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      parts.push(`From ${start}`);
    } else if (filterOptions.endDate) {
      const end = new Date(filterOptions.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      parts.push(`Until ${end}`);
    }
    
    return parts.join(', ');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Transaction History
        </h3>
        
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center text-sm px-3 py-1.5 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      </div>

      {/* Active Filter Indicators */}
      {(filterOptions.type !== 'all' || filterOptions.startDate || filterOptions.endDate) && (
        <div className="mb-4 flex flex-wrap items-center">
          <span className="text-sm text-gray-400 mr-2">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            <div className="bg-gray-800/80 text-indigo-300 text-xs px-3 py-1 rounded-full border border-indigo-500/30 flex items-center">
              {getFilterBadgeText()}
              <button 
                onClick={() => setFilterOptions({ type: 'all', startDate: null, endDate: null })}
                className="ml-2 text-indigo-400 hover:text-indigo-300"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Transaction Filter Modal */}
      <TransactionFilter 
        transactions={transactions}
        onFilterChange={handleFilterChange}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
      
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-700/30">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                        {transaction.status === 'completed' ? (
                          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          getTransactionTypeIcon(transaction.type)
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{transaction.description}</div>
                        <div className="text-sm text-gray-400">{transaction.hackathonName || 'General'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${transaction.type === 'deposit' ? 'text-green-400' : transaction.type === 'withdrawal' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                    {transaction.fee > 0 && (
                      <div className="text-xs text-gray-400">
                        Fee: {formatCurrency(transaction.fee)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {transaction.method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'completed' ? (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      ) : (
                        transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onViewTransactionDetails(transaction)}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-end"
                    >
                      <span className="mr-1">View Details</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                    <div className="mt-1 flex justify-end gap-2">
                      {transaction.status === 'completed' && (
                        <span className="text-xs text-green-400 flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                          Success
                        </span>
                      )}
                      {transaction.status === 'pending' && (
                        <span className="text-xs text-yellow-400 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {transaction.type === 'withdrawal' ? 'Est. ' + formatDate(transaction.estimatedCompletion, true) : 'Processing'}
                        </span>
                      )}
                      {transaction.reference && (
                        <span className="text-xs text-gray-400 truncate max-w-[100px]" title={transaction.reference}>
                          Ref: {transaction.reference}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-300">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterOptions.type === 'all' 
                ? 'No transactions match the current filters.' 
                : `No ${filterOptions.type} transactions found for the selected criteria.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory; 