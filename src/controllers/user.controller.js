import jwt from "jsonwebtoken";

import { settingDotEnvSecret } from "../config/config.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

// -------------------------User--------------------------
export const createUser = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;

        //const rolesFound = await Role.find({ name: { $in: roles } });

        const newUser = new User({
            username,
            email,
            password: await User.encryptPassword(password),
        });

        if (roles) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            newUser.roles = foundRoles.map((role) => role._id);
        } else {
            const role = await Role.findOne({ name: "user" });
            newUser.roles = [role._id];
        }

        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, settingDotEnvSecret, {
            expiresIn: "1d ", // 24 hours
        });

        res.status(200).json({
            message: "Successfully registered user!",
            token,
        });
    } catch (error) {
        console.error(error);
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: "User not found" });
        console.error(error);
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: "User not found" });
        console.error(error);
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.status(204).json();
    } catch (error) {
        res.status(404).json({ message: "User not found" });
        console.error(error);
    }
};

export const updateUserById = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            {
                new: true,
            }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(404).json({ message: "User not found" });
        console.error(error);
    }
};

export const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const foundUser = await User.findOne({ username });

        // Buscamos user en la DB
        if (!foundUser)
            return res.status(400).json({ message: "User not found" });

        // Comparamos password
        const matchPassword = await User.comparePassword(
            password,
            foundUser.password
        );

        if (!matchPassword) {
            return res
                .status(401)
                .json({ token: null, message: "Invalid password" });
        } else {
            const token = jwt.sign(
                { id: foundUser._id },
                settingDotEnvSecret().secret,
                {
                    expiresIn: "1d", // 24 hours
                }
            );
        }
    } catch (error) {
        return res.status(400).json({ message: "Login failed" });
    }
};

// -------------------------Roles--------------------------
export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(404).json({ message: "Roles not found" });
        console.error(error);
    }
};

export const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.roleId);
        res.status(200).json(role);
    } catch (error) {
        res.status(404).json({ message: "Role not found" });
        console.error(error);
    }
};

export const createRole = async (req, res) => {
    try {
        const { name } = req.body;

        const newRole = new Role({ name });
        const roleSaved = await newRole.save();

        res.status(200).json(roleSaved);
    } catch (error) {
        console.error(error);
    }
};

export const deleteRoleById = async (req, res) => {
    try {
        const { roleId } = req.params;
        await Role.findByIdAndDelete(roleId);
        res.status(204).json();
    } catch (error) {
        res.status(404).json({ message: "Role not found" });
        console.error(error);
    }
};
