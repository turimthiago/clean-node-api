import { HttpRequest, Validation } from "../../../protocols";
import { AddSurveyController } from "./add-survey-controller";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answer: [{ image: "any_image", answer: "any_answer" }]
  }
});

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);
  return { validationStub, sut };
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

describe("AddSurvey Controller", () => {
  test("Shoud call validation with correct values", async () => {
    const { validationStub, sut } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
