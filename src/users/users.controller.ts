import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorators';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('access_token')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users/profile
   * Retrieve the profile of the authenticated user.
   */
  @Get('profile')
  @ApiOperation({ summary: 'Retrieve the authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the profile of the authenticated user',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'user@example.com' },
        role: { type: 'string', example: 'USER' },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-25T12:00:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-25T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized – missing or invalid token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error – user not found',
  })
  getProfile(@GetUser('id') userId: number) {
    return this.usersService.getUserProfile(userId);
  }
}
