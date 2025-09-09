import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SubscriptionPlans: React.FC = () => {
  const subscriptionPlans = [
    {
      name: "Starter Plan",
      price: "29,900원/주",
      features: [
        "주간 맞춤 식단 제공",
        "기본 지역 농산물 사용",
        "주 1회 배송"
      ]
    },
    {
      name: "Standard Plan",
      price: "49,900원/주",
      features: [
        "주간 맞춤 식단 제공",
        "프리미엄 지역 농산물 사용",
        "주 2회 배송",
        "영양사 상담 1회/월"
      ],
      popular: true
    },
    {
      name: "Senior Care Plan",
      price: "59,900원/주",
      features: [
        "고령견 맞춤 식단",
        "프리미엄 지역 농산물 사용",
        "주 2회 배송",
        "영양사 상담 2회/월",
        "건강 추적 리포트"
      ]
    }
  ];

  return (
    <Card className="rounded-2xl shadow-md border border-[#E7EBE4] bg-white">
      <CardHeader>
        <CardTitle className="text-[#3D405B]">구독 플랜</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl p-6 bg-white shadow-sm border transition-all
                ${plan.popular
                  ? 'border-[#E07A5F] ring-2 ring-[#F7D1C8]'
                  : 'border-[#E7EBE4] hover:shadow-md'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E07A5F] text-white text-xs px-3 py-1 rounded-full shadow-sm">
                  인기
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 text-[#3D405B]">{plan.name}</h3>
              <p className="text-2xl font-extrabold text-[#E07A5F] mb-4">{plan.price}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-[#3D405B]">
                    <span className="text-[#A3B899] mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full rounded-xl
                  ${plan.popular
                    ? 'bg-[#E07A5F] hover:bg-[#cf6a52] text-white shadow-md'
                    : 'border border-[#A3B899] text-[#3D405B] hover:bg-[#F1F4EE]'
                  }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                선택하기
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlans;