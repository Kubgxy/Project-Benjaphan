import  { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { addRating, getAverageRating, getUserRating } from "../controllers/review.controller";

const review = Router();

// 🟢 Add Rating
review.post("/addRating", verifyToken, addRating);
review.get("/average/:productId", getAverageRating);
review.get("/user-rating/:productId", verifyToken, getUserRating);


export default review;