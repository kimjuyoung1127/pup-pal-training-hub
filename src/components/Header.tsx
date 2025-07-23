import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User, ShoppingBag } from 'lucide-react';

const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link to={to} className="text-slate-700 hover:text-amber-600 transition-colors duration-300 font-medium">
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }: { to: string, children: React.ReactNode, onClick: () => void }) => (
  <Link to={to} onClick={onClick} className="block py-3 text-2xl font-bold text-center text-slate-800 hover:bg-cream-200 rounded-lg transition-colors duration-300">
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
      <header className="bg-cream-100 border-b border-cream-200 sticky top-0 z-30 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-3xl font-bold text-slate-800 tracking-tight">
                Mung-AI
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-10">
              <NavLink to="/category/health">건강</NavLink>
              <NavLink to="/category/behavior">행동</NavLink>
              <NavLink to="/category/nutrition">영양</NavLink>
              <NavLink to="/category/lifestyle">라이프스타일</NavLink>
              <div className="relative group">
                <button className="text-slate-700 hover:text-amber-600 transition-colors duration-300 font-medium flex items-center">
                  AI 솔루션
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-cream-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40">
                  <Link to="/filter-wizard" className="block px-4 py-3 text-sm text-slate-700 hover:bg-cream-50">AI 견종 추천</Link>
                  <Link to="/mbti-test" className="block px-4 py-3 text-sm text-slate-700 hover:bg-cream-50">견종 MBTI 테스트</Link>
                  <Link to="/breeds" className="block px-4 py-3 text-sm text-slate-700 hover:bg-cream-50">견종 백과</Link>
                  <Link to="/app" className="block px-4 py-3 text-sm text-amber-600 font-semibold hover:bg-cream-50">AI 행동 분석</Link>
                </div>
              </div>
            </nav>

            {/* Desktop Icons */}
            <div className="hidden lg:flex items-center space-x-6">
              <button className="text-slate-600 hover:text-amber-600"><Search size={22} /></button>
              <button className="text-slate-600 hover:text-amber-600"><User size={22} /></button>
              <button className="text-slate-600 hover:text-amber-600"><ShoppingBag size={22} /></button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button onClick={toggleMobileMenu} className="text-slate-600 hover:text-slate-900">
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-cream-100 z-50 flex flex-col animate-fade-in-up">
          <div className="flex items-center justify-between h-20 px-4 border-b border-cream-200">
            <Link to="/" className="text-3xl font-bold text-slate-800">Mung-AI</Link>
            <button onClick={toggleMobileMenu} className="text-slate-600 hover:text-slate-900">
              <X size={28} />
            </button>
          </div>
          <nav className="flex-grow p-8 flex flex-col items-center justify-center space-y-6">
            <MobileNavLink to="/category/health" onClick={toggleMobileMenu}>건강</MobileNavLink>
            <MobileNavLink to="/category/behavior" onClick={toggleMobileMenu}>행동</MobileNavLink>
            <MobileNavLink to="/category/nutrition" onClick={toggleMobileMenu}>영양</MobileNavLink>
            <MobileNavLink to="/category/lifestyle" onClick={toggleMobileMenu}>라이프스타일</MobileNavLink>
            <hr className="w-full border-t border-cream-200 my-4" />
            <MobileNavLink to="/filter-wizard" onClick={toggleMobileMenu}>AI 견종 추천</MobileNavLink>
            <MobileNavLink to="/mbti-test" onClick={toggleMobileMenu}>견종 MBTI 테스트</MobileNavLink>
            <MobileNavLink to="/breeds" onClick={toggleMobileMenu}>견종 백과</MobileNavLink>
            <MobileNavLink to="/app" onClick={toggleMobileMenu}>AI 행동 분석</MobileNavLink>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;