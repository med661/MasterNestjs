/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-empty-function */
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
@Injectable()
 export class JwStrategyt extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:process.env.AUTH_SECRET,

        })

    }

    async validate(payload:any){
        
        return await this.userRepository.findOne({where:{id:payload.sub}});
    }


 }