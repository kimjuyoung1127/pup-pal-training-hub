import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTrainingHistory, TrainingLog, TrainingLogUpdate } from '@/hooks/useTrainingHistory';

const formSchema = z.object({
  training_type: z.string().min(1, '훈련 종류를 입력해주세요.'),
  session_date: z.string().refine((date) => !isNaN(Date.parse(date)), '유효한 날짜를 입력해주세요.'),
  duration_minutes: z.coerce.number().int().min(0, '훈련 시간은 0분 이상이어야 합니다.').nullable(),
  success_rate: z.coerce.number().min(0).max(100, '성공률은 0에서 100 사이여야 합니다.').nullable(),
  notes: z.string().nullable(),
});

interface EditTrainingLogDialogProps {
  log: TrainingLog | null;
  dogId: string | undefined;
  onOpenChange: (open: boolean) => void;
}

const EditTrainingLogDialog = ({ log, dogId, onOpenChange }: EditTrainingLogDialogProps) => {
  console.log('EditTrainingLogDialog rendered. Props:', { log, dogId });
  const { updateMutation } = useTrainingHistory(dogId);
  const [notes, setNotes] = useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      training_type: '',
      session_date: '',
      duration_minutes: 0,
      success_rate: 0,
      notes: '',
    },
  });

  useEffect(() => {
    console.log('useEffect triggered. Log:', log);
    if (log) {
      form.reset({
        training_type: log.training_type || '',
        session_date: log.session_date.split('T')[0],
        duration_minutes: log.duration_minutes ?? 0,
        success_rate: log.success_rate ?? 0,
        notes: log.notes ?? '',
      });
      console.log('Form reset with log data.');
    }
  }, [log, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Submitting form with values:', values);
    if (log) {
      const updateData: TrainingLogUpdate = {
        ...values,
        notes: values.notes || null,
      };
      updateMutation.mutate({ id: log.id, ...updateData }, {
        onSuccess: () => {
          console.log('Update successful');
          onOpenChange(false);
        },
        onError: (error) => {
          console.error('Update failed:', error);
        }
      });
    }
  };

  return (
    <Dialog open={!!log} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-gray-800">훈련 기록 수정</DialogTitle>
          <DialogDescription className="text-gray-800">훈련 기록의 세부 정보를 수정합니다.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="training_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800">훈련 종류</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 앉아" {...field} className="bg-gray-50 border-gray-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="session_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800">날짜</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="bg-gray-50 border-gray-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800">훈련 시간 (분)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? null : +e.target.value)} className="bg-gray-50 border-gray-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="success_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800">성공률 (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? null : +e.target.value)} className="bg-gray-50 border-gray-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800">메모</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="훈련에 대한 메모를 남겨주세요."
                      className="resize-none bg-gray-50 border-gray-300"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)} className="bg-pink-200 hover:bg-pink-300 text-gray-800">취소</Button>
              <Button type="submit" disabled={updateMutation.isPending} className="bg-pink-500 hover:bg-pink-600 text-gray-800">
                {updateMutation.isPending ? '저장 중...' : '변경사항 저장'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTrainingLogDialog;
