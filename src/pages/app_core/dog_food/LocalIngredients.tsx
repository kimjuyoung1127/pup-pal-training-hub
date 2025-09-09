import React from 'react';

// Mock data for demonstration
const mockIngredients = [
  { 
    name: "이천 쌀", 
    source: "경기도 이천시", 
    benefit: "소화에 좋은 주식",
    image: "https://placehold.co/400x400?text=이천+쌀"
  },
  { 
    name: "여주 고구마", 
    source: "경기도 여주시", 
    benefit: "관절 염증 완화",
    image: "https://placehold.co/400x400?text=여주+고구마"
  },
  { 
    name: "파주 인삼", 
    source: "경기도 파주시", 
    benefit: "면역력 강화",
    image: "https://placehold.co/400x400?text=파주+인삼"
  },
  { 
    name: "춘천 닭고기", 
    source: "강원도 춘천시", 
    benefit: "근육 발달에 도움",
    image: "https://placehold.co/400x400?text=춘천+닭고기"
  }
];

const LocalIngredients: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-stone-200">
      <h3 className="text-zinc-900 text-xl font-bold leading-tight tracking-[-0.015em] mb-3">지역 농산물</h3>
      <p className="text-zinc-600 text-base font-normal leading-relaxed mb-6">
        우리는 신선하고 고품질의 식재료를 위해 지역 농장을 직접 방문하여 식재료를 조달합니다. 
        이천 쌀, 여주 고구마, 파주 인삼 등 다양한 유기농 채소와 곡물을 사용합니다.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockIngredients.map((ingredient, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg group">
            <div 
              className="w-full h-40 bg-center bg-no-repeat bg-cover transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url(${ingredient.image})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-2">
              <div>
                <p className="text-white text-sm font-semibold">{ingredient.name}</p>
                <p className="text-white text-xs">{ingredient.source}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalIngredients;