import mongoose from "mongoose";
import { settingDotEnvDB } from "../config/config.js";

const { db } = settingDotEnvDB();

export const connectMongo = async () => {
    try {
        await mongoose.connect(db.host);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(`MongoDB connection failed - ${error}`);
    }
};
