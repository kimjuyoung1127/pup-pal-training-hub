import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link to={to} className="text-gray-700 hover:text-indigo-600 transition-colors font-semibold">
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }: { to: string, children: React.ReactNode, onClick: () => void }) => (
  <Link to={to} onClick={onClick} className="block py-3 text-2xl font-bold text-center text-gray-800 hover:bg-indigo-50 rounded-lg">
    {children}
  </Link>
);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-900">Mung-AI</Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-8">
              <NavLink to="/health">건강 정보</NavLink>
              <NavLink to="/training">훈련/행동</NavLink>
              <NavLink to="/nutrition">영양/식단</NavLink>
              <div className="relative group">
                <button className="text-gray-700 hover:text-indigo-600 transition-colors font-semibold flex items-center">
                  AI 솔루션 <span className="ml-1">▼</span>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40">
                  <Link to="/ai/breed-recommender" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">AI 견종 추천</Link>
                  <Link to="/ai/mbti-test" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">견종 MBTI 테스트</Link>
                  <Link to="/breeds" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">견종 백과</Link>
                  <Link to="/app" className="block px-4 py-2 text-indigo-600 font-bold hover:bg-gray-100">AI 행동 분석</Link>
                </div>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-gray-900">
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link to="/" className="text-2xl font-bold text-gray-900">Mung-AI</Link>
            <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-gray-900">
              <X size={28} />
            </button>
          </div>
          <nav className="flex-grow p-8 flex flex-col items-center justify-center space-y-6">
            <MobileNavLink to="/health" onClick={toggleMobileMenu}>건강 정보</MobileNavLink>
            <MobileNavLink to="/training" onClick={toggleMobileMenu}>훈련/행동</MobileNavLink>
            <MobileNavLink to="/nutrition" onClick={toggleMobileMenu}>영양/식단</MobileNavLink>
            <hr className="w-full border-t border-gray-200" />
            <MobileNavLink to="/ai/breed-recommender" onClick={toggleMobileMenu}>AI 견종 추천</MobileNavLink>
            <MobileNavLink to="/ai/mbti-test" onClick={toggleMobileMenu}>견종 MBTI 테스트</MobileNavLink>
            <MobileNavLink to="/breeds" onClick={toggleMobileMenu}>견종 백과</MobileNavLink>
            <MobileNavLink to="/app" onClick={toggleMobileMenu}>AI 행동 분석</MobileNavLink>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
