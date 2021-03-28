import { DbAuthentication } from "./db-authentication";
import {
  AccountModel,
  AuthenticationParams,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
  LoadAccountByEmailRepository
} from "./db-authentication-protocols";

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRespositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRespositoryStub = makeLoadAccountByEmailRespository();
  const hashComparerStub = makeHasheComparer();
  const encrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRespositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRespositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  };
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await Promise.resolve();
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

const makeHasheComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<Boolean> {
      return await Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return await Promise.resolve("any_token");
    }
  }
  return new EncrypterStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  email: "any_email@mail.com.br",
  name: "any_name",
  password: "hased_password"
});

const makeFakeAuthentication = (): AuthenticationParams => ({
  email: "any_email@mail.com",
  password: "any_password"
});

const makeLoadAccountByEmailRespository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRespositoryStub
  implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByEmailRespositoryStub();
};

describe("DbAuthentication UseCase", () => {
  test("Shoud call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    const loadSpy = jest.spyOn(
      loadAccountByEmailRespositoryStub,
      "loadByEmail"
    );
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("Shoud throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRespositoryStub, "loadByEmail")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  test("Shoud return null if LoadAccountByEmailRepository with returns null", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRespositoryStub, "loadByEmail")
      .mockResolvedValueOnce(null);
    const acessToken = await sut.auth(makeFakeAuthentication());
    expect(acessToken).toBeNull();
  });

  test("Shoud call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith("any_password", "hased_password");
  });

  test("Shoud throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  test("Shoud call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith("any_password", "hased_password");
  });

  test("Shoud return null if HashComparer with returns false", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockResolvedValueOnce(false);
    const acessToken = await sut.auth(makeFakeAuthentication());
    expect(acessToken).toBeNull();
  });

  test("Shoud call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = makeSut();
    const generateSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith("any_id");
  });

  test("Shoud throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  test("Shoud return a token on success", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBe("any_token");
  });

  test("Shoud call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );
    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
  });

  test("Shoud throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });
});
