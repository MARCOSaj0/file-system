import express from 'express';
import cors from 'cors';
import https from 'node:https';
import appConfig from './config/index.js';
import db from './config/database.js';
import routes from './routes/index.js';

const app: express.Application = express();
const { PORT, PROJECT_NAME, IS_SERVER, SERVER_CERT, SERVER_KEY } = appConfig;

const server = https.createServer({
    key: SERVER_KEY,
    cert: SERVER_CERT
}, app);

/* cors middleware */
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

/* logging middleware */
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    // Log when response finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });

    next();
});

app.use('/', routes);

try {
    db();
    server.listen(PORT, () => {
        console.info(`${PROJECT_NAME} application is running on Port-${PORT} & on ${IS_SERVER} server`);
    });
    server.on('error', (err: Error) => {
        console.error('Error at app start', err);
        process.exit(1);
    });
} catch (err: any) {
    console.error('App startup error', err);
    process.exit(1);
}