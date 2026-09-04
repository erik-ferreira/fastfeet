import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common"
import { UserPayload } from "./jwt.strategy"

@Injectable()
export class DeliveryDriverGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user = request.user as UserPayload

    if (!user || user.role !== "DELIVERY_DRIVER") {
      throw new ForbiddenException("Acesso restrito apenas entregadores.")
    }

    return true
  }
}
