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
            { key: 'past_experience', title: '과거 경험', question: '아이에게 특별한 과거 경험이 있나요?', type: 'radio', options: ['입양', '유기', '가정견', '모름'] },
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
    {
        key: 'routine',
        title: '일상 루틴',
        icon: '⏰',
        missions: [
            { key: 'active_time', title: '활발한 시간대', question: '하루중 활발한 시간대는 언제인가요?', type: 'radio', options: ['아침', '오전', '오후', '저녁', '밤', '종일 활발함', '종일 조용함'] },
            { key: 'separation_anxiety', title: '분리 불안', question: '보호자가 외출할 때 반응이 어떤가요?', type: 'radio', options: ['매우 불안함', '약간 불안함', '보통', '평온함'] },
            { key: 'sleep_pattern', title: '수면 패턴', question: '하루 수면 시간과 패턴은 어떤가요?', type: 'radio', options: ['새벽형 (늦게 자고 늦게 일어남)', '올빼미형 (밤에 활발하고 아침엔 조용함)', '정규형 (일정한 시간에 자고 일어남)', '낮잠을 많이 잔다', '잠이 적은 편이다'] },
        ],
    },
    {
        key: 'training',
        title: '훈련 정보',
        icon: '🎓',
        missions: [
            { key: 'known_commands', title: '알고 있는 명령어', question: '지금까지 배운 명령어들을 알려주세요.', type: 'array', placeholder: '쉼표(,)로 구분하여 입력' },
            { key: 'training_challenges', title: '훈련 어려움', question: '어떤 훈련에서 어려움을 겪고 있나요?', type: 'array', placeholder: '쉼표(,)로 구분하여 입력' },
            { key: 'reward_preference', title: '훈련 보상 선호도', question: '훈련할 때 어떤 보상을 제일 좋아하나요?', type: 'radio', options: ['간식', '칭찬', '장난감', '산책', '혼합'] },
            { key: 'training_consistency', title: '훈련 일관성', question: '가족 구성원들이 훈련 방식에 얼마나 일관적인가요?', type: 'radio', options: ['매우 일관됨', '대체로 일관됨', '때때로 다름', '자주 다름'] },
        ],
    },
];