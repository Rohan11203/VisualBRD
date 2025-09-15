import multer from 'multer';
import path from 'path';

/**
 * Multer is a middleware that handles 'multipart/form-data', which is used for file uploads.
 * This configuration tells Multer how to process the incoming annotated image.
 */
const upload = multer({
  // 'dest' specifies a temporary directory to store the uploaded files.
  // You must create this 'uploads/' folder in the root of your backend project.
  dest: 'uploads/',

  // Set a file size limit to prevent overly large uploads (e.g., 10MB).
  limits: { fileSize: 10 * 1024 * 1024 },

  // A filter to ensure only valid image file types are accepted.
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const isMimeTypeAllowed = allowedFileTypes.test(file.mimetype);
    const isExtensionAllowed = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (isMimeTypeAllowed && isExtensionAllowed) {
      // If the file is an allowed type, accept it.
      return cb(null, true);
    }
    // Otherwise, reject the file with an error.
    cb(new Error('File upload rejected: Only PNG, JPG, or JPEG file types are supported.'));
  },
});

export default upload;
