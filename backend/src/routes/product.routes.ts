import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema, paginationSchema } from "../validators/customer.validator.js";
import {
  productCreateSchema,
  productListQuerySchema,
  productUpdateSchema,
  stockMovementSchema,
} from "../validators/product.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"), validate(productListQuerySchema, "query"), productController.list);
router.get("/:id", authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"), validate(idParamSchema, "params"), productController.getById);
router.post("/", authorize("ADMIN", "WAREHOUSE"), validate(productCreateSchema), productController.create);
router.put("/:id", authorize("ADMIN", "WAREHOUSE"), validate(idParamSchema, "params"), validate(productUpdateSchema), productController.update);
router.post(
  "/:id/stock",
  authorize("ADMIN", "WAREHOUSE"),
  validate(idParamSchema, "params"),
  validate(stockMovementSchema),
  productController.adjustStock,
);
router.get(
  "/:id/movements",
  authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  validate(idParamSchema, "params"),
  validate(paginationSchema, "query"),
  productController.movements,
);

export default router;
