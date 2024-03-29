import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel
} from "./save-survey-result-controller-protocols";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  forbidden,
  ok,
  serverError
} from "@/presentation/helpers/http/http-helpers";
import { InvalidParamError } from "@/presentation/errors";
import MockDate from "mockdate";
import {
  SaveSurveyResult,
  SaveSurveyResultParam
} from "@/domain/usecases/survey-result/save-survey-result";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { mockSurveyModel, throwError } from "@/domain/test";
import { mockSaveSurveyResut, mockSurveyResultModel } from "@/domain/test/mock-survey-result";
import { mockLoadSurveyById } from "@/presentation/test";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_survey_id"
  },
  body: {
    answer: "any_answer"
  },
  accountId: "any_account_id"
});

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = mockSaveSurveyResut();
  const loadSurveyByIdStub = mockLoadSurveyById();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub
  );
  return { sut, loadSurveyByIdStub, saveSurveyResultStub };
};

interface SutTypes {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
}

describe("SaveSurveyResult Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  test("Should call LoadSurveyById with correact values", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const spyLoadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById");
    await sut.handle(makeFakeRequest());
    expect(spyLoadByIdSpy).toHaveBeenCalledWith("any_survey_id");
  });

  test("Should return 403 if LoadSurveyById returns null", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, "loadById").mockResolvedValueOnce(null);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  test("Shoud return 500 if LoadSurveyById throws", async () => {
    const { loadSurveyByIdStub, sut } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, "loadById")
      .mockRejectedValueOnce(throwError);
    const response = await sut.handle({});
    expect(response).toEqual(serverError(new Error()));
  });

  test("Shoud return 403 if invalid anwser is provided", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({
      params: {
        surveyId: "any_survey_id"
      },
      body: {
        anwser: "wrong_anwser"
      }
    });
    expect(response).toEqual(forbidden(new InvalidParamError("answer")));
  });

  test("Should call SaveSurveyResult with correct values", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, "save");
    await sut.handle(makeFakeRequest());
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: "any_survey_id",
      accountId: "any_account_id",
      date: new Date(),
      answer: "any_answer"
    });
  });

  test("Shoud return 500 if SaveSurveyResult throws", async () => {
    const { saveSurveyResultStub, sut } = makeSut();
    jest.spyOn(saveSurveyResultStub, "save").mockRejectedValueOnce(new Error());
    const response = await sut.handle({});
    expect(response).toEqual(serverError(new Error()));
  });

  test("Shoud return 200 on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(ok(mockSurveyResultModel()));
  });
});
