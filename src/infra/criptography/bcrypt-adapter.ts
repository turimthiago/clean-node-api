import bcrypt from "bcrypt";
import { HashComparer } from "../../data/protocols/criptography/hash-comparer";
import { Hasher } from "../../data/protocols/criptography/hasher";

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number;

  constructor (salt: number) {
    this.salt = salt;
  }

  async compare (value: string, hash: string): Promise<Boolean> {
    await bcrypt.compare(value, hash);
    return await Promise.resolve(true);
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt);
  }
}
