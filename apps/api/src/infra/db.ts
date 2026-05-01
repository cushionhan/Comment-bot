import type { JobRun, JobRunItem, PlatformAccount, ReplyRule } from "../modules/platform-adapters/core/types.js";

export const db = {
  platformAccounts: [] as PlatformAccount[],
  reviews: new Set<string>(),
  replyRules: [] as ReplyRule[],
  jobRuns: [] as JobRun[],
  jobRunItems: [] as JobRunItem[],
};
