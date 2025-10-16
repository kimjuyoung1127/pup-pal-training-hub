// src/pages/community/agent/src/agents/planner.ts

import * as fs from 'fs';
import * as path from 'path';
import { Ollama } from 'ollama';
import { PlanningOutput } from '../types';

// 임시: 기존 주제를 시뮬레이션하는 함수
// 실제 구현에서는 fs.readdirSync 등을 사용하여 src/content/articles 폴더를 스캔해야 함
const getExistingTopics = (): string[] => {
  // 실제 파일 시스템에서 읽어오는 로직으로 대체될 예정
  // 예시 주제들
  return [
    "반려견의 분리불안을 줄이는 5가지 방법",
    "강아지 훈련의 기본 원칙",
    "AI로 알아보는 반려견의 행동 분석",
    "실내 놀이로 지치지 않는 강아지 만들기",
    "강아지와의 원활한 소통법"
  ];
};

// 임시: 외부 키워드를 시뮬레이션하는 함수
// 실제 구현에서는 Google Trends API 등을 사용해야 함
const getTrendingKeywords = (): string[] => {
  // 실제 외부 API에서 가져오는 로직으로 대체될 예정
  // 예시 키워드들
  return [
    "반려견 AI 훈련",
    "강아지 스마트 훈련",
    "반려견 행동 교정",
    "강아지 지능 테스트",
    "AI 돌봄 서비스"
  ];
};

// LLM을 사용하여 새로운 주제와 개요를 생성하는 함수
const generateNewTopicAndOutline = async (existingTopics: string[], trendingKeywords: string[]): Promise<PlanningOutput> => {
  const prompt = `
    당신은 'Mung-Ai'라는 AI 기반 강아지 훈련 플랫폼의 콘텐츠 기획자입니다.
    다음 기존 아티클 주제들을 참고하세요:
    ${existingTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

    다음은 현재 유행하는 키워드입니다:
    ${trendingKeywords.map((k, i) => `${i + 1}. ${k}`).join('\n')}

    위의 기존 주제와 유행 키워드를 바탕으로, 독자에게 흥미롭고 유용한 새로운 아티클 주제와 개요를 만들어 주세요.
    주제는 구체적이고 검색 유입에 유리한 형태여야 합니다.
    
    --- 응답 형식 ---
    반드시 아래의 JSON 형식으로만 응답하세요. 다른 어떤 설명, 텍스트, 마크다운 블록(\`\`\`json)도 포함하지 마세요. 오직 아래의 JSON 객체만 출력해야 합니다. 출력 시작과 끝에는 다른 문자가 없어야 합니다.

    {
      "topic": "새로운 아티클 주제 (예: 'AI가 분석한 강아지의 스트레스 해소법')",
      "outline": {
        "title": "새로운 아티클 주제와 동일한 제목",
        "summary": "아티클 전체 내용을 요약한 2-3문장",
        "sections": [
          {
            "heading": "섹션 1 제목",
            "contentIdeas": ["섹션 1의 내용 아이디어 1", "섹션 1의 내용 아이디어 2"]
          },
          {
            "heading": "섹션 2 제목",
            "contentIdeas": ["섹션 2의 내용 아이디어 1", "섹션 2의 내용 아이디어 2"]
          }
        ]
      }
    }
    --- 응답 형식 끝 ---
  `;

  try {
    // 실제 Ollama 서버 URL은 환경변수나 설정 파일에서 가져와야 함
    // 예: const ollamaClient = new ollama({ host: process.env.OLLAMA_HOST });
    // 현재는 예시로 기본 호스트를 사용
    const ollamaClient = new Ollama();
    
    const response = await ollamaClient.chat({
      model: 'gpt-oss:20b',
      messages: [{ role: 'user', content: prompt }]
    });

    const rawContent = response.message.content;
    console.log('LLM Raw Response:', rawContent);
    
    // 응답에서 JSON 부분만 추출 (백틱 제거 등)
    let jsonString = rawContent.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.substring(7);
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.substring(0, jsonString.length - 3);
    }
    jsonString = jsonString.trim();

    const parsedData: PlanningOutput = JSON.parse(jsonString);
    return parsedData;
  } catch (error) {
    console.error('LLM 호출 중 오류 발생:', error);
    throw error;
  }
};

// Planner Agent의 메인 실행 함수
export const runPlanner = async (): Promise<void> => {
  try {
    console.log('Planner Agent 시작...');
    
    // 1. 기존 주제 분석
    const existingTopics = getExistingTopics();
    console.log('기존 주제 목록:', existingTopics);

    // 2. 외부 키워드 수집
    const trendingKeywords = getTrendingKeywords();
    console.log('트렌드 키워드:', trendingKeywords);

    // 3. LLM을 통한 주제/개요 생성
    console.log('LLM을 통해 새로운 주제와 개요 생성 중...');
    const planningResult = await generateNewTopicAndOutline(existingTopics, trendingKeywords);
    console.log('생성된 주제 및 개요:', JSON.stringify(planningResult, null, 2));

    // 4. 결과를 planning.json 파일로 저장
    const outputPath = path.join(__dirname, '../../planning.json'); // agent 디렉토리에 저장
    fs.writeFileSync(outputPath, JSON.stringify(planningResult, null, 2), 'utf-8');
    console.log(`planning.json 파일이 생성되었습니다: ${outputPath}`);

    console.log('Planner Agent 작업 완료.');
  } catch (error) {
    console.error('Planner Agent 실행 중 오류 발생:', error);
    // 오류 발생 시에도 프로세스를 종료하지 않고, 오류 로그만 남김
    // 상위 프로세스(main.ts)에서 재시도 로직을 구현할 수 있음
  }
};

// 스andalone 실행을 위한 엔트리 포인트
if (require.main === module) {
  runPlanner();
}