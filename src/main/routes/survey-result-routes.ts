import { adaptRoute } from "@/main/adapters/express-routes-adapter";
import { Router } from "express";
import { auth } from "@/main/middlewares/auth";
import { makeSaveSurveyResultController } from "@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory";

export default (router: Router): void => {
  router.put("/surveys/:surveyId/results", auth, adaptRoute(makeSaveSurveyResultController()));
};
