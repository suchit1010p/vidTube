import { Router } from 'express';
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo
} from '../controllers/video.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';


const router = Router();


//upload video 

router.route("/publishVideo").post(verifyJWT, publishAVideo)
router.route("/:videoId").get(verifyJWT, getVideoById)
router.route("/:videoId").patch(verifyJWT, updateVideo)
router.route("/:videoId").delete(verifyJWT, deleteVideo)
router.route("/").get(verifyJWT, getAllVideos)

export default router;