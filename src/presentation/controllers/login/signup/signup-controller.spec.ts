import {
  EmailInUseError,
  MissingParamError,
  ServerError
} from "../../../errors";
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Validation,
  Authentication,
  AuthenticationModel
} from "./signup-coneroller-protocols";
import { SignUpController } from "./signup-controller";
import {
  ok,
  serverError,
  badRequest,
  forbidden
} from "../../../helpers/http/http-helpers";
import { HttpRequest } from "../../../protocols";

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise((resolve) => resolve("any_token"));
    }
  }
  return new AuthenticationStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password"
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com.br",
    password: "any_password",
    passwordConfirmation: "any_password"
  }
});

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  );
  return { sut, addAccountStub, validationStub, authenticationStub };
};

describe("SignUp Controller", () => {
  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementation(async () => {
      return await Promise.reject(new Error());
    });

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password"
    });
  });

  test("Should retun 403 AddAccount returns null", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockResolvedValueOnce(null);
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test("Should retun 200 if valid data is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok({ accessToken: "any_token" }));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should retun 400 if Validation retuns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });

  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    await sut.handle(makeFakeRequest());
    expect(authSpy).toHaveBeenCalledWith({
      email: "any_email@mail.com.br",
      password: "any_password"
    });
  });

  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    const isValidSpy = jest
      .spyOn(authenticationStub, "auth")
      .mockRejectedValueOnce(() => {
        throw new Error();
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
