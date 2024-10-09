import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { LoginUsecase } from './usecase/login.usecase';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const usecases = [LoginUsecase];

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('authentication.secret'),
          signOptions: configService.get<jwt.SignOptions>(
            'authentication.jwtOptions',
          ),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, ...usecases],
  exports: [JwtModule],
})
export class AuthModule {}
