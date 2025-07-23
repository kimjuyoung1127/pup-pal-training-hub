import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useArticles } from './hooks/useArticles'; // useArticles 훅 임포트
import { useMutation, useQueryClient } from '@tanstack/react-query';

const ArticlesListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: articles, isLoading, isError, error } = useArticles(); // useArticles 훅 사용

  // 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      alert('아티클이 삭제되었습니다.');
      // 'articles' 쿼리를 무효화하여 목록을 새로고침
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error) => {
      alert('삭제에 실패했습니다.');
      console.error('Error deleting article:', error);
    },
  });

  const handleEdit = (id: string) => {
    navigate(`/admin/editor/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 아티클을 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">아티클 관리</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4">제목</th>
              <th className="text-left py-3 px-4">카테고리</th>
              <th className="text-left py-3 px-4">상태</th>
              <th className="text-left py-3 px-4">생성일</th>
              <th className="text-left py-3 px-4">발행일</th>
              <th className="text-left py-3 px-4">작업</th>
            </tr>
          </thead>
          <tbody>
            {articles?.map((article) => (
              <tr key={article.id} className="border-b">
                <td className="py-3 px-4">{article.title}</td>
                <td className="py-3 px-4">{article.category}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    article.is_published ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {article.is_published ? '발행됨' : '초안'}
                  </span>
                </td>
                <td className="py-3 px-4">{new Date(article.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4">{article.published_at ? new Date(article.published_at).toLocaleDateString() : '-'}</td>
                <td className="py-3 px-4">
                  <button onClick={() => handleEdit(article.id)} className="text-blue-600 hover:underline mr-4">수정</button>
                  <button 
                    onClick={() => handleDelete(article.id)} 
                    className="text-red-600 hover:underline"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? '삭제 중...' : '삭제'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticlesListPage;
