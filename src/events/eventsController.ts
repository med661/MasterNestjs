/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
  NotFoundException,
  Query,
  UsePipes,
  ForbiddenException,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './input/update-event.dto';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
import { UseGuards } from '@nestjs/common';
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('/events')
@SerializeOptions({strategy:'excludeAll'})
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(
    private readonly eventsService:EventsService,
  ) {}


  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    const events = await this.eventsService
      .getEventsWithAttendeeCountFilterdPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 2
        }
      );
    return events;
  }
  
 /* @Get("/practicee")
  async practice2() {
  /*   const event= new Event();
    event.id=1
    const attendee=new Attendee();
    attendee.name='jerry the second'
    attendee.event=event
    await this.attendeeRepository.save(attendee) */
   /*  this.logger.log(`hit the practice2 route`);
    const options= {
      where: { id: 1 },
      relations: ['attendees'],
    };

    const event = await this.repository.findOne(options);

    if (!event) {
      throw new NotFoundException();
    }  

    return await this.repository.createQueryBuilder('e')
    .select(['e.id', 'e.name'])
    .orderBy('e.id', 'DESC')
    .take(3) 
    .getMany();
  }*/



  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id) {

    const event= await this.eventsService.getEvent(id)
        if (!event) {
      throw new NotFoundException()
      
    }
    return event
  }

  /*@Get('/practice')
  async practice() {
    return await this.repository.find({
      select: ['id', 'when'],
      where: [
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%mee%'),
        },
      ],
      take: 2,
      order: {
        id: 'DESC',
      },
    });
  }
*/


  @Patch(':id')
  @UseGuards(AuthGuardJwt)
    async update(
    @Param('id') id, 
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User) {
    
      const event = await this.eventsService.getEvent(id);
      if (!event) {
      throw new NotFoundException()
      
    }
    if (event.organizerId!==user.id) {
      throw new ForbiddenException(null,'you are not authorized to change this event')
      
    }

    return await this.eventsService.updateEvent(event,input)
    
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)

  async create(
    @Body() input: CreateEventDto,
    @CurrentUser() user: User
  ) {
    return await this.eventsService.createEvent(input, user);
  }


  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(@Param('id') id, @CurrentUser() user: User  ) {
    const event = await this.eventsService.getEvent(id);
    if (!event) {
      throw new NotFoundException()
      
    }
    if (event.organizerId!==user.id) {
      throw new ForbiddenException(null,'you are not authorized to delet this event')
      
    }
     await this.eventsService.deleteEvent(id)
 
  //  return result
      
    
  }
}
