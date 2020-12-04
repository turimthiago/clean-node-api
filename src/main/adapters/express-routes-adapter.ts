import { Request, Response } from "express";
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    };
    const httpResponse: HttpResponse = await controller.handle(httpRequest);
    console.log(httpResponse);
    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
