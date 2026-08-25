import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/users/entities/user.entity";


export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){} // Role => Read Meta Data

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
        /*
            @Roles('admin', 'manager')
            this code Convert to :
            roles = ['admin', 'manager']
        */
       if(!requiredRoles) return true;

       const request = context.switchToHttp().getRequest();
       const user = request.user;

       if(!user || !requiredRoles.includes(user.role)) { // we use includes to verify if this user authorized
        throw new ForbiddenException("You do not have access to this path.");
        /*
        requiredRoles = ['admin', 'manager'];
        user.role = 'user';
        includes() → false
        */
       }

       return true;
    }
}  