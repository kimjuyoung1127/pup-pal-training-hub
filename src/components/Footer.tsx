import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 pt-4 sm:pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* About Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-white mb-2">Mung-AI</h3>
            <p className="text-sm">
              반려동물의 행복한 삶을 위한 모든 정보. Mung-AI가 함께합니다.
            </p>
          </div>
          
          {/* Content Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">콘텐츠</h3>
            <ul className="space-y-2">
              <li><Link to="/health" className="hover:text-white transition-colors">건강 정보</Link></li>
              <li><Link to="/training" className="hover:text-white transition-colors">훈련/행동</Link></li>
              <li><Link to="/nutrition" className="hover:text-white transition-colors">영양/식단</Link></li>
            </ul>
          </div>

          {/* AI Solutions Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">AI 솔루션</h3>
            <ul className="space-y-2">
              <li><Link to="/ai/breed-recommender" className="hover:text-white transition-colors">AI 견종 추천</Link></li>
              <li><Link to="/ai/mbti-test" className="hover:text-white transition-colors">견종 MBTI 테스트</Link></li>
              <li><Link to="/breeds" className="hover:text-white transition-colors">견종 백과</Link></li>
              <li><Link to="/app" className="hover:text-white transition-colors">AI 행동 분석</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">회사</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Mung-AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
