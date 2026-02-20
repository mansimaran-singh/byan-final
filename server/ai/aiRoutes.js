import express from "express";
import { rewriteText } from "./aiController.js";

const router = express.Router();

router.post("/rewrite", rewriteText);

export default router;
