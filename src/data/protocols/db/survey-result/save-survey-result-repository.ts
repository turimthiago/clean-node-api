import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultParam } from "@/domain/usecases/survey-result/save-survey-result";

export interface SaveSurveyResultRepository {
  save(data: SaveSurveyResultParam): Promise<SurveyResultModel>;
}
