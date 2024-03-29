import {
  badRequest,
  noContent,
  serverError
} from "../../../helpers/http/http-helpers";
import { HttpRequest, Validation } from "../../../protocols";
import { AddSurveyController } from "./add-survey-controller";
import { AddSurvey, AddSurveyParams } from "./add-survey-protocols";
import MockDate from "mockdate";
import { throwError } from "@/domain/test";
import { mockValidation } from "@/validation/test";
import { mockAddSurvey } from "@/presentation/test";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [{ image: "any_image", answer: "any_answer" }],
    date: new Date()
  }
});

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const addSurveyStub = mockAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return { validationStub, sut, addSurveyStub };
};

describe("AddSurvey Controller", async () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test("Shoud call validation with correct values", async () => {
    const { validationStub, sut } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Shoud return 400 if validation fails", async () => {
    const { validationStub, sut } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test("Shoud call AddSurvey with correct values", async () => {
    const { addSurveyStub, sut } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, "add");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Shoud return 500 if AddSurvey throws", async () => {
    const { addSurveyStub, sut } = makeSut();
    jest.spyOn(addSurveyStub, "add").mockRejectedValueOnce(throwError);
    const httpRequest = makeFakeRequest();
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(serverError(new Error()));
  });

  test("Shoud return 204 if AddSurvey throws", async () => {
    const { addSurveyStub, sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(noContent());
  });
});
