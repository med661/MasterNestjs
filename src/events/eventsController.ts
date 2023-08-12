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
  UsePipes
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './input/update-event.dto';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(
    @InjectRepository(Event)
    private repository: Repository<Event>,
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>,
    private readonly eventsService:EventsService,
  ) {}


  @Get()
  @UsePipes(new ValidationPipe({transform:true}))
  async findAll(@Query() filter:ListEvents) {

    this.logger.log(`hit the findAll route`);
    console.log({filter});
    
    const events= await this.eventsService.getEventsWithAttendeeCountFilterdPaginated(filter,{
      total:true,
      currentPage:filter.page,
      limit:10
    });
   this.logger.debug(`found ${events.data.length} events`);
    return events;

  }

  
  @Get("/practicee")
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
    } */ 

    return await this.repository.createQueryBuilder('e')
    .select(['e.id', 'e.name'])
    .orderBy('e.id', 'DESC')
    .take(3) 
    .getMany();
  }



  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {

    const event= await this.eventsService.getEvent(id)
        if (!event) {
      throw new NotFoundException()
      
    }
    return event
  }

  @Get('/practice')
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



  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    
    const event = await this.repository.findOneBy({id:id});
    if (!event) {
      throw new NotFoundException()
      
    }
    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when
    });

  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const result = await this.eventsService.deleteEvent(id)
    if (result.affected !== 1) {
      throw new NotFoundException()
    }
  //  return result
      
    
  }
}
