import mongoose, { Document, Schema } from 'mongoose';

export interface IFiles extends Document {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    bucket?: string;
    key: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}

const filesSchema: Schema<IFiles> = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    bucket: { type: String },
    key: { type: String, required: true, unique: true },
    url: { type: String, required: true }
}, {
    collection: 'files',
    timestamps: true
});

const Files = mongoose.model<IFiles>('files', filesSchema);

export { Files };