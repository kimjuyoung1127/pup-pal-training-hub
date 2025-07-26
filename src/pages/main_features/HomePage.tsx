import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import FullArticleFeed from '@/components/FullArticleFeed';
import { DetailedFeatureIntroduction } from '@/components/main/DetailedFeatureIntroduction';

const HomePage: React.FC = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <HeroSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <DetailedFeatureIntroduction />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <FullArticleFeed />
      </motion.div>
    </div>
  );
};

export default HomePage;
