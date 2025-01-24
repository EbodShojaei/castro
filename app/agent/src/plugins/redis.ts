import { createClient } from '@redis/client';
import type { RedisClientType } from '@redis/client';

let redisClient: RedisClientType | undefined = undefined;

const getRedisClient = async () => {
  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (!process.env.REDIS_CONNECTION_STRING) {
    throw new Error('REDIS_CONNECTION_STRING not found');
  }

  const client = createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });

  client.on('error', (err) => {
    console.error('Redis client error:', err);
  });

  await client.connect();
  redisClient = client as RedisClientType;
  return client as RedisClientType;
};

export async function getCacheKey(key: string): Promise<string | null> {
  const client = await getRedisClient();
  return client.get(key);
}

export async function setCacheKey(
  key: string,
  value: string,
  ttl: number = 300,
): Promise<void> {
  const client = await getRedisClient();
  await client.set(key, value, { EX: ttl });
}
