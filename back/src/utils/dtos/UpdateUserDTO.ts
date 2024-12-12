import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsUrl } from 'class-validator';

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
