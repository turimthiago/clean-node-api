import { Validation } from "../../../protocols";
import { Controller, HttpRequest, HttpResponse } from "./add-survey-protocols";

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);
    return await Promise.resolve(null);
  }
}
