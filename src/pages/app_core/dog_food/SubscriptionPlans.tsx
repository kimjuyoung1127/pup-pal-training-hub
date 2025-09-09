import React from 'react';

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

const SubscriptionPlans: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            당신의 반려견에게 딱 맞는 플랜을 찾아보세요
          </h1>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
            신선하고 건강한 식단이 당신의 반려견에게 전달됩니다. 가장 사랑하는 친구에게 최고의 것을 제공하세요.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {subscriptionPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`flex flex-col gap-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm h-full ${
                plan.popular ? "relative border-2 border-orange-500 shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <div className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-full px-4 py-1">
                    인기
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-stone-900">{plan.name}</h2>
                <p className="flex items-baseline gap-1 text-stone-900">
                  <span className="text-4xl font-extrabold tracking-tighter">{plan.price.split('/')[0]}</span>
                  <span className="text-sm font-semibold text-stone-500">/ {plan.price.split('/')[1]}</span>
                </p>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-stone-600">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg text-green-500">check_circle</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className={`mt-auto w-full flex items-center justify-center rounded-full h-12 px-6 text-base font-bold transition-colors ${
                  plan.popular 
                    ? "bg-orange-500 text-white shadow-sm hover:bg-orange-600" 
                    : "bg-stone-100 text-stone-800 hover:bg-stone-200"
                }`}
              >
                선택하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;