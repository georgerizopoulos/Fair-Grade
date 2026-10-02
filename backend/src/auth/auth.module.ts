import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [
    // Global so the AuthGuard can verify tokens from any module.
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT_SECRET is not set in backend/.env');
        }
        if (
          process.env.NODE_ENV === 'production' &&
          (secret === 'change-me' || secret.length < 16)
        ) {
          throw new Error(
            'JWT_SECRET is the example value or shorter than 16 characters; set a long random one',
          );
        }
        return { secret, signOptions: { expiresIn: '24h' } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
