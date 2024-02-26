import { Cache } from 'cache-manager';
import {CacheManager} from "../src/cache/cache.manager";
import {Article} from "../src/articles/entity/articles.entity";

const articles: Article[] = [
  { id: 1, title: 'Test Article 1', content: 'Test Content 1' },
  { id: 2, title: 'Test Article 2', content: 'Test Content 2' },
];


describe('CacheManager', () => {
  let cacheManager: CacheManager;
  let cacheMock: jest.Mocked<Cache>;

  beforeEach(() => {
    cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as any;

    cacheManager = new CacheManager({} as any);
    cacheManager['cache'] = cacheMock;
  });

  it('should be defined', () => {
    expect(cacheManager).toBeDefined();
  });

  describe('get', () => {
    it('should call cache get method', async () => {
      const key = 'testKey';
      await cacheManager.get(key);

      expect(cacheMock.get).toHaveBeenCalledWith(key);
    });

    it('should return undefined if cache get method fails', async () => {
      cacheMock.get.mockRejectedValue(new Error('Failed to get data from cache'));

      const result = await cacheManager.get('testKey');

      expect(result).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should call cache set method', async () => {
      const key = 'testKey';
      const value = [{ id: 1, title: 'Test Article' }];
      await cacheManager.set(key, articles);

      expect(cacheMock.set).toHaveBeenCalledWith(key, value, undefined);
    });

    it('should call cache set method with ttl if provided', async () => {
      const key = 'testKey';
      const value = [{ id: 1, title: 'Test Article' }];
      const ttl = { ttl: 60 };
      await cacheManager.set(key, articles, ttl);

      expect(cacheMock.set).toHaveBeenCalledWith(key, value, ttl);
    });

    it('should handle error if cache set method fails', async () => {
      cacheMock.set.mockRejectedValue(new Error('Failed to set data to cache'));

      await expect(cacheManager.set('testKey', [{ id: 1, title: 'Test Article', content: 'test' }])).resolves.not.toThrow();
    });
  });

  describe('del', () => {
    it('should call cache del method', async () => {
      const key = 'testKey';
      await cacheManager.del(key);

      expect(cacheMock.del).toHaveBeenCalledWith(key);
    });

    it('should handle error if cache del method fails', async () => {
      cacheMock.del.mockRejectedValue(new Error('Failed to delete data from cache'));

      await expect(cacheManager.del('testKey')).resolves.not.toThrow();
    });
  });
});
