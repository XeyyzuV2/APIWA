import { v4 as uuidv4 } from 'uuid';

// --- Types ---
interface User {
  id: string;
  email: string;
  password?: string; // In a real app, this would be a hashed password
}

interface ApiKey {
  id: string;
  key: string;
  userId: string;
  createdAt: Date;
  revokedAt?: Date;
}

interface ApiLog {
  id:string;
  keyId: string;
  method: string;
  endpoint: string;
  timestamp: Date;
}

// --- In-Memory Store ---
const users: User[] = [];
const apiKeys: ApiKey[] = [];
const apiLogs: ApiLog[] = [];

// --- Mock Database Object ---
export const db = {
  // User Management
  async createUser(email: string, password?: string): Promise<User> {
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const newUser: User = { id: uuidv4(), email, password };
    users.push(newUser);
    return newUser;
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    return users.find(user => user.email === email);
  },

  async getUserById(id: string): Promise<User | undefined> {
    return users.find(user => user.id === id);
  },

  // API Key Management
  async createApiKey(userId: string): Promise<ApiKey> {
    const newKey: ApiKey = {
      id: uuidv4(),
      key: `xapi_${uuidv4().replace(/-/g, '')}`,
      userId,
      createdAt: new Date(),
    };
    apiKeys.push(newKey);
    return newKey;
  },

  async getApiKeysByUserId(userId: string): Promise<ApiKey[]> {
    return apiKeys.filter(key => key.userId === userId && !key.revokedAt);
  },

  async getApiKey(key: string): Promise<ApiKey | undefined> {
    return apiKeys.find(k => k.key === key && !k.revokedAt);
  },

  async revokeApiKey(keyId: string): Promise<ApiKey | undefined> {
    const key = apiKeys.find(k => k.id === keyId);
    if (key) {
      key.revokedAt = new Date();
      return key;
    }
    return undefined;
  },

  // API Log Management
  async logRequest(keyId: string, method: string, endpoint: string): Promise<ApiLog> {
    const newLog: ApiLog = {
      id: uuidv4(),
      keyId,
      method,
      endpoint,
      timestamp: new Date(),
    };
    apiLogs.push(newLog);
    return newLog;
  },

  async getLogsByApiKey(keyId: string): Promise<ApiLog[]> {
    return apiLogs.filter(log => log.keyId === keyId);
  },

  async getLogsByUserId(userId: string): Promise<ApiLog[]> {
    const userKeys = apiKeys.filter(key => key.userId === userId).map(k => k.id);
    return apiLogs.filter(log => userKeys.includes(log.keyId));
  }
};

// Seeding is removed to prevent conflicts in a serverless environment.
