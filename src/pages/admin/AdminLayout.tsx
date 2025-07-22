import { Outlet, Navigate } from 'react-router-dom';

// 이 값은 실제 인증 시스템에서 가져와야 합니다.
// 예시: const { user } = useUser();
// const isAdmin = user?.id === process.env.REACT_APP_ADMIN_ID;
const isAdmin = true; // 개발을 위해 임시로 true 설정

const AdminLayout = () => {
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white p-5">
        <div className="font-bold text-xl mb-10">Mung-AI CMS</div>
        <nav className="flex flex-col gap-4">
          <a href="/admin" className="text-lg hover:text-gray-300">대시보드</a>
          <a href="/admin/suggestions" className="text-lg hover:text-gray-300">콘텐츠 아이디어</a>
          <a href="/admin/articles" className="text-lg hover:text-gray-300">아티클 관리</a>
        </nav>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
