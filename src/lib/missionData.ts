import { FullDogExtendedProfile } from '@/hooks/useDogProfile';

export type MissionKey = keyof Omit<FullDogExtendedProfile, 'id' | 'dog_id' | 'created_at' | 'updated_at'>;

export interface Mission {
    key: MissionKey;
    title: string;
    question: string;
    type: 'string' | 'array' | 'boolean' | 'radio';
    options?: string[];
    placeholder?: string;
}

export interface MissionCategory {
    key: string;
    title: string;
    icon: string;
    missions: Mission[];
}

export const missionCategories: MissionCategory[] = [
    {
        key: 'basic',
        title: '기본 정보',
        icon: '🏠',
        missions: [
            { key: 'living_environment', title: '생활 환경', question: '아이는 어디에서 살고 있나요?', type: 'radio', options: ['아파트', '단독주택', '농가주택'] },
            { key: 'family_composition', title: '함께사는 가족 구성원', question: '함께 사는 가족은 몇 명인가요?', type: 'radio', options: ['1인', '2인', '3인', '4인', '5인 이상'] },
            { key: 'family_kids', title: '아이 동거 여부', question: '가족 중에 아이가 함께 사나요?', type: 'boolean' },
        ],
    },
    {
        key: 'personality',
        title: '성격 및 사회성',
        icon: '🐾',
        missions: [
            { key: 'social_level', title: '사회성', question: '다른 강아지나 사람들과의 사회성은 어떤가요?', type: 'radio', options: ['좋음', '보통', '부족'] },
            { key: 'owner_proximity', title: '보호자와의 관계', question: '보호자와의 거리감은 어느 정도인가요?', type: 'radio', options: ['항상 함께 있음', '혼자 있는 시간 많음'] },
            { key: 'past_experience', title: '과거 경험', question: '딩딩이에게 특별한 과거 경험이 있나요?', type: 'radio', options: ['입양', '유기', '가정견', '모름'] },
            { key: 'sensitive_items', title: '민감 요소', question: '특별히 민감하게 반응하는 것이 있나요?', type: 'array', placeholder: '쉼표(,)로 구분하여 입력' },
        ],
    },
    {
        key: 'habits',
        title: '생활 습관',
        icon: '🍚',
        missions: [
            { key: 'meal_habit', title: '식사 습관', question: '식사 습관은 어떤 편인가요?', type: 'radio', options: ['잘 먹음', '입이 짧음', '편식 심함'] },
            { key: 'toilet_type', title: '배변 습관', question: '배변은 주로 어디서 해결하나요?', type: 'radio', options: ['실내', '실외', '혼합'] },
            { key: 'leash_type', title: '산책 장비', question: '산책 시 어떤 장비를 사용하나요?', type: 'radio', options: ['목줄', '하네스', '둘 다 사용'] },
            { key: 'activity_level', title: '활동량', question: '하루 평균 활동량은 어느 정도인가요?', type: 'radio', options: ['많이 움직임', '보통', '적음'] },
        ],
    },
    {
        key: 'preferences',
        title: '개인 취향',
        icon: '💖',
        missions: [
            { key: 'known_behaviors', title: '잘하는 행동', question: '이미 잘하는 행동들을 알려주세요.', type: 'array', placeholder: '쉼표(,)로 구분하여 입력' },
            { key: 'preferred_play', title: '선호하는 놀이', question: '어떤 놀이를 가장 좋아하나요?', type: 'array', placeholder: '쉼표(,)로 구분하여 입력' },
            { key: 'favorites', title: '최애템', question: '가장 좋아하는 간식이나 장난감은 무엇인가요?', type: 'array', placeholder: '쉼표(,)로 구분하여 입력' },
        ],
    },
];