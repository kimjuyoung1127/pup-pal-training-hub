// scripts/run-pipeline.ts

// 1. 각 모듈에서 필요한 함수들을 가져옵니다.
import { fetchAllCategorizedArticles } from './fetch-articles';
import { ArticleAnalyzer } from './analyzer';
import { createClient } from '@supabase/supabase-js';

// Supabase 접속 정보를 환경 변수에서 가져옵니다.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

/**
 * 전체 데이터 파이프라인을 실행하는 메인 함수
 */
async function main() {
  console.log('======= 데이터 파이프라인 시작 =======');

  // --- 1단계: 데이터 수집 ---
  const rawArticles = await fetchAllCategorizedArticles();
  if (!rawArticles || rawArticles.length === 0) {
    console.log('수집된 아티클이 없어 파이프라인을 종료합니다.');
    return;
  }
  console.log(`[1/3] 데이터 수집 완료: ${rawArticles.length}개`);

  // --- 2단계: AI 분석 ---
  const analyzer = new ArticleAnalyzer();
  const analyzedArticles = await analyzer.analyzeArticles(rawArticles);
  if (!analyzedArticles || analyzedArticles.length === 0) {
    console.log('AI 분석 결과가 없어 파이프라인을 종료합니다.');
    return;
  }
  console.log(`[2/3] AI 분석 완료: ${analyzedArticles.length}개`);

  // --- 3단계: 데이터베이스 저장 ---
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase 환경 변수가 설정되지 않았습니다. DB 저장을 건너뜁니다.');
    console.log('======= 데이터 파이프라인 종료 (DB 저장 실패) =======');
    // 최종 결과물을 콘솔에 출력하여 수동으로 확인할 수 있게 함
    console.log(JSON.stringify(analyzedArticles, null, 2));
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('Supabase 클라이언트 초기화 완료.');

  // DB에 저장할 형태로 데이터를 변환합니다.
  const dataToInsert = analyzedArticles.map(article => ({
    suggested_title_ko: article.suggested_title_ko,
    summary_ko: article.summary_ko,
    original_url: article.url,
    image_url: article.imageUrl,
    category: article.category,
    source_name: article.source,
  }));

  console.log(`${dataToInsert.length}개의 데이터를 Supabase에 저장합니다...`);
  const { data, error } = await supabase
    .from('suggested_topics')
    .insert(dataToInsert)
    .select();

  if (error) {
    console.error('DB 저장 중 오류 발생:', error);
    console.log('======= 데이터 파이프라인 종료 (DB 저장 실패) =======');
    return;
  }

  console.log(`[3/3] DB 저장 완료: ${data.length}개 행 삽입`);
  console.log('======= 데이터 파이프라인 성공적으로 종료 =======');
}

// 메인 함수 실행
main().catch(error => {
  console.error('파이프라인 실행 중 예기치 않은 오류 발생:', error);
  process.exit(1);
});