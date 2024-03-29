/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Logger } from '@nestjs/common';
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt"

@Injectable()
export class  LocalStrategy extends PassportStrategy(Strategy){
    private readonly logger = new Logger(LocalStrategy.name)
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super()
    }
        public async validate(username: string, password: string): Promise<any> {
            
                const user = await this.userRepository.findOne({where: {username: username}})
                
                if (!user) {
                    console.log("use");
                    
                    this.logger.debug(`User ${username} not found`)
                    throw new UnauthorizedException()
                }
                if (!await bcrypt.compare(password, user.password)) {
                    this.logger.debug(` Invalid credentialss for user ${username}`)

                    
                    throw new UnauthorizedException()

                    
                }
                return user

        }


}