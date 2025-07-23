import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Bootpay } from '@bootpay/client-js';
import { supabase } from '@/integrations/supabase/client';
import { type User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handlePayment = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await Bootpay.requestPayment({
        application_id: import.meta.env.VITE_BOOTPAY_APPLICATION_ID || '',
        price: 4900,
        order_name: 'Pro 플랜 구독',
        order_id: `pro-plan-${user.id}-${new Date().getTime()}`,
        pg: '토스페이먼츠',
        method: '카드',
        user: {
          id: user.id,
          username: user.user_metadata?.full_name || user.email,
          email: user.email,
        },
        extra: {
          open_type: 'iframe',
        }
      });
      if (response.event === 'done') {
        // 결제 완료시 success 페이지로 이동
        // TODO: 서버로 영수증 ID(response.data.receipt_id)를 보내 결제 검증 및 완료 처리
        navigate(`/success?orderId=${response.data.order_id}&amount=${response.data.price}&paymentKey=${response.data.receipt_id}`);
      }
    } catch (error) {
      console.error(error);
      const err = error as any;
      // 결제 실패시 fail 페이지로 이동
      navigate(`/fail?message=${err.message}&code=${err.code || 'UNKNOWN_ERROR'}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 relative">
      <Button 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4 bg-transparent hover:bg-gray-200 text-gray-800 p-2 rounded-full"
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <CardTitle className="text-4xl font-extrabold tracking-tight">Pro 플랜</CardTitle>
            <CardDescription className="text-lg text-gray-300 mt-2">모든 기능을 무제한으로 경험하세요.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-5xl font-bold tracking-tighter text-gray-900">₩4,900</span>
                <span className="text-xl text-gray-500">/월</span>
              </div>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    <span className="font-semibold">AI 훈련 코치</span> 무제한 이용
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    모든 <span className="font-semibold">훈련 프로그램</span> 무제한 접근
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    상세한 <span className="font-semibold">훈련 기록 분석</span> 및 리포트
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    새로운 기능 <span className="font-semibold">우선 접근</span> 혜택
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="p-8 bg-gray-50/50">
            <Button 
              className="w-full text-lg font-bold py-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out group" 
              onClick={handlePayment} 
              disabled={!user}
            >
              {user ? (
                <>
                  <span>월 4,900원으로 시작하기</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              ) : '로그인 후 이용 가능'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PricingPage;