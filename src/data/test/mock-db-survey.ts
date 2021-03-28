import { SurveyModel } from "@/domain/models/survey";
import { mockSurveyModel, mockSurveys } from "@/domain/test";
import { AddSurveyParams } from "@/domain/usecases/survey/add-survey";
import { AddSurveyRepository } from "../protocols/db/survey/add-survey-repository";
import { LoadSurveyByIdRepository } from "../protocols/db/survey/load-survey-by-id-repository";
import { LoadSurveysRepository } from "../protocols/db/survey/load-surveys-repository";

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyParams): Promise<void> {
      return await Promise.resolve();
    }
  }
  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurveyModel());
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveys());
    }
  }
  return new LoadSurveysRepositoryStub();
};
