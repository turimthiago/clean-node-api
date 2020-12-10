import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helpers";
import { EmailValidator } from "../../protocols";
import { LoginController } from "./login";

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub
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

  test("Should call email validator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = {
      body: {
        email: "any_email@mail.com.br",
        password: "any_password"
      }
    };
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com.br");
  });

  test("Should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest
      .spyOn(emailValidatorStub, "isValid")
      .mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        email: "any_email@mail.com.br",
        password: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });
});
