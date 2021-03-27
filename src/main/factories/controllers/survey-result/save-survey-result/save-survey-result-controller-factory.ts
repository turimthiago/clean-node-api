import { makeDbSaveSurveyResultFactory } from "@/main/factories/usecases/survey-result/save-survey-result/db-save-survey-result-factory";
import { makeDbLoadSurveyById } from "@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory";
import { SaveSurveyResultController } from "@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller";
import { Controller } from "@/presentation/protocols";
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator-factory";

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResultFactory()
  );
  return makeLogControllerDecorator(controller);
};
