import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import {
  SaveSurveyResult,
  SaveSurveyResultParam
} from "@/domain/usecases/survey-result/save-survey-result";

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParam): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(data);
    return surveyResult;
  }
}
