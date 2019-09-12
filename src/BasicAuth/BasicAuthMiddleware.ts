import * as extractBasicAuthCredentials from "basic-auth";
import { NextFunction, Request, Response } from "express";

import BasicAuthError from "./BasicAuthError";

export default class BasicAuthMiddleware {
  private username: string;
  private password: string;

  public constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  public handleBasicAuth() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        this.validateCredentials(req);
        next();
      } catch (error) {
        if (error instanceof BasicAuthError) {
          res.status(401);
        } else {
          res.status(500);
        }
        res.json({ message: error.message });
        res.end();
      }
    };
  }

  private validateCredentials(req: Request) {
    const credentials = extractBasicAuthCredentials(req);
    if (!credentials || credentials.name !== this.username || credentials.pass !== this.password) {
      throw new BasicAuthError();
    }
  }
}