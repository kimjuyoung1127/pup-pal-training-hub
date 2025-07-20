// scripts/fetch-articles.ts

import axios from 'axios';

const API_KEY = process.env.NEWS_API_KEY || 'f865d92a072e473b9d4452043913edfe';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// 1. 카테고리 및 관련 키워드 정의
const CATEGORIES = {
  '건강정보': '"dog health" OR "canine disease" OR "veterinary medicine"',
  '훈련/행동': '"dog training" OR "puppy training" OR "dog behavior"',
  '영양/식단': '"canine nutrition" OR "dog food" OR "pet food ingredients"',
  '펫테크': '"pet tech" OR "dog camera" OR "smart feeder" OR "gps dog collar"',
};

const DOMAINS = [
  'akc.org', 'petmd.com', 'thesprucepets.com', 'whole-dog-journal.com',
  'apnews.com', 'reuters.com', 'wired.com', 'theverge.com',
].join(',');

interface Article {
  title: string;
  url: string;
  source: string;
  imageUrl: string | null;
  category: string; // 카테고리 필드 추가
}

/**
 * 특정 카테고리에 대한 아티클을 가져오는 함수
 * @param categoryName - 카테고리 이름 (예: "건강정보")
 * @param query - 해당 카테고리의 검색 키워드
 */
async function fetchArticlesForCategory(categoryName: string, query: string): Promise<Article[]> {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: query,
        domains: DOMAINS,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 5, // 카테고리별로 5개씩 가져오기
      },
      headers: { 'X-Api-Key': API_KEY },
    });

    return response.data.articles
      .filter((item: any) => item.title && item.urlToImage)
      .map((item: any) => ({
        title: item.title,
        url: item.url,
        source: item.source.name,
        imageUrl: item.urlToImage,
        category: categoryName, // 2. 카테고리 꼬리표 부착
      }));
  } catch (error) {
    console.error(`'${categoryName}' 카테고리 조회 중 오류 발생:`, error);
    return [];
  }
}

/**
 * 모든 카테고리의 아티클을 병렬로 가져오는 메인 함수
 */
async function fetchAllCategorizedArticles(): Promise<Article[]> {
  if (!API_KEY) {
    throw new Error('NEWS_API_KEY 환경 변수가 설정되지 않았습니다.');
  }

  console.log('모든 카테고리에 대해 아티클 요청을 시작합니다...');

  // 3. 모든 카테고리에 대한 API 요청을 병렬로 실행
  const promises = Object.entries(CATEGORIES).map(([name, query]) =>
    fetchArticlesForCategory(name, query)
  );

  const results = await Promise.all(promises);
  
  // 4. 모든 카테고리의 결과를 하나의 배열로 합침
  const allArticles = results.flat();

  console.log(`총 ${allArticles.length}개의 카테고리 분류된 아티클을 가져왔습니다.`);
  return allArticles;
}

// 스크립트 실행
(async () => {
  const fetchedArticles = await fetchAllCategorizedArticles();
  if (fetchedArticles.length > 0) {
    console.log('--- 수집된 아티클 목록 (카테고리 분류 완료) ---');
    console.log(JSON.stringify(fetchedArticles, null, 2));
    console.log('-------------------------------------------');
  } else {
    console.log('수집된 아티클이 없습니다.');
  }
})();