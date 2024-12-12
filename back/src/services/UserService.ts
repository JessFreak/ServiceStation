import { Injectable } from '@nestjs/common';
import { UserRepository } from '../database/repositories/UserRepository';
import { VehicleRepository } from '../database/repositories/VehicleRepository';
import { User, Vehicle } from '@prisma/client';
import { UpdateUserDTO } from '../utils/dtos/UpdateUserDTO';
import { CreateVehicleDTO, UpdateVehicleDTO } from '../utils/dtos/VehicleDTO';
import { NotBelongException } from '../utils/exceptions/NotBelongException';
import { RoleDTO } from '../utils/dtos/RoleDTO';

@Injectable()
export class UserService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  getAllUsers({ role }: RoleDTO): Promise<User[]> {
    return this.userRepository.findMany({ role });
  }

  async update (id: string, data: UpdateUserDTO): Promise<User> {
    return this.userRepository.updateById(id, data);
  }

  async addVehicle (id: string, data: CreateVehicleDTO): Promise<Vehicle> {
    return this.vehicleRepository.create({ userId: id, ...data });
  }

  async getUserVehicles (id: string): Promise<Vehicle[]> {
    return this.vehicleRepository.findMany({ userId: id });
  }

  async updateVehicle (id: string, vehicleId: string, data: UpdateVehicleDTO): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (id !== vehicle.userId) {
      throw new NotBelongException('Vehicle', 'User');
    }

    return this.vehicleRepository.updateById(vehicleId, data);
  }
}