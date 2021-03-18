import { adaptRoute } from "../adapters/express-routes-adapter";
import { Router } from "express";
import { makeAddSurveyController } from "../factories/controllers/survey/add-survey/add-survey-controller-factory";
import { makeLoadSurveysController } from "../factories/controllers/survey/load-surveys/add-survey-controller-factory";
import { adminAuth } from "../middlewares/admin-auth";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.post("/surveys", adminAuth, adaptRoute(makeAddSurveyController()));
  router.get("/surveys", auth, adaptRoute(makeLoadSurveysController()));
};
