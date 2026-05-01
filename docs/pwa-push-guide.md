# PWA Push Guide

## End-to-End 플로우

```text
[Client PWA] --(1) subscribe--> [Push Service Worker]
      |                               |
      |--(2) subscription payload---->| 
      v                               v
[Backend API] --(3) store subscription--> [Subscription Store]
      |
      |--(4) send notification request--> [Push Provider]
      |
      v
[Push Provider] --(5) deliver--> [User Device]
      |
      v
[Service Worker] --(6) receive/show notification--> [User Interaction]
```

## 단계별 설명
1. **구독(Subscribe)**: PWA가 브라우저 Push API를 통해 구독 객체를 발급받습니다.
2. **전송**: 클라이언트는 구독 객체(endpoint, keys)를 백엔드에 전달합니다.
3. **저장(Store)**: 백엔드는 사용자/디바이스 식별자와 함께 구독 정보를 저장합니다.
4. **발송 요청(Send)**: 이벤트 발생 시 백엔드가 Push Provider로 메시지를 전송합니다.
5. **전달(Deliver)**: Provider가 브라우저 벤더 채널을 통해 디바이스에 전달합니다.
6. **수신(Receive)**: Service Worker가 푸시 이벤트를 수신해 알림을 표시합니다.

## 운영 팁
- 만료/무효 구독(410/404)을 감지하면 즉시 정리합니다.
- 메시지 payload는 최소화하고 민감정보를 포함하지 않습니다.
- 알림 클릭 시 앱 내 안전한 라우트로만 이동시킵니다.
