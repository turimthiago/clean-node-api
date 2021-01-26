import { badRequest } from "../../../helpers/http/http-helpers";
import { HttpRequest, Validation } from "../../../protocols";
import { AddSurveyController } from "./add-survey-controller";
import { AddSurvey, AddSurveyModel } from "./add-survey-protocols";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [{ image: "any_image", answer: "any_answer" }]
  }
});

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return { validationStub, sut, addSurveyStub };
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return await Promise.resolve();
    }
  }
  return new AddSurveyStub();
};

describe("AddSurvey Controller", async () => {
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
});
