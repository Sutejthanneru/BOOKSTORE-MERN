import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  createBook,
  getMyBooks,
  getBookById,
  updateBook,
  deleteBook
} from "../controllers/note.controllers.js";

const router = Router();
//ADMIN
router.post("/add", protect,authorize("admin"), createBook);
router.put("/update", protect,authorize("admin"), updateBook);
router.delete("/delete", protect,authorize("admin"), deleteBook);
//ANYONE
router.get("/getall", protect, getMyBooks);
router.get("/getbyid", protect, getBookById);

export default router;
