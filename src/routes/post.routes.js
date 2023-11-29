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
postRoutes.get("/post", getPosts);
// GET ONE POST
postRoutes.get("/post/:id", getPost);
// GET ALL POSTS BY USER
postRoutes.get("/mypost", getPostsByUser);
// CREATE POST
postRoutes.post("/post", authRequired, postValidationRules, createPost);
// UPDATE POST
postRoutes.put("/post/:id", authRequired, updatedPost);
// DELETE POST
postRoutes.delete("/post/:id", authRequired, deletePost);

export default postRoutes;
