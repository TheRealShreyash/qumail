import type { Request, Response } from "express";
import {
  generateEncryptionKey,
  getDecryptionKey,
  getKmStatus,
  getKeysList,
  getLogsList,
} from "./km.service";
import ApiResponse from "../../common/utils/api-response";

class KmController {
  static async handleEncKeys(req: Request, res: Response) {
    try {
      const { senderEmail, recipientEmail, algorithm, keyLength } = req.body;
      const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      const result = await generateEncryptionKey(senderEmail, recipientEmail, algorithm, ipAddress, keyLength);
      return ApiResponse.created(res, "Quantum key generated successfully", result);
    } catch (error: any) {
      return ApiResponse.error(res, error);
    }
  }

  static async handleDecKeys(req: Request, res: Response) {
    try {
      const userEmail = (req.query.userEmail as string) || (req.query.email as string);
      const keyId = (req.query.key_ID as string) || (req.query.keyId as string);
      const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      const result = await getDecryptionKey(userEmail, keyId, ipAddress);
      return ApiResponse.ok(res, "Quantum key retrieved successfully", result);
    } catch (error: any) {
      return ApiResponse.error(res, error);
    }
  }

  static async handleGetStatus(req: Request, res: Response) {
    try {
      const userEmail = (req.query.email as string) || "";
      const status = await getKmStatus(userEmail);
      return ApiResponse.ok(res, "KM status fetched", status);
    } catch (error: any) {
      return ApiResponse.error(res, error);
    }
  }

  static async handleGetKeys(req: Request, res: Response) {
    try {
      const userEmail = req.query.email as string;
      const keys = await getKeysList(userEmail);
      return ApiResponse.ok(res, "Keys fetched", keys);
    } catch (error: any) {
      return ApiResponse.error(res, error);
    }
  }

  static async handleGetLogs(req: Request, res: Response) {
    try {
      const userEmail = req.query.email as string;
      const logs = await getLogsList(userEmail);
      return ApiResponse.ok(res, "Security logs fetched", logs);
    } catch (error: any) {
      return ApiResponse.error(res, error);
    }
  }
}

export default KmController;
