// scripts/analyzer.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API 키를 환경 변수에서 가져옵니다.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 입력 데이터와 출력 데이터의 타입을 정의합니다.
interface InputArticle {
  title: string;
  url: string;
  source: string;
  imageUrl: string | null;
  category: string;
}

interface AnalyzedArticle extends InputArticle {
  suggested_title_ko: string;
  summary_ko: string;
}

/**
 * AI를 사용하여 아티클 목록을 분석하고 가공하는 클래스
 */
export class ArticleAnalyzer {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
    }
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }

  /**
   * 단일 아티클을 분석하여 한글 제목과 요약을 생성합니다.
   * @param article - 분석할 원본 아티클 객체
   */
  private async analyzeSingleArticle(article: InputArticle): Promise<AnalyzedArticle | null> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        You are an expert assistant for 'Juyoung Kim', a professional dog trainer in Korea.
        Analyze the following article and generate a blog post idea for her.
        The article category is '${article.category}'.
        Please respond ONLY in JSON format with two keys: "suggested_title_ko" and "summary_ko".

        - suggested_title_ko: Create a compelling, professional blog title in Korean.
        - summary_ko: Summarize the key points of the article in three concise bullet points in Korean.

        Article Title: ${article.title}
        Article URL: ${article.url}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().replace(/```json|```/g, '').trim();
      
      const parsed = JSON.parse(text);

      return {
        ...article,
        suggested_title_ko: parsed.suggested_title_ko,
        summary_ko: parsed.summary_ko,
      };

    } catch (error) {
      console.error(`'${article.title}' 아티클 분석 중 오류 발생:`, error);
      return null;
    }
  }

  /**
   * 여러 아티클을 병렬로 분석합니다.
   * @param articles - 분석할 원본 아티클 배열
   */
  public async analyzeArticles(articles: InputArticle[]): Promise<AnalyzedArticle[]> {
    console.log(`총 ${articles.length}개의 아티클에 대한 AI 분석을 시작합니다...`);

    const analysisPromises = articles.map(article => this.analyzeSingleArticle(article));
    const results = await Promise.all(analysisPromises);

    // null이 아닌 유효한 결과만 필터링합니다.
    const validResults = results.filter((result): result is AnalyzedArticle => result !== null);
    
    console.log(`AI 분석 완료. 총 ${validResults.length}개의 유효한 글감을 생성했습니다.`);
    return validResults;
  }
}