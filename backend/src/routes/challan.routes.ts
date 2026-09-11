import { Router } from "express";
import * as challanController from "../controllers/challan.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/customer.validator.js";
import {
  challanCreateSchema,
  challanListQuerySchema,
  challanUpdateSchema,
} from "../validators/challan.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("ADMIN", "SALES", "ACCOUNTS"), validate(challanListQuerySchema, "query"), challanController.list);
router.get("/:id", authorize("ADMIN", "SALES", "ACCOUNTS"), validate(idParamSchema, "params"), challanController.getById);
router.post("/", authorize("ADMIN", "SALES"), validate(challanCreateSchema), challanController.create);
router.put("/:id", authorize("ADMIN", "SALES"), validate(idParamSchema, "params"), validate(challanUpdateSchema), challanController.update);
router.post("/:id/confirm", authorize("ADMIN", "SALES"), validate(idParamSchema, "params"), challanController.confirm);
router.post("/:id/cancel", authorize("ADMIN", "SALES"), validate(idParamSchema, "params"), challanController.cancel);

export default router;
