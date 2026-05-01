import type { FastifyInstance } from "fastify";
import { db } from "../infra/db.js";
import { DailyJobService } from "../modules/jobs/daily-job.service.js";
import { MockPlatformClient } from "../modules/platform-adapters/mock-platform/mock-platform.client.js";

const adapter = new MockPlatformClient(new Set(["expired-account"]));
const dailyJobService = new DailyJobService(adapter);

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", async () => ({ service: "comment-bot-api", ok: true }));

  app.get("/health", async () => ({ ok: true }));

  app.get("/reviews", async () => ({ items: Array.from(db.reviews) }));

  app.post<{ Params: { id: string }; Body: { text: string } }>("/reviews/:id/reply", async (request) => {
    return { ok: true, reviewId: request.params.id, text: request.body.text };
  });

  app.get("/reply-rules", async () => ({ items: db.replyRules }));

  app.post<{ Body: { name: string; condition: string; template: string } }>("/reply-rules", async (request) => {
    const rule = {
      id: crypto.randomUUID(),
      enabled: true,
      ...request.body,
    };
    db.replyRules.push(rule);
    return { item: rule };
  });

  app.get("/jobs", async () => ({ runs: db.jobRuns, items: db.jobRunItems }));

  app.post("/jobs/run-daily", async () => ({ run: await dailyJobService.run() }));

  app.post<{ Body: { accountId: string; endpoint: string } }>("/push/subscribe", async (request) => {
    const account = db.platformAccounts.find((a) => a.id === request.body.accountId);
    if (account) account.pushEndpoint = request.body.endpoint;
    return { ok: true };
  });
}
