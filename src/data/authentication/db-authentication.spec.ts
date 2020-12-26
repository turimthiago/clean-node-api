import { AccountModel } from "../../domain/models/account";
import { AuthenticationModel } from "../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../protocols/db/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";
interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRespositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRespositoryStub = makeLoadAccountByEmailRespository();
  const sut = new DbAuthentication(loadAccountByEmailRespositoryStub);
  return {
    sut,
    loadAccountByEmailRespositoryStub
  };
};

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  email: "any_email@mail.com.br",
  name: "any_name",
  password: "any_password"
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@mail.com",
  password: "any_password"
});

const makeLoadAccountByEmailRespository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRespositoryStub
  implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByEmailRespositoryStub();
};

describe("DbAuthentication UseCase", () => {
  test("Shoud call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRespositoryStub, "load");
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("Shoud throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRespositoryStub, "load")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  test("Shoud return null if LoadAccountByEmailRepository with returns null", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRespositoryStub, "load")
      .mockResolvedValueOnce(null);
    const acessToken = await sut.auth(makeFakeAuthentication());
    expect(acessToken).toBeNull();
  });
});
