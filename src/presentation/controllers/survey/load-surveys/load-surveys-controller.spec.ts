import {
  LoadSurveys,
  SurveyModel,
  LoadSurveysController
} from "./load-survey-protocols";
import MockDate from "mockdate";
import { noContent, ok, serverError } from "../../../helpers/http/http-helpers";

const makeFackeSurveys = (): SurveyModel[] => {
  return [
    {
      id: "any_id",
      question: "any_question",
      answers: [{ image: "any_image", answer: "any_answer" }],
      date: new Date()
    },
    {
      id: "other_id",
      question: "other_question",
      answers: [{ image: "other_image", answer: "other_answer" }],
      date: new Date()
    }
  ];
};

interface SutTypes {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
}

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(makeFackeSurveys());
    }
  }
  return new LoadSurveysStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys();
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
    jest.spyOn(loadSurveysStub, "load").mockRejectedValueOnce(new Error());
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
    expect(httpResponse).toEqual(ok(makeFackeSurveys()))
  });
});
