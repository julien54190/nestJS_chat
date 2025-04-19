import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './user.service';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UsersService) {}
  //localhost:3000/users
    @Get()
    async getUsers() {
      return this.userService.getUsers();
    }
    @Get('/:userId')
    // localhost:3000/users/1
    getUser(@Param('userId') userId: string) {
        return this.userService.getUser({
          userId,
        });
    }

}
