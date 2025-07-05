import { useEffect, useState, useRef } from 'react';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PricingPage = () => {
  const [user, setUser] = useState(null);
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef(null);
  const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eun'; // 나중에 실제 클라이언트 키로 교체해야 합니다.

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const fetchPaymentWidget = async () => {
      try {
        const paymentWidget = await loadPaymentWidget(clientKey, user?.id || '@ANONYMOUS');
        paymentWidgetRef.current = paymentWidget;

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          '#payment-widget',
          { value: 4900 },
          { variantKey: 'DEFAULT' }
        );
        paymentMethodsWidgetRef.current = paymentMethodsWidget;

        paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' });
      } catch (error) {
        console.error('Error fetching payment widget:', error);
      }
    };

    fetchPaymentWidget();
  }, [user?.id]);

  const proFeatures = [
    'AI 챗봇 무제한 이용',
    '모든 훈련 프로그램 잠금 해제',
    '상세한 훈련 진행 상황 분석',
    '맞춤형 AI 훈련 추천',
    '새로운 기능 우선 이용',
  ];

  const handlePayment = async () => {
    const paymentWidget = paymentWidgetRef.current;

    if (!user) {
        alert('로그인이 필요합니다.');
        return;
    }

    try {
      await paymentWidget?.requestPayment({
        orderId: `${user.id}-${new Date().getTime()}`,
        orderName: 'DogFit Pro 플랜',
        customerName: user.email || '고객',
        customerEmail: user.email,
        successUrl: `${window.location.origin}/payment-success`,
        failUrl: `${window.location.origin}/payment-fail`,
      });
    } catch (error) {
      console.error('Error requesting payment:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-white dark:bg-gray-950 shadow-2xl rounded-2xl ring-1 ring-black/5">
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Pro 플랜</CardTitle>
            <CardDescription className="text-lg text-gray-500 dark:text-gray-400 pt-1">모든 기능을 제한 없이 이용하세요</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="my-4 text-center">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">₩4,900</span>
              <span className="text-gray-500 dark:text-gray-400">/ 월</span>
            </div>
            <ul className="space-y-4 mb-8">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            {/* Toss Payments 위젯이 렌더링될 위치 */}
            <div id="payment-widget" />
            <div id="agreement" />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 p-8 pt-0">
            <Button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base py-6 rounded-lg">
              Pro 플랜으로 업그레이드
            </Button>
            <Link to="/" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              나중에 하기
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PricingPage;