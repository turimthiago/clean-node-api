import {
  CompareFieldValidation,
  ValidationComposite,
  EmailValidation
} from "../../../../../validation/validators";
import { RequiredFieldValidation } from "../../../../../validation/validators/required-field-validation";
import { Validation } from "../../../../../presentation/protocols/validation";
import { EmailValidatorAdapter } from "../../../../../infra/validations/email-validator-adapter";

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "email", "password", "passwordConfirmation"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(
    new CompareFieldValidation("password", "passwordConfirmation")
  );
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
