"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controllers/post.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.isAuthenticated, upload_middleware_1.upload.single('attachment'), post_controller_1.createPost);
router.get("/", post_controller_1.getAllPosts);
// Update post
router.put("/:id", auth_middleware_1.isAuthenticated, upload_middleware_1.upload.single("attachment"), post_controller_1.updatePost);
// Delete post
router.delete("/:id", auth_middleware_1.isAuthenticated, post_controller_1.deletePost);
exports.default = router;
