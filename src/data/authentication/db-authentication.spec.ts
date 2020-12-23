import { AccountModel } from "../../domain/models/account";
import { LoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

describe("DbAuthentication UseCase", () => {
  test("Shoud call LoadAccountByEmailRepository with correct email", async () => {
    class LoadAccountByEmailRespositoryStub
    implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: "any_id",
          email: "any_email@mail.com.br",
          name: "any_name",
          password: "any_password"
        };
        return await Promise.resolve(account);
      }
    }

    const loadAccountByEmailRespositoryStub = new LoadAccountByEmailRespositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRespositoryStub);
    const loadSpy = jest.spyOn(loadAccountByEmailRespositoryStub, "load");
    await sut.auth({
      email: "any_email@mail.com",
      password: "any_password"
    });
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
