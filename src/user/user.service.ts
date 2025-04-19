import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}
    async getUsers(){
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
            }
        });
        return users;
    }
    async getUser({ userId }: { userId: string }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: '',
            },
            select: {
                id: true,
                email: true,
                firstName: true,
            }
        });
        return user;
    }
    

}
