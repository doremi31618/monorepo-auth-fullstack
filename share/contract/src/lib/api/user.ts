import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsNumber,
    IsDate
} from 'class-validator'

export type UserBasicInfo = {
    userId: number,
    name: string,
}

export type Session = {
    token: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
} & UserBasicInfo

export class SessionDto implements Session {

    @IsString()
    @IsNotEmpty()
    token!: string;

    @IsNumber()
    @IsNotEmpty()
    userId!: number;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsDate()
    @IsNotEmpty()
    expiresAt!: Date;

    @IsDate()
    @IsNotEmpty()
    createdAt!: Date;

    @IsDate()
    @IsNotEmpty()
    updatedAt!: Date;
}

