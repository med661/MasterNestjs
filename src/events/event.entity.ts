/* eslint-disable prettier/prettier */
import {Entity,Column,PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm'
import { Attendee } from './attendee.entity';
import { User } from 'src/auth/user.entity';
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
    

    @ManyToOne(() => User, (user) => user.organized)
    organizer: User;
  
    @Column({ nullable: true })
    organizerId: number;
  

    attendeeCount?:number; 

    attendeeRejected?:number;
    attendeeMaybe?:number;
    attendeeAccepted?:number;


    


    
    
}