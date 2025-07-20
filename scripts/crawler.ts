import puppeteer from 'puppeteer';

/**
 * Google 검색을 이용하여 AKC의 'Health' 관련 아티클을 수집합니다.
 * 이는 사이트의 복잡한 구조와 봇 방어 기술을 우회하는 가장 안정적인 방법입니다.
 */
async function crawlAKCviaGoogle() {
  console.log('🚀 Google 검색을 통한 AKC 크롤러를 시작합니다...');

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');

  const searchTerm = 'site:petmd.com/';
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
  console.log(`Google 검색 URL로 이동합니다: ${googleUrl}`);

  try {
    await page.goto(googleUrl, { waitUntil: 'domcontentloaded' });
    console.log('Google 검색 결과 페이지 로딩을 확인했습니다.');

    // Google 검색 결과의 링크 선택자
    const resultSelector = 'div.g'; 
    await page.waitForSelector(resultSelector, { timeout: 30000 });
    console.log('검색 결과를 찾았습니다. 데이터 추출을 시작합니다...');

    const articles = await page.$eval(
      resultSelector,
      (elements) =>
        elements.map((el) => {
          const linkElement = el.querySelector('a');
          const titleElement = el.querySelector('h3');
          
          const title = titleElement ? (titleElement as HTMLElement).innerText.trim() : '제목을 찾을 수 없음';
          const link = linkElement ? linkElement.href : '링크를 찾을 수 없음';
          
          // AKC 링크만 필터링
          if (link && link.includes('petmd.com')) {
            return { title, link };
          }
          return null;
        }).filter(item => item !== null) // null이 아닌 항목만 필터링
    );

    console.log('✅ 크롤링 성공!');
    console.log(`총 ${articles.length}개의 아티클을 찾았습니다.`);
    console.log(articles);

    return articles;

  } catch (error) {
    console.error('❌ 크롤링 중 오류가 발생했습니다:', error);
  } finally {
    await browser.close();
    console.log('👋 크롤러 작업을 마치고 브라우저를 닫았습니다.');
  }
}

// 크롤러 함수를 실행합니다.
crawlAKCviaGoogle();

/*
  참고: 여러 페이지를 순회하는 경우, 요청 사이에 딜레이를 추가하는 것이 서버 부하를 줄이는 데 중요합니다.
  (예: await new Promise(resolve => setTimeout(resolve, 3000));)
  이 스크립트는 단일 페이지만 요청하므로 해당 코드는 포함하지 않았습니다.
*/