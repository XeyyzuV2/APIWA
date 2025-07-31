import { v4 as uuidv4 } from 'uuid';
import dbConnect from './mongodb';
import User from '@/models/user';
import ApiKey from '@/models/apiKey';

// --- Types ---
interface UserType {
  id: string;
  email: string;
  password?: string;
}

interface ApiKeyType {
  id: string;
  key: string;
  userId: string;
  createdAt: Date;
  revokedAt?: Date;
}

const mongoDb = {
    async createUser(email: string, password?: string): Promise<UserType> {
        await dbConnect();
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error('User already exists');
        const user = await User.create({ email, password });
        return { id: user._id.toString(), email: user.email };
    },
    async getUserByEmail(email: string): Promise<UserType | undefined> {
        await dbConnect();
        const user = await User.findOne({ email });
        if (!user) return undefined;
        return { id: user._id.toString(), email: user.email, password: user.password };
    },
    async createApiKey(userId: string): Promise<ApiKeyType> {
        await dbConnect();
        const newKey = { key: `xapi_${uuidv4().replace(/-/g, '')}`, userId };
        const apiKey = await ApiKey.create(newKey);
        return {
            id: apiKey._id.toString(),
            key: apiKey.key,
            userId: apiKey.userId.toString(),
            createdAt: apiKey.createdAt,
        };
    },
    async getApiKeysByUserId(userId: string): Promise<ApiKeyType[]> {
        await dbConnect();
        const keys = await ApiKey.find({ userId, revokedAt: { $exists: false } });
        return keys.map(k => ({
            id: k._id.toString(),
            key: k.key,
            userId: k.userId.toString(),
            createdAt: k.createdAt,
        }));
    },
    async getApiKey(key: string): Promise<ApiKeyType | undefined> {
        await dbConnect();
        const apiKey = await ApiKey.findOne({ key, revokedAt: { $exists: false } });
        if (!apiKey) return undefined;
        return {
            id: apiKey._id.toString(),
            key: apiKey.key,
            userId: apiKey.userId.toString(),
            createdAt: apiKey.createdAt,
        };
    },
    async revokeApiKey(keyId: string): Promise<ApiKeyType | undefined> {
        await dbConnect();
        const apiKey = await ApiKey.findByIdAndUpdate(keyId, { revokedAt: new Date() }, { new: true });
        if (!apiKey) return undefined;
        return {
            id: apiKey._id.toString(),
            key: apiKey.key,
            userId: apiKey.userId.toString(),
            createdAt: apiKey.createdAt,
            revokedAt: apiKey.revokedAt,
        };
    }
}

// --- Log Management (in-memory) ---
const apiLogs: any[] = [];
const logRequest = async (keyId: string, method: string, endpoint: string) => {
    const newLog = { id: uuidv4(), keyId, method, endpoint, timestamp: new Date() };
    apiLogs.push(newLog);
    return newLog;
};

const getLogsByUserId = async (userId: string) => {
    const userKeys = await mongoDb.getApiKeysByUserId(userId);
    const userKeyIds = userKeys.map(k => k.id);
    return apiLogs.filter(log => userKeyIds.includes(log.keyId));
};

export { mongoDb as db, logRequest, getLogsByUserId };
