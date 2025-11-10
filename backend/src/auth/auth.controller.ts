import { Controller, HttpCode, HttpStatus, Get, Post, Body, Headers as ReqHeaders } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto, SignupDto } from 'src/auth/dto/auth.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Get('inspect')
    @HttpCode(HttpStatus.OK)
    async inspectSession(@ReqHeaders('Authorization') token: string) {
        return this.authService.inspectSession(token);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        console.log('body', dto);
        return this.authService.login(dto);
    }

    @Post('signup')
    @HttpCode(HttpStatus.OK)
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('signout')
    @HttpCode(HttpStatus.OK)
    async signout(@ReqHeaders('Authorization') token: string) {
        return this.authService.signout(token);
    }
}
