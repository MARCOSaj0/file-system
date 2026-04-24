import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Files } from '../model/files.js';
import { Logs } from '../model/logs.js';
import { s3UploadFile, s3DeleteFile } from '../service/awsSdk.js';
import { httpConst } from '../config/httpConst.js';
import { ReS } from '../service/util.js';
import appConfig from '../config/index.js';

const { AWS_FOLDER, AWS_STATIC_ASSET_BUCKET, AWS_REGION } = appConfig;

const mapCloudError = (err: any): { status: number; message: string } | null => {
    const errorName = err?.name ?? err?.Code;

    if (!errorName) {
        return null;
    }

    const timeoutErrors = new Set(['TimeoutError', 'RequestTimeout', 'NetworkingError', 'ECONNRESET']);
    const quotaErrors = new Set(['ServiceQuotaExceededException', 'QuotaExceededError']);
    const throttlingErrors = new Set(['Throttling', 'TooManyRequestsException', 'SlowDown']);

    if (timeoutErrors.has(errorName)) {
        return { status: httpConst.ServiceUnavailable, message: 'Cloud storage request timed out. Please try again later.' };
    }

    if (quotaErrors.has(errorName)) {
        return { status: httpConst.ServiceUnavailable, message: 'Cloud storage quota exceeded. Please free up space or try again later.' };
    }

    if (throttlingErrors.has(errorName)) {
        return { status: httpConst.ServiceUnavailable, message: 'Cloud storage rate limit exceeded. Please retry after a short delay.' };
    }

    return { status: httpConst.BadGateway, message: 'Cloud storage service error. Please try again later.' };
};

const safeCreateLog = async (payload: Partial<{ trace_id: string; action: string; status: string; error_message?: string; response_time_ms?: number; timestamp: Date; }>) => {
    try {
        return await Logs.create(payload);
    } catch (err: any) {
        console.error('Upload log creation failed', err);
        return null;
    }
};

const safeUpdateLog = async (id: string | object | undefined, payload: Partial<{ status: string; error_message?: string; response_time_ms?: number; timestamp: Date; }>) => {
    if (!id) {
        return null;
    }
    try {
        return await Logs.findByIdAndUpdate(id, payload);
    } catch (err: any) {
        console.error('Upload log update failed', err);
        return null;
    }
};

const uploadFile = async (req: Request & { file?: any }, res: Response): Promise<Response> => {
    const trace_id = randomUUID();
    const logEntry = await safeCreateLog({
        trace_id,
        action: 'upload',
        status: 'initialized',
        timestamp: new Date()
    });

    try {
        const file = req.file;
        if (!file) {
            await safeUpdateLog(logEntry?._id, {
                status: 'failed',
                error_message: 'File is required',
                timestamp: new Date()
            });
            return ReS(res, httpConst.BadRequest, 'File is required');
        }

        const prefix = AWS_FOLDER ? AWS_FOLDER.replace(/\/+$/, '') + '/' : '';
        const randomId = randomUUID();
        const key = `${prefix}${randomId}`;

        const cloudStart = Date.now();
        await s3UploadFile({
            buffer: file.buffer,
            mimetype: file.mimetype,
            contentType: file.mimetype
        }, key);
        const responseTimeMs = Date.now() - cloudStart;

        await safeUpdateLog(logEntry?._id, {
            status: 'cloud-uploaded',
            response_time_ms: responseTimeMs,
            timestamp: new Date()
        });

        const url = AWS_STATIC_ASSET_BUCKET && AWS_REGION
            ? `https://${AWS_STATIC_ASSET_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`
            : key;

        const createdFile = await Files.create({
            filename: file.originalname,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            bucket: AWS_STATIC_ASSET_BUCKET,
            key,
            url
        });

        await safeUpdateLog(logEntry?._id, {
            status: 'completed',
            timestamp: new Date()
        });

        return ReS(res, httpConst.Cretaed, 'File uploaded successfully', {
            id: createdFile._id,
            url
        });
    } catch (err: any) {
        console.error('Error uploading file', err);
        const cloudError = mapCloudError(err);
        const updatePayload: any = {
            status: 'failed',
            timestamp: new Date()
        };

        if (err?.message) {
            updatePayload.error_message = err.message;
        }

        await safeUpdateLog(logEntry?._id, updatePayload);

        if (cloudError) {
            return ReS(res, cloudError.status, cloudError.message);
        }
        return ReS(res, httpConst.InternalServerError, 'Unable to upload file');
    }
};

const listFiles = async (req: Request, res: Response): Promise<Response> => {
    try {
        const files = await Files.find().sort({ createdAt: -1 });
        return ReS(res, httpConst.Ok, 'File list retrieved successfully', files);
    } catch (err: any) {
        console.error('Error listing files', err);
        return ReS(res, httpConst.InternalServerError, 'Unable to list files');
    }
};

const getFileById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const file = await Files.findById(req.params.id);
        if (!file) {
            return ReS(res, httpConst.NotFound, 'File not found');
        }
        return ReS(res, httpConst.Ok, 'File found', file);
    } catch (err: any) {
        console.error('Error getting file details', err);
        return ReS(res, httpConst.InternalServerError, 'Unable to get file details');
    }
};

const deleteFile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const file = await Files.findByIdAndDelete(req.params.id);
        if (!file) {
            return ReS(res, httpConst.NotFound, 'File not found');
        }

        try {
            await s3DeleteFile(file.key);
        } catch (s3Error: any) {
            console.error('Error deleting file from S3', s3Error);
            // we can implement a retry mechanism or queue
        }

        return ReS(res, httpConst.Ok, 'File deleted successfully');
    } catch (err: any) {
        console.error('Error deleting file', err);
        return ReS(res, httpConst.InternalServerError, 'Unable to delete file');
    }
};

export { uploadFile, listFiles, getFileById, deleteFile };