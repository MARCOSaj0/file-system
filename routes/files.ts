import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadFile, listFiles, getFileById, deleteFile } from '../controller/fileController.js';

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), uploadFile);
router.get('/list', listFiles);
router.get('/:id', getFileById);
router.delete('/:id', deleteFile);

export default router;