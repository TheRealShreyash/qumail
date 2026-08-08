import type { Request, Response } from "express";
import { sendEmailViaGmail, fetchInboxEmails } from "./email.service";
import ApiResponse from "../../common/utils/api-response";

class EmailController {
  static async handleSendEmail(req: Request, res: Response) {
    try {
      const { senderEmail, recipientEmail, subject, body, level, keyId } = req.body;
      const result = await sendEmailViaGmail({ senderEmail, recipientEmail, subject, body, level, keyId });
      return ApiResponse.ok(res, "Email sent successfully", result);
    } catch (error: any) {
      console.error("[ Email Send Error ]", error.message);
      return ApiResponse.error(res, error);
    }
  }

  static async handleFetchEmails(req: Request, res: Response) {
    try {
      const userEmail = req.query.email as string;
      const folder = (req.query.folder as string) || "inbox";
      const maxResults = parseInt(req.query.limit as string) || 20;

      if (!userEmail) {
        return res.status(400).json({ success: false, error: "email query param required" });
      }

      const emails = await fetchInboxEmails(userEmail, folder, maxResults);
      return ApiResponse.ok(res, `Fetched ${emails.length} emails from ${folder}`, emails);
    } catch (error: any) {
      console.error("[ Email Fetch Error ]", error.message);
      return ApiResponse.error(res, error);
    }
  }
}

export default EmailController;
