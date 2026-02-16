import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById ,
  cancelOrder
} from "../controllers/order.controllers.js";

const router = Router();

router.post("/create", protect, createOrder);
router.get("/getall", protect, getMyOrders);
router.post("/getsingle/:id", protect, getOrderById);
router.put("/cancel/:id",protect,cancelOrder);
export default router;
