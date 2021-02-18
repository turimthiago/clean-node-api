import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http/http-helpers";
import { AuthMiddleware } from "./auth-middleware";

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const sut = new AuthMiddleware();
    const httResponse = await sut.handle({});
    expect(httResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
