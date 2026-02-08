import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const channel = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },

        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
                pipeline: [
                    // views
                    {
                        $lookup: {
                            from: "histories",
                            localField: "_id",
                            foreignField: "video",
                            as: "histories"
                        }
                    },
                    // likes
                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "video",
                            as: "likes"
                        }
                    },
                    {
                        $addFields: {
                            views: { $size: "$histories" },
                            likesCount: { $size: "$likes" }
                        }
                    },
                    {
                        $project: {
                            histories: 0,
                            likes: 0
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $addFields: {
                totalVideos: { $size: "$videos" },
                totalSubscribers: { $size: "$subscribers" },
                totalViews: {
                    $sum: {
                        $map: {
                            input: "$videos",
                            as: "video",
                            in: "$$video.views"
                        }
                    }
                },
                totalLikes: {
                    $sum: {
                        $map: {
                            input: "$videos",
                            as: "video",
                            in: "$$video.likesCount"
                        }
                    }
                }
            }
        },

        {
            $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                coverImage: 1,
                videos: 1,
                totalVideos: 1,
                totalSubscribers: 1,
                totalLikes: 1,
                totalViews: 1
            }
        }
    ]);

    if (!channel.length) {
        return res.status(404).json(
            new ApiResponse(404, null, "Channel not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            channel[0],
            "Channel stats fetched successfully with all the details."
        )
    );
});

export { getChannelStats };
