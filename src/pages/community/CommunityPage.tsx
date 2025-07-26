import React, { useState } from 'react';
import { usePosts } from './usePosts';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import PostCard from './PostCard'; // 새로 만든 PostCard 컴포넌트 임포트

const POSTS_PER_PAGE = 12; // 한 페이지에 더 많�� 카드를 표시

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
        <ArrowLeft className="mr-2 h-4 w-4" /> 이전
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
        다음 <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};


const CommunityPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePosts(page, POSTS_PER_PAGE);

  const posts = data?.posts || [];
  const totalCount = data?.count || 0;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">커뮤니티</h1>
            <p className="text-gray-500 mt-1">반려동물에 대한 따뜻한 이야기를 나누고 정보를 공유해 보세요.</p>
          </div>
          <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-600 text-white">
            <Link to="/community/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              새 글 쓰기
            </Link>
          </Button>
        </div>

        {isLoading && <p className="text-center py-12 text-gray-500">게시글을 불러오는 중입니다...</p>}
        {error && <p className="text-red-500 text-center py-12">오류가 발생했습니다: {error.message}</p>}
        
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
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
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
              <h2 className="text-2xl font-semibold text-gray-700">아직 이야기가 없어요!</h2>
              <p className="text-gray-500 mt-2">첫 번째 주인공이 되어 당신의 소중한 순간을 공유해 주세요.</p>
              <Button asChild className="mt-6 bg-sky-500 hover:bg-sky-600 text-white">
                <Link to="/community/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  지금 바로 글쓰기
                </Link>
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
