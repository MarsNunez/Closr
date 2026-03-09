import express from "express";
import { getFeed } from "../controllers/feed.controller.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";

const router = express.Router();

router.get("/", optionalAuth, getFeed);

export default router;
