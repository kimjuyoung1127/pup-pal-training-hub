
import { LucideIcon } from 'lucide-react';
import { Target, Home, Footprints, Users } from 'lucide-react';

export interface TrainingStep {
  title: string;
  instruction: string;
  videoUrl?: string;
  tip?: string;
  image?: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  Icon: LucideIcon;
  description: string;
  difficulty: '초급' | '중급' | '고급';
  duration: string;
  steps: TrainingStep[];
  color: string;
}

export const trainingPrograms: { [key: string]: TrainingProgram } = {
  basic: {
    id: 'basic',
    title: '기본 명령어',
    Icon: Target,
    description: '앉아, 기다려, 이리와 등 기본적인 명령어를 배워요.',
    difficulty: '초급',
    duration: '10-15분',
    color: 'blue',
    steps: [
      {
        title: 'Step 1: "앉아"',
        instruction: "강아지에게 '앉아' 라고 말하며 간식으로 유도해주세요.",
        tip: '엉덩이가 바닥에 닿으면 바로 칭찬과 간식을 주세요!',
      },
      {
        title: 'Step 2: "기다려"',
        instruction: "손바닥을 보여주며 '기다려' 라고 말해주세요.",
        tip: '처음에는 1~2초만 유지해도 성공이에요.',
      },
      {
        title: 'Step 3: "이리와"',
        instruction: "강아지의 이름을 부르며 '이리와' 라고 말해주세요.",
        tip: '두 팔을 벌리고 반갑게 맞아주면 더 잘 와요!',
      },
      {
        title: 'Step 4: "안녕"',
        instruction: "강아지에게 '안녕' 이라고 말해주세요.",
        tip: '간식으로 유도해주세요!',
      },
      {
        title: 'Step 5: "잘가"',
        instruction: "강아지에게 '잘가' 라고 말해주세요.",
        tip: '간식으로 유도해주세요!',
      },
    ],
  },
  toilet: {
    id: 'toilet',
    title: '배변 훈련',
    Icon: Home,
    description: '올바른 배변 습관을 기르는 훈련이에요.',
    difficulty: '초급',
    duration: '5-10분',
    color: 'green',
    steps: [
      {
        title: 'Step 1: 배변 장소 정하기',
        instruction: '집 안에서 강아지가 배변할 장소를 정하고 배변패드를 깔아주세요.',
        tip: '조용하고 구석진 곳이 안정감을 줘요.',
      },
      {
        title: 'Step 2: 신호 파악하기',
        instruction: '강아지가 바닥 냄새를 맡거나 뱅뱅 도는 등 배변 신호를 보낼 때를 잘 관찰하세요.',
        tip: '식사 후, 낮잠 후가 주요 배변 타이밍이에요.',
      },
      {
        title: 'Step 3: 유도 및 칭찬하기',
        instruction: '배변 신호가 보이면 즉시 배변패드로 데려가세요. 성공하면 아낌없이 칭찬하고 간식을 주세요.',
        tip: '실수해도 절대 혼내지 마세요! 무관심하게 치우는 것이 중요해요.',
      },
      {
        title: 'Step 4: "잘가"',
        instruction: "강아지에게 '잘가' 라고 말해주세요.",
        tip: '간식으로 유도해주세요!',
      },
      {
        title: 'Step 5: "안녕"',
        instruction: "강아지에게 '안녕' 이라고 말해주세요.",
        tip: '간식으로 유도해주세요!',
      },
    ],
  },
  walk: {
    id: 'walk',
    title: '산책 예절',
    Icon: Footprints,
    description: '줄 당기지 않기, 다른 강아지와의 만남 등을 배워요.',
    difficulty: '중급',
    duration: '15-20분',
    color: 'emerald',
    steps: [
      {
        title: 'Step 1: 리드줄과 친해지기',
        instruction: '집 안에서 리드줄을 착용하고 편안하게 느끼도록 해주세요.',
        tip: '리드줄을 착용했을 때 간식을 주어 좋은 기억을 만들어주세요.',
      },
      {
        title: 'Step 2: 줄 당기지 않고 걷기',
        instruction: "강아지가 줄을 당기면, 즉시 멈춰 서세요. 강아지가 돌아와 줄이 느슨해지면 다시 걷기 시작합니다.",
        tip: '보호자 옆에서 걸을 때마다 간식으로 보상해주세요.',
      },

      {
        title: 'Step 3: 다른 강아지와의 만남',
        instruction: '강아지가 다른 강아지와 만나는 것을 즐기세요.',
        tip: '강아지가 먹이를 찾아간 후, 간식으로 보상해주세요.',
      },
      {
        title: 'Step 4: "잘가"',
        instruction: "강아지에게 '잘가' 라고 말해주세요.",
        tip: '간식으로 유도해주세요!',
      },
      {
        title: 'Step 5: "안녕"',
        instruction: "강아지에게 '안녕' 이라고 말해주세요.",
        tip: '간식으로 유도해주세요!',
      },
    ],
  },
  social: {
    id: 'social',
    title: '사회화 훈련',
    Icon: Users,
    description: '다양한 상황과 사람들에게 익숙해지는 훈련이에요.',
    difficulty: '중급',
    duration: '20-25분',
    color: 'indigo',
    steps: [
      {
        title: 'Step 1: 다양한 소리 들려주기',
        instruction: '집에서 청소기, 초인종 등 다양한 생활 소음을 들려주며 소리에 둔감해지도록 도와주세요.',
        tip: '작은 소리부터 시작하고, 강아지가 안정적일 때 간식을 주세요.',
      },
      {
        title: 'Step 2: 낯선 사람 만나기',
        instruction: '차분한 친구나 이웃을 초대해 강아지와 자연스럽게 인사하게 하세요.',
        tip: '방문객이 강아지에게 간식을 주도록 하여 낯선 사람에 대한 긍정적인 인식을 심어주세요.',
      
      },
      {
        title: 'Step 3: "잘가"',
        instruction: "강아지에게 '잘가' 라고 말해주세요.",
        tip: '간식으로 유도해주세요!',
      },
      {
        title: 'Step 4: "안녕"',
        instruction: "강아지에게 '안녕' 이라고 말해주세요.",
        tip: '간식으로 유도해주세요!',
      },
      {
        title: 'Step 5: "잘가"',
        instruction: "강아지에게 '잘가' 라고 말해주세요.",
        tip: '간식으로 유도해주세요!',
      },
    ],
  },
};
