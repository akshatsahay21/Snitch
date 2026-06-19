import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";



export const authenticateUser = async (req, res, next) => {
    // Support both Bearer token (header) and cookie
    const authHeader = req.headers["authorization"]
    const token = (authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null)
        ?? req.cookies.token

    console.log("[Auth] cookies:", req.cookies, "| header token:", !!authHeader)

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user
        next();
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export const authenticateSeller = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = (authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null)
        ?? req.cookies.token;

    if (!token){
        return res.status(401).json({ message: "Unauthorized" });
    }
    try{
        const decoded = jwt.verify(token, config.JWT_SECRET)
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (user.role !== "seller") {
            return res.status(403).json({ message: "Forbidden: Only sellers can perform this action" });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Unauthorized" });
    }
}