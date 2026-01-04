import express from "express";
import { loginUser, registerUser ,refreshAccessToken, logoutUser } from "../controllers/auth.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/register",registerUser);
router.post("/refresh", refreshAccessToken);
router.post("/login",loginUser);
router.post("/logout",protect ,logoutUser);
export default router;