
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
  "허스키",
].sort((a, b) => {
  if (a === "잘 모르겠어요") return 1;
  if (b === "잘 모르겠어요") return -1;
  return a.localeCompare(b);
});

dogBreeds.push("잘 모르겠어요");

