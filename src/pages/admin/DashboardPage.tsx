import React from 'react';
import { useDashboardStats } from './hooks/useDashboardStats';

const StatCard = ({ title, value, description, color, isLoading }: { title: string, value: number, description: string, color: string, isLoading: boolean }) => {
  const bgColor = `bg-${color}-100`;
  const titleColor = `text-${color}-800`;
  const valueColor = `text-${color}-900`;
  const descColor = `text-${color}-700`;

  return (
    <div className={`${bgColor} p-6 rounded-lg`}>
      <h3 className={`font-bold text-lg ${titleColor}`}>{title}</h3>
      {isLoading ? (
        <div className="h-10 mt-2 bg-gray-300 rounded animate-pulse w-1/2"></div>
      ) : (
        <p className={`text-3xl font-bold ${valueColor} mt-2`}>{value}개</p>
      )}
      <p className={`text-sm ${descColor} mt-1`}>{description}</p>
    </div>
  );
};


const DashboardPage = () => {
  const { data, isLoading, isError, error } = useDashboardStats();

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4">관리자 대시보드</h2>
      <p className="text-gray-600">Pet-Life Magazine 콘텐츠 관리 시스템에 오신 것을 환영합니다.</p>
      
      {isError && <div className="mt-4 text-red-500">데이터 로딩 실패: {error.message}</div>}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          title="새로운 아이디어"
          value={data?.suggestionsCount ?? 0}
          description="글쓰기를 기다리고 있어요."
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="발행된 아티클"
          value={data?.publishedArticlesCount ?? 0}
          description="사이트에 게시되었습니다."
          color="green"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
