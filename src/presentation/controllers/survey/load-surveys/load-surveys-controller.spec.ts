import {
  LoadSurveys,
  SurveyModel,
  LoadSurveysController
} from "./load-survey-protocols";
import MockDate from "mockdate";
import { noContent, ok, serverError } from "../../../helpers/http/http-helpers";
import { mockSurveys, throwError } from "@/domain/test";
import { mockLoadSurveys } from "@/presentation/test";
interface SutTypes {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);
  return { sut, loadSurveysStub };
};

describe("LoadSurveys Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test("Should call LoadSurveys", async () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, "load");

    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Shoud return 500 if AddSurvey throws", async () => {
    const { loadSurveysStub, sut } = makeSut();
    jest.spyOn(loadSurveysStub, "load").mockRejectedValueOnce(throwError);
    const response = await sut.handle({});
    expect(response).toEqual(serverError(new Error()));
  });

  test("Should return 204 if LoadSurveys returns empty", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, "load").mockResolvedValueOnce([]);
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(mockSurveys()))
  });
});
