import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PetModule } from './modules/pet/pet.module';
import { MatchModule } from './modules/matches/matches.module';
import { TransactionModule } from './modules/transactions/transactions.module';
import { SwipeModule } from './modules/swipes/swipes.module';
import { PostsModule } from './modules/posts/posts.module';
import { NewsModule } from './modules/news/news.module';
import { MessageModule } from './modules/messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database');
        return {
          uri: databaseConfig.uri,
          ...databaseConfig.options,
        };
      },
    }),
    UserModule,
    TransactionModule,
    SwipeModule,
    PostsModule,
    PetModule,
    NewsModule,
    MessageModule,
    AuthModule,
    MatchModule,
  ],
})
export class AppModule {}
