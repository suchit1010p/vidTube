import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponce } from "../utils/ApiResponce.js"
import { History } from "../models/history.model.js";

// const getAllVideos = asyncHandler(async (req, res) => {
//     let { pages = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

//     // Convert to number safely
//     pages = Math.max(Number(pages) || 1, 1);
//     limit = Math.min(Math.max(Number(limit) || 10, 1), 50); 
//     // limit max is 50 => protects server load

//     const filter = {};

//     // Validate search input
//     if (query) {
//         if (query.length > 50) {
//             throw new ApiError(400, "Search query too long");
//         }
//         filter.title = { $regex: query, $options: "i" };
//     }

//     // Validate userId before filtering
//     if (userId) {
//         if (!isValidObjectId(userId)) {
//             throw new ApiError(400, "Invalid userId format");
//         }
//         filter.owner = userId;
//     }

//     // Whitelist allowed sorting fields
//     const allowedSort = ["createdAt", "views", "title"];
//     if (!allowedSort.includes(sortBy)) {
//         sortBy = "createdAt";
//     }

//     const sortOrder = sortType === "asc" ? 1 : -1;

//     // DB Query
//     const videos = await Video.find(filter)
//         .sort({ [sortBy]: sortOrder })
//         .skip((pages - 1) * limit)
//         .limit(limit);

//     const totalVideos = await Video.countDocuments(filter);

//     return res.status(200).json(
//         new ApiResponse(200, {
//             videos,
//             totalVideos,
//             currentPage: pages,
//             limit,
//             hasNextPage: pages * limit < totalVideos,
//             totalPages: Math.ceil(totalVideos / limit),
//         }, "Videos fetched successfully")
//     );
// });

const getAllVideos = asyncHandler(async (req, res) => {
    let {
        pages = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query;

    pages = Math.max(Number(pages) || 1, 1);
    limit = Math.min(Math.max(Number(limit) || 10, 1), 50);

    const skip = (pages - 1) * limit;
    const sortOrder = sortType === "asc" ? 1 : -1;

    const allowedSort = ["createdAt", "views", "title"];
    if (!allowedSort.includes(sortBy)) {
        sortBy = "createdAt";
    }

    const matchStage = {};

    if (query) {
        if (query.length > 50) {
            throw new ApiError(400, "Search query too long");
        }
        matchStage.title = { $regex: query, $options: "i" };
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId format");
        }
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }

    const result = await Video.aggregate([
        { $match: matchStage },

        {
            $facet: {
                videos: [
                    { $sort: { [sortBy]: sortOrder } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        avatar: 1,
                                        fullName: 1,
                                        _id: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" }
                        }
                    }
                ],
                totalVideos: [
                    { $count: "count" }
                ]
            }
        },

        {
            $addFields: {
                totalVideos: {
                    $ifNull: [{ $arrayElemAt: ["$totalVideos.count", 0] }, 0]
                }
            }
        },

    ]);

    const videos = result[0].videos;
    const totalVideos = result[0].totalVideos;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                totalVideos,
                currentPage: pages,
                limit,
                hasNextPage: pages * limit < totalVideos,
                totalPages: Math.ceil(totalVideos / limit)
            },
            "Videos fetched successfully"
        )
    );
});


const publishAVideo = asyncHandler(async (req, res) => {

    const videoLocalPath = req.files?.video?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video not found, please upload the video");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail not found, please upload the thumbnail");
    }

    const { title, description } = req.body;
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required to publish a video");
    }

    // Upload video and thumbnail to Cloudinary
    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUpload?.url) {
        throw new ApiError(500, "Something went wrong while uploading the video");
    }

    if (!thumbnailUpload?.url) {
        throw new ApiError(500, "Something went wrong while uploading the thumbnail");
    }

    const duration = videoUpload?.duration || 0; // Cloudinary gives duration in seconds

    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        duration,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(new ApiResponce(201, newVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {
                $unwind: "$owner"
            },
            {
                $lookup: {
                    from: "histories",
                    localField: "_id",
                    foreignField: "video",
                    as: "history"
                }
            },
            {
                $addFields: {
                    totalLikes: {
                        $size: "$likes"
                    },
                    isLiked: {
                        $cond: {
                            if: { $in: [req.user?._id, "$likes.likedBy"] },
                            then: true,
                            else: false
                        }
                    },
                    totalViews: {
                        $size: "$history"
                    }
                }
            },
            {
                $project: {
                    __v: 0,
                    "owner.email": 0,
                    "owner.watchHistory": 0,
                    "owner.fullName": 0,
                    "owner.password": 0,
                    "owner.createdAt": 0,
                    "owner.updatedAt": 0,
                    "owner.__v": 0,
                    likes: 0,
                    history: 0
                }
            }
        ]
    );
    
    if (!video || video.length === 0) {
        throw new ApiError(404, "Video not found");
    }

    // adding user and video in history collection if user is not in history
    if (req.user) {
        const existingHistory = await History.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId),
                    user: new mongoose.Types.ObjectId(req.user._id)
                }
            }
        ]);
        if (existingHistory.length === 0) {
            await History.create({
                video: videoId,
                user: req.user._id
            });
        }
    }

    return res.status(200).json(new ApiResponse(200, video));
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    const { title, description } = req.body;

    if (title) video.title = title;
    if (description) video.description = description;
    await video.save();

    return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    const videoURL = video.videoFile;
    const thumbnailURL = video.thumbnail;

    await Video.findByIdAndDelete(videoId);

    // Delete video and thumbnail from Cloudinary
    const videoDeletionResult = await deleteOnCloudinary(videoURL);
    const thumbnailDeletionResult = await deleteOnCloudinary(thumbnailURL);

    return res.status(200).json(new ApiResponse(200, { videoDeletionResult, thumbnailDeletionResult }, "Video deleted successfully"));

})

export {
    publishAVideo,
    getVideoById,
    getAllVideos,
    updateVideo,
    deleteVideo
}