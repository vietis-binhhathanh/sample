import { IsString } from 'class-validator';

export class IdeaDto {
  @IsString()
  id: string;

  @IsString()
  description: string;
}
