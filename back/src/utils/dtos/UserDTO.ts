import { RegisterDTO } from './AuthDTO';
import { IntersectionType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';
import { Role } from '@prisma/client';

export class RoleDTO {
  @IsOptional()
  @IsEnum(Role)
    role: Role;
}

export class CreateUserDTO extends IntersectionType(RegisterDTO, RoleDTO) {}

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
    name?: string;

  @IsOptional()
  @IsString()
    surname?: string;

  @IsOptional()
  @IsEmail()
    email?: string;

  @IsOptional()
  @IsPhoneNumber('UA')
    phone?: string;

  @IsOptional()
  @IsUrl()
    avatarUrl?: string;
}
