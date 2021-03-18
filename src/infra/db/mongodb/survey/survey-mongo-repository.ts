import {
  AddSurveyModel,
  AddSurveyRepository
} from "../../../../data/protocols/db/survey/add-survey-protocols";
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import { SurveyModel } from "../../../../domain/models/survey";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository
implements AddSurveyRepository, LoadSurveysRepository {
  async add (data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(data);
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const surveys = surveyCollection.find().toArray();
    return await surveys;
  }
}
