import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IApiKey extends Document {
  key: string;
  userId: mongoose.Schema.Types.ObjectId;
  revokedAt?: Date;
}

const ApiKeySchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  revokedAt: { type: Date },
}, { timestamps: true });

export default models.ApiKey || model<IApiKey>('ApiKey', ApiKeySchema);
