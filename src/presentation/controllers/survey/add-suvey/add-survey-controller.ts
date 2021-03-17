import { AddSurvey } from "../../../../domain/usecases/add-survey";
import {
  badRequest,
  noContent,
  serverError
} from "../../../helpers/http/http-helpers";
import { Validation } from "../../../protocols";
import { Controller, HttpRequest, HttpResponse } from "./add-survey-protocols";

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { question, answers } = httpRequest.body;
      await this.addSurvey.add({ question, answers, date: new Date() });
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
