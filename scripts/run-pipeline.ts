// scripts/run-pipeline.ts

import { fetchAllCategorizedArticles } from './fetch-articles';
import { ArticleAnalyzer } from './analyzer';
import { createClient } from '@supabase/supabase-js';

// Supabase 접속 정보를 환경 변수에서 가져옵니다.
const SUPABASE_URL = process.env.SUPABASE_URL;
// anon_key 대신 service_role_key를 사용합니다.
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

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
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Supabase URL 또는 Service Key 환경 변수가 설정되지 않았습니다.');
    return;
  }

  // service_role_key를 사용하여 클라이언트를 생성하면 RLS를 우회할 수 있습니다.
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  console.log('Supabase 클라이언트 (Service Role) 초기화 완료.');

  const dataToInsert = analyzedArticles.map(article => ({
    suggested_title_ko: article.suggested_title_ko,
    summary_ko: article.summary_ko,
    initial_draft_markdown: article.initial_draft_markdown, // 상세 초안 필드 추가
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
    return;
  }

  console.log(`[3/3] DB 저장 완료: ${data.length}개 행 삽입`);
  console.log('======= 데이터 파��프라인 성공적으로 종료 =======');
}

main().catch(error => {
  console.error('파이프라인 실행 중 예기치 않은 오류 발생:', error);
  process.exit(1);
});