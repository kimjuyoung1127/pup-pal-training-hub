import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-4">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-3">
          <Link to="/privacy" className="hover:text-white transition-colors text-sm">
            개인정보처리방침
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors text-sm">
            이용약관
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors text-sm">
            문의하기
          </Link>
        </div>
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Mung-AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
