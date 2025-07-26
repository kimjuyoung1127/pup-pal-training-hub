import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-bold text-slate-800 tracking-tight">
              Mung-AI
            </Link>
          </div>

          {/* 향후 아이콘 추가를 위한 공간 (옵션) */}
          {/* 
          <div className="flex items-center space-x-4">
            <button className="text-slate-600 hover:text-sky-600">
              <Search size={22} />
            </button>
            <button className="text-slate-600 hover:text-sky-600">
              <User size={22} />
            </button>
          </div>
          */}
        </div>
      </div>
    </header>
  );
};

export default Header;
