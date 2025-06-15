
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MoreVertical, Edit, Trash2, ShieldQuestion } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from 'framer-motion';
import { useTrainingHistory, TrainingLog } from '@/hooks/useTrainingHistory';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteTrainingLogDialog from './DeleteTrainingLogDialog';
import EditTrainingLogDialog from './EditTrainingLogDialog';

interface TrainingHistoryPageProps {
  onNavigate: (page: string) => void;
}

const TrainingHistoryCard = ({ item, onEdit, onDelete }: { item: TrainingLog, onEdit: () => void, onDelete: () => void }) => {
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
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TrainingHistoryPage = ({ onNavigate }: TrainingHistoryPageProps) => {
  const { data: trainingHistory, isLoading, isError } = useTrainingHistory();
  const [logToDelete, setLogToDelete] = useState<TrainingLog | null>(null);
  const [logToEdit, setLogToEdit] = useState<TrainingLog | null>(null);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (isError) {
      return <div className="text-center text-red-500 p-8">훈련 기록을 불러오는 데 실패했습니다.</div>;
    }

    if (!trainingHistory || trainingHistory.length === 0) {
      return (
        <div className="text-center py-16 text-gray-500 flex flex-col items-center">
            <ShieldQuestion className="w-16 h-16 mb-4 text-gray-400" />
            <p className="font-semibold text-lg">기록된 훈련이 없어요.</p>
            <p className="mt-1">첫 훈련을 시작하고 기록을 남겨보세요!</p>
            <Button onClick={() => onNavigate('training')} className="mt-6">훈련 시작하기</Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <AnimatePresence>
          {trainingHistory.map((item) => (
            <TrainingHistoryCard
              key={item.id}
              item={item}
              onEdit={() => setLogToEdit(item)}
              onDelete={() => setLogToDelete(item)}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="p-4 bg-cream-50 min-h-screen">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 ml-2">훈련 기록</h1>
      </div>
      
      {renderContent()}

      <DeleteTrainingLogDialog 
        log={logToDelete}
        onOpenChange={(open) => !open && setLogToDelete(null)}
      />
      <EditTrainingLogDialog
        log={logToEdit}
        onOpenChange={(open) => !open && setLogToEdit(null)}
      />
    </div>
  );
};

export default TrainingHistoryPage;
