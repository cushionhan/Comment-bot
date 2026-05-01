import type { MockRawReview } from "./mock-platform.contract.js";
import type { PlatformReview } from "../core/types.js";

export const mapMockReview = (raw: MockRawReview): PlatformReview => ({
  externalId: raw.id,
  rating: raw.score,
  authorName: raw.writer,
  content: raw.text,
  createdAt: raw.created_at,
});
