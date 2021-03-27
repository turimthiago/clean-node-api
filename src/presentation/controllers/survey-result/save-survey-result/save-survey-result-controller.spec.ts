import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel
} from "./save-survey-result-controller-protocols";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import { forbidden, serverError } from "@/presentation/helpers/http/http-helpers";
import { InvalidParamError } from "@/presentation/errors";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_survey_id"
  }
});

const makeFakeSurvey = (): SurveyModel => ({
  id: "any_id",
  question: "any_question",
  answers: [{ image: "any_image", answer: "any_answer" }],
  date: new Date()
});

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(makeFakeSurvey());
    }
  }
  return new LoadSurveyByIdStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub);
  return { sut, loadSurveyByIdStub };
};

interface SutTypes {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
}

describe("SaveSurveyResult Controller", () => {
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
    jest.spyOn(loadSurveyByIdStub, "loadById").mockRejectedValueOnce(new Error());
    const response = await sut.handle({});
    expect(response).toEqual(serverError(new Error()));
  });
});
