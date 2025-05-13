import React, { useState, useEffect } from 'react';

const WithdrawModal = ({ isOpen, onClose, onSubmit, availableBalance }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [accountDetails, setAccountDetails] = useState({
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: ''
  });
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Reset states when modal is fully closed
        setAmount('');
        setMethod('bank_transfer');
        setAccountDetails({
          accountName: '',
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          upiId: ''
        });
        setDescription('');
        setError('');
      }, 500); // Should match the duration in the CSS transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleAccountDetailChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > availableBalance) {
      setError('Withdrawal amount exceeds available balance');
      return;
    }

    // Validate based on method
    if (method === 'bank_transfer') {
      if (!accountDetails.accountName || !accountDetails.accountNumber || !accountDetails.ifscCode || !accountDetails.bankName) {
        setError('Please fill all bank account details');
        return;
      }
    } else if (method === 'upi') {
      if (!accountDetails.upiId) {
        setError('Please enter your UPI ID');
        return;
      }
    }

    setLoading(true);
    
    try {
      // In a real app, this would be an API call to process the withdrawal
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the onSubmit callback with the form data
      onSubmit({
        amount: parseFloat(amount),
        method,
        accountDetails,
        description,
        currency: 'INR',
        date: new Date().toISOString()
      });
      
      // Close the modal
      onClose();
    } catch (err) {
      setError('There was an error processing your withdrawal. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className={`absolute inset-0 backdrop-blur-sm bg-black/75 transition-opacity duration-500 ${
            isAnimating ? 'opacity-90' : 'opacity-0'
          }`} 
          onClick={onClose}
        ></div>
        
        <section className="absolute inset-y-0 right-0 max-w-full flex outline-none">
          <div 
            className="relative w-screen max-w-md transform transition-transform duration-500 ease-in-out"
            style={{ transform: isAnimating ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div className="h-full bg-gradient-to-br from-gray-900 to-gray-950 shadow-2xl flex flex-col overflow-y-auto">
              {/* Colored header */}
              <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              
              <div className="px-8 pt-8 pb-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-500/10 text-indigo-500 ring-1 ring-indigo-500/30 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Withdraw Funds</h3>
                  </div>
                  <button 
                    onClick={onClose}
                    className="text-gray-500 hover:text-white transition-colors rounded-full hover:bg-gray-800 p-1"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {error && (
                  <div className="mb-5 p-3 bg-red-900/30 border border-red-700/30 rounded-xl text-red-400 text-sm flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    {/* Balance Display */}
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-800/20 p-4 rounded-xl border border-gray-700/30 mb-3">
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Available Balance</div>
                      <div className="text-xl font-bold text-white">₹{availableBalance.toLocaleString()}</div>
                    </div>
                    
                    {/* Amount Input */}
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                        Amount (₹)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-400 font-medium">₹</span>
                        </div>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          min="1"
                          step="1"
                          max={availableBalance}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                          className="w-full pl-8 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          placeholder="0"
                        />
                      </div>
                      <div className="mt-2 flex justify-between">
                        <button 
                          type="button" 
                          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md px-2 py-1 transition-colors"
                          onClick={() => setAmount(String(Math.floor(availableBalance * 0.25)))}
                        >
                          25%
                        </button>
                        <button 
                          type="button" 
                          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md px-2 py-1 transition-colors"
                          onClick={() => setAmount(String(Math.floor(availableBalance * 0.5)))}
                        >
                          50%
                        </button>
                        <button 
                          type="button" 
                          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md px-2 py-1 transition-colors"
                          onClick={() => setAmount(String(Math.floor(availableBalance * 0.75)))}
                        >
                          75%
                        </button>
                        <button 
                          type="button" 
                          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md px-2 py-1 transition-colors"
                          onClick={() => setAmount(String(availableBalance))}
                        >
                          MAX
                        </button>
                      </div>
                    </div>
                    
                    {/* Method Selection */}
                    <div>
                      <label htmlFor="method" className="block text-sm font-medium text-gray-300 mb-2">
                        Withdrawal Method
                      </label>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          className={`flex-1 px-4 py-3 rounded-xl border transition-all flex flex-col items-center justify-center ${
                            method === 'bank_transfer' 
                              ? 'bg-indigo-800/20 border-indigo-600/30 text-indigo-300' 
                              : 'bg-gray-800/30 border-gray-700/30 text-gray-400 hover:bg-gray-800/50'
                          }`}
                          onClick={() => setMethod('bank_transfer')}
                        >
                          <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span className="text-sm font-medium">Bank Transfer</span>
                        </button>
                        <button
                          type="button"
                          className={`flex-1 px-4 py-3 rounded-xl border transition-all flex flex-col items-center justify-center ${
                            method === 'upi' 
                              ? 'bg-indigo-800/20 border-indigo-600/30 text-indigo-300' 
                              : 'bg-gray-800/30 border-gray-700/30 text-gray-400 hover:bg-gray-800/50'
                          }`}
                          onClick={() => setMethod('upi')}
                        >
                          <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium">UPI</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Bank Account Details */}
                    {method === 'bank_transfer' && (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label htmlFor="accountName" className="block text-sm font-medium text-gray-300 mb-2">
                            Account Holder Name
                          </label>
                          <input
                            type="text"
                            id="accountName"
                            name="accountName"
                            value={accountDetails.accountName}
                            onChange={handleAccountDetailChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300 mb-2">
                            Account Number
                          </label>
                          <input
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            value={accountDetails.accountNumber}
                            onChange={handleAccountDetailChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-300 mb-2">
                            IFSC Code
                          </label>
                          <input
                            type="text"
                            id="ifscCode"
                            name="ifscCode"
                            value={accountDetails.ifscCode}
                            onChange={handleAccountDetailChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="bankName" className="block text-sm font-medium text-gray-300 mb-2">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            id="bankName"
                            name="bankName"
                            value={accountDetails.bankName}
                            onChange={handleAccountDetailChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* UPI Details */}
                    {method === 'upi' && (
                      <div>
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-300 mb-2">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          id="upiId"
                          name="upiId"
                          value={accountDetails.upiId}
                          onChange={handleAccountDetailChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          placeholder="example@upi"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="2"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        placeholder="Purpose of this withdrawal"
                      ></textarea>
                    </div>

                    {/* Fee Information */}
                    <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/30 flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-gray-400">
                        A processing fee of <span className="text-indigo-400">₹25-₹50</span> may be applied based on the withdrawal amount
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center font-medium"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                          </svg>
                          Withdraw Funds
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full mt-3 px-4 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WithdrawModal; 