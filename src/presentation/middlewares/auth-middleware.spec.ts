import { AccountModel } from "../../domain/models/account";
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccessDeniedError } from "../errors";
import { forbidden, ok } from "../helpers/http/http-helpers";
import { HttpRequest } from "../protocols";
import { AuthMiddleware } from "./auth-middleware";

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByTokenStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return { sut, loadAccountByTokenStub };
};

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  email: "any_email@mail.com.br",
  name: "any_name",
  password: "hased_password"
});

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    "x-access-token": "any_token"
  }
});

describe("Auth Middleware", () => {
  test("Should return 403 if no x-access-token exists in headers", async () => {
    const { sut } = makeSut();
    const httResponse = await sut.handle({});
    expect(httResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should call LoadAccountByToken with correct accessToken", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    const httResponse = await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith("any_token");
  });

  test("Should return 403 if LoadAccountByToken retuns null", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, "load").mockReturnValueOnce(null);
    const httResponse = await sut.handle({});
    expect(httResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should return 200 if LoadAccountByToken retuns an account", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const httResponse = await sut.handle(makeFakeRequest());
    expect(httResponse).toEqual(ok({ accountId: "any_id" }));
  });
});