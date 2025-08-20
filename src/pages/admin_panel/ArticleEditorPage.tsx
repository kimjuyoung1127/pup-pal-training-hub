import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useArticle } from './hooks/useArticle';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import MdEditor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import 'react-markdown-editor-lite/lib/index.css';
import { AIFormatterModal } from './components/AIFormatterModal';

// 'articles' 테이블 타입 - 실제 스키마에 맞게 확장 가능
type ArticlePayload = {
  title?: string;
  content?: string;
  summary?: string;
  category?: string;
  is_published?: boolean;
  published_at?: string | null;
};

const ArticleEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: initialArticle, isLoading, isError, error } = useArticle(id!);
  const [article, setArticle] = useState(initialArticle);

  useEffect(() => {
    if (initialArticle) {
      setArticle(initialArticle);
    }
  }, [initialArticle]);

  const updateArticleMutation = useMutation({
    mutationFn: async (payload: ArticlePayload) => {
      if (!id) throw new Error('Article ID is missing');
      const { error } = await supabase.from('articles').update(payload).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      const isPublishing = variables.is_published !== undefined;
      if (!isPublishing) {
        alert(article?.is_published ? '업데이트되었습니다.' : '저장되었습니다.');
      }
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
    },
    onError: (error) => {
      alert(`오류가 발생했습니다: ${error.message}`);
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Article ID is missing');
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      alert('아티클이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      navigate('/admin/articles');
    },
    onError: (error) => {
      alert(`삭제에 실패���습니다: ${error.message}`);
    },
  });

  const handleSave = () => {
    if (!article) return;
    const { title, content, summary, category } = article;
    updateArticleMutation.mutate({ title, content, summary, category });
  };

  const handlePublish = () => {
    if (!article || article.is_published) return;
    if (window.confirm('정말로 이 아티클을 발행하시겠습니까? 되돌릴 수 없습니다.')) {
      updateArticleMutation.mutate(
        { is_published: true, published_at: new Date().toISOString() },
        {
          onSuccess: () => {
            alert('발행되었습니다.');
            setArticle(prev => prev ? { ...prev, is_published: true } : null);
          }
        }
      );
    }
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 아티클을 삭제하시겠습니까?')) {
      deleteArticleMutation.mutate();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setArticle(prev => prev ? { ...prev, [id]: value } : null);
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setArticle(prev => prev ? { ...prev, content: text } : null);
  };

  const onImageUpload = async (file: File) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('이미지를 업로드하려면 로그인이 필요합니다.');
      return Promise.reject('User not authenticated');
    }

    const fileName = `${uuidv4()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('articles-images')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      alert('이미지 업로드에 실패했습니다.');
      return Promise.reject(uploadError);
    }

    const { data } = supabase.storage
      .from('articles-images')
      .getPublicUrl(fileName);

    return Promise.resolve(data.publicUrl);
  };

  if (isLoading) return <div>아티클 로딩 중...</div>;
  if (isError) return <div>오류가 발생했습니다: {error?.message}</div>;
  if (!article) return <div>아티클을 찾을 수 없습니다.</div>;

  return (
    <>
      <AIFormatterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFormatComplete={(formattedText) => {
          setArticle(prev => prev ? { ...prev, content: formattedText } : null);
        }}
      />
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6">아티클 수정</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              type="text"
              id="title"
              value={article.title || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <input
              type="text"
              id="category"
              value={article.category || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">요약</label>
            <textarea
              id="summary"
              rows={3}
              value={article.summary || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">내용</label>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm hover:bg-blue-200 font-semibold"
              >
                ✨ AI로 붙여넣기
              </button>
            </div>
            <MdEditor
              value={article.content || ''}
              style={{ height: '500px' }}
              renderHTML={text => <div className="prose max-w-none"><ReactMarkdown>{text}</ReactMarkdown></div>}
              onChange={handleEditorChange}
              onImageUpload={onImageUpload}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-between items-center">
          <div>
            <button 
              onClick={handleDelete}
              disabled={deleteArticleMutation.isPending}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
            >
              {deleteArticleMutation.isPending ? '삭제 중...' : '삭제하기'}
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={updateArticleMutation.isPending}
              className={`${
                article.is_published
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-500 hover:bg-gray-600'
              } text-white px-6 py-2 rounded-md disabled:bg-gray-400`}
            >
              {updateArticleMutation.isPending && updateArticleMutation.variables?.is_published === undefined
                ? '처리 중...'
                : (article.is_published ? '업데이트' : '임시 저장')}
            </button>
            <button
              onClick={handlePublish}
              disabled={article.is_published || updateArticleMutation.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {article.is_published ? '발행됨' : (updateArticleMutation.isPending && updateArticleMutation.variables?.is_published ? '발행 중...' : '발행하기')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleEditorPage;