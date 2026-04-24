import mongoose, { Document, Schema } from 'mongoose';

export interface ILog extends Document {
    trace_id: string;
    action: string;
    status: string;
    error_message?: string;
    response_time_ms?: number;
    timestamp: Date;
}

const logsSchema: Schema<ILog> = new mongoose.Schema({
    trace_id: { type: String, required: true, index: true },
    action: { type: String, required: true },
    status: { type: String, required: true },
    error_message: { type: String },
    response_time_ms: { type: Number },
    timestamp: { type: Date, required: true }
}, {
    timestamps: false,
    collection: 'logs'
});

const Logs = mongoose.model<ILog>('Logs', logsSchema);

export { Logs };