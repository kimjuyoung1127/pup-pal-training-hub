
export interface DogInfo {
  name: string;
  age: {
    years: number | null;
    months: number | null;
  };
  gender: string;
  breed: string;
  weight: number | null;
  healthStatus: number[];
  trainingGoals: number[];
}

export type AgeGroup = 'puppy' | 'adult' | 'senior';
export type GenderKey = 'male' | 'female';

export interface BreedData {
  [key: string]: {
    size: 'small' | 'medium' | 'large';
    idealWeight: {
      [key in AgeGroup]: { [key in GenderKey]: [number, number] };
    };
  };
}

export const breedData: BreedData = {
   "그레이트 데인": {
    size: "large",
    idealWeight: {
      puppy: { male: [15, 30], female: [14, 28] },
      adult: { male: [54, 90], female: [45, 59] },
      senior: { male: [50, 85], female: [42, 55] }
    }
  },
  "골든 리트리버": {
    size: "large",
    idealWeight: {
      puppy: { male: [10, 20], female: [8, 18] },
      adult: { male: [29, 34], female: [25, 32] },
      senior: { male: [27, 32], female: [23, 30] }
    }
  },
  "꼬똥 드 툴리아": {
    size: "small",
    idealWeight: {
      puppy: { male: [1.5, 3], female: [1.5, 3] },
      adult: { male: [4, 6], female: [4, 6] },
      senior: { male: [3.5, 5.5], female: [3.5, 5.5] }
    }
  },
  "달마시안": {
    size: "medium",
    idealWeight: {
      puppy: { male: [6, 12], female: [5, 10] },
      adult: { male: [27, 32], female: [24, 29] },
      senior: { male: [25, 30], female: [22, 27] }
    }
  },
  "도베르만": {
    size: "large",
    idealWeight: {
      puppy: { male: [8, 15], female: [7, 14] },
      adult: { male: [34, 40], female: [27, 35] },
      senior: { male: [32, 38], female: [25, 33] }
    }
  },
  "러프 콜리": {
    size: "medium",
    idealWeight: {
      puppy: { male: [5, 10], female: [4, 9] },
      adult: { male: [27, 34], female: [23, 30] },
      senior: { male: [25, 32], female: [21, 28] }
    }
  },
  "로트와일러": {
    size: "large",
    idealWeight: {
      puppy: { male: [10, 20], female: [8, 18] },
      adult: { male: [50, 60], female: [35, 48] },
      senior: { male: [45, 58], female: [32, 45] }
    }
  },
  "래브라도 리트리버": {
    size: "large",
    idealWeight: {
      puppy: { male: [8, 16], female: [7, 15] },
      adult: { male: [29, 36], female: [25, 32] },
      senior: { male: [27, 34], female: [23, 30] }
    }
  },
  "말티즈": {
    size: "small",
    idealWeight: {
      puppy: { male: [1, 3], female: [0.8, 2.5] },
      adult: { male: [2, 4], female: [1.8, 3.5] },
      senior: { male: [1.8, 3.8], female: [1.5, 3.2] }
    }
  },
  "말티숑": {
    size: "small",
    idealWeight: {
      puppy: { male: [1.5, 3.5], female: [1.2, 3] },
      adult: { male: [3, 5], female: [2.5, 4.5] },
      senior: { male: [2.5, 4.8], female: [2.3, 4.2] }
    }
  },
  "말티폼": {
    size: "small",
    idealWeight: {
      puppy: { male: [1.5, 3.5], female: [1.2, 3] },
      adult: { male: [3, 5], female: [2.5, 4.5] },
      senior: { male: [2.5, 4.8], female: [2.3, 4.2] }
    }
  },
  "믹스견": {
    size: "medium",
    idealWeight: {
      puppy: { male: [5, 12], female: [4, 10] },
      adult: { male: [12, 25], female: [11, 23] },
      senior: { male: [11, 23], female: [10, 21] }
    }
  },
  "바센지": {
    size: "medium",
    idealWeight: {
      puppy: { male: [4, 8], female: [3, 7] },
      adult: { male: [9, 11], female: [8, 10] },
      senior: { male: [8, 10], female: [7, 9] }
    }
  },
  "버니즈 마운틴 독": {
    size: "large",
    idealWeight: {
      puppy: { male: [10, 20], female: [8, 18] },
      adult: { male: [35, 50], female: [30, 45] },
      senior: { male: [32, 47], female: [28, 42] }
    }
  },
  "보더 콜리": {
    size: "medium",
    idealWeight: {
      puppy: { male: [4, 8], female: [3.5, 7] },
      adult: { male: [14, 20], female: [12, 19] },
      senior: { male: [13, 18], female: [11, 17] }
    }
  },
  "보스턴 테리어": {
    size: "small",
    idealWeight: {
      puppy: { male: [2, 5], female: [2, 4.5] },
      adult: { male: [7, 11], female: [6, 10] },
      senior: { male: [6, 10], female: [5, 9] }
    }
  },
  "브리타니 스파니엘": {
    size: "medium",
    idealWeight: {
      puppy: { male: [5, 9], female: [4, 8] },
      adult: { male: [14, 18], female: [13, 17] },
      senior: { male: [13, 17], female: [12, 16] }
    }
  },
  "불마스티프": {
    size: "large",
    idealWeight: {
      puppy: { male: [12, 20], female: [10, 18] },
      adult: { male: [50, 60], female: [40, 50] },
      senior: { male: [47, 58], female: [38, 48] }
    }
  },
  "비글": {
    size: "small",
    idealWeight: {
      puppy: { male: [3, 6], female: [2.5, 5.5] },
      adult: { male: [9, 14], female: [8, 13] },
      senior: { male: [8, 13], female: [7, 12] }
    }
  },
  "비즐라": {
    size: "medium",
    idealWeight: {
      puppy: { male: [5, 10], female: [4, 9] },
      adult: { male: [20, 29], female: [18, 25] },
      senior: { male: [18, 27], female: [17, 23] }
    }
  },
  "비숑 프리제": {
    size: "small",
    idealWeight: {
      puppy: { male: [2, 4], female: [1.8, 3.5] },
      adult: { male: [5, 8], female: [4.5, 7.5] },
      senior: { male: [4.5, 7.5], female: [4, 7] }
    }
  },
  "사모예드": {
    size: "large",
    idealWeight: {
      puppy: { male: [6, 14], female: [5, 12] },
      adult: { male: [20, 30], female: [16, 24] },
      senior: { male: [18, 28], female: [15, 22] }
    }
  },
  "삽살개": {
    size: "medium",
    idealWeight: {
      puppy: { male: [4, 10], female: [3, 9] },
      adult: { male: [18, 27], female: [16, 25] },
      senior: { male: [16, 25], female: [15, 23] }
    }
  },
  "샤페이": {
    size: "medium",
    idealWeight: {
      puppy: { male: [4, 9], female: [3, 8] },
      adult: { male: [18, 25], female: [16, 23] },
      senior: { male: [16, 23], female: [14, 21] }
    }
  },
  "시바 이누": {
    size: "medium",
    idealWeight: {
      puppy: { male: [3, 8], female: [2.5, 7] },
      adult: { male: [9, 14], female: [7, 12] },
      senior: { male: [8, 13], female: [6.5, 11] }
    }
  },
  "시츄": {
    size: "small",
    idealWeight: {
      puppy: { male: [1.5, 3], female: [1.5, 2.8] },
      adult: { male: [4, 7], female: [4, 6.5] },
      senior: { male: [3.8, 6.5], female: [3.5, 6] }
    }
  },
  "스코티시 테리어": {
    size: "small",
    idealWeight: {
      puppy: { male: [2, 4], female: [1.8, 3.5] },
      adult: { male: [8, 10], female: [7, 9] },
      senior: { male: [7, 9.5], female: [6.5, 8.5] }
    }
  },
  "아이리시 세터": {
    size: "large",
    idealWeight: {
      puppy: { male: [5, 12], female: [4, 10] },
      adult: { male: [27, 32], female: [24, 29] },
      senior: { male: [25, 30], female: [22, 27] }
    }
  },
  "아키타견": {
    size: "large",
    idealWeight: {
      puppy: { male: [6, 14], female: [5, 12] },
      adult: { male: [30, 40], female: [25, 35] },
      senior: { male: [28, 38], female: [23, 33] }
    }
  },
  "아프간 하운드": {
    size: "large",
    idealWeight: {
      puppy: { male: [5, 10], female: [4, 9] },
      adult: { male: [23, 27], female: [20, 25] },
      senior: { male: [21, 25], female: [18, 23] }
    }
  },
  "알래스칸 말라뮤트": {
    size: "large",
    idealWeight: {
      puppy: { male: [6, 14], female: [5, 12] },
      adult: { male: [36, 43], female: [32, 38] },
      senior: { male: [34, 40], female: [30, 36] }
    }
  },
  "요크셔 테리어": {
    size: "small",
    idealWeight: {
      puppy: { male: [0.8, 2], female: [0.8, 2] },
      adult: { male: [2, 3.2], female: [2, 3] },
      senior: { male: [1.8, 3], female: [1.8, 2.8] }
    }
  },
  "웰시 코기": {
    size: "small",
    idealWeight: {
      puppy: { male: [2, 5], female: [2, 4.5] },
      adult: { male: [10, 14], female: [9, 13] },
      senior: { male: [9, 13], female: [8, 12] }
    }
  },
  "잉글리시 불도그": {
    size: "medium",
    idealWeight: {
      puppy: { male: [4, 8], female: [3.5, 7] },
      adult: { male: [23, 25], female: [18, 23] },
      senior: { male: [21, 23], female: [17, 21] }
    }
  },
  "잉글리시 코커 스파니엘": {
    size: "medium",
    idealWeight: {
      puppy: { male: [3, 6], female: [2.5, 5] },
      adult: { male: [13, 16], female: [12, 15] },
      senior: { male: [12, 15], female: [11, 14] }
    }
  },
  "이탈리안 그레이하운드": {
    size: "small",
    idealWeight: {
      puppy: { male: [2, 4], female: [2, 3.5] },
      adult: { male: [4, 6], female: [3.5, 5] },
      senior: { male: [3.5, 5.5], female: [3, 4.5] }
    }
  },
  "저먼 셰퍼드": {
    size: "large",
    idealWeight: {
      puppy: { male: [5, 12], female: [4, 10] },
      adult: { male: [30, 40], female: [22, 32] },
      senior: { male: [28, 38], female: [20, 30] }
    }
  },
  "제주개": {
    size: "medium",
    idealWeight: {
      puppy: { male: [4, 8], female: [3, 7] },
      adult: { male: [15, 20], female: [13, 18] },
      senior: { male: [14, 19], female: [12, 17] }
    }
  },
  "잭 러셀 테리어": {
    size: "small",
    idealWeight: {
      puppy: { male: [2, 4], female: [1.8, 3.5] },
      adult: { male: [5, 8], female: [4.5, 7.5] },
      senior: { male: [4.5, 7.5], female: [4, 7] }
    }
  },
  "진돗개": {
    size: "medium",
    idealWeight: {
      puppy: { male: [5, 15], female: [4, 13] },
      adult: { male: [18, 23], female: [15, 20] },
      senior: { male: [17, 22], female: [14, 19] }
    }
  },
   "치와와": {
    size: "small",
    idealWeight: {
      puppy: { male: [0.8, 2], female: [0.8, 2] },
      adult: { male: [2, 3], female: [2, 3] },
      senior: { male: [1.8, 2.8], female: [1.8, 2.8] }
    }
  },
  "카네 코르소": {
    size: "large",
    idealWeight: {
      puppy: { male: [10, 20], female: [8, 18] },
      adult: { male: [45, 50], female: [40, 45] },
      senior: { male: [42, 48], female: [38, 43] }
    }
  },
  "카바푸": {
    size: "medium",
    idealWeight: {
      puppy: { male: [1.5, 3.5], female: [1.3, 3] },
      adult: { male: [6, 12], female: [5, 11] },
      senior: { male: [5.5, 11], female: [4.5, 10] }
    }
  },
  "코카 스파니엘": {
    size: "medium",
    idealWeight: {
      puppy: { male: [3, 6], female: [2.5, 5.5] },
      adult: { male: [12, 16], female: [11, 15] },
      senior: { male: [11, 15], female: [10, 14] }
    }
  },
  "파피용": {
    size: "small",
    idealWeight: {
      puppy: { male: [1, 2.5], female: [1, 2.5] },
      adult: { male: [3, 4.5], female: [3, 4.5] },
      senior: { male: [2.8, 4.2], female: [2.8, 4.2] }
    }
  },
  "페키니즈": {
    size: "small",
    idealWeight: {
      puppy: { male: [1, 3], female: [1, 2.8] },
      adult: { male: [4, 6], female: [4, 5.5] },
      senior: { male: [3.5, 5.5], female: [3.5, 5] }
    }
  },
  "포인터": {
    size: "medium",
    idealWeight: {
      puppy: { male: [5, 10], female: [4, 9] },
      adult: { male: [23, 30], female: [20, 28] },
      senior: { male: [21, 28], female: [19, 26] }
    }
  },
  "포메라니안": {
    size: "small",
    idealWeight: {
      puppy: { male: [0.8, 2], female: [0.8, 2] },
      adult: { male: [2, 3], female: [2, 3] },
      senior: { male: [1.8, 2.8], female: [1.8, 2.8] }
    }
  },
  "푸들": {
    size: "small",
    idealWeight: {
      puppy: { male: [2, 4], female: [1.5, 3.5] },
      adult: { male: [5, 8], female: [4, 7] },
      senior: { male: [4.5, 7.5], female: [3.5, 6.5] }
    }
  },
  "프렌치 불독": {
    size: "small",
    idealWeight: {
      puppy: { male: [3, 6], female: [2.5, 5] },
      adult: { male: [9, 14], female: [8, 13] },
      senior: { male: [8, 13], female: [7, 12] }
    }
  },
  "풍산개": {
    size: "medium",
    idealWeight: {
      puppy: { male: [4, 10], female: [3, 9] },
      adult: { male: [18, 25], female: [16, 23] },
      senior: { male: [16, 23], female: [14, 21] }
    }
  },
   "허스키": {
    size: "large",
    idealWeight: {
      puppy: { male: [5, 12], female: [4, 10] },
      adult: { male: [20, 27], female: [16, 23] },
      senior: { male: [18, 25], female: [15, 21] }
    }
  },
  
  




};

