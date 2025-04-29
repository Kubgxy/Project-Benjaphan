import express from "express";
import {
  createArticle,
  getAllArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  increaseViewBySlug,
} from "../controllers/article.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import { upload } from "../middlewares/articleUpload.middleware";

const article = express.Router();

article.post(
  "/createArticle",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "contentImages", maxCount: 10 }
  ]),                          // ✅ multer ทำงานก่อน
  verifyToken,                 // ✅ auth check
  verifyAdmin,                 // ✅ role check
  createArticle                // ✅ ← อย่าใส่ `(req, res)` ตรง route อีก!
);                                                         // ✅ create
article.get("/getAllArticle", getAllArticles);                                  // 🟢 get all (search, filter)
<<<<<<< HEAD
article.get("/getOneArticle/:slug", getArticleBySlug); // 🟠 get by slug
article.patch("/increaseView/:slug", increaseViewBySlug); //  increase view
article.patch("/updateArticle/:id", verifyToken, verifyAdmin, updateArticle);   // 🟡 update
=======
article.get("/getOneArticle/:slug", getArticleBySlug);                          // 🟠 get by slug
article.patch("/updateArticle/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "contentImages", maxCount: 10 }
  ]), verifyToken, verifyAdmin, updateArticle);   // 🟡 update
>>>>>>> 3ca0704b800d85348951a578420c2a88ab938b06
article.delete("/deleteArticle/:id", verifyToken, verifyAdmin, deleteArticle);  // 🔴 delete

export default article;
