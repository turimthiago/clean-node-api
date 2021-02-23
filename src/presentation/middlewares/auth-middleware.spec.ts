import { AccountModel } from "../../domain/models/account";
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http/http-helpers";
import { AuthMiddleware } from "./auth-middleware";

class LoadAccountByTokenStub implements LoadAccountByToken {
  async load (accessToken: string, role?: string): Promise<AccountModel> {
    return await Promise.resolve(makeFakeAccount());
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  email: "any_email@mail.com.br",
  name: "any_name",
  password: "hased_password"
});

describe("Auth Middleware", () => {
  test("Should return 403 if no x-access-token exists in headers", async () => {
    const loadAccountByTokenStub = new LoadAccountByTokenStub();
    const sut = new AuthMiddleware(loadAccountByTokenStub);
    const httResponse = await sut.handle({});
    expect(httResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should call LoadAccountByToken with correct accessToken", async () => {
    const loadAccountByTokenStub = new LoadAccountByTokenStub();
    const sut = new AuthMiddleware(loadAccountByTokenStub);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    const httResponse = await sut.handle({
      headers: {
        "x-access-token": "any_token"
      }
    });
    expect(loadSpy).toHaveBeenCalledWith("any_token");
  });
});
