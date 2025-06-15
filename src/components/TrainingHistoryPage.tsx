
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';

const trainingHistory = [
  {
    id: 1,
    type: '기본 명령어',
    date: '2025년 6월 14일',
    duration: '15분',
    successRate: 90,
    icon: '🎯'
  },
  {
    id: 2,
    type: '산책 예절',
    date: '2025년 6월 13일',
    duration: '20분',
    successRate: 80,
    icon: '🚶‍♂️'
  },
  {
    id: 3,
    type: '배변 훈련',
    date: '2025년 6월 12일',
    duration: '10분',
    successRate: 95,
    icon: '🏠'
  },
  {
    id: 4,
    type: '사회화 훈련',
    date: '2025년 6월 10일',
    duration: '25분',
    successRate: 75,
    icon: '🤝'
  },
  {
    id: 5,
    type: '기본 명령어',
    date: '2025년 6월 9일',
    duration: '12분',
    successRate: 88,
    icon: '🎯'
  }
];

interface TrainingHistoryPageProps {
  onNavigate: (page: string) => void;
}

const TrainingHistoryPage = ({ onNavigate }: TrainingHistoryPageProps) => {
  return (
    <div className="p-4 bg-cream-50 min-h-screen">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 ml-2">훈련 기록</h1>
      </div>

      <div className="space-y-4">
        {trainingHistory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl p-3 bg-cream-100 rounded-xl">{item.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-800">{item.type}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-600">성공률</span>
                        <span className="text-sm font-bold text-orange-500">{item.successRate}%</span>
                      </div>
                      <Progress value={item.successRate} className="h-2 bg-cream-200" indicatorClassName="bg-orange-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrainingHistoryPage;
