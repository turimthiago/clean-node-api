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
    password: "123",
    role: "admin"
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
});
