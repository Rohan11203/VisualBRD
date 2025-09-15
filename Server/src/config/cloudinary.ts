import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Get your Cloudinary credentials from your .env file
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Check if all required environment variables are set
if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Cloudinary environment variables are not set. Please check your .env file.');
}

// Configure the Cloudinary SDK
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
