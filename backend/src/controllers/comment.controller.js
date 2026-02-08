import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";


const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;


    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content cannot be empty");
    }

    const newComment = new Comment({
        content,
        owner: userId,
        video: videoId
    });
    await newComment.save();
    res.status(201).json(new ApiResponse(true, "Comment added successfully", newComment));
});

// const getCommentsByVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params;

//     if (!isValidObjectId(videoId)) {
//         throw new ApiError(400, "Invalid video ID");
//     }

//     const comments = await Comment.find({ video: videoId }).populate("owner", "username fullName").sort({ createdAt: -1 });
//     res.status(200).json(new ApiResponse(true, "Comments fetched successfully", comments));
// });

const getCommentsByVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // const comments = await Comment.find({ video: videoId }).populate("owner", "username fullName").sort({ createdAt: -1 });

    const comments = await Comment.aggregate([
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
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
        { $unwind: "$owner" },
        { $sort: { createdAt: -1 } },
        {
            $project: {
                "owner.username": 1,
                "owner.fullName": 1,
                "owner.avatar": 1,
                "owner._id": 1,
                content: 1,
                video: 1,
                likesCount: 1,
                isLiked: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);


    res.status(200).json(new ApiResponse(true, comments, "Comments fetched successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content cannot be empty");
    }


    comment.content = content || comment.content;

    await comment.save();
    res.status(200).json(new ApiResponse(true, "Comment updated successfully", comment));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await comment.deleteOne();
    res.status(200).json(new ApiResponse(true, "Comment deleted successfully", null));
})


export { addComment, getCommentsByVideo, updateComment, deleteComment };