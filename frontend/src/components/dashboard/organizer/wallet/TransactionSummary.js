import React, { useState, useEffect } from 'react';

const TransactionSummary = ({ transactions, formatCurrency }) => {
  const [summary, setSummary] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalFees: 0,
    monthlyBreakdown: {},
    recentActivity: []
  });

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      return;
    }

    // Calculate total deposits, withdrawals, and fees
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalFees = 0;
    const monthlyData = {};
    
    // Process all transactions
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();
      const monthYearKey = `${transactionYear}-${transactionMonth + 1}`;
      
      // Calculate monthly data
      if (!monthlyData[monthYearKey]) {
        monthlyData[monthYearKey] = {
          deposits: 0,
          withdrawals: 0,
          fees: 0,
          month: transactionMonth + 1,
          year: transactionYear,
          label: transactionDate.toLocaleString('default', { month: 'long' }) + ' ' + transactionYear
        };
      }
      
      if (transaction.type === 'deposit') {
        totalDeposits += transaction.amount;
        monthlyData[monthYearKey].deposits += transaction.amount;
      } else if (transaction.type === 'withdrawal') {
        totalWithdrawals += transaction.amount;
        monthlyData[monthYearKey].withdrawals += transaction.amount;
        
        if (transaction.fee) {
          totalFees += transaction.fee;
          monthlyData[monthYearKey].fees += transaction.fee;
        }
      } else if (transaction.type === 'fee') {
        totalFees += transaction.amount;
        monthlyData[monthYearKey].fees += transaction.amount;
      }
    });
    
    // Convert monthly data object to sorted array (most recent first)
    const monthlyBreakdown = Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
    
    // Get most recent 5 transactions
    const recentActivity = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    setSummary({
      totalDeposits,
      totalWithdrawals,
      totalFees,
      monthlyBreakdown,
      recentActivity
    });
  }, [transactions]);

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Transaction Summary
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Deposits */}
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl border border-green-700/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-green-400">Total Deposits</h4>
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalDeposits)}</p>
        </div>
        
        {/* Total Withdrawals */}
        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl border border-red-700/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-red-400">Total Withdrawals</h4>
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalWithdrawals)}</p>
        </div>
        
        {/* Total Fees */}
        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl border border-yellow-700/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-yellow-400">Total Fees</h4>
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalFees)}</p>
        </div>
      </div>
      
      {summary.monthlyBreakdown.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-700/30">
            <h4 className="text-sm font-medium text-white">Monthly Breakdown</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Deposits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Withdrawals</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {summary.monthlyBreakdown.map((month, index) => (
                  <tr key={`${month.year}-${month.month}`} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-300">{month.label}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-green-400">{formatCurrency(month.deposits)}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-red-400">{formatCurrency(month.withdrawals)}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-yellow-400">{formatCurrency(month.fees)}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                      <span className={month.deposits > (month.withdrawals + month.fees) ? 'text-green-400' : 'text-red-400'}>
                        {formatCurrency(month.deposits - month.withdrawals - month.fees)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionSummary; 