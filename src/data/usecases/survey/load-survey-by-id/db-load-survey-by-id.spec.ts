import MockDate from "mockdate";
import {
  LoadSurveyByIdRepository,
  SurveyModel,
  DbLoadSurveyById
} from "./db-load-load-survey-by-id-protocols";

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: "any_id",
    question: "any_question",
    answers: [{ image: "any_image", answer: "any_answer" }],
    date: new Date()
  };
};

interface SutTypes {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(makeFakeSurvey());
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
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
      .mockRejectedValueOnce(new Error());
    const promise = sut.loadById("any_id");
    await expect(promise).rejects.toThrow();
  });

  test("Should return a list of Survey on success", async () => {
    const { sut } = makeSut();
    const surveys = await sut.loadById("any_id");
    expect(surveys).toEqual(makeFakeSurvey());
  });

  test("Should call LoadSurveyByIdRepository with correct values", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById");
    await sut.loadById("any_id");
    expect(loadByIdSpy).toHaveBeenCalledWith("any_id");
  });
});