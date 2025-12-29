import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from '../database/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityEntity])],
  controllers: [],
  providers: [],
})
export class ActivitiesModule {}
