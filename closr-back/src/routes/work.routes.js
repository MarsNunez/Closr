import express from "express";
import upload from "../middlewares/upload.js";
import { createWork } from "../controllers/work.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createWork);

export default router;
