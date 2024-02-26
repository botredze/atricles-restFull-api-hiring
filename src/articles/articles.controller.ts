import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './entity/articles.entity';
import { AuthGuard } from '@nestjs/passport';
import {CreateArticleDto} from "./dto/create.article.dto";
import {UpdateArticleDto} from "./dto/update.article.dto";

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(@Query() query): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Article> {
    return this.articlesService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: number, @Body() updateArticleDto: UpdateArticleDto): Promise<Article> {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: number): Promise<void> {
    return this.articlesService.delete(id);
  }
}
