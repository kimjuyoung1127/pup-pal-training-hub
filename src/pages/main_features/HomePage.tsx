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
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96] // Using bezier curve instead of string
            }
          }
        }}
      >
        <HeroSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96] // Using bezier curve instead of string
            }
          }
        }}
      >
        <DetailedFeatureIntroduction />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96]
            }
          }
        }}
      >
        <FullArticleFeed />
      </motion.div>
    </div>
  );
};

export default HomePage;