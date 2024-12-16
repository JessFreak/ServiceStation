import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Access } from '../config/security/decorators/Access';
import { UserRequest } from '../config/security/decorators/UserRequest';
import { Role, Vehicle } from '@prisma/client';
import { CreateVehicleDTO, UpdateVehicleDTO } from '../utils/dtos/VehicleDTO';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { CreateUserDTO, RoleDTO, UpdateUserDTO } from '../utils/dtos/UserDTO';
import { OrderService } from '../services/OrderService';
import { OrderQueryDTO } from '../utils/dtos/OrderDTO';
import { UserMapper } from '../utils/mappers/UserMapper';
import { UserResponse } from '../utils/types/UserResponse';
import { OrderResponse } from '../utils/types/OrderResponse';
import { OrderMapper } from '../utils/mappers/OrderMapper';
import { VehicleByIdPipe } from '../utils/pipes/VehicleByIdPipe';
import { OrderByIdPipe } from '../utils/pipes/OrderByIdPipe';
import { ServiceByIdPipe } from '../utils/pipes/ServiceByIdPipe';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @Access(Role.ADMIN)
  async create(@Body() body: CreateUserDTO): Promise<UserResponse> {
    const user = await this.authService.register(body);
    return UserMapper.getUserResponse(user);
  }

  @Get()
  @Access(Role.ADMIN)
  async getAll(@Query() role?: RoleDTO): Promise<UserResponse[]> {
    const users = await this.userService.getAllUsers(role);
    return UserMapper.getUsersResponse(users);
  }

  @Patch()
  @Access()
  async update(@UserRequest() user: UserResponse, @Body() body: UpdateUserDTO): Promise<UserResponse> {
    const updatedUser = await this.userService.update(user.id, body);
    return UserMapper.getUserResponse(updatedUser);
  }

  @Post('vehicles')
  @Access()
  addVehicle(@UserRequest() user: UserResponse, @Body() body: CreateVehicleDTO): Promise<Vehicle> {
    return this.userService.addVehicle(user.id, body);
  }

  @Get('vehicles')
  @Access()
  getVehicles (@UserRequest() user: UserResponse): Promise<Vehicle[]> {
    return this.userService.getUserVehicles(user.id);
  }

  @Patch('vehicles/:vehicleId')
  @Access()
  updateVehicle (
    @UserRequest() user: UserResponse,
    @Param('vehicleId', VehicleByIdPipe) vehicleId: string,
    @Body() body: UpdateVehicleDTO,
  ): Promise<Vehicle> {
    return this.userService.updateVehicle(user.id, vehicleId, body);
  }

  @Delete('vehicles/:vehicleId')
  @Access()
  deleteVehicle (
    @UserRequest() user: UserResponse,
    @Param('vehicleId', VehicleByIdPipe) vehicleId: string,
  ): Promise<Vehicle> {
    return this.userService.deleteVehicle(user.id, vehicleId);
  }

  @Get('orders')
  @Access()
  async getHistory (
    @UserRequest() user: UserResponse,
    @Query() query: OrderQueryDTO,
    @Query('vehicleId', VehicleByIdPipe) vehicleId: string,
    @Query('serviceId', ServiceByIdPipe) serviceId: string,
  ): Promise<OrderResponse[]> {
    const orders = await this.orderService.getAll({ ...query, userId: user.id });
    return OrderMapper.getOrdersResponse(orders);
  }

  @Post('orders/:orderId/cancel')
  @Access()
  async cancelOrder (@UserRequest() user: UserResponse, @Param('orderId', OrderByIdPipe) orderId: string): Promise<OrderResponse> {
    const order = await this.orderService.cancel(user.id, orderId);
    return OrderMapper.getOrderResponse(order);
  }
}