import express from "express";
import upload from "../middlewares/upload.js";
import {
  createWork,
  getWorkById,
  getWorks,
  getWorksByUser,
} from "../controllers/work.controller.js";
import {
  likeWork,
  unlikeWork,
  saveWork,
  unsaveWork,
  getWorkComments,
  createWorkComment,
  deleteWorkComment,
  getSavedWorks,
} from "../controllers/workInteraction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";

const router = express.Router();

/* ── Works CRUD ── */
router.post("/", authMiddleware, upload.single("image"), createWork);
router.get("/", optionalAuth, getWorks);
router.get("/user/:userId", optionalAuth, getWorksByUser);
router.get("/:workId", optionalAuth, getWorkById);

/* ── Likes ── */
router.post("/:workId/like", authMiddleware, likeWork);
router.delete("/:workId/like", authMiddleware, unlikeWork);

/* ── Saves ── */
router.post("/:workId/save", authMiddleware, saveWork);
router.delete("/:workId/save", authMiddleware, unsaveWork);

/* ── Comments ── */
router.get("/:workId/comments", getWorkComments);
router.post("/:workId/comments", authMiddleware, createWorkComment);
router.delete("/:workId/comments/:commentId", authMiddleware, deleteWorkComment);

export default router;
