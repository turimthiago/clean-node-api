import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeSignUpController } from "../factories/controllers/login/signup/signup-controller-factory";
import { makeLoginController } from "../factories/controllers/login/login/login-controller-factory";
import { Router } from "express";

export default (router: Router): void => {
  router.post("/signup", adaptRoute(makeSignUpController()));
  router.post("/login", adaptRoute(makeLoginController()));
};
