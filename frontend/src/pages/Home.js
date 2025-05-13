import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedHackathons from '../components/home/FeaturedHackathons';
import FeaturesGrid from '../components/home/FeaturesGrid';
import UserShowcaseSection from '../components/home/UserShowcaseSection';

// New Components
// import MissionSection from '../components/home/MissionSection';
import TeamSection from '../components/home/TeamSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
// import PartnersSection from '../components/home/PartnersSection';
// simport FaqSection from '../components/home/FaqSection';
import CallToAction from '../components/home/CallToAction';


function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <HeroSection />
      </div>
      
      {/* Featured Hackathons Section */}
      <div className="relative py-2">
        <div className="relative z-10">
          <FeaturedHackathons />
        </div>
      </div>
      
      {/* Trending Projects Section removed as requested */}
      
      {/* Features Grid Section */}
      <div className="relative py-2">
        <div className="relative z-10">
          <FeaturesGrid />
        </div>
      </div>
      
      {/* Who's Using Section */}
      <div className="relative py-2">
        <div className="relative z-10">
          <UserShowcaseSection />
        </div>
      </div>
      
      {/* Mission Section */}
      {/* <div className="relative py-4">
        <div className="relative z-10">
          <MissionSection />
        </div>
      </div> */}
      
      {/* Testimonials Section */}
      <div className="relative py-2">
        <div className="relative z-10">
          <TestimonialsSection />
        </div>
      </div>
      
      {/* Partners Section */}
      {/* <div className="relative py-4">
        <div className="relative z-10">
          <PartnersSection />
        </div>
      </div> */}
      
      {/* Team Section */}
      <div className="relative py-2">
        <div className="relative z-10">
          <TeamSection />
        </div>
      </div>
      
      {/* FAQ Section */}
      {/* <div className="relative py-4">
        <div className="relative z-10">
          <FaqSection />
        </div>
      </div> */}
      
      {/* Call To Action */}
      <div className="relative py-2">
        <div className="relative z-10">
          <CallToAction />
        </div>
      </div>
    </div>
  );
}

export default Home;