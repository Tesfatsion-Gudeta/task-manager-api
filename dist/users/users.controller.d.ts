import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(userId: number): Promise<{
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
        id: number;
    }>;
}
