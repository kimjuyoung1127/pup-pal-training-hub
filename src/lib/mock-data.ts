// AI/src/lib/mock-data.ts

export interface Article {
  created_at: string | number | Date;
  review_info: any;
  id: string;
  title: string;
  slug: string;
  image_url: string;
  category: string;
  author_name: string;
  tags: string[];
  // 필요에 따라 추가 속성을 정의할 수 있습니다
  content?: string;
  published_date?: string;
}

export const mockArticles: Article[] = [
  {
      id: '1',
      title: '강아지 치석 관리의 중요성',
      slug: 'dog-dental-care-importance',
      image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '건강 정보',
      author_name: '김수의',
      tags: ['치아 관리', '건강'],
      content: '강아지의 치석 관리는 전반적인 건강에 매우 중요합니다. 정기적인 치아 관리를 통해 심각한 건강 문제를 예방할 수 있습니다.',
      review_info: undefined,
      created_at: ""
  },
  {
      id: '2',
      title: '반려견 여름철 열사병 예방법',
      slug: 'preventing-heatstroke-in-dogs',
      image_url: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '건강 정보',
      author_name: '이건강',
      tags: ['여름', '열사병', '건강'],
      content: '여름철에는 반려견의 열사병에 특히 주의해야 합니다. 충분한 물과 그늘을 제공하고 더운 시간대의 산책을 피하세요.',
      review_info: undefined,
      created_at: ""
  },
  {
      id: '3',
      title: '강아지 알레르기 증상과 대처법',
      slug: 'dog-allergy-symptoms-and-treatment',
      image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '건강 정보',
      author_name: '박알러지',
      tags: ['알레르기', '건강', '증상'],
      content: '강아지도 다양한 알레르기를 가질 수 있습니다. 흔한 증상으로는 피부 가려움, 발적, 재채기 등이 있으며 수의사와 상담하는 것이 중요합니다.',
      review_info: undefined,
      created_at: ""
  },
  {
      id: '4',
      title: '기본 복종 훈련: 앉아, 기다려, 엎드려',
      slug: 'basic-obedience-training',
      image_url: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '훈련/행동',
      author_name: '최훈련',
      tags: ['훈련', '복종', '기본 명령어'],
      content: '기본적인 복종 훈련은 반려견과의 관계를 강화하고 안전을 보장합니다. 일관성과 긍정적 강화가 핵심입니다.',
      review_info: undefined,
      created_at: ""
  },
  {
      id: '5',
      title: '강아지 분리불안 극복하기',
      slug: 'overcoming-separation-anxiety-in-dogs',
      image_url: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '훈련/행동',
      author_name: '정행동',
      tags: ['분리불안', '행동', '훈련'],
      content: '분리불안은 많은 강아지들이 겪는 문제입니다. 점진적인 훈련과 일상 루틴 확립으로 도움을 줄 수 있습니다.',
      review_info: undefined,
      created_at: ""
  },
  {
      id: '6',
      title: '산책 중 끌기 행동 고치기',
      slug: 'fixing-leash-pulling-behavior',
      image_url: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '훈련/행동',
      author_name: '김산책',
      tags: ['산책', '리드줄', '훈련'],
      content: '리드줄을 당기는 행동은 적절한 훈련으로 개선할 수 있습니다. 일관된 방법과 보상 시스템이 효과적입니다.',
      review_info: undefined,
      created_at: ""
  },
  {
      id: '7',
      title: '강아지를 위한 건강한 수제 간식',
      slug: 'healthy-homemade-dog-treats',
      image_url: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '영양/식단',
      author_name: '이요리',
      tags: ['간식', '수제', '영양'],
      content: '집에서 만드는 건강한 간식으로 반려견에게 영양과 즐거움을 동시에 제공하세요. 간단한 레시피를 소개합니다.',
      review_info: undefined,
      created_at: ""
  },
  {
      id: '8',
      title: '강아지 생애 주기별 적합한 식단',
      slug: 'life-stage-appropriate-dog-diets',
      image_url: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '영양/식단',
      author_name: '박영양',
      tags: ['식단', '생애주기', '영양'],
      content: '강아지의 나이에 따라 필요한 영양소가 달라집니다. 각 생애 단계에 맞는 적절한 식단 구성법을 알아봅니다.',
      review_info: undefined,
      created_at: ""
  },
  {
      id: '9',
      title: '강아지 비만 예방과 관리',
      slug: 'preventing-and-managing-dog-obesity',
      image_url: 'https://images.unsplash.com/photo-1541599468348-e96984315921?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '영양/식단',
      author_name: '최건강',
      tags: ['비만', '체중관리', '영양'],
      content: '강아지 비만은 여러 건강 문제를 일으킬 수 있습니다. 적절한 식이 조절과 운동으로 건강한 체중을 유지하는 방법을 알아봅니다.',
      review_info: undefined,
      created_at: ""
  },
  {
      id: '10',
      title: '최신 스마트 자동 급식기 비교',
      slug: 'smart-automatic-pet-feeders-comparison',
      image_url: 'https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '제품 리뷰',
      author_name: '김테크',
      tags: ['펫테크', '급식기', '스마트 기기'],
      content: '최신 스마트 자동 급식기들의 기능과 성능을 비교 분석합니다. 당신의 라이프스타일에 맞는 제품을 찾아보세요.',
      review_info: undefined,
      created_at: ""
  },
  {
      id: '11',
      title: 'GPS 반려동물 추적기 추천',
      slug: 'recommended-gps-pet-trackers',
      image_url: 'https://images.unsplash.com/photo-1546975490-e8b92a360b24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '제품 리뷰',
      author_name: '박안전',
      tags: ['펫테크', 'GPS', '안전'],
      content: '반려견의 위치를 실시간으로 확인할 수 있는 GPS 추적기들을 소개합니다. 배터리 수명, 정확도, 앱 기능 등을 비교했습니다.',
      review_info: undefined,
      created_at: ""
  },
  {
      id: '12',
      title: '반려견 건강 모니터링 앱 TOP 5',
      slug: 'top-5-dog-health-monitoring-apps',
      image_url: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      category: '제품 리뷰',
      author_name: '이앱리뷰',
      tags: ['펫테크', '건강', '앱'],
      content: '반려견의 건강 상태를 추적하고 관리할 수 있는 최고의 앱 5가지를 소개합니다. 각 앱의 주요 기능과 장단점을 비교했습니다.',
      review_info: undefined,
      created_at: ""
  }
];