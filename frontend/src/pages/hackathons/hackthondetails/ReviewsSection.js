import React, { useState } from 'react';

function ReviewsSection({ reviews = [] }) {
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [displayedReviews, setDisplayedReviews] = useState(
    reviews.map(review => ({ ...review, replies: review.replies || [], showReplyForm: false }))
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (newReview.trim() === '') return;
    
    const review = {
      id: Date.now(),
      text: newReview,
      rating: rating,
      user: {
        name: 'Current User',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      date: new Date().toLocaleDateString(),
      replies: [],
      showReplyForm: false
    };
    
    setDisplayedReviews([review, ...displayedReviews]);
    setNewReview('');
    setRating(5);
    setShowConfirmation(true);
    
    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  const toggleReplyForm = (reviewId) => {
    setDisplayedReviews(displayedReviews.map(review => 
      review.id === reviewId 
        ? { ...review, showReplyForm: !review.showReplyForm }
        : review
    ));
    setReplyText('');
  };

  const handleReplySubmit = (reviewId, e) => {
    e.preventDefault();
    
    if (replyText.trim() === '') return;
    
    const reply = {
      id: Date.now(),
      text: replyText,
      user: {
        name: 'Current User',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      date: new Date().toLocaleDateString()
    };
    
    setDisplayedReviews(displayedReviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            replies: [...review.replies, reply],
            showReplyForm: false
          }
        : review
    ));
    
    setReplyText('');
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-xl overflow-hidden border border-gray-700/50 p-3 sm:p-4">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Reviews</h3>
      
      {/* Confirmation message */}
      {showConfirmation && (
        <div className="mb-4 p-3 bg-green-900/70 border border-green-700 rounded-lg text-green-200 animate-slide-up">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Thank you! Your review has been submitted successfully.</span>
          </div>
        </div>
      )}
      
      {/* Add review form */}
      <form onSubmit={handleSubmitReview} className="mb-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-lg border border-gray-700/50 p-3 sm:p-4">
        <h4 className="text-base sm:text-lg font-medium text-white mb-2">Share your experience</h4>
        
        <div className="mb-3">
          <label className="block text-gray-300 text-sm mb-1">Rating</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <svg 
                  className={`h-6 w-6 ${rating >= star ? 'text-yellow-400' : 'text-gray-500'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-3">
          <label className="block text-gray-300 text-sm mb-1">Your Review</label>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg border border-gray-600 p-2 text-sm"
            rows="3"
            placeholder="Share your thoughts about this hackathon..."
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm"
        >
          Submit Review
        </button>
      </form>
      
      {/* Reviews list */}
      <div className="space-y-4">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review) => (
            <div key={review.id} className="p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="flex items-start">
                <img
                  src={review.user.image}
                  alt={review.user.name}
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="text-white font-medium">{review.user.name}</h5>
                    <span className="text-gray-400 text-xs">{review.date}</span>
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-4 w-4 ${review.rating >= star ? 'text-yellow-400' : 'text-gray-500'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm">{review.text}</p>
                  
                  {/* Reply button */}
                  <div className="mt-2">
                    <button 
                      onClick={() => toggleReplyForm(review.id)}
                      className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      {review.showReplyForm ? 'Cancel Reply' : 'Reply'}
                    </button>
                  </div>
                  
                  {/* Reply form */}
                  {review.showReplyForm && (
                    <form onSubmit={(e) => handleReplySubmit(review.id, e)} className="mt-3 pl-3 border-l-2 border-gray-700">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg border border-gray-600 p-2 text-sm"
                        rows="2"
                        placeholder="Write your reply..."
                        required
                      ></textarea>
                      <button
                        type="submit"
                        className="mt-2 px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-xs"
                      >
                        Submit Reply
                      </button>
                    </form>
                  )}
                  
                  {/* Replies */}
                  {review.replies.length > 0 && (
                    <div className="mt-3 space-y-3 pl-3 border-l-2 border-gray-700">
                      {review.replies.map((reply) => (
                        <div key={reply.id} className="p-2 bg-gray-800/70 rounded-lg">
                          <div className="flex items-start">
                            <img
                              src={reply.user.image}
                              alt={reply.user.name}
                              className="h-6 w-6 rounded-full mr-2"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h6 className="text-white text-xs font-medium">{reply.user.name}</h6>
                                <span className="text-gray-400 text-xs">{reply.date}</span>
                              </div>
                              <p className="text-gray-300 text-xs">{reply.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsSection; 