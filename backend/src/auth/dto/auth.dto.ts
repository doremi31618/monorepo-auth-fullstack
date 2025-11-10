import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SignoutDto {
    
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}

export class UserIdentityDto {
    constructor(token: string, userId: number, name: string) {
        this.token = token;
        this.userId = userId;
        this.name = name;
    }

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}

export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}

export class LoginDto{
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}
