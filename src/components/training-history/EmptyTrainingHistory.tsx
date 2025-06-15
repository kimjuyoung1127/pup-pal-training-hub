
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShieldQuestion } from 'lucide-react';

interface EmptyTrainingHistoryProps {
    onNavigate: (page: string) => void;
}

const EmptyTrainingHistory = ({ onNavigate }: EmptyTrainingHistoryProps) => {
    return (
        <div className="text-center py-16 text-gray-500 flex flex-col items-center">
            <ShieldQuestion className="w-16 h-16 mb-4 text-gray-400" />
            <p className="font-semibold text-lg">기록된 훈련이 없어요.</p>
            <p className="mt-1">첫 훈련을 시작하고 기록을 남겨보세요!</p>
            <Button onClick={() => onNavigate('training')} className="mt-6">훈련 시작하기</Button>
        </div>
    );
};

export default EmptyTrainingHistory;
