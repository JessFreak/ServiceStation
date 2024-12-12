import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class RoleDTO {
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
