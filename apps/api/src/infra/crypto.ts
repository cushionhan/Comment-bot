export interface CryptoService {
  encrypt(plain: string): string;
  decrypt(cipher: string): string;
}

export class Base64CryptoService implements CryptoService {
  encrypt(plain: string): string {
    return Buffer.from(plain, "utf8").toString("base64");
  }
  decrypt(cipher: string): string {
    return Buffer.from(cipher, "base64").toString("utf8");
  }
}
