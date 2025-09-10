import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Edit, PlusCircle } from 'lucide-react';
import { usePost } from './usePost';
import { useUpdatePost } from './useUpdatePost';
import { supabase } from '@/integrations/supabase/client';

const PostEditPage: React.FC = () => {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // 로그인하지 않은 경우 로그인 페이지로 리디렉션
      if (!session?.user) {
        navigate('/login');
      }
    };
    
    fetchUser();
  }, [navigate]);

  const { data: post, isLoading, error } = usePost(postId!);
  const updatePostMutation = useUpdatePost(postId!);

  // 게시글 데이터로 폼 초기화
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
    }
  }, [post]);

  // 게시글 작성자인지 확인
  useEffect(() => {
    if (post && user && post.user_id !== user.id) {
      // 다른 사용자의 게시글을 편집하려는 경우 커뮤니티 메인 페이지로 리디렉션
      navigate('/community');
    }
  }, [post, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !postId) return;
    
    setIsSubmitting(true);
    
    try {
      await updatePostMutation.mutateAsync({
        postId,
        updates: {
          title,
          content,
          category
        }
      });
      
      // 게시글 수정 후 해당 게시글 페이지로 이동
      navigate(`/community/${postId}`);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen pt-4">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center py-12 text-gray-500">게시글을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen pt-4">
        <div className="container mx-auto px-4 py-6">
          <p className="text-red-500 text-center py-12">오류가 발생했습니다: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-4">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-slate-800 text-3xl font-bold leading-tight tracking-tighter">
              게시글 수정
            </h1>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/community/${postId}`)}
              className="flex items-center gap-2"
            >
              <span>← 게시글로 돌아가기</span>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="게시글 제목을 입력하세요"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="general">자유 일상</option>
                  <option value="qna">훈련 Q&A</option>
                  <option value="gallery">우리 아이 자랑</option>
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  내용
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="게시글 내용을 입력하세요"
                  required
                  rows={10}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/community/${postId}`)}
                  type="button"
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? '수정 중...' : '수정하기'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostEditPage;