
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTrainingHistory } from '@/hooks/useTrainingHistory';
import { TrainingLog } from '@/hooks/useTrainingHistory';

interface DeleteTrainingLogDialogProps {
  log: TrainingLog | null;
  onOpenChange: (open: boolean) => void;
}

const DeleteTrainingLogDialog = ({ log, onOpenChange }: DeleteTrainingLogDialogProps) => {
  const { deleteMutation } = useTrainingHistory();

  const handleDelete = () => {
    if (log) {
      deleteMutation.mutate(log.id);
    }
  };

  return (
    <AlertDialog open={!!log} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 되돌릴 수 없습니다. 훈련 기록이 영구적으로 삭제됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-red-600 hover:bg-red-700">
            {deleteMutation.isPending ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTrainingLogDialog;
