import React, { useState, useEffect } from 'react';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import TransactionHistory from './TransactionHistory';
import TransactionSummary from './TransactionSummary';

const WalletDashboard = ({ user }) => {
  // State for wallet data
  const [balance, setBalance] = useState(12500);
  const [transactions, setTransactions] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  
  // State for modals
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Mock data for transactions
  useEffect(() => {
    // Simulate API call to fetch transaction data
    setTimeout(() => {
      const mockTransactions = [
        {
          id: 'txn_1001',
          type: 'deposit',
          amount: 5000,
          fee: 0,
          date: new Date('2023-06-10T14:30:00'),
          method: 'upi',
          status: 'completed',
          description: 'Hackathon sponsor deposit',
          hackathonName: 'Code for Good 2023',
          reference: 'UPI123456789'
        },
        {
          id: 'txn_1002',
          type: 'withdrawal',
          amount: 1500,
          fee: 30,
          date: new Date('2023-06-02T10:15:00'),
          method: 'bank_transfer',
          status: 'completed',
          description: 'Vendor payment',
          hackathonName: 'Code for Good 2023',
          reference: 'NEFT78901234'
        },
        {
          id: 'txn_1003',
          type: 'deposit',
          amount: 8000,
          fee: 0,
          date: new Date('2023-05-28T09:45:00'),
          method: 'credit_card',
          status: 'completed',
          description: 'Registration fees',
          hackathonName: 'Code for Good 2023',
          reference: 'CCR98765432'
        },
        {
          id: 'txn_1004',
          type: 'withdrawal',
          amount: 2500,
          fee: 50,
          date: new Date('2023-05-20T16:10:00'),
          method: 'bank_transfer',
          status: 'pending',
          description: 'Prize money transfer',
          hackathonName: 'AI Innovation Hack',
          estimatedCompletion: new Date('2023-05-23T16:10:00'),
          reference: 'RTGS45678901'
        },
        {
          id: 'txn_1005',
          type: 'fee',
          amount: 75,
          fee: 0,
          date: new Date('2023-05-15T11:20:00'),
          method: 'platform',
          status: 'completed',
          description: 'Platform service fee',
          hackathonName: 'AI Innovation Hack',
          reference: 'FEE56789012'
        },
        {
          id: 'txn_1006',
          type: 'deposit',
          amount: 10000,
          fee: 0,
          date: new Date('2023-04-28T13:40:00'),
          method: 'bank_transfer',
          status: 'completed',
          description: 'Corporate sponsorship',
          hackathonName: 'AI Innovation Hack',
          reference: 'IMPS67890123'
        },
        {
          id: 'txn_1007',
          type: 'withdrawal',
          amount: 3500,
          fee: 70,
          date: new Date('2023-04-18T15:30:00'),
          method: 'bank_transfer',
          status: 'pending',
          description: 'Catering service payment',
          hackathonName: 'Women in Tech Hackathon',
          estimatedCompletion: new Date('2023-04-21T15:30:00'),
          reference: 'NEFT89012345'
        },
        {
          id: 'txn_1008',
          type: 'deposit',
          amount: 7500,
          fee: 0,
          date: new Date('2023-04-10T09:15:00'),
          method: 'upi',
          status: 'completed',
          description: 'Ticket sales',
          hackathonName: 'Women in Tech Hackathon',
          reference: 'UPI90123456'
        }
      ];

      const mockPendingTransactions = [
        {
          id: 'txn_2001',
          type: 'withdrawal',
          amount: 4500,
          fee: 90,
          date: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
          method: 'bank_transfer',
          status: 'pending',
          description: 'Venue booking payment',
          hackathonName: 'Upcoming Hackathon',
          estimatedCompletion: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
          reference: 'RTGS12345678'
        },
        {
          id: 'txn_2002',
          type: 'deposit',
          amount: 15000,
          fee: 0,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          method: 'bank_transfer',
          status: 'pending',
          description: 'Major sponsor contribution',
          hackathonName: 'Upcoming Hackathon',
          estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
          reference: 'IMPS23456789'
        }
      ];

      setTransactions(mockTransactions);
      setPendingTransactions(mockPendingTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Function to format dates
  const formatDate = (dateString, compact = false) => {
    const date = new Date(dateString);
    if (compact) {
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    }
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + 
           ' at ' + 
           date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  // Get transaction status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10 border border-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20';
      case 'failed':
        return 'text-red-400 bg-red-400/10 border border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border border-gray-400/20';
    }
  };

  // Get transaction type icon
  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'withdrawal':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'fee':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  // Handle viewing transaction details
  const handleViewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  // Handle deposit submission
  const handleDepositSubmit = (depositData) => {
    // Generate a unique transaction ID
    const transactionId = `trx-${Date.now()}`;
    
    // Create the new transaction
    const newTransaction = {
      id: transactionId,
      type: 'deposit',
      amount: depositData.amount,
      currency: 'INR',
      status: 'pending',
      date: depositData.date,
      description: depositData.description || 'Deposit',
      method: depositData.method,
      fee: 0,
      estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
    };
    
    // Add to pending transactions
    setPendingTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    
    // In a real app, update the balance immediately or wait for confirmation
    // For demo, we'll update it immediately
    setBalance(prevBalance => prevBalance + depositData.amount);
  };
  
  // Handle withdrawal submission
  const handleWithdrawSubmit = (withdrawData) => {
    // Generate a unique transaction ID
    const transactionId = `trx-${Date.now()}`;
    
    // Calculate fee (for demonstration)
    const fee = withdrawData.amount > 5000 ? 50 : 25;
    
    // Create the new transaction
    const newTransaction = {
      id: transactionId,
      type: 'withdrawal',
      amount: withdrawData.amount,
      currency: 'INR',
      status: 'pending',
      date: withdrawData.date,
      description: withdrawData.description || 'Withdrawal',
      method: withdrawData.method,
      fee: fee,
      estimatedCompletion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days from now
    };
    
    // Add to pending transactions
    setPendingTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    
    // Update balance (subtract amount + fee)
    setBalance(prevBalance => prevBalance - withdrawData.amount - fee);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading wallet dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <svg className="w-7 h-7 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Organization Wallet
        </h1>
        <p className="text-gray-400">Manage your organization's finances, track transactions, and withdraw funds</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Balance</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {formatCurrency(balance)}
                </h2>
                <p className="text-cyan-400 text-sm mt-1">
                  Available for withdrawal
                </p>
              </div>
              <div className="flex mt-4 md:mt-0">
                <button 
                  onClick={() => setShowDepositModal(true)}
                  className="mr-3 flex items-center px-4 py-2 bg-cyan-600/90 hover:bg-cyan-500/90 text-white rounded-lg shadow transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Deposit
                </button>
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600/90 hover:bg-indigo-500/90 text-white rounded-lg shadow transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                  Withdraw
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 border-t border-gray-700/30 px-6 py-3">
            <div className="flex items-center justify-center text-sm">
              <div className="flex items-center text-gray-400">
                <svg className="w-4 h-4 mr-1 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Standard withdrawal processing time: 3-5 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Transactions Section */}
      {pendingTransactions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending Transactions
          </h3>
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-700/30">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Est. Completion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {pendingTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                            {getTransactionTypeIcon(transaction.type)}
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
                        {formatDate(transaction.estimatedCompletion)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewTransactionDetails(transaction)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Summary Section */}
      <TransactionSummary
        transactions={transactions}
        formatCurrency={formatCurrency}
      />

      {/* Transaction History Section */}
      <TransactionHistory
        transactions={transactions}
        onViewTransactionDetails={handleViewTransactionDetails}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
        getTransactionTypeIcon={getTransactionTypeIcon}
      />

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedTransaction && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTransactionDetails(false)}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl w-full max-w-md border border-gray-800/80 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Colored status header that matches transaction type */}
            <div className={`h-2 w-full ${
              selectedTransaction.status === 'completed'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : selectedTransaction.status === 'pending'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600'
                : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}></div>
            
            {/* Header with type icon */}
            <div className="px-6 pt-6 pb-0 flex justify-between items-start">
              <div className="flex items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  selectedTransaction.type === 'deposit'
                    ? 'bg-green-500/10 text-green-500 ring-1 ring-green-500/30' 
                    : selectedTransaction.type === 'withdrawal'
                    ? 'bg-red-500/10 text-red-500 ring-1 ring-red-500/30'
                    : 'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30'
                }`}>
                  {getTransactionTypeIcon(selectedTransaction.type)}
                </div>
                <div className="ml-3">
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    {selectedTransaction.type}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {formatCurrency(selectedTransaction.amount)}
                    {selectedTransaction.fee > 0 && (
                      <span className="text-xs ml-1 text-gray-500 font-normal">
                        (+{formatCurrency(selectedTransaction.fee)} fee)
                      </span>
                    )}
                  </h3>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <button 
                  onClick={() => setShowTransactionDetails(false)}
                  className="text-gray-500 hover:text-white transition-colors rounded-full hover:bg-gray-800 p-1 -mt-1 -mr-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedTransaction.status === 'completed' 
                    ? 'text-green-400 bg-green-900/30 ring-1 ring-green-400/30' 
                    : selectedTransaction.status === 'pending'
                    ? 'text-amber-400 bg-amber-900/30 ring-1 ring-amber-400/30'
                    : 'text-red-400 bg-red-900/30 ring-1 ring-red-400/30'
                }`}>
                  <span className={`mr-1.5 w-1.5 h-1.5 rounded-full ${
                    selectedTransaction.status === 'completed' ? 'bg-green-400' : 
                    selectedTransaction.status === 'pending' ? 'bg-amber-400 animate-pulse' : 
                    'bg-red-400'
                  }`}></span>
                  {selectedTransaction.status}
                </div>
              </div>
            </div>
            
            {/* Transaction date and ID info */}
            <div className="px-6 pt-4 pb-5">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div>
                  {formatDate(selectedTransaction.date)}
                </div>
                <div className="font-mono">
                  ID: {selectedTransaction.id.substring(0, 8)}
                </div>
              </div>
            </div>
            
            {/* Main details container */}
            <div className="px-6 py-5 bg-gray-800/30 border-y border-gray-800">
              <div className="space-y-4">
                {/* Row 1: Method & Reference */}
                <div className="flex">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Method</div>
                    <div className="text-sm text-white">
                      {selectedTransaction.method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reference</div>
                    <div className="text-sm font-mono text-white truncate" title={selectedTransaction.reference || 'N/A'}>
                      {selectedTransaction.reference || 'N/A'}
                    </div>
                  </div>
                </div>
                
                {/* Row 2: Description */}
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Description</div>
                  <div className="text-sm text-white">{selectedTransaction.description}</div>
                </div>
                
                {/* Row 3: Related Hackathon (if any) */}
                {selectedTransaction.hackathonName && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Related Hackathon</div>
                    <div className="text-sm text-white flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {selectedTransaction.hackathonName}
                    </div>
                  </div>
                )}
                
                {/* Row 4: Net Amount (if fee exists) */}
                {selectedTransaction.fee > 0 && (
                  <div className="pt-2 mt-2 border-t border-gray-700/50">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">Processing Fee</div>
                      <div className="text-sm text-amber-400">{formatCurrency(selectedTransaction.fee)}</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm font-medium text-white">Net Amount</div>
                      <div className="text-sm font-medium text-white">
                        {formatCurrency(selectedTransaction.amount - selectedTransaction.fee)}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Row 5: Estimated Completion (if pending) */}
                {selectedTransaction.status === 'pending' && selectedTransaction.estimatedCompletion && (
                  <div className="pt-2 mt-2 border-t border-gray-700/50">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estimated Completion</div>
                    <div className="text-sm text-amber-400 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(selectedTransaction.estimatedCompletion)}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer Actions */}
            <div className="px-6 py-4 flex justify-between items-center">
              <button
                onClick={() => {
                  alert('Receipt download functionality would be implemented here');
                }}
                className="flex items-center px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
              >
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Download Receipt
              </button>
              
              <button
                onClick={() => setShowTransactionDetails(false)}
                className={`px-4 py-2 text-white rounded-lg transition-colors text-sm ${
                  selectedTransaction.status === 'completed'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600' 
                    : selectedTransaction.status === 'pending'
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-700 hover:from-amber-500 hover:to-yellow-600'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      <DepositModal 
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSubmit={handleDepositSubmit}
      />

      {/* Withdraw Modal */}
      <WithdrawModal 
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onSubmit={handleWithdrawSubmit}
        availableBalance={balance}
      />
    </div>
  );
};

export default WalletDashboard; 