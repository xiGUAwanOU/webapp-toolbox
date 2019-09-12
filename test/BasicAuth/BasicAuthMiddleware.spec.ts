import * as express from "express";
import { Express, Request, Response } from "express";
import * as request from "supertest";

import BasicAuthMiddleware from "../../src/BasicAuth/BasicAuthMiddleware";

describe("BasicAuthValidator", () => {
  let basicAuthMiddleware: BasicAuthMiddleware;
  let server: Express;

  beforeEach(() => {
    basicAuthMiddleware = new BasicAuthMiddleware("dummy-username", "dummy-password");

    server = express();
    server.use(basicAuthMiddleware.handleBasicAuth());
    server.get("/resource", (req: Request, res: Response) => {
      res.status(204);
      res.end();
    });
  });

  it("does nothing if credentials are correct", async () => {
    const response = await request(server)
      .get("/resource")
      .auth("dummy-username", "dummy-password");

    expect(response.status).toEqual(204);
  });

  it("throws an error if credentials are not correct", async () => {
    const responseWithWrongPassword = await request(server)
      .get("/resource")
      .auth("dummy-username", "wrong-password");

    expect(responseWithWrongPassword.status).toEqual(401);

    const responseWithWrongUsername = await request(server)
      .get("/resource")
      .auth("wrong-username", "dummy-password");

    expect(responseWithWrongUsername.status).toEqual(401);
  });

  it("throws an error if credentials cannot be parsed", async () => {
    const response = await request(server)
      .get("/resource")
      .set("Authorization", "Basic invalid-base64-encoded-credentials");

    expect(response.status).toEqual(401);
  });
});
