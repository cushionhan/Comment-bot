# Comment-bot

리뷰 수집/답글 처리 자동화와 웹 푸시 알림을 결합한 모노레포 프로젝트입니다.

## 코드 리뷰 요약

아래는 현재 코드 기준의 빠른 리뷰 결과입니다.

### 👍 강점
- 플랫폼 어댑터 인터페이스(`PlatformReviewClient`)를 통해 플랫폼 종속 코드를 분리하려는 구조가 잘 보입니다.
- Daily Job 실행 결과를 `jobRuns`, `jobRunItems`로 분리해 추적 가능성을 확보했습니다.
- 푸시 구독/발송을 `push` 모듈로 분리해 기능 경계를 명확히 했습니다.

### ⚠️ 개선 권장 사항
1. **입력값 검증 강화 필요**
   - `push-routes.ts`에서 `req.body.subscription` 구조 자체는 검증하지 않아, 잘못된 payload가 저장될 수 있습니다.
   - 런타임 스키마(Zod/TypeBox 등) 기반 검증 추가를 권장합니다.

2. **중복 처리 정책 정교화 필요**
   - Daily Job에서 `db.reviews`에 `externalId`만 저장해 플랫폼/계정이 다를 때 충돌 여지가 있습니다.
   - `platform + account + externalId` 복합 키 정책이 더 안전합니다.

3. **오류/재시도 전략 명시 필요**
   - `registerReply` 실패 시 기록은 남기지만 재시도(backoff) 전략이 없습니다.
   - 일시 장애와 영구 실패를 분리하고 재시도 정책을 문서화하면 운영성이 개선됩니다.

4. **테스트 자동화 보강 필요**
   - 루트 스크립트에는 `test`가 있으나 각 앱에 테스트 스크립트가 부족해 실제 검증 범위가 제한됩니다.
   - `DailyJobService`, `push-routes` 중심 단위 테스트 추가를 권장합니다.

## 모노레포 구조

```text
apps/
  api/   # Fastify 기반 API, 배치/플랫폼 어댑터/푸시 로직
  web/   # Next.js 기반 웹 UI, 푸시 구독 UI

docs/    # 아키텍처/보안/플랫폼 어댑터 가이드
prisma/  # 데이터 모델 스키마
tools/   # Playwright 캡처 예제 등 보조 도구
```

## 시작하기

### 1) 설치

```bash
pnpm install
```

### 2) 개발 서버 실행

```bash
pnpm dev
```

- API 기본 포트: `3000`

### 3) 빌드

```bash
pnpm build
```

### 4) 타입/정적 검사(권장)

```bash
pnpm lint
pnpm typecheck
```

### 5) 테스트

```bash
pnpm test
```

### 6) Mock daily job 실행

```bash
pnpm job:daily:mock
```

## 핵심 동작 흐름

1. 배치 실행 시 활성 플랫폼 계정을 조회합니다.
2. 계정 세션 유효성을 확인합니다.
3. 신규 리뷰를 수집하고, 룰 템플릿 기반 답글을 생성합니다.
4. 플랫폼 어댑터를 통해 답글 등록을 시도합니다.
5. 성공/실패 결과를 JobRunItem에 기록합니다.
6. 처리 완료 후 필요 시 사용자 푸시 알림을 전송합니다.

## 참고 문서

- `docs/architecture.md`
- `docs/platform-adapter-guide.md`
- `docs/pwa-push-guide.md`
- `docs/security-notes.md`
