import {
  AddSurveyModel,
  AddSurveyRepository
} from "../../../../data/protocols/db/survey/add-survey-protocols";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(data);
  }
}
