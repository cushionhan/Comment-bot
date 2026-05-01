export type PlatformCode = "MOCK";

export type PlatformReview = {
  externalId: string;
  rating: number;
  authorName: string;
  content: string;
  createdAt: string;
};

export type CollectReviewsResult = {
  reviews: PlatformReview[];
  nextCursor?: string;
};

export type SessionStatus = "VALID" | "REAUTH_REQUIRED";

export type RegisterReplyResult = {
  ok: boolean;
  errorCode?: "SESSION_EXPIRED" | "NOT_FOUND" | "UNKNOWN";
};

export type PlatformAccount = {
  id: string;
  platformCode: PlatformCode;
  isActive: boolean;
  encryptedCredential: string;
  encryptedSession: string;
  pushEndpoint?: string;
};

export type ReplyRule = {
  id: string;
  name: string;
  condition: string;
  template: string;
  enabled: boolean;
};

export type JobRun = {
  id: string;
  startedAt: string;
  endedAt?: string;
  status: "RUNNING" | "SUCCESS" | "FAILED";
};

export type JobRunItem = {
  id: string;
  jobRunId: string;
  platformAccountId: string;
  reviewExternalId?: string;
  status: "SUCCESS" | "FAILED" | "SKIPPED";
  reason?: string;
};
