import { Request, Response, NextFunction } from "express";

export const cors = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  response.set("access-control-allowed-origin", "*");
  response.set("access-control-allowed-headers", "*");
  response.set("access-control-allowed-methods", "*");
  next();
};
