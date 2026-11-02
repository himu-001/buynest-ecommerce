import express from "express";
import { logout, signIn, signUp, isAuthenticated } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";  

const userRouter = express.Router();

// Public routes — no authentication required
userRouter.route("/signup").post(signUp);
userRouter.route("/login").post(signIn);

// Protected route — authentication required
userRouter.route("/is-auth").get(isAuthenticated, logout);
userRouter.route("/logout").post(verifyJWT, logout);

export default userRouter;
