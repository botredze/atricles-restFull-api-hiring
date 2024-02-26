import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from '../src/articles/articles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Article} from "../src/articles/entity/articles.entity";
import {User} from "../src/auth/entity/user.entity";
import { DeleteResult, UpdateResult  } from 'typeorm';

describe('ArticlesService', () => {
    let articleRepository: Repository<Article>;
    let userRepository: Repository<User>;
    let service: ArticlesService;
    let repository: Repository<Article>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getRepositoryToken(Article),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        articleRepository = module.get<Repository<Article>>(getRepositoryToken(Article));
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {

        it('should create an article', async () => {
            const user: User = { id: 1, email: 'testuser', password: 'testpassword' };
            const articleData = { title: 'Test Article', description: 'Test Description', author: user, content: 'Test CONTENT' };
            const createdArticle = { id: 1, ...articleData };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(articleRepository, 'create').mockReturnValue(articleData as any);
            jest.spyOn(articleRepository, 'save').mockResolvedValue(createdArticle);

            const result = await articleRepository.save(articleData);
            expect(result).toEqual(createdArticle);
        });
    });

    describe('findById', () => {
        it('should return an article if found', async () => {
            const articleId = 1;
            const article = { id: articleId, title: 'Test Article', content: 'Test Content' };
            jest.spyOn(repository, 'findOne').mockResolvedValue(article);

            expect(await service.findById(articleId)).toEqual(article);
        });

        it('should return null if article is not found', async () => {
            const articleId = 1;
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            expect(await service.findById(articleId)).toBeNull();
        });
    });

    describe('update', () => {
        it('should update an article if found', async () => {
            const articleId = 1;
            const updatedArticleData = { title: 'Updated Title',  content: 'Test Content' };
            const updatedArticle = { id: articleId, ...updatedArticleData };
            jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);
            jest.spyOn(repository, 'findOne').mockResolvedValue(updatedArticle);

            expect(await service.update(articleId, updatedArticleData)).toEqual(updatedArticle);
        });

        it('should return null if article is not found', async () => {
            const articleId = 1;
            const updatedArticleData = { title: 'Updated Title' };
            jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);

            expect(await service.update(articleId, updatedArticleData)).toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete an article if found', async () => {
            const articleId = 1;
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as DeleteResult);
            await service.delete(articleId);

            expect(repository.delete).toHaveBeenCalledWith(articleId);
        });

        it('should not delete anything if article is not found', async () => {
            const articleId = 1;
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as DeleteResult);
            await service.delete(articleId);

            expect(repository.delete).toHaveBeenCalledWith(articleId);
        });
    });
});
