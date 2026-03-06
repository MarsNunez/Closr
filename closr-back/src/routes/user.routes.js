import { Router } from "express";
import {
  createUser,
  getMe,
  getUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import {
  authMiddleware,
  rolesMiddleware,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/", validate(registerSchema), createUser);
router.get("/all", authMiddleware, rolesMiddleware("ADMIN"), getUsers);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", authMiddleware, getMe);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;
