import React from 'react';

const DashboardPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4">관리자 대시보드</h2>
      <p className="text-gray-600">Pet-Life Magazine 콘텐츠 관리 시스템에 오신 것을 환영합니다.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-blue-800">새로운 아이디어</h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">12개</p>
          <p className="text-sm text-blue-700 mt-1">글쓰기를 기다리고 있어요.</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-green-800">발행된 아티클</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">58개</p>
          <p className="text-sm text-green-700 mt-1">사이트에 게시되었습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
