import { SurveyResultModel } from "@/domain/models/survey-result";
import { mockSurveyResultModel } from "@/domain/test/mock-survey-result";
import { SaveSurveyResultParam } from "@/domain/usecases/survey-result/save-survey-result";
import { SaveSurveyResultRepository } from "../protocols/db/survey-result/save-survey-result-repository";

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParam): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel());
    }
  }
  return new SaveSurveyResultRepositoryStub();
};
