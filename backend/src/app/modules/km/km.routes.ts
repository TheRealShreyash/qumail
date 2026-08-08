import { Router } from "express";
import KmController from "./km.controller";

const kmRouter = Router();

kmRouter.get("/status", KmController.handleGetStatus);

export default kmRouter;
