// src/pages/community/agent/src/main.ts

import * as fs from 'fs';
import * as path from 'path';
import { runPlanner } from './agents/planner';
import { runWriter } from './agents/writer';
import { runReviewer } from './agents/reviewer';
import { runPublisher } from './agents/publisher';

async function main() {
  console.log('=== Mung-Ai 콘텐츠 생성 파이프라인 시작 ===');
  
  const agentDir = path.join(__dirname, '..');

  // 1. 파일 존재 여부 확인
  const files = fs.readdirSync(agentDir);
  const hasPlanningJson = files.includes('planning.json');
  const draftFiles = files.filter(f => f.startsWith('DRAFT-') && f.endsWith('.md'));
  const hasDraft = draftFiles.length > 0;
  const reviewFiles = files.filter(f => f.startsWith('FOR_REVIEW-') && f.endsWith('.md'));
  const hasReview = reviewFiles.length > 0;

  console.log('현재 상태 확인:');
  console.log(`- planning.json: ${hasPlanningJson}`);
  console.log(`- DRAFT-*.md: ${hasDraft} (${draftFiles.length}개)`);
  console.log(`- FOR_REVIEW-*.md: ${hasReview} (${reviewFiles.length}개)`);

  try {
    // 2. 조건에 따라 에이전트 실행
    if (!hasPlanningJson) {
      console.log('-> Planner Agent 실행');
      await runPlanner();
    } else if (hasPlanningJson && !hasDraft) {
      console.log('-> Writer Agent 실행');
      await runWriter();
    } else if (hasDraft && !hasReview) {
      console.log('-> Reviewer Agent 실행');
      await runReviewer();
    } else if (hasReview) {
      console.log('-> Publisher Agent 실행');
      await runPublisher();
    } else {
      console.log('실행할 작업이 없습니다. 모든 단계가 완료되었거나, 파이프라인 상태가 불일치합니다.');
    }
  } catch (error) {
    console.error('파이프라인 실행 중 오류 발생:', error);
    process.exit(1); // 오류 발생 시 프로세스 종료 코드 1로 종료
  }

  console.log('=== Mung-Ai 콘텐츠 생성 파이프라인 종료 ===');
}

// 스크립트로 직접 실행될 때 main 함수 호출
if (require.main === module) {
  main();
}