import { Express, Router } from "express";
import { readdirSync } from "fs";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  readdirSync(`${__dirname}/../routes`).map(async file => {
    if (!file.endsWith(".map") && !file.includes("test.ts")) {
      console.log(file);
      (await import(`../routes/${file}`)).default(router);
    }
  });
};
