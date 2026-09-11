import { Router } from "express";
import * as customerController from "../controllers/customer.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import {
  customerCreateSchema,
  customerListQuerySchema,
  customerUpdateSchema,
  followUpSchema,
  idParamSchema,
} from "../validators/customer.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("ADMIN", "SALES", "ACCOUNTS"), validate(customerListQuerySchema, "query"), customerController.list);
router.get("/:id", authorize("ADMIN", "SALES", "ACCOUNTS"), validate(idParamSchema, "params"), customerController.getById);
router.post("/", authorize("ADMIN", "SALES"), validate(customerCreateSchema), customerController.create);
router.put("/:id", authorize("ADMIN", "SALES"), validate(idParamSchema, "params"), validate(customerUpdateSchema), customerController.update);
router.delete("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), customerController.remove);
router.post(
  "/:id/followups",
  authorize("ADMIN", "SALES"),
  validate(idParamSchema, "params"),
  validate(followUpSchema),
  customerController.addFollowUp,
);

export default router;
