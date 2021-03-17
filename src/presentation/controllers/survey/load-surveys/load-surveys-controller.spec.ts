import {
  LoadSurveys,
  SurveyModel,
  LoadSurveysController
} from "./load-survey-protocols";
import MockDate from "mockdate";

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

describe("LoadSurveys Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test("Should call LoadSurveys ", async () => {
    class LoadSurveysStub implements LoadSurveys {
      async load (): Promise<SurveyModel[]> {
        return await Promise.resolve(makeFackeSurveys());
      }
    }
    const loadSurveysStub = new LoadSurveysStub();
    const loadSpy = jest.spyOn(loadSurveysStub, "load");
    const sut = new LoadSurveysController(loadSurveysStub);
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });
});
