import express from "express";
import {addOrUpdateReview,getReviewsByBook,deleteMyReview} from "../controllers/review.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/addorupdate",protect,addOrUpdateReview);
router.get("/getreviews/:bookId",getReviewsByBook);
router.delete("/deletereview/:bookId",protect,deleteMyReview);

export default router;