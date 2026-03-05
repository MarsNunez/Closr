import { Router } from "express";
import {
  createUser,
  getUser,
  getUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", createUser);
router.get("/", getUsers);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;
