import Router from 'express';
import { verifyJWT, optionalVerifyJWT } from '../middlewares/auth.middleware.js';
import { addComment, deleteComment, getCommentsByVideo, updateComment } from '../controllers/comment.controller.js';

const router = Router();

// Public / optional auth for fetching comments
router.get('/:videoId', optionalVerifyJWT, getCommentsByVideo);

// Protected routes for comment modifications
router.post('/:videoId', verifyJWT, addComment);
router.patch('/:commentId', verifyJWT, updateComment);
router.delete('/:commentId', verifyJWT, deleteComment);

export default router;