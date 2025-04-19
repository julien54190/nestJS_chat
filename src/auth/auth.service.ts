import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthBody, CreateUser } from './auth.controller';
import {  compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';



@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, 
        private readonly jwtService: JwtService,
) {}
async login ({ authBody }: { authBody: AuthBody }) {
    const {email, password} = authBody;

    
    
    
    const existingUser = await this.prisma.user.findUnique({
        where: {
            email,
        }
    })
    if (!existingUser) {
        throw new Error('L\'utilisateur n\'existe pas');
    }
    const isPasswordValid = await this.isPasswordValid({
        password,
        hashedPassword: existingUser.password!,
    });
    
    if (!isPasswordValid) {
        throw new Error('Mot de passe incorrect')
    }
    return this.authenticateUser({userId: existingUser.id});
    }
    async register ({ registerBody}: { registerBody: CreateUser }) {
        const {email, firstname, password} = registerBody;
    

        
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email,
            }
        })
        if (existingUser) {
            throw new Error('Un compte existe déjà avec cet email');
        }
        const hashedPassword = await this.hashPassword({ password });
        const createUser = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName: firstname,
            }
        })

        return this.authenticateUser({userId: createUser.id});
        }
    private async hashPassword({ password }: { password: string }) {
        const hashedPassword = await hash(password, 10);
        return hashedPassword;
    }
    private async isPasswordValid({
        password,
        hashedPassword,
    }: {
        password: string;
        hashedPassword: string;
    }) {
        
        const isPasswordValid = await compare(password, hashedPassword);
        return isPasswordValid;
    }
    private async authenticateUser({ userId }: UserPayload) {
        const payload: UserPayload = { userId };
        return {
            access_token: await this.jwtService.signAsync(payload),

        };
    }

}
