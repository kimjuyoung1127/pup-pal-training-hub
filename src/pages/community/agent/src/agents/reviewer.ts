// src/pages/community/agent/src/agents/reviewer.ts

import * as fs from 'fs';
import * as path from 'path';
import { Ollama } from 'ollama';
import { ReviewerInput, ReviewerOutput } from '../types';

// LLM을 사용하여 마크다운 초안을 검토하고 교정하는 함수
const reviewAndCorrectDraft = async (draftContent: string): Promise<ReviewerOutput> => {
  const prompt = `
    당신은 'Mung-Ai'라는 AI 기반 강아지 훈련 플랫폼의 콘텐츠 리뷰어입니다.
    다음은 블로그 글의 초안입니다. 이 초안을 꼼꼼히 검토하고, 다음과 같은 항목을 중심으로 교정해주세요.

    검토 항목:
    1.  **논리적 오류 및 일관성**: 내용에 모순되거나 일관성 없는 부분이 있는가?
    2.  **문법 및 오타**: 문법 오류, 맞춤법 오류, 오타가 있는가?
    3.  **톤 앤 매너**: 친근하고 전문가의 조언을 제공하는 톤을 유지하고 있는가?
    4.  **브랜딩**: Mung-Ai 프로젝트에 대한 언급이 자연스럽고 적절한가?
    5.  **가독성**: 문장이 명확하고 이해하기 쉬운가?

    교정 시 다음 지침을 따라주세요:
    - 교정된 전체 마크다운 내용을 반환해주세요. 다른 설명이나 JSON 래퍼는 포함하지 마세요.
    - 원본의 구조와 제목은 최대한 유지하면서, 필요한 부분만 수정해주세요.
    - 수정이 필요한 부분이 없다면, 원본 내용을 그대로 반환해주세요.
    
    ---
    초안 내용:
    ${draftContent}
    ---
  `;

  try {
    // 실제 Ollama 서버 URL은 환경변수나 설정 파일에서 가져와야 함
    // 예: const ollamaClient = new ollama({ host: process.env.OLLAMA_HOST });
    // 현재는 예시로 기본 호스트를 사용
    const ollamaClient = new Ollama();
    
    const response = await ollamaClient.chat({
      model: 'gpt-oss:20b', // sw.md에 정의된 모델명
      messages: [{ role: 'user', content: prompt }]
    });

    const reviewedContent = response.message.content.trim();
    return { reviewedContent };
  } catch (error) {
    console.error('LLM 호출 중 오류 발생:', error);
    throw error;
  }
};

// Reviewer Agent의 메인 실행 함수
export const runReviewer = async (): Promise<void> => {
  try {
    console.log('Reviewer Agent 시작...');
    
    // 1. 가장 최근에 생성된 DRAFT-*.md 파일 찾기
    const agentDir = path.join(__dirname, '../../');
    const files = fs.readdirSync(agentDir);
    const draftFiles = files.filter(file => file.startsWith('DRAFT-') && file.endsWith('.md'));
    
    if (draftFiles.length === 0) {
      throw new Error(`DRAFT-*.md 파일을 찾을 수 없습니다.`);
    }
    
    // 가장 최근 파일 (파일명이 알파벳순으로 정렬되었을 때 마지막)
    const latestDraftFile = draftFiles.sort().pop()!;
    const draftPath = path.join(agentDir, latestDraftFile);
    console.log(`검토할 파일: ${draftPath}`);
    
    // 2. 파일 내용 읽기
    const draftContent = fs.readFileSync(draftPath, 'utf-8');
    console.log(`파일 내용 로드 완료. (길이: ${draftContent.length} 문자)`);

    // 3. LLM을 통한 검토 및 교정
    console.log('LLM을 통해 글 검토 및 교정 중...');
    const reviewResult = await reviewAndCorrectDraft(draftContent);
    console.log('검토 및 교정 완료. (교정된 내용 길이:', reviewResult.reviewedContent.length, '문자)');

    // 4. 결과를 FOR_REVIEW-*.md 파일로 저장
    const fileNameWithoutExt = path.basename(latestDraftFile, '.md');
    const outputPath = path.join(agentDir, `FOR_REVIEW-${fileNameWithoutExt.substring(6)}.md`); // DRAFT- prefix 제거
    fs.writeFileSync(outputPath, reviewResult.reviewedContent, 'utf-8');
    console.log(`검토된 파일이 생성되었습니다: ${outputPath}`);

    console.log('Reviewer Agent 작업 완료.');
  } catch (error) {
    console.error('Reviewer Agent 실행 중 오류 발생:', error);
    // 오류 발생 시에도 프로세스를 종료하지 않고, 오류 로그만 남김
  }
};

// 스andalone 실행을 위한 엔트리 포인트
if (require.main === module) {
  runReviewer();
}