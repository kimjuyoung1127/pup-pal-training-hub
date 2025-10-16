# Mung-Ai AI 콘텐츠 생성 파이프라인 개발 및 시행착오 정리

이 문서는 `Mung-Ai` 프로젝트에 통합된 AI 기반 자동 콘텐츠 생성 파이프라인을 개발하고, 이를 GitHub Actions와 연동하며 겪은 과정과 해결한 문제들을 정리한 문서입니다.

## 1. 개요

- **목표**: `sw.md`에 정의된 Git-Centric 자동화 시스템을 구현하여, AI를 활용한 커뮤니티 블로그 콘텐츠를 자동으로 생성하고 GitHub Pull Request로 발행하는 파이프라인을 구축.
- **핵심 기술**: Node.js, TypeScript, Ollama (Local LLM), GitHub Actions, `@octokit/rest`
- **에이전트**: Planner, Writer, Reviewer, Publisher

## 2. 개발 단계 및 과정

### 2.1. Phase 1: 환경 설정 및 초기화 (2025-09-15)

1.  **디렉토리 및 프로젝트 구조 생성**:
    - `src/pages/community/agent` 디렉토리 생성.
    - `npm init -y`로 Node.js 프로젝트 초기화.
    - `src`, `src/agents` 디렉토리 및 `types.ts`, `main.ts`, `planner.ts` 등 뼈대 파일 생성.
2.  **의존성 설치**:
    - `npm install typescript @types/node ts-node @octokit/rest ollama --save-dev`
3.  **TypeScript 설정**:
    - `npx tsc --init` 및 `tsconfig.json` 수정.
4.  **콘텐츠 디렉토리 생성**:
    - `src/content/articles` 디렉토리 생성.

### 2.2. Phase 2: Planner & Writer 에이전트 개발

1.  **타입 정의 (`types.ts`)**:
    - `ArticleOutline`, `PlanningOutput`, `WriterInput`, `WriterOutput` 정의.
2.  **Planner Agent (`planner.ts`)**:
    - 기존 주제 및 트렌드 키워드 시뮬레이션 함수 구현.
    - LLM(Ollama)을 호출하여 새로운 주제와 개요를 JSON 형식으로 생성하는 로직 구현.
    - 결과를 `planning.json` 파일로 저장.
3.  **Writer Agent (`writer.ts`)**:
    - `planning.json` 파일을 읽어들임.
    - LLM을 호출하여 개요를 바탕으로 마크다운 형식의 글 초안을 생성.
    - 결과를 `DRAFT-*.md` 파일로 저장.

### 2.3. Phase 3: Reviewer & Publisher 에이전트 개발

1.  **타입 정의 확장 (`types.ts`)**:
    - `ReviewerInput`, `ReviewerOutput`, `PublisherInput`, `PublisherOutput` 정의.
2.  **Reviewer Agent (`reviewer.ts`)**:
    - `DRAFT-*.md` 파일을 읽어들임.
    - LLM을 호출하여 글의 논리, 문법, 톤 등을 검토하고 교정.
    - 결과를 `FOR_REVIEW-*.md` 파일로 저장.
3.  **Publisher Agent (`publisher.ts`)**:
    - `FOR_REVIEW-*.md` 파일을 읽어들임.
    - Git CLI (`child_process`)를 사용하여 새 브랜치 생성, 파일 이동/커밋, 푸시.
    - `@octokit/rest`를 사용하여 GitHub Pull Request 생성.

### 2.4. Phase 4: 통합 및 GitHub Actions 연동

1.  **메인 오케스트레이터 (`main.ts`)**:
    - `agent` 디렉토리의 파일 상태를 확인하여 적절한 에이전트를 순차적으로 실행.
2.  **GitHub Actions 워크플로우 (`content_generation.yml`)**:
    - 매일 KST 20:00 (UTC 11:00)에 실행되도록 스케줄 설정.
    - Node.js 환경 설정, 의존성 설치, TypeScript 컴파일, `main.js` 실행.
    - GitHub Token 및 Ollama Host 정보를 Secrets에서 가져와 설정.

## 3. 시행착오 및 해결 과정

### 3.1. `ollama` 모듈 미설치 (2025-09-15)

- **문제**: `writer.ts`에서 `Cannot find module 'ollama'` 오류 발생.
- **원인**: `ollama` 라이브러리가 `agent` 디렉토리에 설치되지 않았음.
- **해결**: `npm install ollama` 명령으로 라이브러리 설치.

### 3.2. Ollama 서버 연결 실패 (2025-09-15)

- **문제**: `ECONNREFUSED 127.0.0.1:11434` 오류 발생.
- **원인**: Ollama 서버가 실행 중이지 않거나, `localhost`에서만 접근 가능하도록 설정되어 있었음.
- **해결**:
    1.  Ollama 서버가 실행 중인지 확인 (`ollama serve`).
    2.  Ollama 서버를 외부에서 접근 가능하도록 설정 (`OLLAMA_HOST=http://0.0.0.0:11434`).
    3.  라우터 포트 포워딩 (11434) 및 Windows 방화벽 설정.

### 3.3. 모델 이름 불일치 (2025-09-15)

- **문제**: `model "gpt-oss.20b" not found` 오류 발생.
- **원인**: `ollama list`의 출력은 `gpt-oss:20b`였지만, 코드에서는 `gpt-oss.20b`를 사용했음.
- **해결**: `planner.ts`, `writer.ts`, `reviewer.ts`의 모델 이름을 `gpt-oss:20b`로 수정.

### 3.4. LLM 응답 형식 오류 (2025-09-15)

- **문제**: `SyntaxError: Unexpected token 'W', "We need to"... is not valid JSON`.
- **원인**: LLM이 `format: 'json'` 지시어를 무시하고 텍스트 설명과 JSON이 섞인 응답을 반환함.
- **해결**:
    1.  `planner.ts`의 프롬프트를 강화하여, 반드시 JSON만 반환하라고 명확히 지시.
    2.  `format: 'json'` 옵션을 제거하고 프롬프트에 의존하도록 변경.
    3.  프롬프트 끝에 "--- 응답 형식 --- ... --- 응답 형식 끝 ---"과 같은 구분자를 추가하여 모델의 주의를 끔.

## 4. 최종 결과 및 확인

- 모든 에이전트(Planner, Writer, Reviewer, Publisher)가 TypeScript로 성공적으로 구현됨.
- `main.ts`를 통해 파일 상태에 따라 에이전트가 순차적으로 실행되는 로직이 동작함.
- `content_generation.yml`을 통해 GitHub Actions에서 워크플로우가 스케줄링됨.
- 로컬 테스트를 통해 `planning.json` 파일이 성공적으로 생성됨.
- 네트워크 설정, 모델 이름, 프롬프트 오류 등 주요 문제점이 해결됨.

이제 파이프라인이 GitHub Actions를 통해 매일 자동으로 실행되어, AI 기반의 새로운 콘텐츠를 생성하고 Pull Request로 제안할 수 있는 상태가 되었습니다.