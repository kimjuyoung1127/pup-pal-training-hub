
// scripts/fetch-articles.ts

import axios from 'axios';

const API_KEY = process.env.NEWS_API_KEY || 'f865d92a072e473b9d4452043913edfe';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// 1. 키워드 확장
const CATEGORIES = {
  '건강정보': '"dog health" OR "canine disease" OR "veterinary" OR "dog illness" OR "pet first aid"',
  '훈련/행동': '"dog training" OR "puppy training" OR "dog behavior" OR "dog obedience" OR "separation anxiety"',
  '영양/식단': '"canine nutrition" OR "dog food" OR "pet food ingredients" OR "dog diet"',
  '펫테크': '"pet tech" OR "dog camera" OR "smart feeder" OR "gps dog collar" OR "pet technology"',
};

// 2. 도메인 제한 완화 (주요 언론사 및 기술/라이프스타일 매체 추가)
const DOMAINS = [
  // 전문
  'akc.org', 'petmd.com', 'thesprucepets.com', 'whole-dog-journal.com',
  // 주요 언론사
  'apnews.com', 'reuters.com', 'nytimes.com', 'theguardian.com', 'bbc.com',
  // 기술 및 라이프스타일
  'wired.com', 'theverge.com', 'techcrunch.com', 'cnet.com', 'engadget.com',
].join(',');

interface Article {
  title: string;
  url: string;
  source: string;
  imageUrl: string | null;
  category: string;
}

async function fetchArticlesForCategory(categoryName: string, query: string): Promise<Article[]> {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: query,
        domains: DOMAINS,
        language: 'en',
        sortBy: 'publishedAt',
        // 3. 가져올 개수 조정
        pageSize: 7,
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
        category: categoryName,
      }));
  } catch (error) {
    console.error(`'${categoryName}' 카테고리 조회 중 오류 발생:`, error);
    return [];
  }
}

async function fetchAllCategorizedArticles(): Promise<Article[]> {
  if (!API_KEY) {
    throw new Error('NEWS_API_KEY 환경 변수가 설정되지 않았습니다.');
  }
  console.log('모든 카테고리에 대해 아티클 요청을 시작합니다 (완화된 조건)...');
  const promises = Object.entries(CATEGORIES).map(([name, query]) =>
    fetchArticlesForCategory(name, query)
  );
  const results = await Promise.all(promises);
  const allArticles = results.flat();
  console.log(`총 ${allArticles.length}개의 카테고리 분류된 아티클을 가져왔습니다.`);
  return allArticles;
}

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
