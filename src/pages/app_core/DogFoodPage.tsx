import React from 'react';
import DogProfileSummary from './dog_food/DogProfileSummary';
import AiAnalysisReport from './dog_food/AiAnalysisReport';
import WeeklyMealPlan from './dog_food/WeeklyMealPlan';
import LocalIngredients from './dog_food/LocalIngredients';
import SubscriptionPlans from './dog_food/SubscriptionPlans';

const DogFoodPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F6F2] py-10">
      <div className="max-w-5xl mx-auto space-y-8 px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-[#EAE7E2]">
          <h1 className="text-3xl font-extrabold text-[#3D405B]">AI 맞춤 사료 구독</h1>
          <p className="text-[#5B5F7A] mt-3">
            반려견의 건강 데이터를 기반으로 한 맞춤형 식단을 제공합니다
          </p>
        </div>

        <DogProfileSummary />
        <AiAnalysisReport />
        <WeeklyMealPlan />
        <LocalIngredients />
        <SubscriptionPlans />
      </div>
    </div>
  );
};

export default DogFoodPage;