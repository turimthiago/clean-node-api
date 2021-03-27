import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel
} from "./save-survey-result-controller-protocols";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  forbidden,
  serverError
} from "@/presentation/helpers/http/http-helpers";
import { InvalidParamError } from "@/presentation/errors";
import MockDate from "mockdate";
import {
  SaveSurveyResult,
  SaveSurveyResultModel
} from "@/domain/usecases/survey-result/save-survey-result";
import { SurveyResultModel } from "@/domain/models/survey-result";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_survey_id"
  },
  body: {
    answer: "any_answer"
  },
  accountId: "any_account_id"
});

const makeFakeSurvey = (): SurveyModel => ({
  id: "any_id",
  question: "any_question",
  answers: [{ image: "any_image", answer: "any_answer" }],
  date: new Date()
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "valid_id",
  surveyId: "valid_survey_id",
  accountId: "valid_account_id",
  answer: "valid_anwser",
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

const makeSaveSurveyResut = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await Promise.resolve(makeFakeSurveyResult());
    }
  }
  return new SaveSurveyResultStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeSaveSurveyResut();
  const loadSurveyByIdStub = makeLoadSurveyById();
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
      .mockRejectedValueOnce(new Error());
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
    jest
      .spyOn(saveSurveyResultStub, "save")
      .mockRejectedValueOnce(new Error());
    const response = await sut.handle({});
    expect(response).toEqual(serverError(new Error()));
  });
});
