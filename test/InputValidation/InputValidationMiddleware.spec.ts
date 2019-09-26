import * as express from "express";
import { Express, Request, Response } from "express";
import * as request from "supertest";

import bodyParser = require("body-parser");
import InputValidationMiddleware from "../../src/InputValidation/InputValidationMiddleware";

describe("BasicAuthValidator", () => {
  let inputValidationMiddleware: InputValidationMiddleware;
  let server: Express;

  beforeEach(() => {
    inputValidationMiddleware = new InputValidationMiddleware(require("./item.schema.json"));

    server = express();
    server.use(bodyParser.json());
    server.use(inputValidationMiddleware.handleInputValidation((req) => req.body));
    server.post("/resource", (req: Request, res: Response) => {
      res.status(204);
      res.end();
    });
  });

  it("forwards the request to the next handler", async () => {
    const response = await request(server)
      .post("/resource")
      .send({ numberField: 42 });

    expect(response.status).toEqual(204);
  });

  it("returns 400 if there is an input validation error", async () => {
    const response = await request(server)
      .post("/resource")
      .send({ stringField: "foo" });

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Object should have required property 'numberField'");
  });
});
