import { InvalidParamError, ServerError } from "@/presentation/errors";
import { EmailValidation } from "./email-validation";
import { EmailValidator } from "@/presentation/protocols";
import { mockEmailValidator } from "@/validation/test";

interface SutTypes {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator();
  const sut = new EmailValidation("email", emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe("EmailValidation", () => {
  test("Should an error if EmailValidator retuns false", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const error = sut.validate({ email: "any_email@mail.com" });
    expect(error).toEqual(new InvalidParamError("email"));
  });

  test("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    sut.validate({ email: "any_email@mail.com" });
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("Should throw EmailValidator throws", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementation(() => {
      throw new Error();
    });
    expect(sut.validate).toThrow();
  });
});
