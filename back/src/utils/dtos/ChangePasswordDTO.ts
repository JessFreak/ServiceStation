import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
