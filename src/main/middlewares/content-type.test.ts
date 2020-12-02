import request from "supertest";
import app from "../config/app";

describe("Content Type middleware", () => {
  test("Should return default Content Type as json", async () => {
    app.get("/test_content_type", (request, response) => {
      response.send("");
    });

    await request(app).get("/test_content_type").expect("content-type", /json/);
  });

  test("Should return XML when forced", async () => {
    app.get("/test_content_type_xml", (request, response) => {
      response.type("xml");
      response.send("");
    });

    await request(app).get("/test_content_type_xml").expect("content-type", /xml/);
  });
});
