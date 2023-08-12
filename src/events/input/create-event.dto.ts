/* eslint-disable prettier/prettier */
import { Length, IsDateString ,IsString} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 255, { message: 'you name length is wrong' })
  name: string;
  @Length(5, 255)
  description: string;
  @IsDateString()
  when: string;
  @Length(5, 255)
  address: string;
}
