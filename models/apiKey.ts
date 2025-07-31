import mongoose, { Schema, Document, models, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IApiKey extends Document {
  _id: string;
  key: string;
  userId: string;
  revokedAt?: Date;
}

const ApiKeySchema: Schema = new Schema({
  _id: { type: String, default: uuidv4 },
  key: { type: String, required: true, unique: true },
  userId: { type: String, ref: 'User', required: true },
  revokedAt: { type: Date },
}, { timestamps: true });

export default models.ApiKey || model<IApiKey>('ApiKey', ApiKeySchema);
