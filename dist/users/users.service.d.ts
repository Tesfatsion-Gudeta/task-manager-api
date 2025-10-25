import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserProfile(userId: number): Promise<{
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
        id: number;
    }>;
}
