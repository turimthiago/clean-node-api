import {
  Hasher,
  AddAccountParams,
  AccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRespositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const loadAccountByEmailRespositoryStub = makeLoadAccountByEmailRespository();
  const addAccountRepositoryStub = makeAddAccountRepository();
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

const makeHasher = (): Hasher => {
  class HaserStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new HaserStub();
};

const makeFakeAccountData = (): AddAccountParams => ({
  name: "valid_name",
  email: "valid_email@mail.com.br",
  password: "valid_password"
});

const makeLoadAccountByEmailRespository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRespositoryStub
  implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await Promise.resolve(null);
    }
  }
  return new LoadAccountByEmailRespositoryStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password"
});

describe("DbAddAccount Usecase", () => {
  test("Should call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, "hash");
    await sut.add(makeFakeAccountData());
    expect(hasherSpy).toHaveBeenCalledWith("valid_password");
  });

  test("Should throw if Hasher throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockRejectedValueOnce(new Error());
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  test("Should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addAccountSpy = jest.spyOn(addAccountRepositoryStub, "add");
    await sut.add(makeFakeAccountData());
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email@mail.com.br",
      password: "hashed_password"
    });
  });

  test("Should throw if Hasher throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });

  test("Shoud call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    const loadSpy = jest.spyOn(
      loadAccountByEmailRespositoryStub,
      "loadByEmail"
    );
    await sut.add(makeFakeAccountData());
    expect(loadSpy).toHaveBeenCalledWith("valid_email@mail.com.br");
  });

  test("Should return null if LoadAccountByEmailRepository not return null", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRespositoryStub, "loadByEmail")
      .mockResolvedValueOnce(makeFakeAccount());
    const account = await sut.add(makeFakeAccountData());
    expect(account).toBeNull();
  });
});
