import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
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

// --- File-based Fallback ---
const dbPath = path.join(process.cwd(), 'db.json');
const readJsonDb = async () => fs.readFile(dbPath, 'utf-8').then(JSON.parse);
const writeJsonDb = (data: any) => fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');

const fileDb = {
    async createUser(email: string, password?: string): Promise<UserType> {
        const data = await readJsonDb();
        if (data.users.find((u: UserType) => u.email === email)) throw new Error('User already exists');
        const newUser = { id: uuidv4(), email, password };
        data.users.push(newUser);
        await writeJsonDb(data);
        return newUser;
    },
    async getUserByEmail(email: string): Promise<UserType | undefined> {
        const data = await readJsonDb();
        return data.users.find((u: UserType) => u.email === email);
    },
    async createApiKey(userId: string): Promise<ApiKeyType> {
        const data = await readJsonDb();
        const newKey = { id: uuidv4(), key: `xapi_${uuidv4().replace(/-/g, '')}`, userId, createdAt: new Date() };
        data.apiKeys.push(newKey);
        await writeJsonDb(data);
        return newKey;
    },
    async getApiKeysByUserId(userId: string): Promise<ApiKeyType[]> {
        const data = await readJsonDb();
        return data.apiKeys.filter((k: ApiKeyType) => k.userId === userId && !k.revokedAt);
    },
    async getApiKey(key: string): Promise<ApiKeyType | undefined> {
        const data = await readJsonDb();
        return data.apiKeys.find((k: ApiKeyType) => k.key === key && !k.revokedAt);
    },
    async revokeApiKey(keyId: string): Promise<ApiKeyType | undefined> {
        const data = await readJsonDb();
        const key = data.apiKeys.find((k: ApiKeyType) => k.id === keyId);
        if (key) {
            key.revokedAt = new Date();
            await writeJsonDb(data);
        }
        return key;
    }
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

const db = process.env.MONGODB_URI ? mongoDb : fileDb;

// --- Log Management (in-memory) ---
const apiLogs: any[] = [];
const logRequest = async (keyId: string, method: string, endpoint: string) => {
    const newLog = { id: uuidv4(), keyId, method, endpoint, timestamp: new Date() };
    apiLogs.push(newLog);
    return newLog;
};

const getLogsByUserId = async (userId: string) => {
    const userKeys = await db.getApiKeysByUserId(userId);
    const userKeyIds = userKeys.map(k => k.id);
    return apiLogs.filter(log => userKeyIds.includes(log.keyId));
};

export { db, logRequest, getLogsByUserId };
