import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default models.User || model<IUser>('User', UserSchema);
