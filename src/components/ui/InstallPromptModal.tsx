import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: React.ReactNode; // 문자열 또는 JSX 가능
  buttonText?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
}

const InstallPromptModal: React.FC<InstallPromptModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  buttonText,
  onButtonClick,
  showButton = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {showButton && buttonText && onButtonClick && (
            <Button onClick={onButtonClick}>{buttonText}</Button>
          )}
          <Button onClick={onClose}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstallPromptModal;
