import React, { useState, useEffect } from 'react';

const DepositModal = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');
  const [reference, setReference] = useState('');
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
        setMethod('upi');
        setReference('');
        setDescription('');
        setError('');
      }, 500); // Should match the duration in the CSS transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    
    try {
      // In a real app, this would be an API call to process the deposit
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the onSubmit callback with the form data
      onSubmit({
        amount: parseFloat(amount),
        method,
        reference,
        description,
        currency: 'INR',
        date: new Date().toISOString()
      });
      
      // Close the modal
      onClose();
    } catch (err) {
      setError('There was an error processing your deposit. Please try again.');
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
              <div className="h-2 w-full bg-gradient-to-r from-cyan-500 to-blue-600"></div>
              
              <div className="px-8 pt-8 pb-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/30 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Add Funds</h3>
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
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                          className="w-full pl-8 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="method" className="block text-sm font-medium text-gray-300 mb-2">
                        Payment Method
                      </label>
                      <div className="relative">
                        <select
                          id="method"
                          name="method"
                          value={method}
                          onChange={(e) => setMethod(e.target.value)}
                          className="appearance-none w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        >
                          <option value="upi">UPI</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="card">Debit/Credit Card</option>
                          <option value="wallet">Digital Wallet</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="reference" className="block text-sm font-medium text-gray-300 mb-2">
                        Reference ID
                      </label>
                      <input
                        type="text"
                        id="reference"
                        name="reference"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        placeholder="Transaction reference (if available)"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        placeholder="Purpose of this deposit"
                      ></textarea>
                    </div>
                    
                    {method === 'upi' && (
                      <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-900/10 rounded-xl p-5 border border-indigo-500/20 mt-4">
                        <h4 className="text-sm font-medium text-indigo-400 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          UPI Payment Instructions
                        </h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Make your UPI payment to the following UPI ID and provide the transaction reference.
                        </p>
                        <div className="flex items-center justify-between bg-gray-900/60 p-3 rounded-lg border border-indigo-600/10">
                          <code className="text-indigo-300 font-mono">hackathon@upi</code>
                          <button
                            type="button"
                            className="text-xs bg-indigo-700/50 px-3 py-1.5 rounded-lg border border-indigo-600/30 text-indigo-300 hover:bg-indigo-700 transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText('hackathon@upi');
                            }}
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {method === 'bank_transfer' && (
                      <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-900/10 rounded-xl p-5 border border-indigo-500/20 mt-4">
                        <h4 className="text-sm font-medium text-indigo-400 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Bank Transfer Instructions
                        </h4>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex justify-between border-b border-gray-700/50 pb-2">
                            <span>Account Name</span>
                            <span className="text-white">Hackathon Platform</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-700/50 pb-2">
                            <span>Account Number</span>
                            <span className="text-white font-mono">0123456789</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-700/50 pb-2">
                            <span>IFSC Code</span>
                            <span className="text-white font-mono">BANK0001234</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Bank</span>
                            <span className="text-white">Sample Bank</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center font-medium"
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Funds
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

export default DepositModal; 