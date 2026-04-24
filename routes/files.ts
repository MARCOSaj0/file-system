import { Router } from 'express';
import { uploadFile, listFiles, getFileById, deleteFile } from '../controller/fileController';
import { uploadMiddleware } from '../middleware/multer';

const router: Router = Router();

router.post('/upload', uploadMiddleware, uploadFile);
router.get('/list', listFiles);
router.get('/:id', getFileById);
router.delete('/:id', deleteFile);

export default router;