import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IApiKey extends Document {
  value: string;
  tier: "free" | "pro" | "enterprise";
  owner: string;
  limit: number;
  usage: number;
  resetAt: number;
  duration: number;
  createdAt: Date;
}

const ApiKeySchema: Schema = new Schema({
  value: { type: String, required: true, unique: true },
  tier: { type: String, enum: ["free", "pro", "enterprise"], required: true },
  owner: { type: String },
  limit: { type: Number, required: true },
  usage: { type: Number, default: 0 },
  resetAt: { type: Number, required: true },
  duration: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.ApiKey || model<IApiKey>('ApiKey', ApiKeySchema);
