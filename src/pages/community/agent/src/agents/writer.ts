// src/pages/community/agent/src/agents/writer.ts

import * as fs from 'fs';
import * as path from 'path';
import { Ollama } from 'ollama';
import { WriterInput, WriterOutput } from '../types';

// 임시: 웹 검색을 시뮬레이션하는 함수
// 실제 구현에서는 SerpAPI, Google Custom Search 등 외부 API를 사용해야 함
const performWebSearch = async (query: string): Promise<string> => {
  // 실제 외부 API 호출 로직으로 대체될 예정
  // 현재는 시뮬레이션을 위해 고정된 텍스트를 반환
  console.log(`[시뮬레이션] 웹 검색 수행: ${query}`);
  return `검색 결과: ${query}에 대한 최신 정보는 ... 입니다. 전문가들은 ...라고 말합니다.`;
};

// LLM을 사용하여 마크다운 초안을 생성하는 함수
const generateDraft = async (input: WriterInput): Promise<WriterOutput> => {
  // Mung-Ai 프로젝트에 대한 간단한 설명을 프롬프트에 포함
  const mungAiDescription = `
    Mung-Ai는 반려견의 훈련과 건강을 AI 기술을 통해 돕는 플랫폼입니다.
    주요 기능으로는:
    - AI 견종 추천: 사용자의 생활 방식과 선호도에 따라 적합한 견종을 추천합니다.
    - AI 훈련 추천: 강아지의 프로필(나이, 견종, 건강 상태, 훈련 목표 등)을 바탕으로 맞춤형 훈련 프로그램을 추천합니다.
    - AI 자세 분석: 사용자가 업로드한 강아지 영상을 분석하여 자세의 안정성과 건강 상태를 평가합니다.
    - AI 채팅: Google Gemini API를 사용하여 강아지 훈련에 대한 질문에 답변하는 채팅 기능입니다.
  `;

  // 각 섹션에 대한 내용을 생성하기 위한 프롬프트 구성
  const sectionPrompts = input.outline.sections.map(section => `
    섹션 제목: ${section.heading}
    내용 아이디어: ${section.contentIdeas.join(', ')}
    위 제목과 아이디어를 바탕으로, Mung-Ai 프로젝트의 기능을 자연스럽게 통합하여 한글로 3-5문단 분량의 내용을 작성해주세요.
    마크다운 형식으로 출력하세요. 코드 블록이나 JSON 등 다른 형식은 사용하지 마세요.
  `).join('\n\n');

  const prompt = `
    당신은 'Mung-Ai'라는 AI 기반 강아지 훈련 플랫폼의 콘텐츠 작성자입니다.
    다음은 Mung-Ai 프로젝트에 대한 설명입니다:
    ${mungAiDescription}

    다음 주제와 개요에 따라 블로그 글의 초안을 작성해주세요.
    주제: ${input.topic}
    요약: ${input.outline.summary}

    ${sectionPrompts}

    전체 글은 전문가의 조언을 제공하는 톤으로, 일반 반려견 주인도 쉽게 이해할 수 있도록 친근하고 명확한 언어를 사용해주세요.
    Mung-Ai 프로젝트의 기능을 자연스럽게 삽입하여, 독자가 서비스의 가치를 느낄 수 있도록 해주세요.
    글의 시작과 끝에는 Mung-Ai 플랫폼을 언급하여 브랜딩을 강화하세요.
    결과는 순수한 마크다운 형식의 텍스트만 응답하세요. 다른 설명이나 JSON 래퍼는 포함하지 마세요.
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

    const markdownContent = response.message.content.trim();
    return { markdownContent };
  } catch (error) {
    console.error('LLM 호출 중 오류 발생:', error);
    throw error;
  }
};

// Writer Agent의 메인 실행 함수
export const runWriter = async (): Promise<void> => {
  try {
    console.log('Writer Agent 시작...');
    
    // 1. planning.json 파일 읽기
    const planningPath = path.join(__dirname, '../../planning.json');
    if (!fs.existsSync(planningPath)) {
      throw new Error(`planning.json 파일을 찾을 수 없습니다: ${planningPath}`);
    }

    const planningData = fs.readFileSync(planningPath, 'utf-8');
    const input: WriterInput = JSON.parse(planningData);
    console.log('planning.json 로드 완료:', JSON.stringify(input, null, 2));

    // 2. (선택적) 웹 검색 수행
    // const searchQuery = `반려견 훈련 ${input.topic}`;
    // const searchResults = await performWebSearch(searchQuery);
    // console.log('웹 검색 결과:', searchResults);

    // 3. LLM을 통한 초안 작성
    console.log('LLM을 통해 글 초안 작성 중...');
    const draftResult = await generateDraft(input);
    console.log('초안 작성 완료. (내용 길이:', draftResult.markdownContent.length, '문자)');

    // 4. 결과를 DRAFT-*.md 파일로 저장
    // 파일명에 특수문자나 공백이 있을 수 있으므로, 간단히 처리
    const safeTitle = input.topic.replace(/[^a-zA-Z0-9가-힣]/g, '-').replace(/-+/g, '-').substring(0, 50);
    const outputPath = path.join(__dirname, `../../DRAFT-${safeTitle}.md`);
    fs.writeFileSync(outputPath, draftResult.markdownContent, 'utf-8');
    console.log(`초안 파일이 생성되었습니다: ${outputPath}`);

    console.log('Writer Agent 작업 완료.');
  } catch (error) {
    console.error('Writer Agent 실행 중 오류 발생:', error);
    // 오류 발생 시에도 프로세스를 종료하지 않고, 오류 로그만 남김
  }
};

// 스andalone 실행을 위한 엔트리 포인트
if (require.main === module) {
  runWriter();
}