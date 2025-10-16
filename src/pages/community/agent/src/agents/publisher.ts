// src/pages/community/agent/src/agents/publisher.ts

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Octokit } from '@octokit/rest';
import { PublisherInput, PublisherOutput } from '../types';

// GitHub 저장소 정보 (환경변수 또는 설정 파일에서 가져와야 함)
const OWNER = 'gmdqn'; // GitHub 사용자명 또는 조직명
const REPO = 'AI'; // 저장소 이름
const MAIN_BRANCH = 'main'; // 기본 브랜치 이름

// Publisher Agent의 메인 실행 함수
export const runPublisher = async (): Promise<void> => {
  try {
    console.log('Publisher Agent 시작...');
    
    // 1. 가장 최근에 생성된 FOR_REVIEW-*.md 파일 찾기
    const agentDir = path.join(__dirname, '../../');
    const files = fs.readdirSync(agentDir);
    const reviewFiles = files.filter(file => file.startsWith('FOR_REVIEW-') && file.endsWith('.md'));
    
    if (reviewFiles.length === 0) {
      throw new Error(`FOR_REVIEW-*.md 파일을 찾을 수 없습니다.`);
    }
    
    // 가장 최근 파일
    const latestReviewFile = reviewFiles.sort().pop()!;
    const reviewedPath = path.join(agentDir, latestReviewFile);
    console.log(`발행할 파일: ${reviewedPath}`);
    
    // 2. 파일 내용 읽기
    const articleContent = fs.readFileSync(reviewedPath, 'utf-8');
    console.log(`파일 내용 로드 완료. (길이: ${articleContent.length} 문자)`);

    // 3. planning.json에서 아티클 제목과 요약 가져오기 (PR 제목과 설명에 사용)
    const planningPath = path.join(agentDir, 'planning.json');
    let articleTitle = '새로운 아티클';
    let articleSummary = 'AI가 생성한 새로운 콘텐츠입니다.';
    
    if (fs.existsSync(planningPath)) {
      const planningData = JSON.parse(fs.readFileSync(planningPath, 'utf-8'));
      articleTitle = planningData.topic || articleTitle;
      articleSummary = planningData.outline?.summary || articleSummary;
    } else {
      console.warn(`planning.json 파일을 찾을 수 없습니다. 기본 제목과 요약을 사용합니다.`);
    }
    console.log(`아티클 제목: ${articleTitle}`);
    console.log(`아티클 요약: ${articleSummary}`);

    // 4. 새 브랜치 이름 생성
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const safeTitle = articleTitle.replace(/[^a-zA-Z0-9가-힣]/g, '-').replace(/-+/g, '-').substring(0, 50);
    const newBranchName = `feature/article-${dateStr}-${safeTitle}`;
    console.log(`새 브랜치 이름: ${newBranchName}`);

    // 5. Git 작업: 새 브랜치 생성 및 체크아웃
    console.log('새 브랜치 생성 중...');
    execSync(`git checkout -b ${newBranchName}`, { cwd: path.resolve(__dirname, '../../../../../'), stdio: 'inherit' });
    console.log(`브랜치 '${newBranchName}' 생성 및 체크아웃 완료.`);

    // 6. 파일 이동 및 커밋
    const finalArticlePath = path.join(__dirname, '../../../../../src/content/articles', `${dateStr}-${safeTitle}.md`);
    console.log(`파일을 ${finalArticlePath}로 이동 중...`);
    fs.renameSync(reviewedPath, finalArticlePath);
    
    console.log('변경사항을 Git에 추가 및 커밋 중...');
    const repoRoot = path.resolve(__dirname, '../../../../../');
    execSync('git add .', { cwd: repoRoot, stdio: 'inherit' });
    execSync(`git commit -m "Add new article: ${articleTitle}"`, { cwd: repoRoot, stdio: 'inherit' });
    console.log('파일 추가 및 커밋 완료.');

    // 7. 새 브랜치를 원격 저장소에 푸시
    console.log('새 브랜치를 원격 저장소에 푸시 중...');
    execSync(`git push origin ${newBranchName}`, { cwd: repoRoot, stdio: 'inherit' });
    console.log(`브랜치 '${newBranchName}' 푸시 완료.`);

    // 8. GitHub API를 사용하여 Pull Request 생성
    console.log('GitHub API를 통해 Pull Request 생성 중...');
    
    // GitHub Token은 환경변수에서 가져옴
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN 환경변수가 설정되지 않았습니다.');
    }
    
    const octokit = new Octokit({ auth: token });
    
    const prResponse = await octokit.pulls.create({
      owner: OWNER,
      repo: REPO,
      title: `Add new article: ${articleTitle}`,
      head: newBranchName,
      base: MAIN_BRANCH,
      body: `## 아티클 요약

${articleSummary}

---

이 PR은 AI 콘텐츠 생성 파이프라인에 의해 자동으로 생성되었습니다.`
    });
    
    const prUrl = prResponse.data.html_url;
    console.log(`Pull Request가 생성되었습니다: ${prUrl}`);

    // 9. 원래 브랜치로 복귀
    console.log(`원래 브랜치(${MAIN_BRANCH})로 복귀 중...`);
    execSync(`git checkout ${MAIN_BRANCH}`, { cwd: repoRoot, stdio: 'inherit' });
    console.log(`${MAIN_BRANCH} 브랜치로 복귀 완료.`);

    console.log('Publisher Agent 작업 완료.');
  } catch (error) {
    console.error('Publisher Agent 실행 중 오류 발생:', error);
    
    // 오류 발생 시 원래 브랜치로 복귀 시도
    try {
      const repoRoot = path.resolve(__dirname, '../../../../../');
      execSync(`git checkout ${MAIN_BRANCH}`, { cwd: repoRoot, stdio: 'inherit' });
      console.log('오류 발생 후 원래 브랜치로 복귀 완료.');
    } catch (restoreError) {
      console.error('원래 브랜치로 복귀 중 오류 발생:', restoreError);
    }
  }
};

// 스andalone 실행을 위한 엔트리 포인트
if (require.main === module) {
  runPublisher();
}