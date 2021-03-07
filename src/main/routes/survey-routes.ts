import { adaptRoute } from "../adapters/express-routes-adapter";
import { Router } from "express";
import { makeAddSurveyController } from "../factories/controllers/survey/add-survey/add-survey-controller-factory";

export default (router: Router): void => {
  router.post("/surveys", adaptRoute(makeAddSurveyController()));
};
