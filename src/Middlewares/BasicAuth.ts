import * as extractBasicAuthCredentials from "basic-auth";
import { Handler, Request } from "express";

import BasicAuthError from "../Errors/BasicAuthError";
import BusinessLogicAndErrorHandling from "./BusinessLogicAndErrorHandling";

export default class BasicAuth {
  private username!: string;
  private password!: string;

  public withCredential(username: string, password: string) {
    this.username = username;
    this.password = password;
    return this;
  }

  public done(): Handler {
    return new BusinessLogicAndErrorHandling()
      .withBusinessLogic((req, res, next) => {
        this.validateCredentials(req);
        next();
      })
      .withErrorMapper("BasicAuthError", 401)
      .done();
  }

  private validateCredentials(req: Request) {
    const credentials = extractBasicAuthCredentials(req);
    if (!credentials || credentials.name !== this.username || credentials.pass !== this.password) {
      throw new BasicAuthError();
    }
  }
}
