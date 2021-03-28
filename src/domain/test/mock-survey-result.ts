import { SurveyResultModel } from "@/domain/models/survey-result";
import {
  SaveSurveyResult,
  SaveSurveyResultParam
} from "@/domain/usecases/survey-result/save-survey-result";

export const mockSurveyResultModel = (): SurveyResultModel =>
  Object.assign({}, mockSaveSurveyResultParams(), { id: "any_data" });

export const mockSaveSurveyResultParams = (): SaveSurveyResultParam => ({
  accountId: "any_account_id",
  surveyId: "any_survey_id",
  answer: "any_answer",
  date: new Date()
});

export const mockSaveSurveyResut = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParam): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel());
    }
  }
  return new SaveSurveyResultStub();
};
