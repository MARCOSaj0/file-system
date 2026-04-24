import { Response } from 'express';

export const ReS = (res: Response, status: number, message?: string, data?: object): Response => {
    const resData: any = {
        ...(message && { message }),
    };
    if (data) {
        resData.data = data;
    }
    return (message || data)
        ? res.status(status).json(resData)
        : res.status(status).end();
};