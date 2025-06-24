
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoreVertical, Edit, Trash2, Star } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrainingLog } from '@/hooks/useTrainingHistory';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Repeat } from 'lucide-react';

interface TrainingHistoryCardProps {
  item: TrainingLog & { isAiTraining?: boolean };
  onEdit: () => void;
  onDelete: () => void;
  onRetry: (trainingType: string) => void;
}

const TrainingHistoryCard = ({ item, onEdit, onDelete, onRetry }: TrainingHistoryCardProps) => {
  const iconMap: { [key: string]: string } = {
    '기본 명령어': '🎯',
    '산책 예절': '🚶‍♂️',
    '배변 훈련': '🏠',
    '사회화 훈련': '🤝',
    '기다려': '⏳',
    '이리와': '🐶',
    '손': '🐾'
  };
  const icon = item.training_type ? (iconMap[item.training_type] || '⭐') : '⭐';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-none border border-gray-200 bg-white hover:bg-gray-50 transition-colors w-full">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="text-3xl p-3 bg-gray-100 rounded-xl border border-gray-200">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg text-gray-800 truncate">{item.training_type || '알 수 없는 훈련'}</p>
                  {item.isAiTraining && (
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">AI 추천</span>
                  )}
                </div>
                {!item.isAiTraining && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-gray-600 hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={onEdit} className="text-blue-600 focus:text-blue-700 focus:bg-blue-50">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>수정</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:text-red-600 focus:bg-red-50">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>삭제</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>{format(new Date(item.session_date), 'yyyy년 M월 d일', { locale: ko })}</span>
                </div>
                {item.duration_minutes !== null && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span>{item.duration_minutes}분</span>
                  </div>
                )}
              </div>
              {item.notes && (
                <p className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 whitespace-pre-wrap break-words">
                  {item.notes}
                </p>
              )}
              {item.training_type && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => onRetry(item.training_type!)} size="sm" className="bg-blue-500 hover:bg-blue-600">
                    <Repeat className="mr-2 h-4 w-4" />
                    다시 훈련하기
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrainingHistoryCard;
