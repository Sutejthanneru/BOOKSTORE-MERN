import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist
} from "../controllers/wishlist.controllers.js";

const router = Router();

// Get logged-in user's wishlist
router.get("/get", protect, getMyWishlist);

// Add book to wishlist
router.post("/post", protect, addToWishlist);

// Remove book from wishlist
router.delete("/remove", protect, removeFromWishlist);

export default router;
