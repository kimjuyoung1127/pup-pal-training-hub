
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrainingLog } from '@/hooks/useTrainingHistory';
import TrainingHistoryCard from './TrainingHistoryCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TrainingHistoryListProps {
    trainingHistory: (TrainingLog & { isAiTraining?: boolean })[];
    onEdit: (log: TrainingLog) => void;
    onDelete: (log: TrainingLog) => void;
    onRetry: (log: TrainingLog) => void;
}

const TrainingHistoryList = ({ trainingHistory, onEdit, onDelete, onRetry }: TrainingHistoryListProps) => {
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

    // Open the first (most recent) day by default
    const defaultOpenValue = sortedDates.length > 0 ? [`item-${sortedDates[0]}`] : [];

    return (
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
                            <AccordionItem value={`item-${date}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                                <AccordionTrigger className="px-6 py-4 text-lg font-bold text-gray-800 hover:no-underline data-[state=open]:border-b data-[state=open]:border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span>{formattedDate}</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {logsForDate.length}회 훈련
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pt-2 pb-4 bg-gray-50">
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
    );
};

export default TrainingHistoryList;
