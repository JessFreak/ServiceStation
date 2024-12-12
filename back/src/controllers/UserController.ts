import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Access } from '../config/security/decorators/Access';
import { UserRequest } from '../config/security/decorators/UserRequest';
import { Role, User, Vehicle } from '@prisma/client';
import { UpdateUserDTO } from '../utils/dtos/UpdateUserDTO';
import { CreateVehicleDTO, UpdateVehicleDTO } from '../utils/dtos/VehicleDTO';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { CreateUserDTO } from '../utils/dtos/CreateUserDTO';
import { RoleDTO } from '../utils/dtos/RoleDTO';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @Access(Role.ADMIN)
  create(@Body() body: CreateUserDTO): Promise<User> {
    return this.authService.register(body);
  }

  @Get()
  @Access(Role.ADMIN)
  getAll(@Query() role?: RoleDTO): Promise<User[]> {
    return this.userService.getAllUsers(role);
  }

  @Patch()
  @Access()
  update(@UserRequest() user: User, @Body() body: UpdateUserDTO) {
    return this.userService.update(user.id, body);
  }

  @Post('vehicles')
  @Access()
  addVehicle(@UserRequest() user: User, @Body() body: CreateVehicleDTO): Promise<Vehicle> {
    return this.userService.addVehicle(user.id, body);
  }

  @Get('vehicles')
  @Access()
  getVehicles (@UserRequest() user: User): Promise<Vehicle[]> {
    return this.userService.getUserVehicles(user.id);
  }

  @Patch('vehicles/:vehicleId')
  @Access()
  updateVehicle (
    @UserRequest() user: User,
    @Param('vehicleId') vehicleId: string,
    @Body() body: UpdateVehicleDTO,
  ): Promise<Vehicle> {
    return this.userService.updateVehicle(user.id, vehicleId, body);
  }
}