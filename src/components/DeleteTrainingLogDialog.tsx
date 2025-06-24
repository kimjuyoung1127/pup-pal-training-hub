
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
import { useTrainingHistory, TrainingLog } from '@/hooks/useTrainingHistory';

interface DeleteTrainingLogDialogProps {
  log: TrainingLog | null;
  dogId: string | undefined;
  onOpenChange: (open: boolean) => void;
}

const DeleteTrainingLogDialog = ({ log, dogId, onOpenChange }: DeleteTrainingLogDialogProps) => {
  const { deleteMutation } = useTrainingHistory(dogId);

  const handleDelete = () => {
    if (log) {
      deleteMutation.mutate(log.id);
    }
  };

  return (
    <AlertDialog open={!!log} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">정말 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-800">
            이 작업은 되돌릴 수 없습니다. 훈련 기록이 영구적으로 삭제됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-pink-200 hover:bg-pink-300 text-gray-800">취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-pink-500 hover:bg-pink-600 text-gray-800">
            {deleteMutation.isPending ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTrainingLogDialog;
