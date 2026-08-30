import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common"
import { UserPayload } from "./jwt.strategy"

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user = request.user as UserPayload

    if (!user || user.role !== "ADMIN") {
      throw new ForbiddenException(
        "Acesso restrito apenas para administradores.",
      )
    }

    return true
  }
}
