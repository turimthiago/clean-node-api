import { EmailValidatorAdapter } from "./email-validator";
import validator from "validator";

describe("EmailValidator Adapter", () => {
  test("Should return false if validator retuns false", () => {
    jest.mock("validator", () => ({
      isEmail (): Boolean {
        return true;
      }
    }));
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });

  test("Should return true if validator retuns true", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("valid_email@mail.com");
    expect(isValid).toBe(true);
  });
});
