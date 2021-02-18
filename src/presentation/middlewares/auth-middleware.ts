import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http/http-helpers";
import { HttpRequest, HttpResponse, Middleware } from "../protocols";

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(forbidden(new AccessDeniedError()));
  }
}
