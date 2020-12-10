import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helpers";
import { LoginController } from "./login";

interface SutTypes {
  sut: LoginController;
}

const makeSut = (): SutTypes => {
  const sut = new LoginController();
  return {
    sut
  };
};

describe("Login Controller", () => {
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password"
      }
    };
    const httResponse = await sut.handle(httpRequest);
    expect(httResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com.br"
      }
    };
    const httResponse = await sut.handle(httpRequest);
    expect(httResponse).toEqual(badRequest(new MissingParamError("password")));
  });
});
