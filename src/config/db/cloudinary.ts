import { v2 as cloudinary, type ConfigOptions } from "cloudinary";


const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET) {
    throw new Error("Missing cloudinary config variables")
}

export const CloudinaryConfig = cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
})