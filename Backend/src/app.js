import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { config } from "./config/config.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: [ "GET", "POST", "PUT", "PATCH", "DELETE" ],
    credentials: true
}))


app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))

// DEBUG: log every incoming /api request headers
app.use("/api", (req, _res, next) => {
    console.log(`\n=== ${req.method} ${req.path} ===`)
    console.log("  Authorization:", req.headers["authorization"] ?? "MISSING")
    console.log("  Cookie:", req.headers["cookie"] ?? "MISSING")
    next()
})

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Server is running and ready to go!" });
});

// DEBUG: echo headers (open in browser to check proxy forwarding)
app.get("/api/debug/headers", (req, res) => {
    res.json({
        authorization: req.headers["authorization"] ?? null,
        cookie: req.headers["cookie"] ?? null,
    })
})

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
export default app;