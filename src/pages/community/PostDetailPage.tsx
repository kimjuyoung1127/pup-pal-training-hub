import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePost } from './usePost';
import { useDeletePost } from './useDeletePost';
import { useToggleLike } from './useToggleLike';
import { supabase } from '@/integrations/supabase/client';
import { Heart, MessageSquare, UserCircle, Edit, Trash2 } from 'lucide-react';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    fetchUser();
  }, []);

  const { data: post, isLoading, error, refetch } = usePost(postId!);
  const deletePostMutation = useDeletePost();
  const toggleLikeMutation = useToggleLike(postId!);

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

  if (!post) {
    return (
      <div className="bg-gray-100 min-h-screen pt-4">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center py-12 text-gray-500">게시글을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const isPostAuthor = user && user.id === post.user_id;

  const handleDelete = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deletePostMutation.mutate(postId!, {
        onSuccess: () => {
          navigate('/community');
        }
      });
    }
  };

  const handleLike = () => {
    if (!user) {
      // 로그인하지 않은 경우 로그인 페이지로 리디렉션
      navigate('/login');
      return;
    }
    toggleLikeMutation.mutate(postId!);
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-4">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-slate-800 text-3xl font-bold leading-tight tracking-tighter">
              게시글 상세
            </h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/community')}
              className="flex items-center gap-2"
            >
              <span>← 커뮤니티로 돌아가기</span>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCircle className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{post.username || '알 수 없음'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                </div>
                {isPostAuthor && (
                  <div className="flex gap-2">
                    <Link to={`/community/edit/${postId}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        수정
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-3 h-3" />
                      삭제
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${
                    post.is_liked_by_user ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  <Heart 
                    className={`w-5 h-5 ${post.is_liked_by_user ? 'fill-current' : ''}`} 
                  />
                  <span>{post.like_count}</span>
                </button>
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageSquare className="w-5 h-5" />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">댓글 ({post.comments?.length || 0})</h2>
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3">
                    <UserCircle className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.username || '알 수 없음'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetailPage;