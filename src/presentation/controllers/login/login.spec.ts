import { Authentication, EmailValidator } from "./login-protocols";
import { InvalidParamError, MissingParamError } from "../../errors";
import {
  badRequest,
  serverError,
  anauthorized
} from "../../helpers/http-helpers";
import { LoginController } from "./login";

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise((resolve) => resolve("any_token"));
    }
  }
  return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

  test("Should return 500 if an invalid email throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest
      .spyOn(emailValidatorStub, "isValid")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const httpRequest = {
      body: {
        email: "any_email@mail.com.br",
        password: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    const httpRequest = {
      body: {
        email: "any_email@mail.com.br",
        password: "any_password"
      }
    };
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith(
      "any_email@mail.com.br",
      "any_password"
    );
  });

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest
      .spyOn(authenticationStub, "auth")
      .mockResolvedValueOnce(null);
    const httpRequest = {
      body: {
        email: "any_email@mail.com.br",
        password: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(anauthorized());
  });

  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    const isValidSpy = jest
      .spyOn(authenticationStub, "auth")
      .mockRejectedValueOnce(() => {
        throw new Error();
      });
    const httpRequest = {
      body: {
        email: "any_email@mail.com.br",
        password: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
