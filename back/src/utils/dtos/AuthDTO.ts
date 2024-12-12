import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail({})
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDTO extends LoginDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsOptional()
  @IsPhoneNumber('UA')
  phone?: string;
}
