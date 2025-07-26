import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare } from 'lucide-react';

// 데이터 구조에 맞게 Post 타입을 정의합니다.
// 향후 DB VIEW에 image_url과 comment_count를 추가해야 합니다.
interface Post {
  id: number;
  title: string;
  username: string;
  created_at: string;
  like_count: number;
  comment_count?: number;
  is_liked_by_user: boolean;
  image_url?: string; 
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <Link to={`/community/${post.id}`} className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="relative w-full h-48 bg-gray-200">
        {/* TODO: post.image_url을 실제 이미지로 교체해야 합니다. */}
        {post.image_url ? (
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
            {/* ��미지가 없을 경우, 귀여운 아이콘이나 플레이스홀더를 넣을 수 있습니다. */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-800 truncate group-hover:text-sky-600 transition-colors">{post.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{post.username || '알 수 없음'}</p>
        <div className="mt-4 flex items-center justify-end space-x-4">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Heart
              className={`w-4 h-4 ${post.is_liked_by_user ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            />
            <span>{post.like_count}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <MessageSquare className="w-4 h-4" />
            {/* TODO: post.comment_count가 DB에 추가되어야 합니다. */}
            <span>{post.comment_count || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
