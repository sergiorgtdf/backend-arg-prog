import { Router } from "express";
import {
    getPosts,
    getPost,
    createPost,
    updatedPost,
    deletePost,
    getPostsByUser,
} from "../controllers/post.controlles.js";

import { postValidationRules } from "../middlewares/post.validations.js";

import { authRequired } from "../middlewares/validateToken.js";

const postRoutes = Router();

// GET ALL POSTS
postRoutes.get("/posts", getPosts);
// GET ONE POST
postRoutes.get("/posts/:id", getPost);
// GET ALL POSTS BY USER
postRoutes.get("/myposts", getPostsByUser);
// CREATE POST
postRoutes.post("/posts", authRequired, postValidationRules, createPost);
// UPDATE POST
postRoutes.put("/posts/:id", authRequired, updatedPost);
// DELETE POST
postRoutes.delete("/posts/:id", authRequired, deletePost);

export default postRoutes;
