import { LoadSurveys } from "../../../../domain/usecases/survey/load-surveys";
import { noContent, ok, serverError } from "../../../helpers/http/http-helpers";
import {
  Controller,
  HttpRequest,
  HttpResponse
} from "../add-suvey/add-survey-protocols";

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      return surveys.length ? ok(surveys) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
