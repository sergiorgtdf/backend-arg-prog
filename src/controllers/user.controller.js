import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { settingDotEnvSecret } from "../config/config.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

import { createAccessToken } from "../middlewares/jwt.validator.js";

// -------------------------User--------------------------
export const createUser = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;
        // Validar Usuario
        const userFound = await User.findOne({ email });
        if (userFound) return res.status(400).json(["User already exists"]);

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
        });

        // Si se envian roles, los buscamos en la DB y los asignamos al nuevo usuario
        if (roles) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            newUser.roles = foundRoles.map((role) => role._id);
        } else {
            const role = await Role.findOne({ name: "user" });
            newUser.roles = [role._id];
        }

        const savedUser = await newUser.save();

        // Crea el token
        const token = await createAccessToken({ id: savedUser._id });
        // Envia el token
        res.cookie("token", token);
        res.status(200).json({
            message: "Successfully registered user!",
            token,
        });
    } catch (error) {
        // res.status(500).json({ message: "Error registering user", error });
        res.status(500).json([error.message]);
        // console.error(error);
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json(["User not found"]);
        console.error(error);
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json(["User not found"]);
        console.error(error);
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.status(204).json();
    } catch (error) {
        res.status(404).json(["User not found"]);
        // console.error(error);
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
        res.status(404).json(["User not found"]);
        console.error(error);
    }
};

// verifica el token que elvia el frontend
const { secret } = settingDotEnvSecret();
export const verifyToken = async (req, res) => {
    try {
        //recibe el cookie del frontend
        const { token } = req.cookies;
        // verifica que venga un token
        if (!token) return res.status(401).json(["Unauthorized"]);
        // verifica el token
        const decoded = jwt.verify(token, secret);
        if (!decoded) return res.status(401).json(["Unauthorized"]);
        // verifica que el usuario exista en la DB
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json(["Unauthorized"]);
        // si todo esta bien, envia el usuario
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
            roles: user.roles,
        });
    } catch (error) {
        res.status(500).json(["Unauthorized"]);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Buscamos user en la DB
        const foundUser = await User.findOne({ email });

        if (!foundUser) return res.status(400).json(["User not found"]);

        // Comparamos password
        const matchPassword = await bcrypt.compare(
            password,
            foundUser.password
        );

        if (!matchPassword) return res.status(401).json(["Invalid password"]);

        // Crea el token
        const token = await createAccessToken({ id: foundUser._id });
        res.cookie("token", token);
        console.log(token);

        res.status(200).json({
            message: "Successfully logged in!",
            username: foundUser.username,
            token,
        });
    } catch (error) {
        return res.status(500).json(["Login failed"]);
    }
};

export const logout = async (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    return res.status(200).json({ message: "Logout successfully" });
};

export const profile = async (req, res) => {
    try {
        // console.log(req.headers.cookie);
        const userFound = await User.findById(req.user.id).populate("roles");
        // const userFound = await User.findById(req.user.id);
        if (!userFound)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Profile", userFound });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user" });
        console.error(error);
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
