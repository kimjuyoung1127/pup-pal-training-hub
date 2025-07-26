import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreatePost } from './useCreatePost';
import { useUpdatePost } from './useUpdatePost';
import { usePost } from './usePost';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

const postSchema = z.object({
  title: z.string().min(5, '제목은 5글자 이상으로 부탁해요! 멍!'),
  content: z.string().min(10, '조금만 더 자세히 들려주세요! 왈왈!'),
  category: z.enum(['general', 'qna', 'gallery'], {
    required_error: '어떤 이야기���지 골라주세요! 낑낑!',
  }),
});

const PostEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const isEditMode = !!postId;
  const { toast } = useToast();

  const { data: existingPost, isLoading: isLoadingPost } = usePost(postId!);

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost(postId!);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      category: undefined,
    }
  });

  useEffect(() => {
    if (isEditMode && existingPost) {
      form.reset({
        title: existingPost.title,
        content: existingPost.content || '',
        category: existingPost.category,
      });
    }
  }, [isEditMode, existingPost, form]);

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({ title: "잠깐! ✋", description: "로그인이 필요해요! 멍멍!", variant: "destructive" });
      return;
    }

    const mutation = isEditMode ? updatePostMutation : createPostMutation;
    const params = isEditMode ? { postId: postId!, updates: values } : { ...values, user_id: user.id };

    // @ts-ignore
    mutation.mutate(params, {
      onSuccess: (data) => {
        toast({ description: `이야기가 성공적으로 ${isEditMode ? '고쳐졌어요' : '등록됐어요'}! 짝짝짝! 🐾` });
        navigate(`/community/${data.id}`);
      },
      onError: (error) => {
        toast({ description: `앗, 뭔가 잘못됐나 봐요: ${error.message}`, variant: "destructive" });
      },
    });
  };

  if (isLoadingPost) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        <p className="ml-4 text-gray-600">예전 이야기를 꺼내오는 중... 잠시만요!</p>
      </div>
    );
  }

  const isSubmitting = createPostMutation.isPending || updatePostMutation.isPending;

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">{isEditMode ? '이야기 고쳐쓰기 ✏️' : '새로운 이야기 시간 🐾'}</h1>
          <p className="text-gray-500 mt-2">댕댕이와의 소중한 순간, 궁금했던 질문들을 마음껏 들려주세요!</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">✨ 반짝이는 제목</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 우리집 댕댕이가 하늘을 나는 꿈을 꿨대요!" {...field} className="py-6 text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">📚 이야기 종류</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="py-6 text-base">
                        <SelectValue placeholder="어떤 종류의 이야기인지 골라주세요!" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">사는 얘기 왈왈! (자유로운 수다)</SelectItem>
                      <SelectItem value="qna">이거 뭐예요? 낑낑! (궁금해요)</SelectItem>
                      <SelectItem value="gallery">우리 애 좀 보세요! 멍멍! (댕댕이 자랑)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">📝 자세한 이야기</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="우리 댕댕이의 재미있는 일화나, 궁금했던 점을 신나게 적어주세요! 꼬리 살랑~"
                      className="resize-y min-h-[300px] text-base p-4"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    (소곤소곤) 사진이랑 동영상은 곧 올릴 수 있게 준비 중이에요!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" asChild className="bg-white">
                <Link to="/community">← 뒤로가기</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} size="lg" className="bg-sky-500 hover:bg-sky-600 text-white font-bold">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? '수정 완료!' : '이야기 올리기!'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PostEditorPage;