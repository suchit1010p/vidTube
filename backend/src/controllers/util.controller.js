
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generatePresignedUrl } from "../utils/s3.js";

const getPresignedUrl = asyncHandler(async (req, res) => {
    const { fileName, fileType } = req.query;

    if (!fileName || !fileType) {
        throw new ApiError(400, "FileName and FileType are required");
    }

    // Optional: Add folder prefix based on file type or context
    // e.g. "avatars/" + fileName or "videos/" + fileName
    // For now, using flat structure or client-provided name

    // Security: You might want to validate fileType here to restrict execution files

    const url = await generatePresignedUrl(fileName, fileType);

    return res
        .status(200)
        .json(new ApiResponse(200, { url }, "Presigned URL generated successfully"));
});

export { getPresignedUrl };
