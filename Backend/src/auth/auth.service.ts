import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role, User } from "src/users/entities/user.entity";
import { JwtService } from '@nestjs/jwt';
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { dot } from "node:test/reporters";


@Injectable()
export class AuthService {
    @InjectRepository(User)
    private userRepository: Repository<User> | undefined; //you use it to work the users table, such as finc,save,delete...
    private jwtService: JwtService | undefined; // To create and verify JWT Tokens
    private configService: ConfigService | undefined; // for read .env



    /**
     * Register
     **/
    async register(dto: RegisterDto) {
        if (!this.userRepository) {
            throw new BadRequestException("User repository is not available");
        }

        const exitingUser = await this.userRepository.findOne({where: {email: dto.email}});
        if (exitingUser) throw new BadRequestException("Email Already Exist");

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            email:dto.email,
            password: hashedPassword
        });

        await this.userRepository.save(user);
        return {message: "Register Success!"};
    }


    /**
     * Login
     **/
    async login(dto: LoginDto) {
        const user = await this.userRepository?.findOne({where: {email:dto.email}});
        if (!user) throw new UnauthorizedException("Email Or Password Not Correct!")

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if(!isPasswordValid) throw new UnauthorizedException("Email Or Password Not Correct!");

        const tokens = await this.generateToken(user.id, user.email, user.role);
        const refreshToken = tokens.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token could not be generated");
        }
        await this.updateRefreshToken(user.id, refreshToken);
    }


    /*
    Refresh Token
    */

    async refreshToken(userId:string, refreshToken:string) {
        const user = await this.userRepository?.findOne({where: {id: userId}});
        if(!user || !user.refreshToken) throw new UnauthorizedException("Access Denied!");

        const isRefreshToeknValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if(!isRefreshToeknValid) throw new UnauthorizedException("Refresh Token Invalid");


        const tokens = await this.generateToken(user.id, user.email, user.role);
        const newRefreshToken = tokens.refreshToken;
        if (!newRefreshToken) {
            throw new UnauthorizedException("Refresh token could not be generated");
        }
        await this.updateRefreshToken(user.id, newRefreshToken);
        return tokens;
    }


    /*
    Logout
    */

    async logout(userId:string) {
        await this.userRepository?.update(userId, {refreshToken: null});
        return {message: "Logout Success!"}
    }


















    // Generate Token => create Token
    private async generateToken(UserId:string, email:string, role:string) {
        const payload = {sub: UserId, email,role};

        const accessToken = await this.jwtService?.signAsync(payload, {
            secret: this.configService?.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '1d',
        });

        const refreshToken = await this.jwtService?.signAsync(payload, {
            secret: this.configService?.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        })

        return {accessToken, refreshToken};
    }

    // Update RefreshToken => Its function is to securely store the Refresh Token in the database.
    // Instead of storing the actual token, an encrypted/hashed copy of it is stored.
    private async updateRefreshToken(userId:string, refreshToken:string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository?.update(userId, { refreshToken: hashedRefreshToken });
    }
}