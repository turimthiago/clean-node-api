import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helpers";
import { LoginController } from "./login";

describe("Login Controller", () => {
  test("Should return 400 if no email is provided", async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        password: "any_password"
      }
    };
    const httResponse = await sut.handle(httpRequest);
    expect(httResponse).toEqual(badRequest(new MissingParamError("email")));
  });
});
