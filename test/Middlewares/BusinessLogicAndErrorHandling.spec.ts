import * as express from "express";
import { Express } from "express";
import * as request from "supertest";

import BusinessLogicAndErrorHandling from "../../src/Middlewares/BusinessLogicAndErrorHandling";

class ErrorOne extends Error {
  public constructor() {
    super("This is error one");
    this.name = "ErrorOne";
  }
}

class ErrorTwo extends Error {
  public constructor() {
    super("This is error two");
    this.name = "ErrorTwo";
  }
}

class ErrorThree extends Error {
  public constructor() {
    super("This is error three");
    this.name = "ErrorThree";
  }
}

describe("BusinessLogicAndErrorHandling", () => {
  let server: Express;

  beforeEach(() => {
    server = express();
  });

  it("runs business logic if there is no error", async () => {
    server.get("/resource", new BusinessLogicAndErrorHandling()
      .withBusinessLogic((req, res) => {
        res.status(204);
        res.end();
      })
      .withErrorMapper("ErrorOne", 401, () => ({ error: "Hey! This is error one" }))
      .withErrorMapper("ErrorTwo", 402)
      .done(),
    );

    await request(server)
      .get("/resource")
      .expect(204);
  });

  it("handles error for synchronous business logic", async () => {
    server.get("/resource", new BusinessLogicAndErrorHandling()
      .withBusinessLogic(() => {
        throw new ErrorOne();
      })
      .withErrorMapper("ErrorOne", 401, () => ({ error: "Hey! This is error one" }))
      .withErrorMapper("ErrorTwo", 402)
      .done(),
    );

    await request(server)
      .get("/resource")
      .expect(401, { error: "Hey! This is error one" });
  });

  it("handles error for asynchronous business logic", async () => {
    server.get("/resource", new BusinessLogicAndErrorHandling()
      .withBusinessLogic(async () => {
        throw new ErrorTwo();
      })
      .withErrorMapper("ErrorOne", 401)
      .withErrorMapper("ErrorTwo", 402)
      .done(),
    );

    await request(server)
      .get("/resource")
      .expect(402, { error: "This is error two" });
  });

  it("responses with 500 if error cannot be handled", async () => {
    server.get("/resource", new BusinessLogicAndErrorHandling()
      .withBusinessLogic(() =>
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new ErrorThree()), 0);
        }))
      .withErrorMapper("ErrorOne", 401)
      .withErrorMapper("ErrorTwo", 402)
      .done(),
    );

    await request(server)
      .get("/resource")
      .expect(500, { error: "Internal server error" });
  });
});
