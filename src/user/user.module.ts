import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UsersService, PrismaService],
})
export class UserModule {}
