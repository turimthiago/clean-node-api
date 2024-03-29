import {
  SaveSurveyResultParam,
  SaveSurveyResultRepository,
  SurveyResultModel
} from "@/data/usecases/survey-result/db-save-survey-result/db-save-survey-result-protocols";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParam): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      "surveyResults"
    );
    const res = await surveyResultCollection.findOneAndUpdate(
      { surveyId: data.surveyId, accountId: data.accountId },
      {
        $set: {
          answer: data.answer,
          date: data.date
        }
      },
      { upsert: true, returnOriginal: false }
    );
    return Object.assign({}, res.value, { id: res.value._id });
  }
}
