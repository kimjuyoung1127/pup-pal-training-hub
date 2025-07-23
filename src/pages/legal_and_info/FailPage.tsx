import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const FailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message');
  const code = searchParams.get('code');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-3xl font-extrabold text-red-500">결제 실패</h2>
        <p className="text-gray-700 dark:text-gray-300">결제 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
        <div className="p-4 bg-gray-100 rounded-md dark:bg-gray-700 text-left">
          <p><strong>오류 메시지:</strong> {message || '알 수 없는 오류'}</p>
          <p><strong>오류 코드:</strong> {code || 'N/A'}</p>
        </div>
        <Link to="/pricing" className="w-full inline-block px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
          결제 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default FailPage;