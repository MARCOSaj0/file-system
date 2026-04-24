import { Request, Response } from 'express';
import { httpConst } from '../config/httpConst.js';
import { commonErrMsg } from '../config/commonConst.js';
import { ReS } from '../service/util.js';

const healthCheck = (req: Request, res: Response): void => {
    try {
        ReS(res, httpConst.Ok, "Health check successful.", req.body);
    } catch (err: any) {
        console.error("Error at health check", err);
        ReS(res, httpConst.InternalServerError, commonErrMsg);
    }
};

export { healthCheck };