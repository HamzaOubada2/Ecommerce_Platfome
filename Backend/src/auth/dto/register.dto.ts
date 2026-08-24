import {IsEmail, isEmail ,IsString, MinLength} from 'class-validator';

export class RegisterDto {
    @IsEmail({} ,{message: "Email Not Correct!"})
    email:string;


    @IsString()
    @MinLength(6, {message: 'Password Must Be at least 6 characters long'})
    password: string;
}