import { Router } from "express";
import {
    createUser,
    login,
    logout,
    profile,
    verifyToken,
} from "../controllers/user.controller.js";

import {
    userValidationRules,
    loginValidationRules,
    errorHandle,
} from "../middlewares/user.validations.js";

import { authRequired } from "../middlewares/validateToken.js";

const userRoutes = Router();

// Route to register new users
userRoutes.post("/signup", userValidationRules, errorHandle, createUser);

// Rout to login users
userRoutes.post("/signin", loginValidationRules, errorHandle, login);

// Route to logout users
userRoutes.post("/logout", logout);

// Route to get profile user
userRoutes.get("/profile", authRequired, profile);

// Pedido del token del usuario, verificando que el token sea válido
userRoutes.get("/verifyToken", verifyToken);

export default userRoutes;
