import { Router } from 'express';
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo
} from '../controllers/video.controller.js';
import { verifyJWT, optionalVerifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Public video listing
router.route("/").get(getAllVideos);

// Upload video (Protected)
router.route("/publishVideo").post(
    verifyJWT,
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {   
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
);

// Video by ID: GET is public (optional auth for liked/history tracking), PATCH/DELETE are protected
router.route("/:videoId")
    .get(optionalVerifyJWT, getVideoById)
    .patch(verifyJWT, updateVideo)
    .delete(verifyJWT, deleteVideo);

export default router;