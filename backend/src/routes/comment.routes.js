import Router from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addComment, deleteComment, getCommentsByVideo, updateComment } from '../controllers/comment.controller.js';

const router = Router();



router.use(verifyJWT);

router.get('/:videoId', getCommentsByVideo);
router.post('/:videoId', addComment);
router.patch('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

export default router;