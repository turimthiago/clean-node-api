import { MissingParamError } from "../../errors";
import { RequiredFieldValidation } from "./required-field-validation";

describe("RequiredField Validation", () => {
  test("Should return a MissingParamError if validation fails", () => {
    const sut = new RequiredFieldValidation("any_field");
    const error = sut.validate({ name: "any_name" });
    expect(error).toEqual(new MissingParamError("any_field"));
  });

  test("Should not return if valitaion success", () => {
    const sut = new RequiredFieldValidation("any_field");
    expect(sut.validate({ any_field: "any_field_value" })).toBeFalsy();
  });
});
