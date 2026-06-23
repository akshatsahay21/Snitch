import express from "express";
import { getWishlist, toggleWishlistItem } from "../controllers/wishlist.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getWishlist);
router.post("/toggle", toggleWishlistItem);

export default router;
