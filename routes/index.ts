import express from 'express';
import { httpConst } from '../config/httpConst.js';
import { ReS } from '../service/util.js';
import healthCheckRouter from './healthCheck.js';
import filesRouter from './files.js';
const app: express.Application = express();

app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (/\/{2,}/.test(req.url)) {
        console.warn('URL contains multiple slashes', req.url);
        ReS(res, httpConst.NotFound, 'Resource not found');
        return;
    }
    next();
});

app.use('/api/health-check', healthCheckRouter);
app.use('/api/v1/files', filesRouter);

export default app;