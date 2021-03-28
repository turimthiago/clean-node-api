import { Hasher } from "@/data/protocols/criptography/hasher";
import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { Encrypter } from "@/data/protocols/criptography/encrypter";
import { HashComparer } from "@/data//protocols/criptography/hash-comparer";

export const mockHasher = (): Hasher => {
  class HaserStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new HaserStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<Boolean> {
      return await Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return await Promise.resolve("any_token");
    }
  }
  return new EncrypterStub();
};

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve("any_token");
    }
  }
  const decrypterStub = new DecrypterStub();
  return decrypterStub;
};
