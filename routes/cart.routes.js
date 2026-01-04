import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cart.controllers.js";

const router = Router();

// Get logged-in user's cart
router.get("/get", protect, getMyCart);

// Add item to cart
router.post("/add", protect, addToCart);

// Update item quantity
router.put("/update", protect, updateCartItem);

// Remove item from cart
router.delete("/remove", protect, removeFromCart);

// Clear entire cart
router.delete("/clear", protect, clearCart);

export default router;
