import React, { useState, useEffect } from 'react';

const PrizePaymentModal = ({ isOpen, onClose, prizeDetails, onSubmit }) => {
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '', // IFSC code
    upiId: '',
    taxId: '',
    phoneNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
        if (success) {
          setSuccess(false);
        }
      }, 500); // Should match the duration in the CSS transition
      return () => clearTimeout(timer);
    }
  }, [isOpen, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle closing the modal
  const handleClose = () => {
    // Reset success state
    setSuccess(false);
    // Call the parent's onClose function
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // In a real app, this would be an API call to process the payment
      // For demo purposes, we're just simulating a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onSubmit) {
        await onSubmit({ 
          paymentMethod, 
          ...formData,
          prizeAmount: prizeDetails.amount,
          currency: prizeDetails.currency,
          hackathonId: prizeDetails.hackathonId
        });
      }
      
      setSuccess(true);
    } catch (err) {
      setError('There was an error processing your payment information. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'bank':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-300 mb-1">Bank Name</label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300 mb-1">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-300 mb-1">IFSC Code</label>
              <input
                type="text"
                id="routingNumber"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      case 'upi':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-300 mb-1">UPI ID</label>
              <input
                type="text"
                id="upiId"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                required
                placeholder="yourname@upi"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                Enter your UPI ID (e.g., name@ybl, name@okhdfcbank, etc.)
              </p>
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="+91 9999999999"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl w-full max-w-md border border-green-500/30 p-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center border border-green-500/30 mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Payment Information Submitted!</h3>
            <p className="text-center text-gray-300 mb-6">
              Your prize payment of {prizeDetails.amount.toLocaleString()} {prizeDetails.currency} will be processed within 5-7 business days. 
              You will receive an email confirmation when the payment is complete.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            isAnimating ? 'opacity-70' : 'opacity-0'
          }`} 
          onClick={handleClose}
        ></div>
        
        <section className="absolute inset-y-0 right-0 max-w-full flex outline-none">
          <div 
            className="relative w-screen max-w-2xl transform transition-transform duration-500 ease-in-out"
            style={{ transform: isAnimating ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div className="h-full bg-gray-800 border-l border-gray-700/50 shadow-xl flex flex-col overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">Prize Payment Information</h3>
                  <button 
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-500/30 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-400">Prize Amount</div>
                      <div className="text-2xl font-bold text-white">{prizeDetails.amount.toLocaleString()} {prizeDetails.currency}</div>
                    </div>
                    <div className="bg-indigo-500/20 rounded-full p-3">
                      <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-300">
                    Expected processing time: 5-7 business days after submission
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                          paymentMethod === 'bank' 
                            ? 'border-indigo-500 bg-indigo-900/30' 
                            : 'border-gray-700 bg-gray-800/50 hover:bg-gray-700/50'
                        } transition-colors`}
                      >
                        <svg className="w-6 h-6 text-gray-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        <span className="text-sm text-gray-300">Bank Transfer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                          paymentMethod === 'upi' 
                            ? 'border-indigo-500 bg-indigo-900/30' 
                            : 'border-gray-700 bg-gray-800/50 hover:bg-gray-700/50'
                        } transition-colors`}
                      >
                        <svg className="w-6 h-6 text-gray-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-300">UPI Transfer</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Common Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* Method Specific Fields */}
                  {renderPaymentForm()}
                  
                  {/* Tax Information */}
                  <div className="mb-6">
                    <label htmlFor="taxId" className="block text-sm font-medium text-gray-300 mb-1">
                      PAN Card Number
                    </label>
                    <input
                      type="text"
                      id="taxId"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Required for tax purposes"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Required for prizes over ₹15,000 for tax reporting purposes.
                    </p>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-300 hover:text-white rounded-lg mr-2"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>Submit Payment Details</>
                      )}
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

export default PrizePaymentModal; 