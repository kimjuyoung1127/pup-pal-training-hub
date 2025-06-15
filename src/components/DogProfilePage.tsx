import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Heart, Target, Calendar, Trophy, Bone } from 'lucide-react';
import { motion } from 'framer-motion';

interface DogInfo {
  name: string;
  age: string;
  gender: string;
  breed: string;
  weight: string;
  healthStatus: string[];
  trainingGoals: string[];
}

interface DogProfilePageProps {
  onNavigate: (page: string) => void;
  dogInfo?: DogInfo;
}

const DogProfilePage = ({ onNavigate, dogInfo }: DogProfilePageProps) => {
  // 기본 데이터 (실제로는 저장된 데이터를 사용)
  const defaultDogInfo: DogInfo = {
    name: '바둑이',
    age: 'adult',
    gender: 'male',
    breed: '믹스견',
    weight: 'medium',
    healthStatus: ['건강함'],
    trainingGoals: ['기본 예절 훈련', '산책 훈련']
  };

  const currentDogInfo = dogInfo || defaultDogInfo;

  const getAgeLabel = (age: string) => {
    switch (age) {
      case 'puppy': return '강아지 (6개월 미만)';
      case 'young': return '어린 개 (6개월 ~ 2년)';
      case 'adult': return '성견 (2년 ~ 7년)';
      case 'senior': return '노견 (7년 이상)';
      default: return age;
    }
  };

  const getWeightLabel = (weight: string) => {
    switch (weight) {
      case 'small': return '소형견 (7kg 미만)';
      case 'medium': return '중형견 (7kg ~ 25kg)';
      case 'large': return '대형견 (25kg 이상)';
      default: return weight;
    }
  };

  const getGenderEmoji = (gender: string) => {
    return gender === 'male' ? '🐕' : '🐕‍🦺';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-xl">🐾</div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 font-pretendard">우리 아이 프로필</h1>
              <p className="text-sm text-slate-600 font-pretendard">소중한 가족을 소개합니다</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('dog-info')}
            className="text-slate-600 hover:text-slate-800 border-slate-300"
          >
            <Edit className="w-4 h-4 mr-1" />
            편집
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 프로필 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="card-soft overflow-hidden bg-gradient-to-r from-blue-100 to-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-blue-200 text-2xl">
                    {getGenderEmoji(currentDogInfo.gender)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1 font-pretendard">
                    {currentDogInfo.name}
                  </h2>
                  <p className="text-slate-700 mb-2 font-pretendard">
                    {currentDogInfo.breed} • {currentDogInfo.gender === 'male' ? '남아' : '여아'}
                  </p>
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {getAgeLabel(currentDogInfo.age)}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {getWeightLabel(currentDogInfo.weight)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 건강 상태 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="card-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-slate-800 font-pretendard">
                <Heart className="w-5 h-5 text-blue-500" />
                <span>건강 상태</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentDogInfo.healthStatus.map((status, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-blue-50 border-blue-200 text-blue-800"
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 훈련 목표 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-slate-800 font-pretendard">
                <Target className="w-5 h-5 text-blue-500" />
                <span>훈련 목표</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {currentDogInfo.trainingGoals.map((goal, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-slate-700 font-pretendard">{goal}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 훈련 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-3 gap-4">
            <Card className="card-soft text-center p-4">
              <div className="text-2xl mb-2">📅</div>
              <p className="text-lg font-bold text-blue-600">7일</p>
              <p className="text-xs text-slate-600 font-pretendard">연속 훈련</p>
            </Card>
            <Card className="card-soft text-center p-4">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-lg font-bold text-blue-600">85%</p>
              <p className="text-xs text-slate-600 font-pretendard">성공률</p>
            </Card>
            <Card className="card-soft text-center p-4">
              <div className="text-2xl mb-2">⭐</div>
              <p className="text-lg font-bold text-blue-600">12</p>
              <p className="text-xs text-slate-600 font-pretendard">획득 뱃지</p>
            </Card>
          </div>
        </motion.div>

        {/* 빠른 액션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="card-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-800 font-pretendard">빠른 액션</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={() => onNavigate('training')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white justify-between py-3"
                >
                  <div className="flex items-center space-x-2">
                    <Bone className="w-4 h-4" />
                    <span className="font-pretendard">오늘의 훈련 시작</span>
                  </div>
                  <span>🎯</span>
                </Button>
                <Button
                  onClick={() => onNavigate('dashboard')}
                  variant="outline"
                  className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 justify-between py-3"
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-pretendard">훈련 기록 보기</span>
                  </div>
                  <span>📊</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DogProfilePage;
