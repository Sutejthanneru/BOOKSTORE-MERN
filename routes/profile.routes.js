import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

import {
  getMyProfile,
  upsertMyProfile,
  getAllProfiles
} from "../controllers/profile.controllers.js";

const router = Router();

// Fetch logged-in user's profile
router.get("/get", protect, getMyProfile);

// Create or update logged-in user's profile
router.put("/update", protect, upsertMyProfile);
router.get("/getall",protect, authorize("admin"),getAllProfiles);


export default router;
