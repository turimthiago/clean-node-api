import validator from "validator";
import { InvalidParamError, MissingParamError } from "../../errors";
import { CompareFieldValidation } from "./compare-fields-validation";
import { Validation } from "./validation";
import { ValidationComposite } from "./validation-composite";

const makeSut = (): CompareFieldValidation => {
  return new CompareFieldValidation("field", "fieldToCompare");
};

describe("CompareField Validation", () => {
  test("Should return an error with any validation fails", () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return new MissingParamError("field");
      }
    }
    const validationStub = new ValidationStub();
    const sut = new ValidationComposite([validationStub]);
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
