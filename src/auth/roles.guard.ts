import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
                private jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

            if (!requiredRoles) {
                return true;
            }

            const req = context.switchToHttp().getRequest();
            const auth = req.headers.authorization;

            const bearer = auth.split(' ')[0];
            const token = auth.split(' ')[1];

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Failed to get resource'});
            }

            const user = this.jwtService.verify(token);

            req.user = user;

            return user.roles.some(role => requiredRoles.includes(role.value));
        } catch(error) {
            throw new HttpException('Canceled for access', HttpStatus.FORBIDDEN);
        }
    }
}