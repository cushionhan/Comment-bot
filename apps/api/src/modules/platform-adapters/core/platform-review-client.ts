import type {
  CollectReviewsResult,
  PlatformCode,
  PlatformReview,
  RegisterReplyResult,
  SessionStatus,
} from "./types.js";

export interface PlatformReviewClient {
  collectReviews(accountId: string, cursor?: string): Promise<CollectReviewsResult>;
  registerReply(accountId: string, review: PlatformReview, replyText: string): Promise<RegisterReplyResult>;
  checkSession(accountId: string): Promise<SessionStatus>;
  refreshSessionIfPossible(accountId: string): Promise<SessionStatus>;
  getPlatformCode(): PlatformCode;
}
