import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helpers";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from "../../protocols";

export class LoginController implements Controller {
  private readonly emailValidator;
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body;
    if (!email) {
      return await new Promise((resolve) =>
        resolve(badRequest(new MissingParamError("email")))
      );
    }
    if (!password) {
      return await new Promise((resolve) =>
        resolve(badRequest(new MissingParamError("password")))
      );
    }
    const isValid = this.emailValidator.isValid(email);
    if (!isValid) {
      return new Promise((resolve) =>
        resolve(badRequest(new InvalidParamError("email")))
      );
    }
  }
}
