import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Helper function to generate download URLs
export const getDownloadUrl = (url: string): string => {
  return url.replace('/upload/', '/upload/fl_attachment/');
};

export default cloudinary;
