import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'; // Supabase 클라이언트 import

// Supabase 스키마에 맞춘 타입 정의
interface SuggestedTopic {
  id: string; // uuid
  created_at: string; // timestamp
  suggested_title_ko: string;
  summary_ko: string;
  original_url: string;
  image_url: string;
  status: string;
  category: string;
  source_name: string;
}

const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState<SuggestedTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState<string | null>(null); // 현재 생성 중인 토픽 ID 저장
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('suggested_topics')
        .select('*')
        .eq('status', 'new')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching suggestions:', error);
      } else if (data) {
        setSuggestions(data);
      }
      setLoading(false);
    };
    
    fetchSuggestions();
  }, []);

  const handleStartWriting = async (topicId: string) => {
    if (isCreating) return; // 이미 생성 중이면 중복 실행 방지
    setIsCreating(topicId);

    const { data: new_article_id, error } = await supabase.rpc('create_article_from_suggestion', {
      suggestion_id: topicId,
    });

    if (error) {
      console.error('Error creating article from suggestion:', error);
      alert('초안 생성에 실패했습니다. 다시 시도해주세요.');
      setIsCreating(null);
    } else {
      console.log('Successfully created draft with id:', new_article_id);
      // 성공 시, 해당 아이디어를 UI에서 즉시 제거
      setSuggestions(suggestions.filter(s => s.id !== topicId));
      // 새로 생성된 아티클의 에디터 페이지로 이동
      navigate(`/admin/editor/${new_article_id}`);
    }
  };

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">콘텐츠 아이디어</h2>
      {suggestions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">새로운 콘텐츠 아이디어가 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">AI 파이프라인이 곧 새로운 아이디어를 가져올 것입니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestions.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <img src={topic.image_url || 'https://via.placeholder.com/600x400'} alt={topic.suggested_title_ko} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm text-gray-500 mb-2">{topic.category} · {topic.source_name}</div>
                <h3 className="text-xl font-bold mb-3 flex-grow">{topic.suggested_title_ko}</h3>
                <p className="text-gray-600 text-sm mb-4">{topic.summary_ko}</p>
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => handleStartWriting(topic.id)}
                    disabled={isCreating === topic.id}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {isCreating === topic.id ? '생성 중...' : '글쓰기 시작'}
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
