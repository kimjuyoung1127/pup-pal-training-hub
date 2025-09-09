import React, { useState } from 'react';

// Mock data for demonstration
const mockMealPlan = {
  week: "2025년 9월 1주차",
  summary: "몽이의 관절 건강을 위한 맞춤형 식단",
  recommendations: [
    {
      day: "월요일",
      meals: [
        { time: "아침", description: "여주산 고구마 30g + 닭가슴살 50g", image: "https://placehold.co/100x100?text=아침" },
        { time: "점심", description: "이천 쌀밥 40g + 당근 20g", image: "https://placehold.co/100x100?text=점심" },
        { time: "저녁", description: "연어 40g + 브로콜리 15g", image: "https://placehold.co/100x100?text=저녁" }
      ]
    },
    {
      day: "화요일",
      meals: [
        { time: "아침", description: "파주 인삼 추출물 5ml + 닭가슴살 50g", image: "https://placehold.co/100x100?text=아침" },
        { time: "점심", description: "이천 쌀밥 40g + 시금치 20g", image: "https://placehold.co/100x100?text=점심" },
        { time: "저녁", description: "연어 40g + 고구마 30g", image: "https://placehold.co/100x100?text=저녁" }
      ]
    },
    {
      day: "수요일",
      meals: [
        { time: "아침", description: "닭가슴살 50g + 고구마 30g", image: "https://placehold.co/100x100?text=아침" },
        { time: "점심", description: "연어 40g + 브로콜리 15g", image: "https://placehold.co/100x100?text=점심" },
        { time: "저녁", description: "이천 쌀밥 40g + 당근 20g", image: "https://placehold.co/100x100?text=저녁" }
      ]
    },
    {
      day: "목요일",
      meals: [
        { time: "아침", description: "시금치 20g + 닭가슴살 50g", image: "https://placehold.co/100x100?text=아침" },
        { time: "점심", description: "고구마 30g + 연어 40g", image: "https://placehold.co/100x100?text=점심" },
        { time: "저녁", description: "이천 쌀밥 40g + 파주 인삼 추출물 5ml", image: "https://placehold.co/100x100?text=저녁" }
      ]
    },
    {
      day: "금요일",
      meals: [
        { time: "아침", description: "브로콜리 15g + 닭가슴살 50g", image: "https://placehold.co/100x100?text=아침" },
        { time: "점심", description: "당근 20g + 이천 쌀밥 40g", image: "https://placehold.co/100x100?text=점심" },
        { time: "저녁", description: "연어 40g + 고구마 30g", image: "https://placehold.co/100x100?text=저녁" }
      ]
    },
    {
      day: "토요일",
      meals: [
        { time: "아침", description: "고구마 30g + 닭가슴살 50g", image: "https://placehold.co/100x100?text=아침" },
        { time: "점심", description: "브로콜리 15g + 이천 쌀밥 40g", image: "https://placehold.co/100x100?text=점심" },
        { time: "저녁", description: "연어 40g + 당근 20g", image: "https://placehold.co/100x100?text=저녁" }
      ]
    },
    {
      day: "일요일",
      meals: [
        { time: "아침", description: "이천 쌀밥 40g + 시금치 20g", image: "https://placehold.co/100x100?text=아침" },
        { time: "점심", description: "닭가슴살 50g + 파주 인삼 추출물 5ml", image: "https://placehold.co/100x100?text=점심" },
        { time: "저녁", description: "고구마 30g + 브로콜리 15g", image: "https://placehold.co/100x100?text=저녁" }
      ]
    }
  ]
};

const WeeklyMealPlan: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);

  const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="bg-white p-6 rounded-lg border border-stone-200">
      <h3 className="text-zinc-900 text-xl font-bold leading-tight tracking-[-0.015em] mb-4">주간 식단 계획</h3>
      
      {/* Day selector */}
      <div className="flex border-b border-gray-200 mb-8">
        {mockMealPlan.recommendations.map((_, index) => (
          <a
            key={index}
            className={`day-selector-item flex-1 cursor-pointer border-b-[3px] px-4 py-3 text-center text-sm font-semibold transition-colors sm:px-6 ${
              selectedDay === index
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setSelectedDay(index)}
          >
            <span className="hidden sm:inline">{mockMealPlan.recommendations[index].day}</span>
            <span className="sm:hidden">{daysOfWeek[index]}</span>
          </a>
        ))}
      </div>
      
      {/* Meals for selected day */}
      <div className="grid gap-8 md:grid-cols-3">
        {mockMealPlan.recommendations[selectedDay].meals.map((meal, index) => (
          <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-xl font-bold text-zinc-900">{meal.time}</h4>
            <div className="flex items-center gap-4">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shrink-0"
                style={{ backgroundImage: `url(${meal.image})` }}
              />
              <div>
                <p className="font-semibold text-zinc-900">{meal.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyMealPlan;