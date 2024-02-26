import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './entity/articles.entity';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { CacheManager } from '../cache/cache.manager';
import {CacheModuleData} from "../cache/cacheModuleData";

@Module({
  imports: [TypeOrmModule.forFeature([Article]), CacheModuleData],
  controllers: [ArticlesController],
  providers: [ArticlesService, JwtAuthGuard, CacheManager],
  exports: [CacheModuleData]
})
export class ArticlesModule {}
