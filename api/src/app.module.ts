import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

/**
 * Root application module
 * Following SOLID principles: Single Responsibility - orchestrates application modules
 */
@Module({
  imports: [
    // Load .env and make config global
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
