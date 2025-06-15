
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';
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

interface TrainingHistoryCardProps {
  item: TrainingLog;
  onEdit: () => void;
  onDelete: () => void;
}

const TrainingHistoryCard = ({ item, onEdit, onDelete }: TrainingHistoryCardProps) => {
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
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="text-3xl p-3 bg-cream-100 rounded-xl">{icon}</div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-bold text-lg text-gray-800">{item.training_type || '알 수 없는 훈련'}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>수정</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:text-red-500 focus:bg-red-50">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>삭제</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
              {item.success_rate !== null && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">성공률</span>
                    <span className="text-sm font-bold text-orange-500">{item.success_rate}%</span>
                  </div>
                  <Progress value={item.success_rate} className="h-2 bg-cream-200" indicatorClassName="bg-orange-400" />
                </div>
              )}
              {item.notes && (
                <p className="mt-3 text-sm text-gray-700 bg-cream-100 p-3 rounded-md border border-cream-200 whitespace-pre-wrap">
                  {item.notes}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrainingHistoryCard;
