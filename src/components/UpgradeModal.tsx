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
import { Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricing'); // '/pricing' 경로는 실제 가격 정책 페이지 경로로 수정해야 합니다.
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <Rocket className="w-16 h-16 text-blue-500" />
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">
            AI 추천 한도를 모두 사용하셨어요
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            Pro 플랜으로 업그레이드하고, 무제한 AI 훈련 추천과 모든 프리미엄 기능을 만나보세요. 지금 업그레이드하고 반려견의 잠재력을 최대로 이끌어내 보세요!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex sm:justify-center mt-6">
          <AlertDialogCancel onClick={onClose}>나중에</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700">
            Pro 플랜 자세히 보기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpgradeModal;