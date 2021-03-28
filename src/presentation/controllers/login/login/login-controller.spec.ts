import { Authentication } from "./login-controller-protocols";
import { MissingParamError } from "../../../errors";
import {
  badRequest,
  serverError,
  anauthorized,
  ok
} from "@/presentation/helpers/http/http-helpers";
import { LoginController } from "./login-controller";
import { HttpRequest, HttpResponse } from "../../../protocols";
import { Validation } from "../signup/signup-coneroller-protocols";
import { throwError } from "@/domain/test";
import { mockAuthentication } from "@/presentation/test";
import { mockValidation } from "@/validation/test";

interface SutTypes {
  sut: LoginController;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const mockRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com.br",
    password: "any_password"
  }
});

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const authenticationStub = mockAuthentication();
  const sut = new LoginController(authenticationStub, validationStub);
  return {
    sut,
    authenticationStub,
    validationStub
  };
};

describe("Login Controller", () => {
  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    await sut.handle(mockRequest());
    expect(authSpy).toHaveBeenCalledWith({
      email: "any_email@mail.com.br",
      password: "any_password"
    });
  });

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest
      .spyOn(authenticationStub, "auth")
      .mockResolvedValueOnce(null);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(anauthorized());
  });

  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    const isValidSpy = jest
      .spyOn(authenticationStub, "auth")
      .mockRejectedValueOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({ accessToken: "any_token" }));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should retun 400 if Validation retuns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });
});
