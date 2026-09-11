import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validators/auth.validator.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authenticate, authController.me);

export default router;
