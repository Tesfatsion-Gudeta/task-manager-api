import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../generated/prisma';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserProfile(userId: number): Promise<Omit<User, 'password'>>;
}
