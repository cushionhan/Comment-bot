import type { PlatformReviewClient } from "../core/platform-review-client.js";
import type { CollectReviewsResult, PlatformCode, PlatformReview, RegisterReplyResult, SessionStatus } from "../core/types.js";
import { mapMockReview } from "./mock-platform.mapper.js";
import { MOCK_REVIEWS } from "./mock-platform.contract.js";

export class MockPlatformClient implements PlatformReviewClient {
  constructor(private readonly expiredAccounts: Set<string> = new Set()) {}

  async collectReviews(accountId: string): Promise<CollectReviewsResult> {
    if (this.expiredAccounts.has(accountId)) return { reviews: [] };
    return { reviews: MOCK_REVIEWS.map(mapMockReview) };
  }

  async registerReply(accountId: string, review: PlatformReview): Promise<RegisterReplyResult> {
    if (this.expiredAccounts.has(accountId)) {
      return { ok: false, errorCode: "SESSION_EXPIRED" };
    }
    if (review.externalId.endsWith("404")) {
      return { ok: false, errorCode: "NOT_FOUND" };
    }
    return { ok: true };
  }

  async checkSession(accountId: string): Promise<SessionStatus> {
    return this.expiredAccounts.has(accountId) ? "REAUTH_REQUIRED" : "VALID";
  }

  async refreshSessionIfPossible(accountId: string): Promise<SessionStatus> {
    return this.expiredAccounts.has(accountId) ? "REAUTH_REQUIRED" : "VALID";
  }

  getPlatformCode(): PlatformCode {
    return "MOCK";
  }
}
