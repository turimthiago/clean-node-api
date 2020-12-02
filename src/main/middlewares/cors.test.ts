import request from "supertest";
import app from "../config/app";

describe("CORS middleware", () => {
  test("Should enable CORS", async () => {
    app.post("/test_cors", (request, response) => {
      response.send();
    });

    await request(app)
      .get("/test_cors")
      .expect("access-control-allowed-origin", "*")
      .expect("access-control-allowed-methods", "*")
      .expect("access-control-allowed-headers", "*");
  });
});
