import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from './jwt.strategy';
import { UsersService } from 'src/user/user.service';


export type AuthBody = {email: string, password: string}
export type CreateUser = {email: string, firstname: string, password: string}
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly userService: UsersService
    ) {}
    // localhost:3000/auth/login
    //1. Envoie un mot de passe et un email
    //2. L'api te renvoie un token sécurise "abc123"
    @Post('login')
    async login(@Body() authBody: AuthBody ){
        return await this.authService.login({ authBody });
    }
    @Post('register')
    async register(@Body() registerBody: CreateUser ){
        return await this.authService.register({ registerBody });
    }
    // localhost:3000/auth/
    // 3 tu renvoies ton token securisé "abc123"
    @UseGuards(JwtAuthGuard)
    @Get()
    async authenticateUser(@Request() req: RequestWithUser) {
        console.log('req.user', req.user.userId);
        return await this.userService.getUser({ userId: req.user.userId });
    }
}
