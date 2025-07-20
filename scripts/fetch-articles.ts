// scripts/fetch-articles.ts

import axios from 'axios';

// API 키를 환경 변수에서 가져옵니다.
// 로컬에서 실행 시 .env.local 파일 (dotenv 라이브러리 필요) 또는 직접 설정
// GitHub Actions에서는 Secrets를 통해 이 환경 변수를 주입합니다.
const API_KEY = process.env.NEWS_API_KEY || 'f865d92a072e473b9d4452043913edfe'; // Secrets가 없을 경우를 대비한 임시 키
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// 수집할 아티클 정보를 담을 인터페이스
interface Article {
  title: string;
  url: string;
  source: string;
  imageUrl: string | null;
}

/**
 * NewsAPI를 사용하여 반려동물 관련 최신 아티클을 가져오는 함수
 */
async function fetchPetArticles(): Promise<Article[]> {
  if (!API_KEY) {
    throw new Error('NEWS_API_KEY 환경 변수가 설정되지 않았습니다.');
  }

  try {
    console.log('NewsAPI에 아티클을 요청합니다...');
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: 'dog OR pet OR veterinary',
        searchIn: 'title,content',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 100,
      },
      headers: {
        'X-Api-Key': API_KEY,
      },
    });

    console.log('API 응답을 성공적으로 받았습니다.');
    const articles: Article[] = response.data.articles
      .filter((item: any) => item.title && item.urlToImage)
      .map((item: any) => ({
        title: item.title,
        url: item.url,
        source: item.source.name,
        imageUrl: item.urlToImage,
      }));

    console.log(`총 ${articles.length}개의 유효한 아티클(제목+이미지)을 가져왔습니다.`);
    return articles;

  } catch (error: any) {
    if (error.response) {
      console.error('API 요청 실패:', error.response.data);
    } else {
      console.error('스크립트 실행 중 오류 발생:', error.message);
    }
    return [];
  }
}

(async () => {
  const fetchedArticles = await fetchPetArticles();
  if (fetchedArticles.length > 0) {
    console.log('--- 수집된 아티클 목록 ---');
    console.log(JSON.stringify(fetchedArticles, null, 2));
    console.log('--------------------------');
  } else {
    console.log('수집된 아티클이 없습니다.');
  }
})();