
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
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // ==================================================
    // 여기가 핵심 수정사항입니다.
    const cookieAcceptButtonSelector = '#onetrust-accept-btn-handler';
    try {
      console.log('쿠키 동의 버튼을 찾습니다...');
      await page.waitForSelector(cookieAcceptButtonSelector, { timeout: 5000 }); // 5초만 기다림
      console.log('쿠키 동의 버튼을 클릭합니다.');
      await page.click(cookieAcceptButtonSelector);
    } catch (error) {
      console.log('쿠키 동의 버튼이 없거나 이미 처리되었습니다. 계속 진행합니다.');
    }
    // ==================================================

    console.log('아티클 목록이 로드되기를 기다립니다...');
    const articleSelector = 'article.teaser'; 
    await page.waitForSelector(articleSelector, { timeout: 15000 });

    console.log('아티클 정보를 추출합니다...');
    const articles: Article[] = await page.evaluate((selector) => {
      const articleElements = document.querySelectorAll(selector);
      const results: Article[] = [];

      articleElements.forEach(element => {
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
    
    console.log('--- 스크래핑 결과 ---');
    console.log(JSON.stringify(articles, null, 2));
    console.log('--------------------');

    expect(articles.length).toBeGreaterThan(0);
  });
});
