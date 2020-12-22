import validator from "validator";
import { InvalidParamError, MissingParamError } from "../../errors";
import { CompareFieldValidation } from "./compare-fields-validation";
import { Validation } from "./validation";
import { ValidationComposite } from "./validation-composite";

interface SutTypes {
  sut: ValidationComposite;
  validationStub: Validation;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);
  return { sut, validationStub };
};

describe("CompareField Validation", () => {
  test("Should return an error with any validation fails", () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
