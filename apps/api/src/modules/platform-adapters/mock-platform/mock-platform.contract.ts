import type { PlatformReview } from "../core/types.js";

export type MockRawReview = {
  id: string;
  score: number;
  writer: string;
  text: string;
  created_at: string;
};

export type MockReplyRequest = {
  reviewId: string;
  replyText: string;
};

export type MockCollectResponse = {
  items: MockRawReview[];
};

export const MOCK_REVIEWS: MockRawReview[] = [
  { id: "rv-100", score: 5, writer: "Alice", text: "Great service", created_at: new Date().toISOString() },
  { id: "rv-101", score: 2, writer: "Bob", text: "Need improvements", created_at: new Date().toISOString() }
];

export type MockMappedReview = PlatformReview;
