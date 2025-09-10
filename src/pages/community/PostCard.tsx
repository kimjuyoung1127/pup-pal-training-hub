import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, UserCircle, Edit, Trash2 } from 'lucide-react';
import { useToggleLike } from './useToggleLike';

interface Post {
  id: number;
  title: string;
  content: string;
  username: string;
  created_at: string;
  like_count: number;
  comment_count?: number;
  is_liked_by_user: boolean;
  image_url?: string;
  user_id: string;
}

interface PostCardProps {
  post: Post;
  currentUser: any;
  onDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onDelete }) => {
  const toggleLikeMutation = useToggleLike(String(post.id));

  const handleLike = () => {
    if (!currentUser) {
      // 로그인하지 않은 경우 로그인 페이지로 리디렉션
      window.location.href = '/login';
      return;
    }
    toggleLikeMutation.mutate(String(post.id));
  };

  const isPostAuthor = currentUser && currentUser.id === post.user_id;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      {post.image_url ? (
        <div
          className="w-full h-40 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${post.image_url})` }}
        ></div>
      ) : (
        <div className="w-full h-40 flex items-center justify-center bg-slate-100 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-slate-800 font-bold leading-snug line-clamp-2 mb-2">
          <Link to={`/community/${post.id}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-slate-500 text-sm font-normal leading-normal line-clamp-3 flex-grow">
          {post.content}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-slate-400" />
            <span className="text-slate-500 text-sm truncate max-w-[80px]">{post.username || '알 수 없음'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <div className="flex items-center gap-1">
              <Heart 
                className={`w-4 h-4 cursor-pointer ${post.is_liked_by_user ? 'text-red-500 fill-current' : 'text-slate-400'}`} 
                onClick={handleLike}
              />
              <span className="text-sm">{post.like_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{post.comment_count || 0}</span>
            </div>
          </div>
        </div>
        
        {/* 게시글 작성자인 경우에만 수정/삭제 버튼 표시 */}
        {isPostAuthor && (
          <div className="flex justify-end gap-2 mt-3">
            <Link to={`/community/edit/${post.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 px-2 text-xs">
                <Edit className="w-3 h-3" />
                <span className="hidden sm:inline">수정</span>
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-1 h-8 px-2 text-xs"
              onClick={() => onDelete(String(post.id))}
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">삭제</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;