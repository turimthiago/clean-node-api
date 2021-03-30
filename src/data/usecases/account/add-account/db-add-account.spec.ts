import {
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from "./db-add-account-protocols";
import {
  mockAccountModel,
  mockAddAccountParams,
  throwError
} from "@/domain/test";
import { DbAddAccount } from "./db-add-account";
import {
  mockAddAccountRepository,
  mockHasher,
  mockLoadAccountByEmailRespository
} from "@/data/test";

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRespositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher();
  const loadAccountByEmailRespositoryStub = mockLoadAccountByEmailRespository();
  jest
    .spyOn(loadAccountByEmailRespositoryStub, "loadByEmail")
    .mockResolvedValue(null);
  const addAccountRepositoryStub = mockAddAccountRepository();
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRespositoryStub
  );
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRespositoryStub
  };
};

describe("DbAddAccount Usecase", () => {
  test("Should call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, "hash");
    await sut.add(mockAddAccountParams());
    expect(hasherSpy).toHaveBeenCalledWith("any_password");
  });

  test("Should throw if Hasher throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockRejectedValueOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test("Should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addAccountSpy = jest.spyOn(addAccountRepositoryStub, "add");
    await sut.add(mockAddAccountParams());
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "hashed_password"
    });
  });

  test("Should throw if Hasher throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockRejectedValueOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(mockAccountModel());
  });

  test("Shoud call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    const loadSpy = jest.spyOn(
      loadAccountByEmailRespositoryStub,
      "loadByEmail"
    );
    await sut.add(mockAddAccountParams());
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("Should return null if LoadAccountByEmailRepository not return null", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRespositoryStub, "loadByEmail")
      .mockResolvedValueOnce(mockAccountModel());
    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });
});
