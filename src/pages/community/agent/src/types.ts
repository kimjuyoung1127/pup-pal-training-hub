// src/pages/community/agent/src/types.ts

// Planner Agent의 출력 타입 (Writer Agent의 입력 타입이기도 함)
export interface ArticleOutline {
  title: string; // 아티클 제목
  summary: string; // 아티클 요약
  sections: { // 아티클의 각 섹션
    heading: string; // 섹션 제목
    contentIdeas: string[]; // 해당 섹션에 포함될 내용 아이디어
  }[];
}

// Planner Agent의 최종 출력
export interface PlanningOutput {
  topic: string; // 생성할 아티클의 주제/제목
  outline: ArticleOutline; // 아티클 개요
}

// Writer Agent의 입력 (Planner의 출력과 동일)
export interface WriterInput extends PlanningOutput {}

// Writer Agent의 출력
export interface WriterOutput {
  markdownContent: string; // 생성된 마크다운 형식의 글
}

// Reviewer Agent의 입력
export interface ReviewerInput {
  draftPath: string; // DRAFT-*.md 파일의 경로
}

// Reviewer Agent의 출력
export interface ReviewerOutput {
  reviewedContent: string; // 검토 및 교정된 마크다운 내용
  // 필요시 교정된 부분에 대한 메타데이터 추가 가능
}

// Publisher Agent의 입력
export interface PublisherInput {
  reviewedPath: string; // FOR_REVIEW-*.md 파일의 경로
}

// Publisher Agent의 출력
export interface PublisherOutput {
  prUrl: string; // 생성된 Pull Request의 URL
}