import { LoginController } from "../../../../../presentation/controllers/login/login/login-controller";
import { AddSurveyController } from "../../../../../presentation/controllers/survey/add-suvey/add-survey-controller";
import { Controller } from "../../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator-factory";
import { makeDbAddSurvey } from "../../../usecases/survey/add-survey/db-add-survey-factory";
import { makeAddSurveyValidation } from "./add-survey-validation-factory";

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey());
  return makeLogControllerDecorator(controller);
};
