"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getAllPosts = exports.createPost = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const post_model_1 = require("../models/post.model");
const streamifier_1 = __importDefault(require("streamifier"));
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.uploader.upload_stream({ folder: 'posts', resource_type: 'auto' }, (error, result) => {
            if (error)
                return reject(error);
            if (!result)
                return reject(new Error('Upload failed'));
            resolve(result.secure_url);
        });
        streamifier_1.default.createReadStream(fileBuffer).pipe(stream);
    });
};
const createPost = async (req, res) => {
    try {
        const { description } = req.body;
        let attachmentUrl;
        if (req.file) {
            attachmentUrl = await uploadToCloudinary(req.file.buffer);
        }
        const post = await post_model_1.Post.create({
            description,
            attachment: attachmentUrl,
            createdBy: req.user?._id,
        });
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Post creation failed', error });
    }
};
exports.createPost = createPost;
// get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await post_model_1.Post.find()
            .populate("createdBy", "username role") // populate user info
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch posts", error });
    }
};
exports.getAllPosts = getAllPosts;
const updatePost = async (req, res) => {
    try {
        const { description } = req.body;
        const { id } = req.params;
        const existingPost = await post_model_1.Post.findById(id);
        if (!existingPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        // Optional: Check ownership or admin role
        if (!req.user || req.user._id?.toString() !== existingPost.createdBy?._id.toString() && req.user.role !== "admin") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        let attachmentUrl = existingPost.attachment;
        if (req.file) {
            attachmentUrl = await uploadToCloudinary(req.file.buffer);
        }
        existingPost.description = description || existingPost.description;
        existingPost.attachment = attachmentUrl;
        await existingPost.save();
        res.status(200).json(existingPost);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update post", error });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await post_model_1.Post.findById(id).populate("createdBy");
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const user = req.user;
        // Optional: Check ownership or admin role
        if (!user || !post.createdBy ||
            (user._id.toString() !== post.createdBy?._id.toString() && user.role !== "admin")) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete post", error });
    }
};
exports.deletePost = deletePost;
