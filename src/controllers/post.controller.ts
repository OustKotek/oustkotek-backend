// src/controllers/post.controller.ts
import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { Post } from '../models/post.model';
import streamifier from 'streamifier';

const uploadToCloudinary = (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'posts', resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed'));
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description } = req.body;
    let attachmentUrl;

    if (req.file) {
      attachmentUrl = await uploadToCloudinary(req.file.buffer);
    }

    const post = await Post.create({
      description,
      attachment: attachmentUrl,
      createdBy: req.user?._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Post creation failed', error });
  }
};

// get all posts
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find()
      .populate("createdBy", "username role") // populate user info
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description } = req.body;
    const { id } = req.params;

    const existingPost = await Post.findById(id);
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
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate("createdBy");
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const user = req.user as { _id: string; role: string };
    // Optional: Check ownership or admin role
    if (!user || !post.createdBy || 
        (user._id.toString() !== post.createdBy?._id.toString() && user.role !== "admin")) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error });
  }
};

