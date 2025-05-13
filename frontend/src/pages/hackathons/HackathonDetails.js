import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { InformationCircleIcon, ClockIcon, GiftIcon, UserGroupIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { hackathonAPI } from '../../services/api';

// Section Components
import HackathonHeader from './common/HackathonHeader';
import OverviewSection from './hackthondetails/OverviewSection';
import TimelineSection from './hackthondetails/TimelineSection';
import PrizesSection from './hackthondetails/PrizesSection';
import JudgesSection from './hackthondetails/JudgesSection';
import FAQsAndDiscussionSection from './hackthondetails/FAQSection';
import ReviewsSection from './hackthondetails/ReviewsSection';

// CSS for the scrollbar hiding
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.3s ease-out forwards;
  }
`;

const HackathonDetails = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [error, setError] = useState(null);

  // Fetch hackathon details
  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        setLoading(true);
        const response = await hackathonAPI.getHackathonById(hackathonId);

        if (response.data.success) {
          const hackathonData = response.data.data;

          // Map backend data to frontend format
          setHackathon({
            id: hackathonData._id,
            title: hackathonData.title,
            subtitle: hackathonData.description,
            organizer: hackathonData.organizerId?.firstName + ' ' + hackathonData.organizerId?.lastName,
            logoUrl: hackathonData.imageFile?.fileUrl,
            bannerImage: hackathonData.imageFile?.fileUrl,
            imageUrl: hackathonData.imageFile?.fileUrl,
            startDate: hackathonData.startDate,
            endDate: hackathonData.endDate,
            registrationEndDate: hackathonData.registrationDeadline,
            location: {
              type: hackathonData.locationType,
              venue: hackathonData.location,
              online: hackathonData.locationType === 'online' || hackathonData.locationType === 'hybrid'
            },
            status: hackathonData.status,
            participants: hackathonData.participants || 0,
            maxTeamSize: hackathonData.maxTeamSize,
            prizeTotalAmount: hackathonData.prize,
            categories: hackathonData.category ? [hackathonData.category] : [],
            description: hackathonData.description,
            aboutEvent: hackathonData.longDescription || hackathonData.description,
            registrationFee: hackathonData.registrationFee || 'Free for all participants',

            // Organizer details
            organizerLogo: hackathonData.organizerId?.profileImage,
            organizerType: hackathonData.organizerType || 'Educational Institution',
            organizerEmail: hackathonData.organizerId?.email,
            organizerWebsite: hackathonData.organizerWebsite,
            organizerDescription: hackathonData.organizerDescription,
            previousHackathons: hackathonData.previousHackathons || 0,

            // Timeline/Rounds
            timeline: hackathonData.rounds || [
              {
                phase: "Registration",
                startDate: new Date().toISOString(),
                endDate: hackathonData.registrationDeadline,
                description: "Register your team and submit your preliminary project idea."
              },
              {
                phase: "Hackathon",
                startDate: hackathonData.startDate,
                endDate: hackathonData.endDate,
                description: "Development period to create your solution."
              }
            ],

            // Prizes
            prizes: hackathonData.prizeDetails || [
              {
                place: "1st Place",
                amount: `$${hackathonData.prize}`,
                benefits: ["Global recognition", "Mentorship", "Cloud credits"]
              }
            ],

            // Judges
            judges: hackathonData.judges || [],

            // FAQs
            faqs: hackathonData.faqs || [
              {
                question: "Do I need to have a team to participate?",
                answer: "No, you can register individually and join a team later or participate solo."
              },
              {
                question: "Is there a registration fee?",
                answer: hackathonData.registrationFee || "No, participation is completely free for all participants."
              }
            ],

            // Reviews (if available)
            reviews: hackathonData.reviews || []
          });
        } else {
          setError('Failed to fetch hackathon details');
        }
      } catch (err) {
        console.error('Error fetching hackathon:', err);
        setError('Failed to fetch hackathon details');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [hackathonId]);

  // Handle registration redirect
  const handleRegisterClick = () => {
    navigate(`/registration/${hackathonId}`);
  };

  // Toggle watchlist status
  const handleWatchlistToggle = () => {
    const watchlist = JSON.parse(localStorage.getItem('hackathon_watchlist') || '[]');

    if (isWatchlisted) {
      const updatedWatchlist = watchlist.filter(id => id !== hackathonId);
      localStorage.setItem('hackathon_watchlist', JSON.stringify(updatedWatchlist));
      setIsWatchlisted(false);
    } else {
      const updatedWatchlist = [...watchlist, hackathonId];
      localStorage.setItem('hackathon_watchlist', JSON.stringify(updatedWatchlist));
      setIsWatchlisted(true);
    }
  };

  // Check if hackathon is in watchlist
  useEffect(() => {
    if (hackathonId) {
      const watchlist = JSON.parse(localStorage.getItem('hackathon_watchlist') || '[]');
      setIsWatchlisted(watchlist.includes(hackathonId));
    }
  }, [hackathonId]);

  // Render section based on active tab
  const renderActiveSection = () => {
    if (!hackathon) return null;

    switch (activeTab) {
      case 'overview':
        return <OverviewSection hackathon={hackathon} />;
      case 'timeline':
        return <TimelineSection timeline={hackathon.timeline} />;
      case 'prizes':
        return <PrizesSection prizes={hackathon.prizes} />;
      case 'judges':
        return <JudgesSection judges={hackathon.judges} />;
      case 'faq':
        return <FAQsAndDiscussionSection faqs={hackathon.faqs} />;
      case 'reviews':
        return <ReviewsSection reviews={hackathon.reviews || []} />;
      default:
        return <OverviewSection hackathon={hackathon} />;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => navigate('/hackathons')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Back to Hackathons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-purple-900/20 to-gray-900">
      {/* Inject CSS */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyles }} />

      {loading ? (
        <LoadingIndicator type="scanning" message="Please wait..." title="" />
      ) : (
        <div className="pb-16 md:pb-0">
          {/* Header section */}
          <HackathonHeader
            hackathon={hackathon}
            onRegister={handleRegisterClick}
            onWatchlist={handleWatchlistToggle}
            isWatchlisted={isWatchlisted}
          />

          {/* Tab Navigation - made scrollable for mobile */}
          <div className="border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto scrollbar-hide">
                <nav className="flex space-x-2 sm:space-x-8 whitespace-nowrap py-1" aria-label="Tabs">
                  {navigationItems.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        py-3 px-3 sm:px-1 inline-flex items-center border-b-2 font-medium text-xs sm:text-sm transition-colors relative
                        ${activeTab === tab.id
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                        }
                      `}
                    >
                      {tab.icon && (
                        <tab.icon
                          className={`-ml-0.5 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 ${activeTab === tab.id ? 'text-blue-400' : 'text-gray-400'
                            }`}
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
            {renderActiveSection()}
          </div>

          {/* Footer CTA - Improved for mobile */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border-t border-blue-800/50">
            <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Ready to showcase your skills?</h2>
              <p className="text-blue-200 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                Join {hackathon.title} and compete for ${hackathon.prizeTotalAmount} in prizes. Registration is {hackathon.registrationFee === 'Free for all participants' ? 'free' : hackathon.registrationFee} and open to individuals and teams worldwide.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleRegisterClick}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-indigo-900 font-medium rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base">
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const navigationItems = [
  { id: 'overview', name: 'Overview', icon: InformationCircleIcon },
  { id: 'timeline', name: 'Timeline', icon: ClockIcon },
  { id: 'prizes', name: 'Prizes', icon: GiftIcon },
  { id: 'judges', name: 'Judges', icon: UserGroupIcon },
  { id: 'faq', name: 'FAQs & Discussion', icon: QuestionMarkCircleIcon },
  { id: 'reviews', name: 'Reviews', icon: ChatBubbleLeftRightIcon },
];

export default HackathonDetails; 