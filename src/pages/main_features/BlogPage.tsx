
import React, { useState } from 'react';
import { useBreeds } from '@/hooks/useBreeds';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Heart, PawPrint } from 'lucide-react';
import Footer from '@/components/Footer';
import BreedCard from '@/components/BreedCard';

const BlogPage: React.FC = () => {
  const { data: breeds, isLoading, error } = useBreeds();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('all');

  const filteredBreeds = breeds?.filter(breed => {
    const matchesSize = selectedSize === 'all' || breed.size_type === selectedSize;
    const matchesSearch = searchQuery === '' ||
                          breed.name_ko.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          breed.name_en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSize && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-pink-500 mx-auto" />
            <PawPrint className="h-8 w-8 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-4 text-lg text-gray-600 font-medium">귀여운 친구들을 찾고 있어요... 🐕</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex justify-center items-center">
        <div className="text-center py-20 text-red-500 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-red-200">
          <p className="text-lg font-semibold">앗! 오류가 발생했어요 😢</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
        <div className="container mx-auto px-4 py-12">
          {/* 헤더 섹션 */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <div className="flex space-x-2">
                <PawPrint className="h-6 w-6 text-pink-300 animate-bounce" style={{animationDelay: '0s'}} />
                <PawPrint className="h-6 w-6 text-purple-300 animate-bounce" style={{animationDelay: '0.2s'}} />
                <PawPrint className="h-6 w-6 text-rose-300 animate-bounce" style={{animationDelay: '0.4s'}} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent">
                견종 탐색
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-light leading-relaxed">
              🐾 다양한 견종을 탐색하고 당신에게 맞는 완벽한 친구를 찾아보세요!
            </p>
          </div>

          {/* 검색 및 필터 섹션 */}
          <div className="mb-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-400" />
                <Input
                  placeholder="견종 이름으로 검색 (한글 또는 영문) 🔍"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-2 border-pink-200 focus:border-pink-400 bg-white/80 backdrop-blur-sm text-gray-800 placeholder:text-gray-600 font-medium"
                />
              </div>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="h-12 rounded-2xl border-2 border-indigo-200 focus:border-indigo-400 bg-white/80 backdrop-blur-sm text-gray-800 font-medium">
                  <SelectValue placeholder="크기 선택 📏" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-indigo-200 bg-white/95 backdrop-blur-sm">
                  <SelectItem value="all" className="hover:bg-indigo-50 focus:bg-indigo-50 text-gray-800 font-medium">🐕 모든 크기</SelectItem>
                  <SelectItem value="소형" className="hover:bg-indigo-50 focus:bg-indigo-50 text-gray-800 font-medium">🐕‍🦺 소형견</SelectItem>
                  <SelectItem value="중형" className="hover:bg-indigo-50 focus:bg-indigo-50 text-gray-800 font-medium">🐕 중형견</SelectItem>
                  <SelectItem value="대형" className="hover:bg-indigo-50 focus:bg-indigo-50 text-gray-800 font-medium">🐕‍🦮 대형견</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 결과 카운트 */}
          {filteredBreeds && (
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600">
                총 <span className="font-bold text-pink-600 text-xl">{filteredBreeds.length}</span>마리의 
                <span className="font-semibold text-purple-600">귀여운 친구들</span>을 찾았어요! 🎉
              </p>
            </div>
          )}

          {/* 견종 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredBreeds?.map((breed) => (
              <BreedCard key={breed.id} breed={breed} />
            ))}
          </div>

          {/* 빈 결과 상태 */}
          {filteredBreeds?.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border-2 border-gray-200 max-w-md mx-auto">
                <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-600 font-semibold mb-2">검색 결과가 없어요 😢</p>
                <p className="text-sm text-gray-500">다른 검색어나 필터를 시도해보세요!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
