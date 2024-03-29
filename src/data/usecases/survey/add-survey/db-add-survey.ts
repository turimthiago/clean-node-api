import { AddSurvey, AddSurveyParams } from "@/domain/usecases/survey/add-survey";
import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-protocols";

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
