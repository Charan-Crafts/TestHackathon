import React, { useState } from 'react';

function PrizesStep({ formData, updateFormData, nextStep, prevStep, isNavigating }) {
  const [errors, setErrors] = useState({});
  const [tempPrize, setTempPrize] = useState({ place: '', amount: '', description: '' });
  const [tempJudge, setTempJudge] = useState({
    name: '',
    title: '',
    company: '',
    image: '',
    bio: '',
    imageFile: null
  });
  const [tempFaq, setTempFaq] = useState({ question: '', answer: '' });

  // Handle prize changes for existing prizes in the prizeDetails array
  const handlePrizeChange = (index, field, value) => {
    const updatedPrizes = [...formData.prizeDetails];
    updatedPrizes[index][field] = value;

    // Also update the prize/prizes fields for consistency with listings
    let totalPrize = '';
    if (field === 'amount' && index === 0) {
      // Use the first prize amount as the main prize amount for listings
      totalPrize = value;
      updateFormData({
        prizeDetails: updatedPrizes,
        prize: totalPrize,
        prizes: totalPrize
      });
    } else {
      updateFormData({ prizeDetails: updatedPrizes });
    }
  };

  // Add new prize
  const addPrize = () => {
    if (tempPrize.place && (tempPrize.amount || tempPrize.description)) {
      const updatedPrizes = [...formData.prizeDetails, { ...tempPrize }];

      // If this is the first prize, also update the prize/prizes fields
      if (formData.prizeDetails.length === 0 && tempPrize.amount) {
        updateFormData({
          prizeDetails: updatedPrizes,
          prize: tempPrize.amount,
          prizes: tempPrize.amount
        });
      } else {
        updateFormData({
          prizeDetails: updatedPrizes
        });
      }

      setTempPrize({ place: '', amount: '', description: '' });
    }
  };

  // Remove prize
  const removePrize = (index) => {
    const updatedPrizes = formData.prizeDetails.filter((_, i) => i !== index);

    // If we removed the first prize, update the prize/prizes fields
    if (index === 0 && updatedPrizes.length > 0) {
      updateFormData({
        prizeDetails: updatedPrizes,
        prize: updatedPrizes[0].amount,
        prizes: updatedPrizes[0].amount
      });
    } else {
      updateFormData({ prizeDetails: updatedPrizes });
    }
  };

  // Handle temp prize change
  const handleTempPrizeChange = (field, value) => {
    setTempPrize(prev => ({ ...prev, [field]: value }));
  };

  // Handle judge changes
  const handleJudgeChange = (index, field, value) => {
    const updatedJudges = [...formData.judges];
    updatedJudges[index][field] = value;
    updateFormData({ judges: updatedJudges });
  };

  // Add new judge
  const addJudge = () => {
    if (tempJudge.name && tempJudge.title) {
      updateFormData({
        judges: [...formData.judges, { ...tempJudge }]
      });
      setTempJudge({ name: '', title: '', company: '', image: '', bio: '', imageFile: null });
    }
  };

  // Remove judge
  const removeJudge = (index) => {
    const updatedJudges = formData.judges.filter((_, i) => i !== index);
    updateFormData({ judges: updatedJudges });
  };

  // Handle temp judge change
  const handleTempJudgeChange = (field, value) => {
    setTempJudge(prev => ({ ...prev, [field]: value }));
  };

  // Handle FAQ changes
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][field] = value;
    updateFormData({ faqs: updatedFaqs });
  };

  // Add new FAQ
  const addFaq = () => {
    if (tempFaq.question && tempFaq.answer) {
      updateFormData({
        faqs: [...formData.faqs, { ...tempFaq }]
      });
      setTempFaq({ question: '', answer: '' });
    }
  };

  // Remove FAQ
  const removeFaq = (index) => {
    const updatedFaqs = formData.faqs.filter((_, i) => i !== index);
    updateFormData({ faqs: updatedFaqs });
  };

  // Handle temp FAQ change
  const handleTempFaqChange = (field, value) => {
    setTempFaq(prev => ({ ...prev, [field]: value }));
  };

  // Add a file upload handler
  const handleJudgeImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the UI
      const imageUrl = URL.createObjectURL(file);

      setTempJudge(prev => ({
        ...prev,
        image: imageUrl,
        imageFile: file
      }));
    }
  };

  // Add a handler for uploading images to existing judges
  const handleExistingJudgeImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the UI
      const imageUrl = URL.createObjectURL(file);

      const updatedJudges = [...formData.judges];
      updatedJudges[index] = {
        ...updatedJudges[index],
        image: imageUrl,
        imageFile: file
      };

      updateFormData({ judges: updatedJudges });
    }
  };

  // Form validation
  const handleSubmit = (e) => {
    e.preventDefault();

    // Skip validation if navigating (coming from another step)
    if (isNavigating) {
      nextStep();
      return;
    }

    const newErrors = {};
    if (formData.prizeDetails.length === 0) {
      newErrors.prizes = 'At least one prize is required';
    }

    if (formData.judges.length === 0) {
      newErrors.judges = 'At least one judge is required';
    }

    if (formData.faqs.length === 0) {
      newErrors.faqs = 'At least one FAQ is required';
    }

    // Ensure prize and prizes fields are set correctly
    if (formData.prizeDetails.length > 0 && !formData.prize) {
      updateFormData({
        prize: formData.prizeDetails[0].amount,
        prizes: formData.prizeDetails[0].amount
      });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Prizes Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Prizes</h3>

        {/* Existing Prizes */}
        {formData.prizeDetails.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-cyan-300 mb-2">Defined Prizes:</h4>
            <div className="space-y-2">
              {formData.prizeDetails.map((prize, index) => (
                <div key={index} className="flex items-start bg-gray-900/50 p-3 rounded-lg border border-cyan-500/30">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                      <div className="mb-2 sm:mb-0 sm:w-1/3">
                        <label className="block text-xs font-medium text-cyan-400 mb-1">
                          Place/Title
                        </label>
                        <input
                          type="text"
                          value={prize.place}
                          onChange={(e) => handlePrizeChange(index, 'place', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                        />
                      </div>
                      <div className="mb-2 sm:mb-0 sm:w-1/3">
                        <label className="block text-xs font-medium text-cyan-400 mb-1">
                          Amount
                        </label>
                        <input
                          type="text"
                          value={prize.amount}
                          onChange={(e) => handlePrizeChange(index, 'amount', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                          placeholder="e.g. $5,000"
                        />
                      </div>
                      <div className="sm:w-1/3">
                        <label className="block text-xs font-medium text-cyan-400 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={prize.description}
                          onChange={(e) => handlePrizeChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                          placeholder="e.g. Plus cloud credits and mentorship"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePrize(index)}
                    className="ml-2 p-1 text-red-400 hover:text-red-300 focus:outline-none"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Prize Form */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/20 mb-2">
          <h4 className="text-sm font-medium text-cyan-300 mb-3">Add New Prize</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-cyan-400 mb-1">
                Place/Title
              </label>
              <input
                type="text"
                value={tempPrize.place}
                onChange={(e) => handleTempPrizeChange('place', e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                placeholder="e.g. 1st Place, Best UI, etc."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-cyan-400 mb-1">
                Amount
              </label>
              <input
                type="text"
                value={tempPrize.amount}
                onChange={(e) => handleTempPrizeChange('amount', e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                placeholder="e.g. $5,000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-cyan-400 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={tempPrize.description}
                onChange={(e) => handleTempPrizeChange('description', e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                placeholder="Any additional details about this prize"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={addPrize}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors"
            >
              Add Prize
            </button>
          </div>
        </div>

        {errors.prizes && (
          <p className="mt-1 text-sm text-red-500">{errors.prizes}</p>
        )}
      </div>

      {/* Judges Section */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-white mb-4">Judges</h3>

        {/* Existing Judges */}
        {formData.judges.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-cyan-300 mb-2">Defined Judges:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.judges.map((judge, index) => (
                <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/30 relative">
                  <button
                    type="button"
                    onClick={() => removeJudge(index)}
                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-300 focus:outline-none bg-gray-900/50 rounded-full"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
                      <div className="mb-2">
                        <div
                          className="w-full h-32 rounded-lg bg-gray-800/50 flex items-center justify-center overflow-hidden border border-cyan-500/30"
                          style={judge.image ? { backgroundImage: `url(${judge.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                        >
                          {!judge.image && (
                            <svg className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-cyan-400 mb-1">
                          Image URL or Upload
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            value={judge.image}
                            onChange={(e) => handleJudgeChange(index, 'image', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-xs"
                            placeholder="URL to judge's photo"
                          />
                          <label className="px-3 py-2 bg-cyan-600 text-white rounded-r-lg cursor-pointer hover:bg-cyan-700 transition-colors">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleExistingJudgeImageUpload(e, index)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="sm:w-2/3 space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-cyan-400 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={judge.name}
                          onChange={(e) => handleJudgeChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-cyan-400 mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={judge.title}
                            onChange={(e) => handleJudgeChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                            placeholder="e.g. CTO"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-cyan-400 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={judge.company}
                            onChange={(e) => handleJudgeChange(index, 'company', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                            placeholder="e.g. TechCorp"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-cyan-400 mb-1">
                          Bio
                        </label>
                        <textarea
                          value={judge.bio}
                          onChange={(e) => handleJudgeChange(index, 'bio', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white resize-none"
                          placeholder="Brief biography..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Judge Form */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/20 mb-2">
          <h4 className="text-sm font-medium text-cyan-300 mb-3">Add New Judge</h4>

          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
              <div className="mb-2">
                <div
                  className="w-full h-32 rounded-lg bg-gray-800/50 flex items-center justify-center overflow-hidden border border-cyan-500/30"
                  style={tempJudge.image ? { backgroundImage: `url(${tempJudge.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {!tempJudge.image && (
                    <svg className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-cyan-400 mb-1">
                  Image URL or Upload
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={tempJudge.image}
                    onChange={(e) => handleTempJudgeChange('image', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-xs"
                    placeholder="URL to judge's photo"
                  />
                  <label className="px-3 py-2 bg-cyan-600 text-white rounded-r-lg cursor-pointer hover:bg-cyan-700 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleJudgeImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="sm:w-2/3 space-y-2">
              <div>
                <label className="block text-xs font-medium text-cyan-400 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={tempJudge.name}
                  onChange={(e) => handleTempJudgeChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                  placeholder="Judge's full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-cyan-400 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={tempJudge.title}
                    onChange={(e) => handleTempJudgeChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    placeholder="e.g. CTO"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-cyan-400 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={tempJudge.company}
                    onChange={(e) => handleTempJudgeChange('company', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    placeholder="e.g. TechCorp"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-cyan-400 mb-1">
                  Bio
                </label>
                <textarea
                  value={tempJudge.bio}
                  onChange={(e) => handleTempJudgeChange('bio', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white resize-none"
                  placeholder="Brief biography..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={addJudge}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors"
            >
              Add Judge
            </button>
          </div>
        </div>

        {errors.judges && (
          <p className="mt-1 text-sm text-red-500">{errors.judges}</p>
        )}
      </div>

      {/* FAQs Section */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>

        {/* Existing FAQs */}
        {formData.faqs.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-cyan-300 mb-2">Defined FAQs:</h4>
            <div className="space-y-3">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/30 relative">
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-300 focus:outline-none bg-gray-900/50 rounded-full"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-cyan-400 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-cyan-400 mb-1">
                        Answer
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add FAQ Form */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/20 mb-2">
          <h4 className="text-sm font-medium text-cyan-300 mb-3">Add New FAQ</h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-cyan-400 mb-1">
                Question *
              </label>
              <input
                type="text"
                value={tempFaq.question}
                onChange={(e) => handleTempFaqChange('question', e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                placeholder="e.g. How do I submit my project?"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-cyan-400 mb-1">
                Answer *
              </label>
              <textarea
                value={tempFaq.answer}
                onChange={(e) => handleTempFaqChange('answer', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white resize-none"
                placeholder="Provide a clear and helpful answer..."
              ></textarea>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={addFaq}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors"
            >
              Add FAQ
            </button>
          </div>
        </div>

        {errors.faqs && (
          <p className="mt-1 text-sm text-red-500">{errors.faqs}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => prevStep()}
          className="px-6 py-3 bg-gray-800 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-gray-700 transition-colors duration-200"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200"
        >
          Next Step
        </button>
      </div>
    </form>
  );
}

export default PrizesStep; 