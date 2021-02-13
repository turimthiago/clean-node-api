import { adaptRoute } from "../adapters/express/express-routes-adapter";
import { Router } from "express";
import { makeAddSurveyController } from "../factories/controllers/add-survey/add-survey-controller-factory";

export default (router: Router): void => {
  router.post("/surveys", adaptRoute(makeAddSurveyController()));
};
