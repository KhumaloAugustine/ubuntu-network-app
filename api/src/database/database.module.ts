import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { VouchEntity } from './entities/vouch.entity';
import { ActivityEntity } from './entities/activity.entity';
import { SafeLocationEntity } from './entities/safe-location.entity';
import { AuditLogEntity } from './entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME', 'ubuntu_network'),
        entities: [UserEntity, VouchEntity, ActivityEntity, SafeLocationEntity, AuditLogEntity],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity, VouchEntity, ActivityEntity, SafeLocationEntity, AuditLogEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
