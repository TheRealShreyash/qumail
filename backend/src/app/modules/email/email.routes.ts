import { Router } from "express";
import EmailController from "./email.controller";

const emailRouter = Router();

emailRouter.post("/send", EmailController.handleSendEmail);
emailRouter.get("/inbox", EmailController.handleFetchEmails);

export default emailRouter;
