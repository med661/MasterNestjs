/* eslint-disable prettier/prettier */
import { AuthGuard } from "@nestjs/passport";

export class AuthGuardJwt extends AuthGuard('jwt') { }