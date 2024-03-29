import { throwError } from "@/domain/test";
import { AccessDeniedError } from "../errors";
import { forbidden, ok, serverError } from "../helpers/http/http-helpers";
import { mockLoadAccountByToken } from "../test";
import { AuthMiddleware } from "./auth-middleware";
import { LoadAccountByToken, HttpRequest } from "./auth-middleware-protocols";

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return { sut, loadAccountByTokenStub };
};

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
    expect(loadSpy).toHaveBeenCalledWith("any_token", undefined);
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

  test("Should return 500 if LoadAccountByToken throws", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockRejectedValueOnce(throwError);
    const httResponse = await sut.handle(makeFakeRequest());
    expect(httResponse).toEqual(serverError(new Error()));
  });

  test("Should call LoadAccountByToken and role with correct accessToken", async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    const httResponse = await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith("any_token", role);
  });
});
