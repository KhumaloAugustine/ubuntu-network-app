import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SafeLocationEntity } from '../database/entities/safe-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SafeLocationEntity])],
  controllers: [],
  providers: [],
})
export class LocationsModule {}
