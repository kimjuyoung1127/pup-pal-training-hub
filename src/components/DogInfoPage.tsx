import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, ChevronLeft, ChevronRight, Heart, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
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

const dogBreeds = [
  "말티즈",
  "푸들",
  "치와와",
  "포메라니안",
  "요크셔 테리어",
  "시츄",
  "비숑 프리제",
  "페키니즈",
  "웰시 코기",
  "시바 이누",
  "비글",
  "프렌치 불독",
  "코카 스파니엘",
  "보스턴 테리어",
  "보더 콜리",
  "진돗개",
  "삽살개",
  "풍산개",
  "골든 리트리버",
  "래브라도 리트리버",
  "저먼 셰퍼드",
  "알래스칸 말라뮤트",
  "도베르만",
  "로트와일러",
  "그레이트 데인",
  "버니즈 마운틴 독",
  "믹스견",
  "잘 모르겠어요"
];

const DogInfoPage = ({ onComplete }: { onComplete: (dogInfo: DogInfo) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [breedOpen, setBreedOpen] = useState(false);
  const [dogInfo, setDogInfo] = useState<DogInfo>({
    name: '',
    age: '',
    gender: '',
    breed: '',
    weight: '',
    healthStatus: [],
    trainingGoals: []
  });

  const healthOptions = [
    { id: '건강함', label: '건강함', icon: '💚' },
    { id: '관절 문제', label: '관절 문제', icon: '🦴' },
    { id: '알레르기', label: '알레르기', icon: '🤧' },
    { id: '소화 문제', label: '소화 문제', icon: '🤱' },
    { id: '피부 질환', label: '피부 질환', icon: '🐕' },
    { id: '과체중', label: '과체중', icon: '⚖️' },
    { id: '저체중', label: '저체중', icon: '📏' },
    { id: '기타', label: '기타', icon: '🏥' }
  ];

  const trainingGoalOptions = [
    { id: '기본 예절 훈련', label: '기본 예절 훈련', icon: '🎓' },
    { id: '배변 훈련', label: '배변 훈련', icon: '🚽' },
    { id: '짖음 줄이기', label: '짖음 줄이기', icon: '🤫' },
    { id: '산책 훈련', label: '산책 훈련', icon: '🚶' },
    { id: '사회성 훈련', label: '사회성 훈련', icon: '👥' },
    { id: '분리불안 해결', label: '분리불안 해결', icon: '💔' },
    { id: '물어뜯기 교정', label: '물어뜯기 교정', icon: '🚫' },
    { id: '손 올리기/앉기', label: '손 올리기/앉기', icon: '✋' },
    { id: '기다려', label: '기다려', icon: '⏱️' },
    { id: '이리와', label: '이리와', icon: '🤗' }
  ];

  const handleHealthStatusChange = (status: string, checked: boolean) => {
    setDogInfo(prev => ({
      ...prev,
      healthStatus: checked 
        ? [...prev.healthStatus, status]
        : prev.healthStatus.filter(s => s !== status)
    }));
  };

  const handleTrainingGoalChange = (goal: string, checked: boolean) => {
    setDogInfo(prev => ({
      ...prev,
      trainingGoals: checked 
        ? [...prev.trainingGoals, goal]
        : prev.trainingGoals.filter(g => g !== goal)
    }));
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(dogInfo);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return dogInfo.name && dogInfo.age && dogInfo.gender;
      case 1:
        return dogInfo.breed && dogInfo.weight;
      case 2:
        return dogInfo.healthStatus.length > 0 && dogInfo.trainingGoals.length > 0;
      default:
        return false;
    }
  };

  const stepTitles = [
    '기본 정보를 알려주세요 🐕',
    '우리 아이 특징이 궁금해요 📏',
    '어떤 훈련을 원하시나요? 🎯'
  ];

  const stepDescriptions = [
    '소중한 우리 아이의 이름과 기본 정보부터 시작해볼까요?',
    '견종과 체중 정보로 더 정확한 훈련을 추천해드릴게요!',
    '건강 상태와 훈련 목표를 선택하면 맞춤 플랜을 만들어드려요!'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50 to-orange-50 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="text-xl">🐾</div>
          <h1 className="text-lg font-bold text-cream-800 font-pretendard">멍멍트레이너</h1>
        </div>
        <div className="text-sm text-cream-600 font-pretendard">
          {currentStep + 1} / 3
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-cream-200 rounded-full h-2 mb-8">
        <motion.div 
          className="bg-orange-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-cream-800 mb-2 font-pretendard">
            {stepTitles[currentStep]}
          </h2>
          <p className="text-cream-700 font-pretendard">
            {stepDescriptions[currentStep]}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="flex-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🐕‍🦺</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-cream-800 font-medium">우리 아이 이름</Label>
                      <Input
                        id="name"
                        value={dogInfo.name}
                        onChange={(e) => setDogInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="예: 바둑이"
                        className="mt-2 bg-white border-2 border-cream-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 rounded-xl text-cream-800 placeholder:text-cream-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="age" className="text-cream-800 font-medium">나이</Label>
                      <Select onValueChange={(value) => setDogInfo(prev => ({ ...prev, age: value }))}>
                        <SelectTrigger className="mt-2 bg-white border-2 border-cream-200 focus:border-orange-300 rounded-xl text-cream-800">
                          <SelectValue placeholder="나이를 선택해주세요" className="text-cream-500" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-cream-200 z-50">
                          <SelectItem value="puppy" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">강아지 (6개월 미만)</SelectItem>
                          <SelectItem value="young" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">어린 개 (6개월 ~ 2년)</SelectItem>
                          <SelectItem value="adult" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">성견 (2년 ~ 7년)</SelectItem>
                          <SelectItem value="senior" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">노견 (7년 이상)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-cream-800 font-medium">성별</Label>
                      <div className="flex space-x-4 mt-2">
                        <Button
                          variant={dogInfo.gender === 'male' ? 'default' : 'outline'}
                          onClick={() => setDogInfo(prev => ({ ...prev, gender: 'male' }))}
                          className={`flex-1 ${
                            dogInfo.gender === 'male' 
                              ? 'bg-cream-400 hover:bg-cream-500 text-cream-800 border-0' 
                              : 'bg-white hover:bg-cream-100 text-cream-700 border-2 border-cream-200'
                          }`}
                        >
                          🐕 남아
                        </Button>
                        <Button
                          variant={dogInfo.gender === 'female' ? 'default' : 'outline'}
                          onClick={() => setDogInfo(prev => ({ ...prev, gender: 'female' }))}
                          className={`flex-1 ${
                            dogInfo.gender === 'female' 
                              ? 'bg-cream-400 hover:bg-cream-500 text-cream-800 border-0' 
                              : 'bg-white hover:bg-cream-100 text-cream-700 border-2 border-cream-200'
                          }`}
                        >
                          🐕‍🦺 여아
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">📏</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-cream-800 font-medium">견종</Label>
                      <Popover open={breedOpen} onOpenChange={setBreedOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={breedOpen}
                            className="w-full justify-between mt-2 bg-white border-2 border-cream-200 focus:border-orange-300 rounded-xl text-cream-800 hover:bg-cream-50"
                          >
                            {dogInfo.breed
                              ? dogBreeds.find((breed) => breed === dogInfo.breed)
                              : "견종을 선택해주세요"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-white border-cream-200 shadow-lg z-50">
                          <Command className="bg-white">
                            <CommandInput 
                              placeholder="견종을 검색해보세요..." 
                              className="h-9 text-cream-800"
                            />
                            <CommandList className="max-h-60 overflow-y-auto">
                              <CommandEmpty className="text-cream-600 py-6 text-center text-sm">
                                검색 결과가 없습니다.
                              </CommandEmpty>
                              <CommandGroup>
                                {dogBreeds.map((breed) => (
                                  <CommandItem
                                    key={breed}
                                    value={breed}
                                    onSelect={(currentValue) => {
                                      setDogInfo(prev => ({ ...prev, breed: currentValue === dogInfo.breed ? "" : currentValue }));
                                      setBreedOpen(false);
                                    }}
                                    className="text-cream-800 hover:bg-orange-100 cursor-pointer data-[selected=true]:bg-orange-100"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        dogInfo.breed === breed ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {breed}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="weight" className="text-cream-800 font-medium">체중</Label>
                      <Select onValueChange={(value) => setDogInfo(prev => ({ ...prev, weight: value }))}>
                        <SelectTrigger className="mt-2 bg-white border-2 border-cream-200 focus:border-orange-300 rounded-xl text-cream-800">
                          <SelectValue placeholder="체중을 선택해주세요" className="text-cream-500" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-cream-200 z-50">
                          <SelectItem value="small" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">소형견 (7kg 미만)</SelectItem>
                          <SelectItem value="medium" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">중형견 (7kg ~ 25kg)</SelectItem>
                          <SelectItem value="large" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">대형견 (25kg 이상)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🎯</div>
                  </div>

                  {/* 건강 상태 카드 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-2 border-cream-200 bg-gradient-to-r from-cream-50 to-orange-50">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <Heart className="w-6 h-6 text-orange-500 mr-2" />
                          <Label className="text-cream-800 font-semibold text-lg font-pretendard">건강 상태</Label>
                        </div>
                        <p className="text-sm text-cream-600 mb-4 font-pretendard">우리 아이의 현재 건강 상태를 알려주세요 (복수 선택 가능)</p>
                        <div className="grid grid-cols-2 gap-3">
                          {healthOptions.map((option, index) => (
                            <motion.div
                              key={option.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${
                                dogInfo.healthStatus.includes(option.id)
                                  ? 'bg-orange-100 border-orange-300 shadow-md'
                                  : 'bg-white border-cream-200 hover:border-orange-200 hover:bg-orange-50'
                              }`}
                              onClick={() => handleHealthStatusChange(option.id, !dogInfo.healthStatus.includes(option.id))}
                            >
                              <Checkbox
                                id={`health-${option.id}`}
                                checked={dogInfo.healthStatus.includes(option.id)}
                                onCheckedChange={(checked) => handleHealthStatusChange(option.id, checked as boolean)}
                                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                              />
                              <span className="text-lg">{option.icon}</span>
                              <Label
                                htmlFor={`health-${option.id}`}
                                className="text-sm text-cream-700 cursor-pointer font-pretendard flex-1"
                              >
                                {option.label}
                              </Label>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* 훈련 목표 카드 */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="border-2 border-cream-200 bg-gradient-to-r from-orange-50 to-cream-50">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <Target className="w-6 h-6 text-orange-500 mr-2" />
                          <Label className="text-cream-800 font-semibold text-lg font-pretendard">훈련 목표</Label>
                        </div>
                        <p className="text-sm text-cream-600 mb-4 font-pretendard">어떤 훈련을 원하시나요? (복수 선택 가능)</p>
                        <div className="grid grid-cols-1 gap-3">
                          {trainingGoalOptions.map((option, index) => (
                            <motion.div
                              key={option.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${
                                dogInfo.trainingGoals.includes(option.id)
                                  ? 'bg-orange-100 border-orange-300 shadow-md'
                                  : 'bg-white border-cream-200 hover:border-orange-200 hover:bg-orange-50'
                              }`}
                              onClick={() => handleTrainingGoalChange(option.id, !dogInfo.trainingGoals.includes(option.id))}
                            >
                              <Checkbox
                                id={`goal-${option.id}`}
                                checked={dogInfo.trainingGoals.includes(option.id)}
                                onCheckedChange={(checked) => handleTrainingGoalChange(option.id, checked as boolean)}
                                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                              />
                              <span className="text-lg">{option.icon}</span>
                              <Label
                                htmlFor={`goal-${option.id}`}
                                className="text-sm text-cream-700 cursor-pointer font-pretendard flex-1"
                              >
                                {option.label}
                              </Label>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fixed Navigation Buttons */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-cream-200 p-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 bg-cream-200 hover:bg-cream-300 text-cream-800 border-2 border-cream-300 font-pretendard"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전</span>
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-pretendard"
          >
            <span>{currentStep === 2 ? '완료' : '다음'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DogInfoPage;
