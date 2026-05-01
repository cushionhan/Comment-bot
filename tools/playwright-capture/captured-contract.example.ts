/**
 * 플랫폼 중립 Contract 샘플
 * - 실제 플랫폼명 금지
 * - 실제 endpoint 금지
 */

export type Review = {
  reviewId: string;
  authorDisplayName: string;
  rating: number;
  content: string;
  createdAtIso: string;
};

export type FetchReviewsRequest = {
  storeId: string;
  cursor?: string;
  limit?: number;
};

export type FetchReviewsResponse = {
  items: Review[];
  nextCursor?: string;
};

export type CreateReplyRequest = {
  reviewId: string;
  replyMessage: string;
};

export type CreateReplyResponse = {
  success: boolean;
  replyId: string;
  createdAtIso: string;
};

export const PlatformNeutralContractExample = {
  fetchReviews: {
    method: 'GET',
    endpoint: '/v1/example/reviews',
    request: {} as FetchReviewsRequest,
    response: {} as FetchReviewsResponse,
  },
  createReply: {
    method: 'POST',
    endpoint: '/v1/example/replies',
    request: {} as CreateReplyRequest,
    response: {} as CreateReplyResponse,
  },
} as const;
