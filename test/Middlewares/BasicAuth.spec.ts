import * as express from "express";
import { Express } from "express";
import * as request from "supertest";

import BasicAuth from "../../src/Middlewares/BasicAuth";

describe("BasicAuth", () => {
  let server: Express;

  beforeEach(() => {
    server = express();
    server.use(
      new BasicAuth()
        .withCredential("dummy-username", "dummy-password")
        .done(),
    );
    server.get("/resource", (req, res) => {
      res.status(204);
      res.end();
    });
  });

  it("does nothing if credentials are correct", async () => {
    await request(server)
      .get("/resource")
      .auth("dummy-username", "dummy-password")
      .expect(204);
  });

  it("throws an error if credentials are not correct", async () => {
    await request(server)
      .get("/resource")
      .auth("dummy-username", "wrong-password")
      .expect(401);

    await request(server)
      .get("/resource")
      .auth("wrong-username", "dummy-password")
      .expect(401);
  });

  it("throws an error if credentials cannot be parsed", async () => {
    await request(server)
      .get("/resource")
      .set("Authorization", "Basic invalid-base64-encoded-credentials")
      .expect(401);
  });
});
