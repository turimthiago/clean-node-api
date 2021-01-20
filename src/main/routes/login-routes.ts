import { Router } from "express";
import { adaptRoute } from "../adapters/express/express-routes-adapter";
import { makeLoginController } from "../factories/login/login-factory";
import { makeSignUpController } from "../factories/signup/signup-factory";

export default async (router: Router): Promise<void> => {
  await router.post("/signup", adaptRoute(makeSignUpController()));
  await router.post("/login", adaptRoute(makeLoginController()));
};
