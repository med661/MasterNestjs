/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './eventsController';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';

@Module({
    imports:[TypeOrmModule.forFeature([Event,Attendee]),],
    controllers:[EventsController],
    providers:[EventsService]

})
export class EventsModule {}
