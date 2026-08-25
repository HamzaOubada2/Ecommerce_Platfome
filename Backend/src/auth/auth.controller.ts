import { Body, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "./guard/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { Role } from "src/users/entities/user.entity";



export class AuthController {
    constructor(private readonly authService: AuthService){};

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    refreshToken(@Body('userId') userId: string, @Body('refreshToken') refreshtoken:string) {
        return this.authService.refreshToken(userId, refreshtoken);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    logout(@Req() req) {
        return this.authService.logout(req.user.sub);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('admin-only')
    adminCheck() {
        return {message: 'Welcome, Admin! You have full access privileges.'};
    }
}