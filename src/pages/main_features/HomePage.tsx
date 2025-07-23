// AI/src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import DynamicCategorizedFeed from '@/components/DynamicCategorizedFeed';
import HeroSection from '@/components/HeroSection';
import FullArticleFeed from '@/components/FullArticleFeed';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('category')
        .eq('is_published', true);

      if (error) {
        console.error('Error fetching categories:', error);
      } else if (data) {
        // .trim()을 추가하여 각 카테고리 이름의 앞뒤 공백을 제거합니다.
        // 이렇게 하면 " 건강"과 "건강"이 같은 것으로 처리됩니다.
        const uniqueCategories = [...new Set(data.map(item => item.category.trim()))];
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
          // key 값으로 category를 사용하면, 공백이 제거된 동일한 카테고리가
          // 여러 개 있을 경우 key 중복 오류가 발생할 수 있으므로,
          // category와 index를 조합하여 더 안전한 key를 만듭니다.
          <div key={`${category}-${index}`} className={index % 2 === 0 ? 'bg-white' : ''}>
             <DynamicCategorizedFeed title={category} category={category} />
          </div>
        ))}
      </div>
      
      

      {/* 전체 아티클 피드 (스스로 데이터 로딩) */}
      <FullArticleFeed />
    </div>
  );
};

export default HomePage;