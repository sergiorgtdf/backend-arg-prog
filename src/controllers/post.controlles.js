import Post from "../models/post.model";

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        console.log(error.message);
        res.status(400).json([`Error getting  posts`]);
    }
};

export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json([`Post not found`]);
        res.status(200).json(post);
    } catch (error) {
        console.log(error.message);
        res.status(400).json([`Error getting the post`]);
    }
};

export const createPost = async (req, res) => {
    const { title, description, imageUrls } = req.body;
    console.log("Guardando post...");
    try {
        const newPost = new Post({
            title,
            description,
            imageUrls,
            autor: req.user.id,
        });

        const postSaved = await newPost.save();

        res.status(201).json(postSaved);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        ).populate("autor");
        if (!updatedPost)
            return res.status(404).json({ message: "Post not found" });

        res.status(200).json({
            message: "Post updated successfully",
            updatedPost,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        await Post.findByIdAndDelete(id);
        res.status(204).json();
    } catch (error) {
        res.status(404).json([`Post not found`]);
        // console.error(error);
    }
};
