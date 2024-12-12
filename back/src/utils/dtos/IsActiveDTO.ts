import { IsBoolean, IsOptional } from 'class-validator';
import { ToBoolean } from '../ToBoolean';

export class IsActiveDTO {
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isActive?: boolean;
}