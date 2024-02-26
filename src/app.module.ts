import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {CacheInterceptor, CacheModule} from '@nestjs/cache-manager'
import {AuthModule} from "./auth/auth.module";
import {ArticlesModule} from "./articles/articles.module";
import {CacheModuleData} from "./cache/cacheModuleData";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {TypeOrmModule} from "@nestjs/typeorm";
import typeOrmConfig from './config/typeorm.config';

@Module({
  imports: [
    CacheModuleData,
    TypeOrmModule.forRoot(typeOrmConfig),
     CacheModule.register( {  isGlobal: true,}),
    ConfigModule.forRoot(),
    AuthModule,
    ArticlesModule,
    ClientsModule.register([
      {
        name: 'articles-service',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT, 10) || 6379,
          retryAttempts: 5,
          retryDelay: 1000,
        }
      }
    ]),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
