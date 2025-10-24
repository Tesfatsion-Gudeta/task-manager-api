import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles'; // Unique key to store roles metadata
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
// Decorator that attaches role requirements to controllers/methods
// Usage: @Roles(Role.ADMIN, Role.USER) - specifies who can access