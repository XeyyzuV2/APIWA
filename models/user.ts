import mongoose, { Schema, Document, models, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  _id: string;
  email: string;
  password?: string;
}

const UserSchema: Schema = new Schema({
  _id: { type: String, default: uuidv4 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default models.User || model<IUser>('User', UserSchema);
