import express from 'express';
import { createPost, deletePost, getAllPosts, updatePost } from '../controllers/post.controller';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();
router.post('/',isAuthenticated, upload.single('attachment'), createPost);
router.get("/", getAllPosts);
// Update post
router.put("/:id", isAuthenticated, upload.single("attachment"), updatePost);
// Delete post
router.delete("/:id", isAuthenticated, deletePost);


export default router;
