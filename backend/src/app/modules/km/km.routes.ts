import { Router } from "express";
import KmController from "./km.controller";

const kmRouter = Router();

kmRouter.post("/enc_keys", KmController.handleEncKeys);
kmRouter.get("/dec_keys", KmController.handleDecKeys);
kmRouter.get("/status", KmController.handleGetStatus);
kmRouter.get("/keys", KmController.handleGetKeys);
kmRouter.get("/logs", KmController.handleGetLogs);

export default kmRouter;
