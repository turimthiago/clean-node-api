import { SignUpController } from "../../../../../presentation/controllers/login/signup/signup-controller";
import { Controller } from "../../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator-factory";
import { makeDbAddAccount } from "../../../usecases/account/add-account/db-add-account-factory";
import { makeDbAutentication } from "../../../usecases/account/authentication/db-authentication-factory";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAutentication()
  );
  return makeLogControllerDecorator(signUpController);
};