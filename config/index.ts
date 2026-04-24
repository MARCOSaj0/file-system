import { config } from 'dotenv';
config({ quiet: true });

export interface Config {
    PROJECT_NAME: string | undefined;
    IS_SERVER: string | undefined;
    PORT: number;
    SERVER_CERT: string | undefined;
    SERVER_KEY: string | undefined;
    MongoDB_HOST: string | undefined;
    MongoDB_URI: string | undefined;
    AWS_ACCESS_KEY_ID: string | undefined;
    AWS_SECRET_ACCESS_KEY: string | undefined;
    AWS_REGION: string | undefined;
    AWS_STATIC_ASSET_BUCKET: string | undefined;
    AWS_FOLDER: string | undefined;
}

const appConfig: Config = {
    PROJECT_NAME: process.env.PROJECT_NAME,
    IS_SERVER: process.env.IS_SERVER,
    PORT: Number(process.env.PORT),
    SERVER_CERT: process.env.SERVER_CERT,
    SERVER_KEY: process.env.SERVER_KEY,
    MongoDB_HOST: process.env.MongoDB_HOST,
    MongoDB_URI: process.env.MongoDB_URI,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_STATIC_ASSET_BUCKET: process.env.AWS_STATIC_ASSET_BUCKET,
    AWS_FOLDER: process.env.AWS_FOLDER
};

export default appConfig;