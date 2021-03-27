import { DbLoadSurveyById } from "@/data/usecases/survey/load-survey-by-id/db-load-load-survey-by-id";
import { DbLoadSurveys } from "@/data/usecases/survey/load-surveys/db-load-surveys";
import { LoadSurveyById } from "@/domain/usecases/survey/load-survey-by-id";
import { LoadSurveys } from "@/domain/usecases/survey/load-surveys";
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository";

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyById(surveyMongoRepository);
};
