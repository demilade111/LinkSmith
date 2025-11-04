import express from "express";
import { createLink, redirectLink, linkAnalytics } from "../controllers/link.controller.js";

const router = express.Router();

router.post("/", createLink);


router.get("/:code", redirectLink);

router.get("/:code/analytics", linkAnalytics);

export default router;