import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.redisClient.set(key, stringValue, 'EX', ttl);
    } else {
      await this.redisClient.set(key, stringValue);
    }
    this.logger.log(`Set key ${key} with value ${stringValue}`);
  }

  async get(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    if (value) {
      this.logger.log(`Retrieved key ${key} with value ${value}`);
      return JSON.parse(value);
    }
    this.logger.warn(`Key ${key} not found`);
    return null;
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
    this.logger.log(`Deleted key ${key}`);
  }
}