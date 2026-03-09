import express from "express";
import { loginUser, registerUser ,refreshAccessToken, logoutUser , forgotPassword , resetPassword } from "../controllers/auth.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/refresh", refreshAccessToken);
router.post("/login",loginUser);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/logout",protect ,logoutUser);
export default router;