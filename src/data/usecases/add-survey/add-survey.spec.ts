import { AddSurveyRepository, AddSurveyModel } from "../../protocols/db/survey/add-survey-protocols";
import { DbAddSurvey } from "./db-add-survey";

const fakeSurveyData = (): AddSurveyModel => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer"
    }
  ]
});

interface SutTypes {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
}

const makeSut = (): SutTypes => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyModel): Promise<void> {
      return await Promise.resolve();
    }
  }
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return { sut, addSurveyRepositoryStub };
};

describe("DbAddSurvey Usecase", () => {
  test("Shoud call AddSurveyRepository with correct values", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");
    const surveyData = fakeSurveyData();
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });
});
