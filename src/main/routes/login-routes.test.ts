import { hash } from "bcrypt";
import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

let accountCollection;

describe("Login Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("POST /login", () => {
    test("Should return 200 on login", async () => {
      const password = await hash("123", 12);
      await accountCollection.insertOne({
        name: "Thiago Turim",
        email: "turimthiago@gmail.com",
        password
      });

      await request(app)
        .post("/api/login")
        .send({
          email: "turimthiago@gmail.com",
          password: "123"
        })
        .expect(200);
    });
  });
});
