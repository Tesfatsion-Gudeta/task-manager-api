import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    register(dto: RegisterDto, res: Response): Promise<{
        access_token: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        access_token: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        access_token: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
    private setRefreshCookie;
}
