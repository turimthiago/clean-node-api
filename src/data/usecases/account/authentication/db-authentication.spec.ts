import {
  mockEncrypter,
  mockHashComparer,
  mockLoadAccountByEmailRespository,
  mockUpdateAccessTokenRepository
} from "@/data/test";
import { mockAuthentication, throwError } from "@/domain/test";
import { DbAuthentication } from "./db-authentication";
import {
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
  const loadAccountByEmailRespositoryStub = mockLoadAccountByEmailRespository();
  const hashComparerStub = mockHashComparer();
  const encrypterStub = mockEncrypter();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
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

describe("DbAuthentication UseCase", () => {
  test("Shoud call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    const loadSpy = jest.spyOn(
      loadAccountByEmailRespositoryStub,
      "loadByEmail"
    );
    await sut.auth(mockAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("Shoud throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRespositoryStub, "loadByEmail")
      .mockRejectedValueOnce(throwError);
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });

  test("Shoud return null if LoadAccountByEmailRepository with returns null", async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRespositoryStub, "loadByEmail")
      .mockResolvedValueOnce(null);
    const acessToken = await sut.auth(mockAuthentication());
    expect(acessToken).toBeNull();
  });

  test("Shoud call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(mockAuthentication());
    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  test("Shoud throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockRejectedValueOnce(throwError);
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });

  test("Shoud call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(mockAuthentication());
    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  test("Shoud return null if HashComparer with returns false", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockResolvedValueOnce(false);
    const acessToken = await sut.auth(mockAuthentication());
    expect(acessToken).toBeNull();
  });

  test("Shoud call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = makeSut();
    const generateSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.auth(mockAuthentication());
    expect(generateSpy).toHaveBeenCalledWith("any_id");
  });

  test("Shoud throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });

  test("Shoud return a token on success", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(mockAuthentication());
    expect(accessToken).toBe("any_token");
  });

  test("Shoud call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );
    await sut.auth(mockAuthentication());
    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
  });

  test("Shoud throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockRejectedValueOnce(throwError);
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });
});
