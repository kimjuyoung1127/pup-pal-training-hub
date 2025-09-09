import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const LocalIngredients: React.FC = () => {
  // Mock data for demonstration
  const mockIngredients = [
    { name: "이천 쌀", source: "경기도 이천시", benefit: "소화에 좋은 주식" },
    { name: "여주 고구마", source: "경기도 여주시", benefit: "관절 염증 완화" },
    { name: "파주 인삼", source: "경기도 파주시", benefit: "면역력 강화" }
  ];

  return (
    <Card className="rounded-2xl shadow-md border border-[#E7EBE4] bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-[#3D405B]">
          <MapPin className="mr-2 text-[#A3B899]" />
          사용된 지역 농산물
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockIngredients.map((ingredient, index) => (
            <div
              key={index}
              className="border border-[#E7EBE4] rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-[#3D405B]">{ingredient.name}</h4>
              <p className="text-sm text-[#5B5F7A] mt-1">{ingredient.source}</p>
              <p className="text-sm text-[#E07A5F] mt-2">{ingredient.benefit}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalIngredients;