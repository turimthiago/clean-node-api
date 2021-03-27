import { DbSaveSurveyResult } from "@/data/usecases/survey-result/db-save-survey-result/db-save-survey-result";
import { SaveSurveyResult } from "@/domain/usecases/survey-result/save-survey-result";
import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey-result/survey-result-mongo-respository";

export const makeDbSaveSurveyResultFactory = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(surveyResultMongoRepository);
};
