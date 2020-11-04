import { MissingParamError } from "../errors/missing-params-error";
import { badRequest } from "../helpers/http-helpers";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email"];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
