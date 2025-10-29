import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user and returns an access token. Also sets an HttpOnly refresh token cookie.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(dto);
    this.setRefreshCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  // 5 attempts per minute per IP
  @ApiOperation({
    summary: 'Log in a user',
    description:
      'Logs in a registered user and returns an access token. Also sets a secure HttpOnly refresh token cookie.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);
    this.setRefreshCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token using refresh cookie',
    description:
      'Uses the refresh token stored in the HttpOnly cookie to issue a new access token and refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'New access token generated successfully.',
    schema: {
      example: {
        access_token: 'new_access_token_here',
      },
    },
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token found');

    const decoded = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const tokens = await this.authService.refreshTokens(
      decoded.sub,
      refreshToken,
    );
    this.setRefreshCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout a user',
    description:
      'Clears the refresh token cookie and invalidates the stored refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out.',
    schema: { example: { message: 'Logged out successfully' } },
  })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      const decoded = await this.jwtService.decode(refreshToken);
      if (decoded && typeof decoded === 'object' && decoded.sub) {
        await this.authService.logout(decoded.sub);
      }
    }
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Logged out successfully' };
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
