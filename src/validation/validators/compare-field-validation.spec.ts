import { InvalidParamError } from "@/presentation/errors";
import { CompareFieldValidation } from "./compare-fields-validation";

const makeSut = (): CompareFieldValidation => {
  return new CompareFieldValidation("field", "fieldToCompare");
};

describe("CompareField Validation", () => {
  test("Should return a InvalidParamError if validation fails", () => {
    const sut = makeSut();
    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "wrong_value"
    });
    expect(error).toEqual(new InvalidParamError("fieldToCompare"));
  });

  test("Should not return if validation success", () => {
    const sut = makeSut();
    expect(
      sut.validate({
        field: "any_value",
        fieldToCompare: "any_value"
      })
    ).toBeFalsy();
  });
});
