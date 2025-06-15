import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Heart, Target, Calendar, Trophy, Bone } from 'lucide-react';
import { motion } from 'framer-motion';
import { DogInfo } from '@/types/dog';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface DogProfilePageProps {
  onNavigate: (page: string) => void;
}

const DogProfilePage = ({ onNavigate }: DogProfilePageProps) => {
  const [dogInfo, setDogInfo] = useState<DogInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDogProfile = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      const { data: dogData, error: dogError } = await supabase
        .from('dogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (dogError || !dogData) {
        if (dogError && dogError.code !== 'PGRST116') { // Ignore 'exact one row' error
            console.error('Error fetching dog data:', dogError);
        }
        setDogInfo(null);
        setIsLoading(false);
        return;
      }

      const { data: healthLinks } = await supabase.from('dog_health_status').select('health_status_option_id').eq('dog_id', dogData.id);
      const healthStatusIds = healthLinks?.map(l => l.health_status_option_id) || [];
      const { data: healthStatusData } = healthStatusIds.length > 0 ? await supabase.from('health_status_options').select('name').in('id', healthStatusIds) : { data: [] };
      const healthStatusNames = healthStatusData?.map(s => s.name) || [];
        
      const { data: behaviorLinks } = await supabase.from('dog_desired_behaviors').select('behavior_option_id').eq('dog_id', dogData.id);
      const behaviorIds = behaviorLinks?.map(l => l.behavior_option_id) || [];
      const { data: behaviorData } = behaviorIds.length > 0 ? await supabase.from('behavior_options').select('name').in('id', behaviorIds) : { data: [] };
      const trainingGoalNames = behaviorData?.map(g => g.name) || [];
      
      const fullDogInfo: DogInfo = {
        name: dogData.name || '',
        age: dogData.age || '',
        gender: dogData.gender || '',
        breed: dogData.breed || '',
        weight: dogData.weight || '',
        healthStatus: healthStatusNames,
        trainingGoals: trainingGoalNames
      };

      setDogInfo(fullDogInfo);
      setIsLoading(false);
    };

    fetchDogProfile();
  }, []);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-orange-50 p-6 space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!dogInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cream-50 to-orange-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-cream-800 mb-2 font-pretendard">프로필이 없어요!</h2>
        <p className="text-cream-700 mb-6 font-pretendard">먼저 우리 아이 정보를 등록해주세요.</p>
        <Button onClick={() => onNavigate('dog-info')}>
            강아지 정보 등록하기
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-orange-50 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-cream-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-xl">🐾</div>
            <div>
              <h1 className="text-lg font-bold text-cream-800 font-pretendard">우리 아이 프로필</h1>
              <p className="text-sm text-cream-600 font-pretendard">소중한 가족을 소개합니다</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('dog-info')}
            className="text-cream-600 hover:text-cream-800 border-cream-300"
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
          <Card className="card-soft overflow-hidden bg-gradient-to-r from-orange-100 to-cream-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-orange-200 text-2xl">
                    {getGenderEmoji(dogInfo.gender)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-cream-800 mb-1 font-pretendard">
                    {dogInfo.name}
                  </h2>
                  <p className="text-cream-700 mb-2 font-pretendard">
                    {dogInfo.breed} • {dogInfo.gender === 'male' ? '남아' : '여아'}
                  </p>
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="bg-cream-200 text-cream-800">
                      {getAgeLabel(dogInfo.age)}
                    </Badge>
                    <Badge variant="secondary" className="bg-cream-200 text-cream-800">
                      {getWeightLabel(dogInfo.weight)}
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
              <CardTitle className="flex items-center space-x-2 text-cream-800 font-pretendard">
                <Heart className="w-5 h-5 text-orange-500" />
                <span>건강 상태</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {dogInfo.healthStatus.map((status, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-green-50 border-green-200 text-green-700"
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
              <CardTitle className="flex items-center space-x-2 text-cream-800 font-pretendard">
                <Target className="w-5 h-5 text-orange-500" />
                <span>훈련 목표</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {dogInfo.trainingGoals.map((goal, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-100"
                  >
                    <Target className="w-4 h-4 text-orange-500" />
                    <span className="text-cream-700 font-pretendard">{goal}</span>
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
              <p className="text-lg font-bold text-orange-600">7일</p>
              <p className="text-xs text-cream-600 font-pretendard">연속 훈련</p>
            </Card>
            <Card className="card-soft text-center p-4">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-lg font-bold text-orange-600">85%</p>
              <p className="text-xs text-cream-600 font-pretendard">성공률</p>
            </Card>
            <Card className="card-soft text-center p-4">
              <div className="text-2xl mb-2">⭐</div>
              <p className="text-lg font-bold text-orange-600">12</p>
              <p className="text-xs text-cream-600 font-pretendard">획득 뱃지</p>
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
              <CardTitle className="text-cream-800 font-pretendard">빠른 액션</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={() => onNavigate('training')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white justify-between py-3"
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
                  className="w-full border-cream-300 text-cream-700 hover:bg-cream-100 justify-between py-3"
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
