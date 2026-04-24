import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import appConfig from '../config/index.js';

const { AWS_STATIC_ASSET_BUCKET } = appConfig;

const s3Client = new S3Client({});

interface FileInfo {
    buffer: Buffer;
    mimetype?: string;
    contentType?: string;
}

const s3UploadFile = async (fileInfo: FileInfo, path: string): Promise<any> => {
    try {
        const data = {
            Bucket: AWS_STATIC_ASSET_BUCKET,
            Key: path,
            Body: fileInfo.buffer,
            ContentType: fileInfo.mimetype || fileInfo.contentType
        };
        const putObjCommand = new PutObjectCommand(data);

        const response = await s3Client.send(putObjCommand);

        return response;
    } catch (err: any) {
        console.error("Error in aws upload function", err);
        throw err;
    }
};

const s3DeleteFile = async (key: string): Promise<any> => {
    try {
        const data = {
            Bucket: AWS_STATIC_ASSET_BUCKET,
            Key: key
        };
        const deleteObjCommand = new DeleteObjectCommand(data);

        const response = await s3Client.send(deleteObjCommand);

        return response;
    } catch (err: any) {
        console.error("Error in aws delete function", err);
        throw err;
    }
};

export { s3UploadFile, s3DeleteFile };