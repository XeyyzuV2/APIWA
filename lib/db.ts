import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';

// --- Types ---
interface User {
  id: string;
  email: string;
  password?: string;
}

interface ApiKey {
  id: string;
  key: string;
  userId: string;
  createdAt: Date;
  revokedAt?: Date;
}

interface DbData {
    users: User[];
    apiKeys: ApiKey[];
}

// --- File-based Store ---
const dbPath = path.join(process.cwd(), 'db.json');

async function readDb(): Promise<DbData> {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, return a default structure
        return { users: [], apiKeys: [] };
    }
}

async function writeDb(data: DbData): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}


// --- Mock Database Object ---
export const db = {
  // User Management
  async createUser(email: string, password?: string): Promise<User> {
    const data = await readDb();
    const existingUser = data.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const newUser: User = { id: uuidv4(), email, password };
    data.users.push(newUser);
    await writeDb(data);
    return newUser;
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    const data = await readDb();
    return data.users.find(user => user.email === email);
  },

  async getUserById(id: string): Promise<User | undefined> {
    const data = await readDb();
    return data.users.find(user => user.id === id);
  },

  // API Key Management
  async createApiKey(userId: string): Promise<ApiKey> {
    const data = await readDb();
    const newKey: ApiKey = {
      id: uuidv4(),
      key: `xapi_${uuidv4().replace(/-/g, '')}`,
      userId,
      createdAt: new Date(),
    };
    data.apiKeys.push(newKey);
    await writeDb(data);
    return newKey;
  },

  async getApiKeysByUserId(userId: string): Promise<ApiKey[]> {
    const data = await readDb();
    return data.apiKeys.filter(key => key.userId === userId && !key.revokedAt);
  },

  async getApiKey(key: string): Promise<ApiKey | undefined> {
    const data = await readDb();
    return data.apiKeys.find(k => k.key === key && !k.revokedAt);
  },

  async revokeApiKey(keyId: string): Promise<ApiKey | undefined> {
    const data = await readDb();
    const key = data.apiKeys.find(k => k.id === keyId);
    if (key) {
      key.revokedAt = new Date();
      await writeDb(data);
      return key;
    }
    return undefined;
  },

  // API Log Management (keeping this in-memory as logs don't need to persist for this app)
  apiLogs: [] as any[],
  async logRequest(keyId: string, method: string, endpoint: string) {
    const newLog = {
      id: uuidv4(),
      keyId,
      method,
      endpoint,
      timestamp: new Date(),
    };
    this.apiLogs.push(newLog);
    return newLog;
  },

  async getLogsByUserId(userId: string) {
    const userKeys = await this.getApiKeysByUserId(userId);
    const userKeyIds = userKeys.map(k => k.id);
    return this.apiLogs.filter(log => userKeyIds.includes(log.keyId));
  }
};
