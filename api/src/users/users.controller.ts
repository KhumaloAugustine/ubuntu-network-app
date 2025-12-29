import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UserEntity } from '../database/entities/user.entity';
import { ApiResponseDTO } from '../common/dtos/response.dto';

/**
 * Users Controller
 * Handles user-related endpoints
 */
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Get user by ID
   * GET /api/v1/users/:id
   */
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<ApiResponseDTO<UserEntity>> {
    const user = await this.usersService.findById(id);
    return new ApiResponseDTO(user, 'User retrieved successfully');
  }
}
