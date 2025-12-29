import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { NotFoundException } from '../common/exceptions/base.exception';

/**
 * Users Service
 * Implements Single Responsibility: manages user business logic
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User', id);
    }

    return user;
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async updateProfile(id: string, displayName: string): Promise<UserEntity> {
    const user = await this.findById(id);
    user.displayName = displayName;
    return this.userRepository.save(user);
  }

  async getAllUsers(skip: number, limit: number): Promise<[UserEntity[], number]> {
    return this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }
}
