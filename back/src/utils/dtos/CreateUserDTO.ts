import { RoleDTO } from './RoleDTO';
import { RegisterDTO } from './AuthDTO';
import { IntersectionType } from '@nestjs/swagger';

export class CreateUserDTO extends IntersectionType(RegisterDTO, RoleDTO) {}
