import { adaptRoute } from "../adapters/express/express-routes-adapter";
import { makeSignUpController } from "../factories/signup/signup-factory";
import { makeLoginController } from "../factories/login/login-factory";
import { Router } from "express";

export default (router: Router): void => {
  router.post("/signup", adaptRoute(makeSignUpController()));
  router.post("/login", adaptRoute(makeLoginController()));
};
