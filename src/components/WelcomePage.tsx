// src/components/WelcomePage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogProfile } from '@/hooks/useDogProfile';
import { motion } from 'framer-motion';

const WelcomePage = () => {
  const { dogInfo, isLoading } = useDogProfile();
  const navigate = useNavigate();

  useEffect(() => {
    // 데이터 로딩이 완료되고, dogInfo가 성공적으로 불러와졌을 때
    if (!isLoading && dogInfo) {
      // 마이페이지로 이동
      navigate('/app/my-page');
    }
    // 만약 로딩이 끝났는데도 dogInfo가 없다면 (매우 예외적인 경우)
    else if (!isLoading && !dogInfo) {
      // 정보 등록 페이지로 다시 보냄
      navigate('/app/dog-info');
    }
  }, [isLoading, dogInfo, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6 p-6">
      <div className="paw-loader flex space-x-2 text-4xl text-sky-500">
        <span>🐾</span>
        <span>🐾</span>
        <span>🐾</span>
        <span>🐾</span>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg font-semibold text-sky-700 font-pretendard"
      >
        프로필을 준비 중입니다...
      </motion.p>
    </div>
  );
};

export default WelcomePage;
