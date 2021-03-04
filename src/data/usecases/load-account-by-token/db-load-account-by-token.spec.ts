import { Decrypter } from "../../protocols/criptography/decrypter";
import { DbLoadAccountByToken } from "./db-load-account-by-token";

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve("any_value");
    }
  }
  const decrypterStub = new DecrypterStub();
  return decrypterStub;
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);
  return { sut, decrypterStub };
};

describe("DbLoadAccountByToken", () => {
  test("Should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");

    await sut.load("any_token");
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });

  test("Should return null if Decrypter returns null", async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, "decrypt").mockResolvedValueOnce(null);

    const account = await sut.load("any_token");
    expect(account).toBeNull();
  });
});
