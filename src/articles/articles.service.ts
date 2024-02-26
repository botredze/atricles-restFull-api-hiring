import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entity/articles.entity';
import { CacheManager } from '../cache/cache.manager';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
      @InjectRepository(Article)
      private articlesRepository: Repository<Article>,
       private readonly cacheManager: CacheManager,
  ) {}

  async findAll(): Promise<Article[]> {
    const cacheKey = 'all_articles';
    let articles = await this.cacheManager.get<Article[]>(cacheKey);

    if (!articles) {
      this.logger.log('Fetching articles from the database');
      articles = await this.articlesRepository.find();
      await this.cacheManager.set(cacheKey, articles, { ttl: 60 });
    } else {
      this.logger.log('Fetching articles from the cache');
    }

    return articles;
  }

  async create(articleData: Partial<Article>): Promise<Article> {
    try {
      const article = this.articlesRepository.create(articleData);
      return await this.articlesRepository.save(article);
    } catch (error) {
      this.logger.error(`Error creating article: ${error.message}`);
      throw error;
    }
  }

  async findById(id: number): Promise<Article> {
    try {
      return await this.articlesRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Error finding article by id ${id}: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, articleData: Partial<Article>): Promise<Article> {
    try {
      await this.articlesRepository.update(id, articleData);
      return await this.articlesRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Error updating article with id ${id}: ${error.message}`);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.articlesRepository.delete({ id });
    } catch (error) {
      this.logger.error(`Error deleting article with id ${id}: ${error.message}`);
      throw error;
    }
  }
}
