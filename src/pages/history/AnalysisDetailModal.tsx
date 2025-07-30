import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import AnalysisDetailView from './AnalysisDetailView';
import { JointAnalysisRecord } from '@/types/analysis';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AnalysisDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: JointAnalysisRecord | null;
}

const AnalysisDetailModal: React.FC<AnalysisDetailModalProps> = ({ isOpen, onClose, record }) => {
  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">상세 분석 결과</DialogTitle>
          <DialogDescription className="sr-only">
            {record.dog_name || '우리 강아지'}의 자세 분석 리포트입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto px-6 pb-6">
          <AnalysisDetailView record={record} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">닫기</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDetailModal;