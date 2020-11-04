import { MissingParamError } from "../errors/missing-params-error";
import { SignUpController } from "./signup";

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: "turimthiago@gmail.com",
        password: "123mudar",
        passwordConfirmation: "123mudar"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("Missing param:name"));
  });

  test("Should return 400 if no email is provided", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: "Thiago Turim",
        password: "123mudar",
        passwordConfirmation: "123mudar"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("Missing param:email"));
  });
});
