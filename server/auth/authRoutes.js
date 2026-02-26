import express from "express";
import { signup, login } from "./authController.js";
import { requestOtp, verifyOtp, getOtpMetrics } from "./otpController.js";
import { uploadAuthDoc } from "./uploadController.js";
import { upload } from "../upload/uploadHandler.js";

const router = express.Router();

// routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/upload-doc", upload.single("file"), uploadAuthDoc);
router.get("/otp-metrics", getOtpMetrics);

export default router;
