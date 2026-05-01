# Architecture Overview

## 1) 전체 컴포넌트

```text
[Scheduler]
   |
   v
[Daily Job Orchestrator]
   |
   +--> [Review Fetch Service] --> [Platform Adapter(s)] --> [External Platforms]
   |
   +--> [Reply Policy Engine]
   |
   +--> [Reply Publish Service] --> [Platform Adapter(s)] --> [External Platforms]
   |
   +--> [Audit/Log Store]
   |
   +--> [Alert/Notification]
```

### 핵심 구성요소
- **Scheduler**: 일 단위 배치 시작 트리거.
- **Daily Job Orchestrator**: 전체 처리 흐름 제어, 단계별 상태 전이 관리.
- **Review Fetch Service**: 리뷰 조회 유스케이스 수행.
- **Reply Policy Engine**: 자동 답글 가능 여부/문구 정책 판단.
- **Reply Publish Service**: 답글 등록 유스케이스 수행.
- **Platform Adapter**: 플랫폼별 인증/요청 포맷/응답 파싱 분리.
- **Audit/Log Store**: 요청 결과, 실패 원인, 재시도 이력 저장.

## 2) Daily Job 처리 흐름

1. Scheduler가 지정 시각에 Daily Job 실행.
2. Orchestrator가 대상 스토어/계정을 로딩.
3. 각 대상에 대해 Adapter를 통해 신규 리뷰를 조회.
4. 조회 결과를 기준으로 Reply Policy Engine이 답변 필요 여부 판단.
5. 답변 대상에 대해 Reply Publish Service가 Adapter 호출.
6. 성공/실패/스킵 결과를 Audit/Log Store에 기록.
7. 실패율 임계치 초과 시 Alert/Notification 전송.
8. 배치 종료 후 요약 리포트 생성.

## 3) Adapter 경계(Boundary)

Adapter는 다음 책임만 가집니다.

- 인증 세션 획득/갱신
- 플랫폼별 endpoint 호출
- 플랫폼 응답을 내부 Contract로 매핑
- 플랫폼별 에러 코드를 표준 에러로 변환

Adapter 바깥 레이어는 다음을 몰라야 합니다.

- 특정 플랫폼의 URL 경로/쿼리 구조
- HTML/DOM 셀렉터
- 플랫폼 고유 에러 메시지 상세 문자열

즉, 도메인 레이어는 항상 **플랫폼 중립 Contract**에만 의존해야 합니다.
