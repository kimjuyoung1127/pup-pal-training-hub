import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, PlusCircle } from 'lucide-react';
import { usePosts } from './usePosts';
import { useCreatePost } from './useCreatePost';
import { useDeletePost } from './useDeletePost';
import PostCard from './PostCard';
import { supabase } from '@/integrations/supabase/client';

const POSTS_PER_PAGE = 12;

const Pagination: React.FC<{
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalCount, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-4 mt-12">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="bg-white"
      >
        이전
      </Button>
      <span className="text-sm font-medium text-gray-700">
        {currentPage} / {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        variant="outline"
        size="sm"
        className="bg-white"
      >
        다음
      </Button>
    </div>
  );
};

const CommunityPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    fetchUser();
    
    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data, isLoading, error, refetch } = usePosts(page, POSTS_PER_PAGE);
  const deletePostMutation = useDeletePost();
  const createPostMutation = useCreatePost();

  const posts = data?.posts || [];
  const totalCount = data?.count || 0;

  // 새 글 작성 핸들러
  const handleCreatePost = () => {
    if (!user) {
      // 로그인하지 않은 경우 로그인 페이지로 리디렉션
      navigate('/login');
      return;
    }
    navigate('/community/new');
  };

  // 게시글 삭제 핸들러
  const handleDeletePost = (postId: string) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deletePostMutation.mutate(postId, {
        onSuccess: () => {
          refetch();
        }
      });
    }
  };

  // 로그인 상태에 따른 새 글 작성 버튼 렌더링
  const renderCreatePostButton = () => {
    if (!user) {
      return (
        <Button 
          onClick={() => navigate('/login')}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700 md:h-16 md:w-16"
        >
          <PlusCircle className="w-6 h-6 md:w-8 md:h-8" />
        </Button>
      );
    }
    
    return (
      <Button 
        onClick={handleCreatePost}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700 md:h-16 md:w-16"
      >
        <PlusCircle className="w-6 h-6 md:w-8 md:h-8" />
      </Button>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-4">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-slate-800 text-2xl font-bold leading-tight tracking-tighter text-center md:text-3xl">
            AI와 함께하는 강아지 훈련 커뮤니티
          </h1>
          <p className="text-slate-500 text-base font-normal leading-normal text-center mt-2 mb-6 md:text-lg">
            훈련 팁을 공유하고 전문가의 조언을 얻으세요.
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              className="w-full rounded-full border-gray-300 bg-gray-50 py-5 pl-12 pr-4 text-base text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 md:py-6"
              placeholder="다른 보호자들의 훈련 팁 검색하기..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Navigation */}
          <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-4">
            {[
              { name: "자유 일상", icon: "🐾", active: true },
              { name: "훈련 Q&A", icon: "❓", active: false },
              { name: "성공 후기", icon: "🏆", active: false },
              { name: "우리 아이 자랑", icon: "🌟", active: false }
            ].map((category, index) => (
              <Link
                key={index}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-slate-700 transition-colors ${
                  category.active
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                to="#"
              >
                <span className="text-2xl">{category.icon}</span>
                <p className="text-xs font-bold text-center md:text-sm">{category.name}</p>
              </Link>
            ))}
          </div>

          {/* Posts Grid */}
          {isLoading && <p className="text-center py-12 text-gray-500">게시글을 불러오는 중입니다...</p>}
          {error && <p className="text-red-500 text-center py-12">오류가 발생했습니다: {error.message}</p>}
          
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUser={user}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalCount={totalCount}
                onPageChange={setPage}
              />
            </>
          ) : (
            !isLoading && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-700 md:text-2xl">아직 이야기가 없어요!</h2>
                <p className="text-gray-500 mt-2 mb-6">첫 번째 주인공이 되어 당신의 소중한 순간을 공유해 주세요.</p>
                <Button 
                  onClick={handleCreatePost}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  지금 바로 글쓰기
                </Button>
              </div>
            )
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        {renderCreatePostButton()}
      </div>
    </div>
  );
};

export default CommunityPage;