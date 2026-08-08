import { type Request, type Response } from "express";
import { getKmStatus } from "./km.service";
import ApiResponse from "../../common/utils/api-response";

class KmController {
  static async handleGetStatus(req: Request, res: Response) {
    try {
      const userEmail = req.query.email as string;
      const status = getKmStatus(userEmail);
      ApiResponse.ok(res, "Success", status);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
}

export default KmController;
