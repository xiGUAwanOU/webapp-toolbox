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

  it("does nothing if user input is valid", async () => {
    const response = await request(server)
      .post("/resource")
      .send({ numberField: 42 });

    expect(response.status).toEqual(204);
  });

  it("throws an error if there is a missing root field", async () => {
    const response = await request(server)
      .post("/resource")
      .send({ stringField: "foo" });

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Object should have required property 'numberField'");
  });

  it("throws an error if there is an invalid field value", async () => {
    const response = await request(server)
      .post("/resource")
      .send({ numberField: "foo" });

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Field \".numberField\" should be integer");
  });
});
