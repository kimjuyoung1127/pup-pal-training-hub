
const healthIcons: Record<string, string> = {
    '건강함': '💚', '관절 문제': '🦴', '알레르기': '🤧', '소화 문제': '🤱',
    '피부 질환': '🐕', '과체중': '⚖️', '저체중': '📏', '기타': '🏥'
};

const trainingGoalIcons: Record<string, string> = {
    '기본 예절 훈련': '🎓', '배변 훈련': '🚽', '짖음 줄이기': '🤫', '산책 훈련': '🚶',
    '사회성 훈련': '👥', '분리불안 해결': '💔', '물어뜯기 교정': '🚫',
    '손 올리기/앉기': '✋', '기다려': '⏱️', '이리와': '🤗'
};

const healthOptionsData = [
    { id: 1, name: '건강함' },
    { id: 2, name: '관절 문제' },
    { id: 3, name: '알레르기' },
    { id: 4, name: '소화 문제' },
    { id: 5, name: '피부 질환' },
    { id: 6, name: '과체중' },
    { id: 7, name: '저체중' },
    { id: 8, name: '기타' },
];

const trainingOptionsData = [
    { id: 1, name: '기본 예절 훈련' },
    { id: 2, name: '배변 훈련' },
    { id: 3, name: '짖음 줄이기' },
    { id: 4, name: '산책 훈련' },
    { id: 5, name: '사회성 훈련' },
    { id: 6, name: '분리불안 해결' },
    { id: 7, name: '물어뜯기 교정' },
    { id: 8, name: '손 올리기/앉기' },
    { id: 9, name: '기다려' },
    { id: 10, name: '이리와' },
];

const healthOptions = healthOptionsData.map(o => ({ id: o.id, label: o.name, icon: healthIcons[o.name] || '❓' }));
const trainingGoalOptions = trainingOptionsData.map(o => ({ id: o.id, label: o.name, icon: trainingGoalIcons[o.name] || '❓' }));


export const useDogInfoOptions = () => {
    return { 
        healthOptions, 
        trainingGoalOptions,
        isLoading: false,
    };
};
