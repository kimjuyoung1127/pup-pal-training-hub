
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrainingLog } from '@/hooks/useTrainingHistory';
import TrainingHistoryCard from './TrainingHistoryCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Zap } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import AiTrainingPlanModal from './AiTrainingPlanModal';

interface TrainingHistoryListProps {
    trainingHistory: (TrainingLog & { isAiTraining?: boolean })[];
    onEdit: (log: TrainingLog) => void;
    onDelete: (log: TrainingLog) => void;
    onRetry: (log: TrainingLog) => void;
}

const TrainingHistoryList = ({ trainingHistory, onEdit, onDelete, onRetry }: TrainingHistoryListProps) => {
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

    const dogId = trainingHistory.length > 0 ? trainingHistory[0].dog_id : null;

    const groupedByDate = React.useMemo(() => 
        trainingHistory.reduce((acc, log) => {
            const dateKey = format(parseISO(log.session_date), 'yyyy-MM-dd');
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(log);
            return acc;
        }, {} as Record<string, TrainingLog[]>)
    , [trainingHistory]);

    const sortedDates = React.useMemo(() => 
        Object.keys(groupedByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    , [groupedByDate]);

    const defaultOpenValue = sortedDates.length > 0 ? [`item-${sortedDates[0]}`] : [];

    return (
      <div className="w-full">
        <div className="mb-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center"><Zap className="w-6 h-6 mr-3 text-yellow-500"/>AI 맞춤 훈련 챌린지</h2>
            <p className="text-gray-600 mt-2 mb-4">지난 훈련 기록을 바탕으로 AI가 강아지의 다음 성장 목표를 설정하고, 맞춤형 훈련 챌린지를 생성합니다.</p>
            <Button onClick={() => setIsPlanModalOpen(true)} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600">
                AI 훈련 챌린지 시작하기
            </Button>
        </div>

        <Accordion type="multiple" className="w-full space-y-4" defaultValue={defaultOpenValue}>
            <AnimatePresence initial={false}>
                {sortedDates.map((date) => {
                    const logsForDate = groupedByDate[date];
                    const formattedDate = format(new Date(date), 'yyyy년 M월 d일 (eee)', { locale: ko });
                    
                    return (
                        <motion.div
                            key={date}
                            layout
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            <AccordionItem value={`item-${date}`} className="bg-sky-50 rounded-xl border border-sky-100 overflow-hidden shadow-md transition-shadow hover:shadow-lg">
                                <AccordionTrigger className="px-6 py-4 text-lg font-bold text-sky-800 hover:no-underline data-[state=open]:border-b data-[state=open]:border-sky-100">
                                    <div className="flex items-center gap-3">
                                        <span>{formattedDate}</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                                            {logsForDate.length}회 훈련
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pt-2 pb-4 bg-sky-50/50">
                                    <div className="space-y-3">
                                      <AnimatePresence>
                                        {logsForDate.map(item => (
                                            <TrainingHistoryCard
                                                key={item.id}
                                                item={item}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                onRetry={onRetry}
                                            />
                                        ))}
                                      </AnimatePresence>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </Accordion>
        
        <AiTrainingPlanModal 
            isOpen={isPlanModalOpen} 
            onClose={() => setIsPlanModalOpen(false)} 
            dogId={dogId} 
        />
      </div>
    );
};

export default TrainingHistoryList;
