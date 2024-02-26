import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Article } from "../articles/entity/articles.entity";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class CacheManager {
    private cache: Cache;

    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
        this.cache = this.cacheManager;
    }

    /**
      @param key
     @returns
     */
    async get<T>(key: string): Promise<T | undefined> {
        return this.cache.get<T>(key)
            .catch(error => {
                console.error('Error getting data from cache:', error);
                return undefined;
            });
    }

    /**
     * @param key
     * @param value
     * @param ttl
     */
    async set<T>(key: string, value: Article[], ttl?: { ttl: number }): Promise<void> {
        // @ts-ignore
        return this.cache.set<T>(key, value, ttl)
            .catch(error => {
                console.error('Error setting data to cache:', error);
            });
    }

    /**
     * @param key
     */
    async del(key: string): Promise<void> {
        return this.cache.del(key)
            .catch(error => {
                console.error('Error deleting data from cache:', error);
            });
    }
}