export const dogBreeds = [
  "그레이트 데인",
  "골든 리트리버",
  "꼬똥 드 툴리아",
  "달마시안",
  "도베르만",
  "러프 콜리",
  "로트와일러",
  "래브라도 리트리버",
  "말티즈",
  "말티숑",
  "말티폼",
  "믹스견",
  "바센지",
  "버니즈 마운틴 독",
  "보더 콜리",
  "보스턴 테리어",
  "브리타니 스파니엘",
  "불마스티프",
  "비글",
  "비즐라",
  "비숑 프리제",
  "사모예드",
  "삽살개",
  "샤페이",
  "시바 이누",
  "시츄",
  "스코티시 테리어",
  "아이리시 세터",
  "아키타견",
  "아프간 하운드",
  "알래스칸 말라뮤트",
  "요크셔 테리어",
  "웰시 코기",
  "잉글리시 불도그",
  "잉글리시 코커 스파니엘",
  "이탈리안 그레이하운드",
  "저먼 셰퍼드",
  "제주개",
  "잭 러셀 테리어",
  "진돗개",
  "치와와",
  "카네 코르소",
  "코카 스파니엘",
  "파피용",
  "페키니즈",
  "포인터",
  "포메라니안",
  "푸들",
  "프렌치 불독",
  "풍산개",
  "허스키"
].sort((a, b) => {
  if (a === "잘 모르겠어요") return 1;
  if (b === "잘 모르겠어요") return -1;
  return a.localeCompare(b);
});

dogBreeds.push("잘 모르겠어요");

