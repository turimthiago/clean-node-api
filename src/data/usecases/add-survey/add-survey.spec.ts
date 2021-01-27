import { AddSurveyModel } from "../../../domain/usecases/add-survey";
import { AddSurveyRepository } from "../../protocols/db/survey/add-survey-protocols";
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

describe("DbAddSurvey Usecase", () => {
  test("Shoud call AddSurveyRepository with correct values", async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (data: AddSurveyModel): Promise<void> {
        return await Promise.resolve();
      }
    }
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");
    const sut = new DbAddSurvey(addSurveyRepositoryStub);
    const surveyData = fakeSurveyData();
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });
});
