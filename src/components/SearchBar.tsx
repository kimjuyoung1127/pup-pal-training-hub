import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
      <Input
        className="w-full rounded-full border-gray-300 bg-gray-50 py-6 pl-12 pr-4 text-base text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
        placeholder="다른 보호자들의 훈련 팁 검색하기..."
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;