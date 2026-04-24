import mongoose from 'mongoose';
import appConfig from './index.js';

const { MongoDB_HOST, MongoDB_URI, IS_SERVER, PROJECT_NAME } = appConfig;

/* Function to log events in JSON format */
const logs = (type: string, connection_type: string, path: string, message: string): string => {
    return JSON.stringify({
        type, connection_type, path, message
    });
};

/* Flag to track connection status */
let isConnected: boolean = false;

const db = async (): Promise<void> => {
    /* Enable Mongoose debug mode in development environment */
    if (IS_SERVER === 'development') {
        mongoose.set('debug', true)
    }

    /* Event listeners for MongoDB connection lifecycle events */
    mongoose.connection.on('connecting', () => {
        console.info(logs(
            'connecting',
            'MongoDB',
            `${MongoDB_HOST}`,
            'Mongoose is connecting to the database...'
        ));
    });
    mongoose.connection.on('connected', () => {
        console.info(logs(
            'connected',
            'MongoDB',
            `${MongoDB_HOST}`,
            'Mongoose connected to the database.'
        ));
    });
    mongoose.connection.on('open', () => {
        console.info(logs(
            'open',
            'MongoDB',
            `${MongoDB_HOST}`,
            'Mongoose connection is open.'
        ));
    });
    mongoose.connection.on('disconnecting', () => {
        console.warn(logs(
            'disconnecting',
            'MongoDB',
            `${MongoDB_HOST}`,
            'Mongoose is disconnecting from the database...'
        ));
    });
    mongoose.connection.on('disconnected', () => {
        console.warn(logs(
            'disconnected',
            'MongoDB',
            `${MongoDB_HOST}`,
            'Mongoose disconnected from the database.'
        ));
    });
    mongoose.connection.on('close', () => {
        console.warn(logs(
            'close',
            'MongoDB',
            `${MongoDB_HOST}`,
            'Mongoose connection closed.'
        ));
    });
    mongoose.connection.on('reconnected', () => {
        console.info(logs(
            'reconnected',
            'MongoDB',
            `${MongoDB_HOST}`,
            'Mongoose reconnected to the database.'
        ));
    });
    mongoose.connection.on('error', (err: Error) => {
        console.error(logs(
            'error',
            'MongoDB',
            `${MongoDB_HOST}`,
            `Mongoose connection error: ${err.message}`
        ));
    });
    mongoose.connection.on('fullsetup', () => {
        console.info(logs(
            'fullsetup',
            'MongoDB',
            `${MongoDB_HOST}`,
            'MongoDB connected to a replica set and has successfully connected to the primary and at least one secondary.'
        ));
    });
    mongoose.connection.on('all', () => {
        console.info(logs(
            'all',
            'MongoDB',
            `${MongoDB_HOST}`,
            'Mongoose connected to all servers in the replica set.'
        ));
    });
    mongoose.connection.on('reconnectFailed', () => {
        console.warn(logs(
            'reconnectFailed',
            'MongoDB',
            `${MongoDB_HOST}`,
            'Mongoose failed to reconnect to the database.'
        ));
    });

    /* Function to connect to MongoDB and handle reconnection on failure */
    const connectDatabase = async (): Promise<void> => {
        if (isConnected) {
            return;
        }
        isConnected = true;
        try {
            await mongoose.connect(MongoDB_URI as string, {
                appName: PROJECT_NAME || 'FileUploadApp',            /* The name of the application using this client */
                heartbeatFrequencyMS: 30000,      /* The frequency in milliseconds for sending heartbeat messages to check the connection status */
                maxPoolSize: 100,                 /* The maximum number of connections in the connection pool */
                serverSelectionTimeoutMS: 30000   /* The amount of time in milliseconds to attempt to select a server for an operation; if none is found, an error is thrown */
            });
        } catch (err: any) {
            console.error(`Error at mongodb connection: ${err.message}`);
            isConnected = false;
            /* Retry connection after 5 seconds on failure */
            setTimeout(async () => {
                await connectDatabase();
            }, 5000);
        }
    };

    /* Initialize database connection */
    await connectDatabase();
};

export default db;