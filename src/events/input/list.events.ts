/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-inferrable-types */
export class ListEvents{
    when?:WhenEventFilter=WhenEventFilter.All;
    page:number=1;
}
export enum WhenEventFilter{
All=1,
Today,
Tomorrow,
ThisWeek,
NextWeek
}