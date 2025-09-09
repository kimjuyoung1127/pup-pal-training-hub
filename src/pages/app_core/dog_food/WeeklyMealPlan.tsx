import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';

const WeeklyMealPlan: React.FC = () => {
  // Mock data for demonstration
  const mockMealPlan = {
    week: "2025년 9월 1주차",
    summary: "몽이의 관절 건강을 위한 맞춤형 식단",
    recommendations: [
      {
        day: "월요일",
        meals: [
          { time: "아침", description: "여주산 고구마 30g + 닭가슴살 50g" },
          { time: "점심", description: "이천 쌀밥 40g + 당근 20g" },
          { time: "저녁", description: "연어 40g + 브로콜리 15g" }
        ]
      },
      {
        day: "화요일",
        meals: [
          { time: "아침", description: "파주 인삼 추출물 5ml + 닭가슴살 50g" },
          { time: "점심", description: "이천 쌀밥 40g + 시금치 20g" },
          { time: "저녁", description: "연어 40g + 고구마 30g" }
        ]
      }
    ]
  };

  return (
    <Card className="rounded-2xl shadow-md border border-[#E7EBE4] bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-[#3D405B]">
          <Calendar className="mr-2 text-[#A3B899]" />
          {mockMealPlan.week} 맞춤 식단
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockMealPlan.recommendations.map((dayPlan, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg mb-2 text-[#3D405B]">{dayPlan.day}</h3>
              <div className="grid gap-2">
                {dayPlan.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="flex items-start">
                    <span className="font-semibold w-12 text-[#E07A5F]">{meal.time}</span>
                    <span className="flex-1 text-[#3D405B]">{meal.description}</span>
                  </div>
                ))}
              </div>
              {index < mockMealPlan.recommendations.length - 1 && (
                <Separator className="my-4 bg-[#EAE7E2]" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyMealPlan;