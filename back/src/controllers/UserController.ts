import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Access } from '../config/security/decorators/Access';
import { UserRequest } from '../config/security/decorators/UserRequest';
import { User, Vehicle } from '@prisma/client';
import { UpdateUserDTO } from '../utils/dtos/UpdateUserDTO';
import { CreateVehicleDTO, UpdateVehicleDTO } from '../utils/dtos/VehicleDTO';
import { UserService } from '../services/UserService';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

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