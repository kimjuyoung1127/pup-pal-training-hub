
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { PawPrint, Search, TestTube2, Wand2 } from 'lucide-react';

const Header: React.FC = () => {
  const activeLinkStyle = {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    color: 'rgb(219, 39, 119)',
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 text-3xl font-bold text-pink-500 hover:text-pink-600 transition-colors group">
              <PawPrint className="h-10 w-10 transition-transform group-hover:rotate-12" />
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Mungai
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2 rounded-full bg-gray-100 p-2">
            <NavLink to="/" end className="flex items-center text-gray-700 hover:text-pink-500 px-4 py-2 rounded-full hover:bg-white transition-all duration-300 font-medium" style={({ isActive }) => isActive ? activeLinkStyle : {}}>
              <Search className="mr-2 h-5 w-5" />
              견종 백과
            </NavLink>
            <NavLink to="/mbti-test" className="flex items-center text-gray-700 hover:text-pink-500 px-4 py-2 rounded-full hover:bg-white transition-all duration-300 font-medium" style={({ isActive }) => isActive ? activeLinkStyle : {}}>
              <TestTube2 className="mr-2 h-5 w-5" />
              MBTI 테스트
            </NavLink>
            <NavLink to="/filter-wizard" className="flex items-center text-gray-700 hover:text-pink-500 px-4 py-2 rounded-full hover:bg-white transition-all duration-300 font-medium" style={({ isActive }) => isActive ? activeLinkStyle : {}}>
              <Wand2 className="mr-2 h-5 w-5" />
              맞춤 견종 찾기
            </NavLink>
          </nav>

          {/* CTA to Mungai App */}
          <div className="flex items-center">
            <Link to="/app" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300">
              AI 훈련 시작하기
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
