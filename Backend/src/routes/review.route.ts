import express from "express";
import { addReview, deleteReview, getReviewsByProduct } from "../controllers/review.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, addReview);
router.delete("/:id", verifyToken, deleteReview);
router.get("/:productId", getReviewsByProduct);

export default router;
