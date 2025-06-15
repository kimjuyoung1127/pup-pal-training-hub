
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { TrainingLog } from '@/hooks/useTrainingHistory';
import TrainingHistoryCard from './TrainingHistoryCard';

interface TrainingHistoryListProps {
    trainingHistory: TrainingLog[];
    onEdit: (log: TrainingLog) => void;
    onDelete: (log: TrainingLog) => void;
}

const TrainingHistoryList = ({ trainingHistory, onEdit, onDelete }: TrainingHistoryListProps) => {
    return (
        <div className="space-y-4">
            <AnimatePresence>
                {trainingHistory.map((item) => (
                    <TrainingHistoryCard
                        key={item.id}
                        item={item}
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default TrainingHistoryList;
