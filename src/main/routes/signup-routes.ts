import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeSignUpController } from "../factories/signup-factory";

export default async (router: Router): Promise<void> => {
  await router.post("/signup", adaptRoute(makeSignUpController()));
};
