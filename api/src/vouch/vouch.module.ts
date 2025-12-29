import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VouchEntity } from '../database/entities/vouch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VouchEntity])],
  controllers: [],
  providers: [],
})
export class VouchModule {}
