import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  description: { type: String, required: true },
  attachment: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // this must match the model name in user.model.ts
    required: true,
  },
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchema);
