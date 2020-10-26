import { Handler } from "express";
export default class BasicAuth {
    private username;
    private password;
    withCredential(username: string, password: string): this;
    done(): Handler;
    private validateCredentials;
}
