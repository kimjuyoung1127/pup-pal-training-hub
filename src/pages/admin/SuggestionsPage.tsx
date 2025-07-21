import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useSuggestions } from './hooks/useSuggestions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const SuggestionsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: suggestions, isLoading, isError, error } = useSuggestions();

  // '글쓰기 시작' 뮤테이션
  const createArticleMutation = useMutation({
    mutationFn: async (topicId: string) => {
      const { data: new_article_id, error } = await supabase.rpc('create_article_from_suggestion', {
        p_suggestion_id: topicId,
      });
      if (error) throw error;
      return new_article_id;
    },
    onSuccess: (new_article_id) => {
      console.log('Successfully created draft with id:', new_article_id);
      // 글감 목록과 아티클 목록을 모두 새로고침
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      // 새로 생성된 아티클의 에디터 페이지로 이동
      navigate(`/admin/editor/${new_article_id}`);
    },
    onError: (error) => {
      console.error('Error creating article from suggestion:', error);
      alert('초안 생성에 실패했습니다. 다시 시도해주세요.');
    },
  });

  // '삭제' 뮤테이션
  const deleteSuggestionMutation = useMutation({
    mutationFn: async (topicId: string) => {
      const { error } = await supabase.from('suggested_topics').delete().eq('id', topicId);
      if (error) throw error;
    },
    onSuccess: () => {
      alert('아이디어가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
    onError: (error) => {
      console.error('Error deleting suggestion:', error);
      alert('아이디어 삭제에 실패했습니다.');
    },
  });

  const handleStartWriting = (topicId: string) => {
    createArticleMutation.mutate(topicId);
  };

  const handleEdit = (articleId: string) => {
    navigate(`/admin/editor/${articleId}`);
  };

  const handleDeleteSuggestion = (topicId: string) => {
    if (window.confirm('정말로 이 아이디어를 삭제하시겠습니까?')) {
      deleteSuggestionMutation.mutate(topicId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">로딩 중...</div>;
  }
  
  if (isError) {
    return <div className="text-center py-12 text-red-500">오류가 발생했습니다: {error.message}</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">콘텐츠 아이디어</h2>
      {suggestions?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">새로운 콘텐츠 아이디어가 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">AI 파이프라인이 곧 새로운 아이디어를 가져올 것입니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestions?.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <img src={topic.image_url || 'https://via.placeholder.com/600x400'} alt={topic.suggested_title_ko} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm text-gray-500 mb-2">{topic.category} · {topic.source_name}</div>
                <h3 className="text-xl font-bold mb-3 flex-grow">{topic.suggested_title_ko}</h3>
                <p className="text-gray-600 text-sm mb-4">{topic.summary_ko}</p>
                <div className="mt-auto pt-4 border-t border-gray-200 flex gap-2">
                  {(topic as any).articles && (topic as any).articles.length > 0 ? (
                    <button 
                      onClick={() => handleEdit((topic as any).articles[0].id)}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                      수정하기
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStartWriting(topic.id)}
                      disabled={createArticleMutation.isPending && createArticleMutation.variables === topic.id}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                      {createArticleMutation.isPending && createArticleMutation.variables === topic.id ? '생성 중...' : '글쓰기 시작'}
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteSuggestion(topic.id)}
                    disabled={deleteSuggestionMutation.isPending && deleteSuggestionMutation.variables === topic.id}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-400"
                  >
                    {deleteSuggestionMutation.isPending && deleteSuggestionMutation.variables === topic.id ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionsPage;
