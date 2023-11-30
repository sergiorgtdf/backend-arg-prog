import Post from "../models/post.model.js";
// import User from "../models/user.model.js";

// GET ALL POSTS - ok
export const getPosts = async (req, res) => {
    try {
        const allPosts = await Post.find({
            // user: req.user.id,
        });
        res.status(200).json(allPosts);
    } catch (error) {
        res.status(404).json(["Post not found"]);
        console.error(error);
    }
};

// GET ONE POST - ok
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post).populate(autor);
    } catch (error) {
        res.status(404).json(["Post not found"]);
        console.error(error);
    }
};

// CREATE POST - OK
export const createPost = async (req, res) => {
    const { title, description, imageUrls } = req.body;

    try {
        const newTask = new Post({
            title,
            description,
            imageUrls,
            autor: req.user.id,
        });

        const savedPost = await newTask.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json(["Error creating post", error.message]);
        console.error(error);
    }
};

// UPDATE POST - ok
export const updatedPost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        ).populate("autor");

        if (!updatedPost) return res.status(404).json(["Post not found"]);
        res.status(200).json({ message: "Post updated", updatedPost });
    } catch (error) {
        res.status(404).json(["Post not found"]);
        console.error(error);
    }
};

// DELETE POST
export const deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (error) {
        res.status(404).json(["Post not found"]);
        console.error(error);
    }
};

// GET POSTS BY USER
export const getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ autor: req.params.id }).populate(
            "autor"
        );
        if (!posts) return res.status(404).json(["Posts not found"]);
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json(["Post not found"]);
        console.error(error);
    }
};
