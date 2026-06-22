import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import { googleCallback, login, register, getMe, updateProfile, addAddress, deleteAddress, toggleWishlist, getWishlist, getMyOrders } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();


router.post('/register', validateRegisterUser, register)

router.post("/login", validateLoginUser, login)


// /api/auth/google
router.get("/google",
    passport.authenticate("google", { scope: [ "profile", "email" ] }))

router.get("/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"

    }),
    googleCallback,
)

/**
 * @route GET /api/auth/me
 * @desc Get current authenticated user
 * @access Private
 */
router.get("/me", authenticateUser, getMe)

/**
 * @route PUT /api/auth/profile
 * @desc Update profile (fullname, contact)
 * @access Private
 */
router.put("/profile", authenticateUser, updateProfile)

/**
 * @route POST /api/auth/address
 * @desc Add a new delivery address
 * @access Private
 */
router.post("/address", authenticateUser, addAddress)

/**
 * @route DELETE /api/auth/address/:addressId
 * @desc Delete a delivery address
 * @access Private
 */
router.delete("/address/:addressId", authenticateUser, deleteAddress)

/**
 * @route POST /api/auth/wishlist/:productId
 * @desc Toggle product in wishlist (add if not present, remove if present)
 * @access Private
 */
router.post("/wishlist/:productId", authenticateUser, toggleWishlist)

/**
 * @route GET /api/auth/wishlist
 * @desc Get user's wishlist with populated product data
 * @access Private
 */
router.get("/wishlist", authenticateUser, getWishlist)

/**
 * @route GET /api/auth/orders
 * @desc Get user's order history
 * @access Private
 */
router.get("/orders", authenticateUser, getMyOrders)

export default router;