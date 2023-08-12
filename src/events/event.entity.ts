/* eslint-disable prettier/prettier */
import {Entity,Column,PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import { Attendee } from './attendee.entity';
@Entity()
export class Event{
    @PrimaryGeneratedColumn() 
    id:number;
    @Column()
    name:string;
    @Column()
    description:string;
    @Column()
    when:Date;
    @Column()
    address:string;
    @OneToMany(() => Attendee, (attendee) => attendee.event,{
        cascade:true
    })
    attendees: Attendee[];
    
    attendeeCount?:number; 

    attendeeRejected?:number;
    attendeeMaybe?:number;
    attendeeAccepted?:number;


    


    
    
}