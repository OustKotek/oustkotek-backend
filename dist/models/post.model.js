"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    description: { type: String, required: true },
    attachment: { type: String },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // this must match the model name in user.model.ts
        required: true,
    },
}, { timestamps: true });
exports.Post = mongoose_1.default.model('Post', postSchema);
