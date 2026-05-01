import { chromium } from 'playwright';

/**
 * 개발/분석 전용 예시:
 * - 로그인 후 네트워크 요청을 관찰/기록
 * - 실제 서비스 endpoint 대신 placeholder endpoint만 사용
 */
async function runCaptureExample(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const capturedRequests: Array<{
    method: string;
    url: string;
    resourceType: string;
  }> = [];

  page.on('request', (request) => {
    const url = request.url();

    // placeholder domain만 기록
    if (url.startsWith('https://placeholder.local')) {
      capturedRequests.push({
        method: request.method(),
        url,
        resourceType: request.resourceType(),
      });
    }
  });

  await page.goto('https://placeholder.local/login');

  // 예시 로그인 동작 (테스트 전용 셀렉터/데이터)
  await page.fill('[data-testid="email"]', 'tester@placeholder.local');
  await page.fill('[data-testid="password"]', 'not-a-real-password');
  await page.click('[data-testid="login-button"]');

  // 로그인 이후 임의 페이지 이동
  await page.goto('https://placeholder.local/dashboard');

  console.log('Captured requests (placeholder only):');
  console.table(capturedRequests);

  await browser.close();
}

runCaptureExample().catch((error) => {
  console.error('[capture-example] failed:', error);
  process.exit(1);
});
