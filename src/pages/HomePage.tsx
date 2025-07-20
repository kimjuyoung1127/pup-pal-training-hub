// AI/src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import DynamicCategorizedFeed from '../components/DynamicCategorizedFeed';
import AIGateway from '../components/AIGateway';
import HeroSection from '../components/HeroSection';
import FullArticleFeed from '../components/FullArticleFeed';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      // Supabase의 PostgREST는 distinct를 직접 지원하지 않으므로,
      // RPC(데이터베이스 함수)를 사용하거나, 클라이언트 측에서 처리하는 것이 일반적입니다.
      // 여기서는 클라이언트 측에서 간단히 처리하겠습니다.
      const { data, error } = await supabase
        .from('articles')
        .select('category')
        .eq('is_published', true);

      if (error) {
        console.error('Error fetching categories:', error);
      } else if (data) {
        // 중복을 제거하여 유니크한 카테고리 목록을 만듭니다.
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <HeroSection />
      
      {/* 카테고리별 피드 (동적 생성) */}
      <div className="space-y-4 py-8">
        {categories.map((category, index) => (
          <div key={category} className={index % 2 === 0 ? 'bg-white' : ''}>
             <DynamicCategorizedFeed title={category} category={category} />
          </div>
        ))}
      </div>
      
      <AIGateway />

      {/* 전체 아티클 피드 (스스로 데이터 로딩) */}
      <FullArticleFeed />
    </div>
  );
};

export default HomePage;
