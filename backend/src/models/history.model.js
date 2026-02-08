import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true });

export const History = mongoose.model("History", historySchema);