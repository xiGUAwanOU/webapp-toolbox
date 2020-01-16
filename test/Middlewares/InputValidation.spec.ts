import * as express from "express";
import { Express } from "express";
import * as request from "supertest";

import bodyParser = require("body-parser");
import InputValidation from "../../src/Middlewares/InputValidation";

describe("BasicAuthValidator", () => {
  let server: Express;

  beforeEach(() => {
    server = express();
    server.use(bodyParser.json());
    server.use(
      new InputValidation()
        .withJsonSchema(require("../Data/item.schema.json"))
        .withDataExtractor((req) => req.body)
        .done(),
    );
    server.post("/resource", (req, res) => {
      res.status(204);
      res.end();
    });
  });

  it("forwards the request to the next handler", async () => {
    await request(server)
      .post("/resource")
      .send({ numberField: 42 })
      .expect(204);
  });

  it("returns 400 if there is an input validation error", async () => {
    await request(server)
      .post("/resource")
      .send({ stringField: "foo" })
      .expect(400, { error: "Object should have required property 'numberField'" });
  });

  it("allows user to customize the error", async () => {
    server = express();
    server.use(bodyParser.json());
    server.use(
      new InputValidation()
        .withJsonSchema(require("../Data/item.schema.json"))
        .withDataExtractor((req) => req.body)
        .withErrorCode(401)
        .withErrorBody(() => ({ error: "Authorization failed" }))
        .done(),
    );
    server.post("/resource", (req, res) => {
      res.status(204);
      res.end();
    });

    await request(server)
      .post("/resource")
      .send({ stringField: "foo" })
      .expect(401, { error: "Authorization failed" });
  });
});
