import { db } from "../../infra/db.js";
import { logger } from "../../infra/logger.js";
import type { PlatformReviewClient } from "../platform-adapters/core/platform-review-client.js";
import type { JobRun, JobRunItem, PlatformReview } from "../platform-adapters/core/types.js";

const buildReply = (review: PlatformReview): string => {
  const rule = db.replyRules.find((r) => r.enabled);
  if (!rule) return "Thanks for your review.";
  return rule.template.replace("{{content}}", review.content);
};

export class DailyJobService {
  constructor(private readonly adapter: PlatformReviewClient) {}

  async run(): Promise<JobRun> {
    const run: JobRun = { id: crypto.randomUUID(), startedAt: new Date().toISOString(), status: "RUNNING" };
    db.jobRuns.push(run);

    const accounts = db.platformAccounts.filter((a) => a.isActive && a.platformCode === this.adapter.getPlatformCode());

    for (const account of accounts) {
      const session = await this.adapter.checkSession(account.id);
      if (session === "REAUTH_REQUIRED") {
        db.jobRunItems.push({ id: crypto.randomUUID(), jobRunId: run.id, platformAccountId: account.id, status: "FAILED", reason: "REAUTH_REQUIRED" });
        continue;
      }

      const { reviews } = await this.adapter.collectReviews(account.id);
      for (const review of reviews) {
        try {
          if (db.reviews.has(review.externalId)) continue;
          db.reviews.add(review.externalId);
          const replyText = buildReply(review);
          const result = await this.adapter.registerReply(account.id, review, replyText);
          const item: JobRunItem = {
            id: crypto.randomUUID(),
            jobRunId: run.id,
            platformAccountId: account.id,
            reviewExternalId: review.externalId,
            status: result.ok ? "SUCCESS" : "FAILED",
            reason: result.ok ? undefined : result.errorCode,
          };
          db.jobRunItems.push(item);
        } catch (error) {
          db.jobRunItems.push({
            id: crypto.randomUUID(),
            jobRunId: run.id,
            platformAccountId: account.id,
            reviewExternalId: review.externalId,
            status: "FAILED",
            reason: error instanceof Error ? error.message : "UNKNOWN",
          });
        }
      }
      logger.info("push sent", { accountId: account.id, endpoint: account.pushEndpoint ?? null });
    }

    run.status = db.jobRunItems.some((i) => i.jobRunId === run.id && i.status === "FAILED") ? "FAILED" : "SUCCESS";
    run.endedAt = new Date().toISOString();
    return run;
  }
}
