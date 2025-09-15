import multer from 'multer';
import path from 'path';
import crypto from 'crypto'; // A built-in Node.js module for creating random strings

/**
 * This multer configuration provides more control over file storage.
 * Instead of just a destination, we define a storage engine.
 */
const storage = multer.diskStorage({
  // Tell multer to save files to the 'uploads/' directory.
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // Generate a unique filename while keeping the original extension.
  filename: (req, file, cb) => {
    // Create a random 16-character string to prevent filename conflicts.
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    // Get the original file extension (e.g., '.png').
    const extension = path.extname(file.originalname);
    // Combine them to create the final filename.
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage: storage, // Use our new diskStorage configuration.
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit.
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const isMimeTypeAllowed = allowedFileTypes.test(file.mimetype);
    const isExtensionAllowed = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (isMimeTypeAllowed && isExtensionAllowed) {
      return cb(null, true);
    }
    cb(new Error('File upload rejected: Only PNG, JPG, or JPEG file types are supported.'));
  },
});

export default upload;

