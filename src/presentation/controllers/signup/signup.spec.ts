import {
  MissingParamError,
  InvalidParamError,
  ServerError
} from "../../errors";
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel,
  Validation
} from "./signup-protocols";
import { SignUpController } from "./signup";
import { ok, serverError, badRequest } from "../../helpers/http-helpers";
import { rejects } from "assert";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password"
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
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const emailValidatorStub = makeEmailValidator();
  const validationStub = makeValidation();
  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub
  );
  return { sut, emailValidatorStub, addAccountStub, validationStub };
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "turimthiago@gmail.com",
        password: "123mudar",
        passwordConfirmation: "123mudar"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("name")));
  });

  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "Thiago Turim",
        password: "123mudar",
        passwordConfirmation: "123mudar"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "Thiago Turim",
        email: "turimthiago@mail.com",
        passwordConfirmation: "123mudar"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  test("Should return 400 if no confirmation password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "Thiago Turim",
        email: "turimthiago@mail.com",
        password: "123mudar"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("passwordConfirmation"))
    );
  });

  test("Should return 400 if invalid email provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "Thiago Turim",
        email: "invalid@mail.com",
        password: "123mudar",
        passwordConfirmation: "123mudar"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("Should return 400 if password confirmation failed", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "invalid_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError("passwordConfirmation"))
    );
  });

  test("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementation(() => {
      throw new Error();
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
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
