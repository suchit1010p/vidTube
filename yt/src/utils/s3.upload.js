
import api from "../api/axios";

export const uploadFileToS3 = async (file, folder = "others") => {
    try {
        if (!file) return null;

        // 1. Get Presigned URL
        // folder: video, thumbnail, avatar, cover-image
        // fileName format: folder/timestamp-filename
        const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const fileType = file.type;

        const response = await api.get("/utils/presigned-url", {
            params: {
                fileName,
                fileType,
            },
        });

        const { url: presignedUrl } = response.data.data;

        // 2. Upload to S3
        // Note: We use fetch here to avoid default axios interceptors/headers (like Auth)
        // that might interfere with S3 signature.
        const uploadResponse = await fetch(presignedUrl, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": fileType,
            },
        });

        if (!uploadResponse.ok) {
            throw new Error(`Failed to upload to S3: ${uploadResponse.statusText}`);
        }

        // 3. Construct Final URL
        // The presigned URL contains query params for signature. We want the clean URL.
        const cleanUrl = presignedUrl.split("?")[0];
        return cleanUrl;

    } catch (error) {
        console.error("S3 Upload Utility Error:", error);
        if (error.response) {
            console.error("Backend Response Data:", error.response.data);
            console.error("Backend Response Status:", error.response.status);
        }
        throw error;
    }
};
