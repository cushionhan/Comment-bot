import Fastify from "fastify";
import { registerRoutes } from "./routes/index.js";
import { db } from "./infra/db.js";
import { Base64CryptoService } from "./infra/crypto.js";

const cryptoService = new Base64CryptoService();

db.platformAccounts.push({
  id: "mock-account",
  platformCode: "MOCK",
  isActive: true,
  encryptedCredential: cryptoService.encrypt("account-secret"),
  encryptedSession: cryptoService.encrypt("session-token"),
});
db.platformAccounts.push({
  id: "expired-account",
  platformCode: "MOCK",
  isActive: true,
  encryptedCredential: cryptoService.encrypt("account-secret-2"),
  encryptedSession: cryptoService.encrypt("expired-session"),
});

const app = Fastify({ logger: true });
await registerRoutes(app);

const port = Number(process.env.PORT ?? 3000);
await app.listen({ port, host: "0.0.0.0" });
