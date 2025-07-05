import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // TODO: 서버에 결제 승인 요청 보내기
    // 이 곳에서 서버로 paymentKey, orderId, amount를 보내 최종 결제 승인을 요청하고,
    // 데이터베이스에 사용자의 플랜을 'pro'로 업데이트해야 합니다.
    // 예: fetch('/api/confirm-payment', { method: 'POST', body: JSON.stringify({ paymentKey, orderId, amount }) });
  }, [paymentKey, orderId, amount]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-3xl font-extrabold text-green-500">결제 성공</h2>
        <p className="text-gray-700 dark:text-gray-300">Pro 플랜으로 업그레이드해 주셔서 감사합니다!</p>
        <div className="p-4 bg-gray-100 rounded-md dark:bg-gray-700 text-left">
          <p><strong>주문 ID:</strong> {orderId}</p>
          <p><strong>결제 금액:</strong> {amount ? `${Number(amount).toLocaleString()}원` : 'N/A'}</p>
          <p><strong>Payment Key:</strong> {paymentKey}</p>
        </div>
        <Link to="/dashboard" className="w-full inline-block px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
          대시보드로 이동
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;