import {
  AddSurveyModel,
  AddSurveyRepository
} from "../../../../data/protocols/db/survey/add-survey-protocols";
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import { SurveyModel } from "@/domain/models/survey";
import { MongoHelper } from "../helpers/mongo-helper";
import { LoadSurveyByIdRepository } from "@/data/usecases/survey/load-survey-by-id/db-load-load-survey-by-id-protocols";

export class SurveyMongoRepository
implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const survey = await surveyCollection.findOne({ _id: id });
    return survey && MongoHelper.map(survey);
  }

  async add (data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(data);
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const surveys = await surveyCollection.find().toArray();
    return MongoHelper.mapCollection(surveys);
  }
}
