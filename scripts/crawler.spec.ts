import { test, expect } from '@playwright/test';

// 수집할 아티클 정보를 담을 인터페이스
interface Article {
  title: string;
  link: string;
}

// 테스트 스위트 정의
test.describe('PetMD Scraper', () => {
  
  // 테스트 케이스 정의
  test('should scrape article titles and links from the care page', async ({ page }) => {
    
    const TARGET_URL = 'https://www.petmd.com/dog/care';

    console.log(`'${TARGET_URL}' 페이지로 이동합니다...`);
    // goto의 timeout을 60초로 늘려 안정성 확보
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log('아티클 목록이 로드되기를 기다립니다...');
    // Codegen을 통해 찾은 더 명확하고 안정적인 선택자
    const articleSelector = 'article.teaser'; 
    await page.waitForSelector(articleSelector, { timeout: 15000 });

    console.log('아티클 정보를 추출합니다...');
    const articles: Article[] = await page.evaluate((selector) => {
      const articleElements = document.querySelectorAll(selector);
      const results: Article[] = [];

      articleElements.forEach(element => {
        // h3 태그 안에 a 태그가 있는 구조
        const linkElement = element.querySelector('h3 a');

        if (linkElement) {
          const title = (linkElement as HTMLElement).innerText.trim();
          const link = (linkElement as HTMLAnchorElement).href;

          if (title && link) {
            results.push({ title, link });
          }
        }
      });
      return results;
    }, articleSelector);

    console.log(`총 ${articles.length}개의 아티클을 찾았습니다.`);
    
    // 결과 출력
    console.log('--- 스크래핑 결과 ---');
    console.log(JSON.stringify(articles, null, 2));
    console.log('--------------------');

    // 검증: 최소 1개 이상의 아티클을 가져왔는지 확인
    expect(articles.length).toBeGreaterThan(0);
  });
});