import path from 'node:path';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { httpConst } from '../config/httpConst';
import { ReS } from '../service/util';

const blockedFileExtensions = new Set(['.exe', '.sh', '.bat', '.cmd', '.msi', '.com', '.cpl']);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        const extension = path.extname(file.originalname).toLowerCase();
        if (blockedFileExtensions.has(extension)) {
            return cb(new Error('Executable file types are not allowed'));
        }
        cb(null, true);
    }
});

const uploadMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    upload.single('file')(req, res, (err: any) => {
        if (!err) {
            next();
            return;
        }

        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return ReS(res, httpConst.PayloadTooLarge, 'Payload too large');
            }
            return ReS(res, httpConst.BadRequest, err.message);
        }

        return ReS(res, httpConst.UnsupportedMediaType, err.message || 'Unsupported media type');
    });
};

export { uploadMiddleware };