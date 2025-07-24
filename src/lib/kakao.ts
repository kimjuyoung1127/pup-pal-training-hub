
// 타입 에러 방지를 위해 Kakao 객체를 window에 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

// 카카오 SDK 초기화 함수
export const initKakao = () => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    // 제공된 JavaScript 키를 사용합니다.
    window.Kakao.init('cc09cea9d387e0428ac409077a15956a'); 
  }
};
