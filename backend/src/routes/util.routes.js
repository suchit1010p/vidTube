
import { Router } from "express";
import { getPresignedUrl } from "../controllers/util.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect this route! Only authenticated users should upload.
router.route("/presigned-url").get(verifyJWT, getPresignedUrl);

export default router;
