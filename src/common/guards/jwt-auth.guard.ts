import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// This guard automatically uses the JWT strategy to validate tokens
// It checks Authorization header for Bearer token and validates it
// If valid, attaches user to request; if invalid, returns 401 Unauthorized
