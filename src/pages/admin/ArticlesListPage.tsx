import React from 'react';

// 이 페이지는 `articles` 테이블의 내용을 보여주는 관리 페이지입니다.
// 필터링, 정렬, 삭제 등의 기능이 추가될 수 있습니다.

const ArticlesListPage = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">아티클 관리</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>이곳에서 작성된 아티클 목록을 확인하고 관리할 수 있습니다.</p>
        {/* TODO: Supabase에서 `articles` 데이터 가져와서 테이블 형태로 표시 */}
      </div>
    </div>
  );
};

export default ArticlesListPage;
