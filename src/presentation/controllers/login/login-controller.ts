import {
  Authentication,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from "./login-controller-protocols";
import { InvalidParamError, MissingParamError } from "../../errors";
import {
  badRequest,
  serverError,
  anauthorized,
  ok
} from "../../helpers/http/http-helpers";
import { Validation } from "../signup/signup-coneroller-protocols";

export class LoginController implements Controller {
  private readonly validation: Validation;
  private readonly authentication: Authentication;
  constructor (authentication: Authentication, validation: Validation) {
    this.validation = validation;
    this.authentication = authentication;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);
      const { email, password } = httpRequest.body;
      const accessToken = await this.authentication.auth({ email, password });
      if (!accessToken) return anauthorized();

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
