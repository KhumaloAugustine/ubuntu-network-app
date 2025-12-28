import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

/**
 * Root application module
 * Following SOLID principles: Single Responsibility - orchestrates application modules
 */
@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
