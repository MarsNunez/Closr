import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createPost } from "../controllers/post.controller.js";
import { validate } from "../middlewares/validate.js";
import { createPostSchema } from "../validations/post.validation.js";

const router = express.Router();

router.post("/", validate(createPostSchema), authMiddleware, createPost);

export default router;
