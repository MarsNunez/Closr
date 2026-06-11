import express from "express";
import upload from "../middlewares/upload.js";
import {
  createWork,
  getWorkById,
  getWorks,
  getWorksByUser,
} from "../controllers/work.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createWork);
router.get("/", getWorks);
router.get("/user/:userId", getWorksByUser);
router.get("/:workId", getWorkById);

export default router;
