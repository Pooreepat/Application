import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PetModule } from './modules/pet/pet.module';
import { MessageModule } from './modules/messages/messages.module';
import { NewsModule } from './modules/news/news.module';
import { TransactionModule } from './modules/transactions/transactions.module';
import { PreferenceModule } from './modules/preference/preference.module';
import { PostsModule } from './modules/posts/posts.module';

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
    AuthModule,
    ProfileModule,
    PetModule,
    MessageModule,
    NewsModule,
    TransactionModule,
    PreferenceModule,
    PostsModule
  ],
})
export class AppModule {}
