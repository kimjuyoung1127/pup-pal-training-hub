
import React from 'react';
import { Button } from '@/components/ui/button';
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
import { Trash2 } from 'lucide-react';

interface DeleteProfileDialogProps {
  isDeleting: boolean;
  onDelete: () => void;
}

const DeleteProfileDialog = ({ isDeleting, onDelete }: DeleteProfileDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 되돌릴 수 없습니다. 강아지의 프로필과 모든 훈련 기록이 영구적으로 삭제됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProfileDialog;
