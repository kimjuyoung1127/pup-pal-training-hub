import React from 'react';
import HeroSection from '@/components/HeroSection';
import FullArticleFeed from '@/components/FullArticleFeed';
import { DetailedFeatureIntroduction } from '@/components/main/DetailedFeatureIntroduction';

const HomePage: React.FC = () => {
  return (
    <div className="bg-cream-50 min-h-screen">
      <HeroSection />
      <DetailedFeatureIntroduction />
      <FullArticleFeed />
    </div>
  );
};

export default HomePage;
