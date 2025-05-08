import multer from 'multer';

const storage = multer.memoryStorage();
// Set file size limit to 10MB (adjust as needed)
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB in bytes
  }
});
