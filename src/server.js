import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

// -------------------------------IMPORTS------------------------------
import { createRoles } from "./config/initial.setup.js";

import { connectMongo } from "./database/db.js";
import userRoutes from "./routes/user.routes.js";

export const server = express();

// -------------------------------CONNECT DB------------------------------
connectMongo();
createRoles();
// -------------------------------CONNECT DB------------------------------

// ---------------------------------USE------------------------------
server.use(helmet());
server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(cors());

server.use("/api/", userRoutes);
// ---------------------------------USE------------------------------
