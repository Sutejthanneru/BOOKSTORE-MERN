import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from "../controllers/address.controllers.js";

const router = Router();

router.get("/getall", protect, getMyAddresses);
router.post("/add", protect, addAddress);
router.put("/update", protect, updateAddress);
router.delete("/delete", protect, deleteAddress);

export default router;
