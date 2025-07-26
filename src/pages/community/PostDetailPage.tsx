import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePost } from './usePost';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateComment } from './useCreateComment';
import { useDeletePost } from './useDeletePost';
import { useToggleLike } from './useToggleLike';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Heart, MessageSquare, UserCircle, Edit, Trash2 } from 'lucide-react';

// --- Sub Components for PostDetailPage ---

const PostHeader: React.FC<{ post: any; isAuthor: boolean; onDelete: () => void; }> = ({ post, isAuthor, onDelete }) => (
  <header className="mb-8">
    <h1 className="text-4xl font-extrabold text-gray-800 leading-tight mb-4">{post.title}</h1>
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        {/* TODO: user_profiles 테이블과 연동하여 실제 아바타 URL을 가져와야 합니다. */}
        <UserCircle className="w-10 h-10 text-gray-400" />
        <div>
          <p className="font-semibold text-gray-700">{post.username || '알 수 없음'}</p>
          <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString('ko-KR')}</p>
        </div>
      </div>
      {isAuthor && (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild className="flex items-center space-x-1">
            <Link to={`/community/edit/${post.id}`}><Edit className="w-3 h-3 mr-1" /> 수정</Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center space-x-1">
                <Trash2 className="w-3 h-3 mr-1" /> 삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말 삭제하시겠어요?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없어요. 소중한 이야기가 영원히 사라집니다!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>삭제하기</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  </header>
);

const PostBody: React.FC<{ content: string }> = ({ content }) => (
  // `prose` 스타일을 유지하되, 폰트와 줄 간격을 조정하여 가독성을 높입니다.
  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
    {content}
  </div>
);

const PostActions: React.FC<{ post: any; onLike: () => void; }> = ({ post, onLike }) => (
  <div className="mt-8 pt-6 border-t flex items-center space-x-6">
    <Button
      onClick={onLike}
      variant="ghost"
      className={`flex items-center space-x-2 transition-colors duration-200 ${post.is_liked_by_user ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
    >
      <Heart className={`w-6 h-6 ${post.is_liked_by_user ? 'fill-current' : ''}`} />
      <span className="font-semibold text-lg">{post.like_count}</span>
    </Button>
    <div className="flex items-center space-x-2 text-gray-500">
      <MessageSquare className="w-6 h-6" />
      <span className="font-semibold text-lg">{post.comments.length}</span>
    </div>
  </div>
);

const commentSchema = z.object({
  content: z.string().min(1, '댓글을 한 글자 이상 입력해주세요!'),
});

const CommentForm: React.FC<{ postId: string; user: Session['user'] | null }> = ({ postId, user }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof commentSchema>>({ resolver: zodResolver(commentSchema) });
  const createCommentMutation = useCreateComment(postId);

  const onSubmit = (values: z.infer<typeof commentSchema>) => {
    if (!user) {
      toast({ title: "로그인이 필요해요!", variant: "destructive" });
      return;
    }
    createCommentMutation.mutate(
      { ...values, post_id: postId, user_id: user.id },
      {
        onSuccess: () => {
          toast({ description: "댓글이 성공적으로 등록되었어요! 🎉" });
          form.reset({ content: '' });
        },
        onError: (error) => {
          toast({ description: `댓글 등록 실패: ${error.message}`, variant: "destructive" });
        },
      }
    );
  };

  if (!user) {
    return <p className="text-sm text-center text-gray-500 p-4 bg-gray-50 rounded-md">댓글을 작성하려면 로그인이 필요해요.</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start space-x-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Textarea placeholder="따뜻한 응원의 댓글을 남겨주세요! 멍!" {...field} className="min-h-[80px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createCommentMutation.isPending} className="h-[80px] bg-sky-500 hover:bg-sky-600 text-white">
          {createCommentMutation.isPending ? '등록 중...' : '댓글 등록'}
        </Button>
      </form>
    </Form>
  );
};

const CommentItem: React.FC<{ comment: any }> = ({ comment }) => (
  <div className="flex items-start space-x-4">
    <UserCircle className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />
    <div className="flex-grow">
      <div className="flex items-center space-x-2 mb-1">
        <span className="font-semibold text-sm">{comment.username || '알 수 없음'}</span>
        <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString('ko-KR')}</span>
      </div>
      <p className="text-gray-700">{comment.content}</p>
    </div>
  </div>
);


// --- Main Page Component ---

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<Session['user'] | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchUser();
  }, []);

  if (!postId) {
    return <div className="container mx-auto py-8">잘못된 접근입니다.</div>;
  }

  const { data: post, isLoading, error } = usePost(postId);
  const deletePostMutation = useDeletePost();
  const toggleLikeMutation = useToggleLike(postId);

  const handleDelete = () => {
    deletePostMutation.mutate(postId, {
      onSuccess: () => {
        toast({ description: "게시글이 삭제되었습니다." });
        navigate('/community');
      },
      onError: (error) => {
        toast({ description: `삭제 실패: ${error.message}`, variant: "destructive" });
      }
    });
  };

  const handleLike = () => {
    if (!user) {
      toast({ title: "좋아요를 누르려면 로그인이 필요해요!", variant: "destructive" });
      return;
    }
    toggleLikeMutation.mutate(postId);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-slate-50"><p>게시글을 불러오는 중입니다...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-slate-50"><p className="text-red-500">오류가 발생했습니다: {error.message}</p></div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center min-h-screen bg-slate-50"><p>게시글을 찾을 수 없습니다.</p></div>;
  }

  const isAuthor = user && user.id === post.user_id;

  return (
    <div className="bg-slate-50 py-8 md:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Button variant="outline" asChild className="mb-6 bg-white">
          <Link to="/community">← 목록으로 돌아가기</Link>
        </Button>
        <article className="bg-white p-6 md:p-10 rounded-lg shadow-lg mb-8">
          <PostHeader post={post} isAuthor={isAuthor} onDelete={handleDelete} />
          <PostBody content={post.content} />
          <PostActions post={post} onLike={handleLike} />
        </article>

        <section className="bg-white p-6 md:p-10 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">댓글 ({post.comments.length})</h2>
          <div className="mb-8">
            <CommentForm postId={postId} user={user} />
          </div>
          <div className="space-y-6">
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetailPage;
