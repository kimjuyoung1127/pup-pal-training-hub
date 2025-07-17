
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} Mungai. All rights reserved.</p>
        <nav className="mt-2">
          <Link to="/app" className="text-sm text-gray-500 hover:underline mx-2">
            Mungai 서비스 소개
          </Link>
          |
          <Link to="/PrivacyPolicyPage" className="text-sm text-gray-500 hover:underline mx-2">
            개인정보처리방침
          </Link>
          |
          <Link to="/TermsOfServicePage" className="text-sm text-gray-500 hover:underline mx-2">
            이용약관
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
