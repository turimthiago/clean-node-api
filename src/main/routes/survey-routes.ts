import { adaptRoute } from "@/main/adapters/express-routes-adapter";
import { Router } from "express";
import { makeAddSurveyController } from "@/main/factories/controllers/survey/add-survey/add-survey-controller-factory";
import { makeLoadSurveysController } from "@/main/factories/controllers/survey/load-surveys/add-survey-controller-factory";
import { adminAuth } from "@/main/middlewares/admin-auth";
import { auth } from "@/main/middlewares/auth";

export default (router: Router): void => {
  router.post("/surveys", adminAuth, adaptRoute(makeAddSurveyController()));
  router.get("/surveys", auth, adaptRoute(makeLoadSurveysController()));
};
