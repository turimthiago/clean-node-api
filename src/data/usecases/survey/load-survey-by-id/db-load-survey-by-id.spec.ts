import { mockLoadSurveyByIdRepository } from "@/data/test";
import { mockSurveyModel, throwError } from "@/domain/test";
import MockDate from "mockdate";
import {
  LoadSurveyByIdRepository,
  DbLoadSurveyById
} from "./db-load-load-survey-by-id-protocols";

interface SutTypes {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return { sut, loadSurveyByIdRepositoryStub };
};
describe("DbLoadSurveyById", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test("Should throw if LoadSurveyByIdRepository throws", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositoryStub, "loadById")
      .mockRejectedValueOnce(throwError);
    const promise = sut.loadById("any_id");
    await expect(promise).rejects.toThrow();
  });

  test("Should return a list of Survey on success", async () => {
    const { sut } = makeSut();
    const surveys = await sut.loadById("any_id");
    expect(surveys).toEqual(mockSurveyModel());
  });

  test("Should call LoadSurveyByIdRepository with correct values", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById");
    await sut.loadById("any_id");
    expect(loadByIdSpy).toHaveBeenCalledWith("any_id");
  });
});
