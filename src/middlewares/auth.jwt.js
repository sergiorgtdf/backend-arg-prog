import Jwt from "jsonwebtoken";
import { settingDotEnvSecret } from "../config/config.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        if (!token) {
            return res.status(403).send({ message: `No token provided` });
        }

        const decoded = Jwt.verify(token, settingDotEnvSecret.SECRET);
        req.userId = decoded.id;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ message: `User not found` });
        }

        next();
    } catch (error) {
        return res.status(401).send({ message: `Unauthorized` });
    }
};
export const isAdministrator = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        const roles = await Role.find({ _id: { $in: user.roles } });
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === `admin`) {
                next();
                return;
            }
        }

        return res.status(403).send({ message: `Require Admin Role` });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
};
