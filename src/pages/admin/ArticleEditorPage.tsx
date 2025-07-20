import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

// articles 테이블 스키마에 맞춘 타입 정의
interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  summary: string;
  is_published: boolean;
  // ... 다른 필드들
}

const ArticleEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        setArticle(null);
      } else {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  const handleSave = async () => {
    if (!article) return;
    // TODO: 저장 로직 구현
    console.log('Saving article:', article);
    const { data, error } = await supabase
      .from('articles')
      .update({ 
        title: article.title, 
        content: article.content,
        summary: article.summary,
        category: article.category,
       })
      .eq('id', article.id);

    if (error) {
      alert('저장에 실패했습니다.');
      console.error(error);
    } else {
      alert('저장되었습니다.');
    }
  };
  
  const handlePublish = async () => {
    if (!article) return;
    // TODO: 발행 로직 구현
    console.log('Publishing article:', article);
     const { data, error } = await supabase
      .from('articles')
      .update({ is_published: true, published_at: new Date().toISOString() })
      .eq('id', article.id);

    if (error) {
      alert('발행에 실패했습니다.');
      console.error(error);
    } else {
      alert('발행되었습니다.');
      setArticle({ ...article, is_published: true });
    }
  }

  if (loading) {
    return <div>아티클 로딩 중...</div>;
  }

  if (!article) {
    return <div>아티클을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">아티클 수정</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            type="text"
            id="title"
            value={article.title}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
          <input
            type="text"
            id="category"
            value={article.category}
            onChange={(e) => setArticle({ ...article, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">요약</label>
          <textarea
            id="summary"
            rows={3}
            value={article.summary}
            onChange={(e) => setArticle({ ...article, summary: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">내용 (Markdown)</label>
          <textarea
            id="content"
            rows={20}
            value={article.content}
            onChange={(e) => setArticle({ ...article, content: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md font-mono"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-4">
        <button onClick={handleSave} className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">
          임시 저장
        </button>
        <button 
          onClick={handlePublish} 
          disabled={article.is_published}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {article.is_published ? '발행됨' : '발행하기'}
        </button>
      </div>
    </div>
  );
};

export default ArticleEditorPage;
