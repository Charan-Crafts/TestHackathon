import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // FAQ items
  const faqs = [
    {
      question: "What is a hackathon?",
      answer: "A hackathon is a time-bound competitive event where participants collaborate to build innovative solutions to specific challenges. Our platform helps organizations run successful hackathons by handling registration, team formation, project submissions, and judging."
    },
    {
      question: "Who can participate in hackathons?",
      answer: "Anyone with an interest in technology, innovation, and problem-solving can participate in hackathons. Most hackathons welcome participants from various backgrounds including developers, designers, product managers, data scientists, and subject matter experts."
    },
    {
      question: "Do I need to have a team to join a hackathon?",
      answer: "No, you can register individually and either form a team before the event or find teammates during the hackathon. Our platform provides team formation tools to help solo participants connect with others who have complementary skills."
    },
    {
      question: "Are hackathons only for programmers?",
      answer: "Not at all! While technical skills are valuable in hackathons, successful teams typically include a mix of skills including design, project management, domain expertise, and business strategy. Everyone has something valuable to contribute."
    },
    {
      question: "How are hackathon winners selected?",
      answer: "Each hackathon has its own judging criteria, typically including innovation, technical complexity, design, user experience, and potential impact. Projects are usually evaluated by a panel of judges through presentations and demonstrations."
    },
    {
      question: "What types of hackathons are hosted on this platform?",
      answer: "Our platform supports various types of hackathons including corporate innovation challenges, civic hackathons addressing social issues, educational hackathons, and open-innovation competitions across industries like healthcare, finance, education, and more."
    },
    {
      question: "How do I organize my own hackathon?",
      answer: "You can create and manage your own hackathon through our platform in just a few steps. After registering as an organizer, you'll be guided through setting up your event, defining challenges, establishing judging criteria, and managing participants."
    },
    {
      question: "Is there a cost to participate in hackathons?",
      answer: "Many hackathons on our platform are free to participate in. Some premium or specialized events may have registration fees. All pricing information is clearly displayed on each hackathon's registration page."
    },
    {
      question: "What resources are provided during hackathons?",
      answer: "Resources vary by event, but typically include documentation, APIs, development environments, mentorship, workshops, and technical support. Some events also provide cloud credits, hardware components, or other specialized tools."
    },
    {
      question: "What happens to my project after the hackathon?",
      answer: "You retain intellectual property rights to your projects (subject to specific hackathon rules). Many teams continue developing their projects after the event, and some have gone on to secure funding, join accelerators, or launch startups based on their hackathon projects."
    }
  ];

  // Categories
  const categories = [
    "Participation", 
    "Organization", 
    "Technical", 
    "Logistics", 
    "Prizes & Recognition"
  ];

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Find answers to common questions about hackathons and how our platform works
          </p>
        </div>
      </div>
      
      {/* FAQ content */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category tabs */}
          <div className="flex overflow-x-auto space-x-2 mb-10 pb-2 scrollbar-hide">
            {categories.map((category, index) => (
              <button 
                key={index}
                className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-sm font-medium whitespace-nowrap hover:bg-indigo-600 hover:text-white transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Search bar */}
          <div className="mb-10">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-10 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search questions..."
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* FAQ accordions */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden transition-all duration-200">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                  <span className={`ml-6 flex-shrink-0 text-indigo-400 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-6 pb-4 text-gray-400">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Still have questions section */}
          <div className="mt-12 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Still have questions?</h3>
            <p className="text-gray-300 mb-6">
              Can't find the answer you're looking for? We're here to help!
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-colors"
            >
              Contact Our Support Team
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 -mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ; 