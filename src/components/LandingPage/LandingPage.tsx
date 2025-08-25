import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { HeroSection } from '../HeroSection';
import { AboutSection } from '../AboutSection';
import { TimelineSection } from '../TimelineSection';
import { CriticalitySection } from '../CriticalitySection';
import { AISection } from '../AISection';
import { FeaturesSection } from '../FeaturesSection';
import { TestimonialsSection } from '../TestimonialsSection';
import { BenefitsSection } from '../BenefitsSection';
import { MissionSection } from '../MissionSection';
import { CTASection } from '../CTASection';
import { Footer } from '../Footer';
import { Chatbot } from '../Chatbot/Chatbot';

export function LandingPage() {
  const navigate = useNavigate();
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <div className="text-black text-base not-italic normal-nums font-normal accent-auto box-border block tracking-[normal] leading-6 list-outside list-disc text-start indent-[0px] normal-case visible border-separate font-inter">
      <div className="box-border min-h-[1000px] w-full">
        <div className="text-white bg-gray-900 box-border min-h-[1000px]">
          <Header />
          <HeroSection />
          <AboutSection />
          <TimelineSection />
          <CriticalitySection />
          <AISection />
          <FeaturesSection />
          <TestimonialsSection />
          <BenefitsSection />
          <MissionSection />
          <CTASection />
          <Footer />
        </div>
      </div>

      {/* Chatbot for landing page */}
      <Chatbot 
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen(!chatbotOpen)}
      />
    </div>
  );
}
