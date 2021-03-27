import app from "../config/app";
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";
import { hash } from "bcrypt";
import request from "supertest";
import { sign } from "jsonwebtoken";
import env from "../config/env";

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: "Thiago Turim",
    email: "turimthiago@gmail.com",
    password: "123"
  });
  const id = res.ops[0]._id;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne(
    {
      _id: id
    },
    {
      $set: {
        accessToken
      }
    }
  );
  return accessToken;
};

let surveyCollection: Collection;
let accountCollection: Collection;
describe("Survey Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    accountCollection = await MongoHelper.getCollection("accounts");
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe("PUT /surveys/:surveyId/results", () => {
    test("Should return 403 on save survey without token", async () => {
      const password = await hash("123", 12);

      await request(app)
        .put("/api/surveys/any_id/results")
        .send({
          answer: "Answer 2"
        })
        .expect(403);
    });
  });

  test("Should return 200 on save survey result with access token", async () => {
    const accessToken = await makeAccessToken();
    const res = await surveyCollection.insertOne({
      question: "Question",
      answers: [
        {
          answer: "Answer 1",
          image: "http://image-name.com"
        },
        {
          answer: "Answer 2"
        }
      ],
      date: new Date()
    });
    const id = res.ops[0]._id as string;

    await request(app)
      .put(`/api/surveys/${id}/results`)
      .set("x-access-token", accessToken)
      .send({
        answer: "Answer 2"
      })
      .expect(200);
  });
});
