import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDNIARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUDNIARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDNIARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // Remove locally saved file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return response;
    } catch (error) {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Cloudinary upload failed:", error);
        return null;
    }
};

const deleteOnCloudinary = async (cloudinaryUrl, resourceType = "image") => {
    try {
        if (!cloudinaryUrl) return null;

        // Extract public_id from cloudinary URL
        // e.g. https://res.cloudinary.com/cloud_name/image/upload/v123456/sample.jpg -> sample
        const urlParts = cloudinaryUrl.split("/");
        const fileNameWithExt = urlParts[urlParts.length - 1];
        const public_id = fileNameWithExt.split(".")[0];

        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: resourceType
        });
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteOnCloudinary };