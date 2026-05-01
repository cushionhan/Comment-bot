import type { PlatformAccount } from "./types.js";

export interface PlatformSessionStore {
  getAccount(accountId: string): Promise<PlatformAccount | undefined>;
  saveEncryptedSession(accountId: string, encryptedSession: string): Promise<void>;
  saveEncryptedCredential(accountId: string, encryptedCredential: string): Promise<void>;
}
